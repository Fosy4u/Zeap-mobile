import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { ArrowDown2, ArrowLeft, ArrowRight, ArrowUp2 } from "iconsax-react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";

import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { AppDispatch, RootState } from "../../../../redux/store/store";
import { setSelectedMeasurementTemplate } from "../slices/measurement_slice";
import useMeasurementHook from "../hooks/measurement_hook";
import { useUpdateBodyMeasurementTemplateMutation } from "../apis/measurement_api";
import handleError from "../../../general/hooks/errorHandler_hook";
import IBodyMeasurementGuide from "../../../general/models/bodyMeasurementGuide_model";
import EditMeasurementTemplateSkeletonLoader from "../components/editMeasurementTemplateSkeletonLoader_component";

// Edit a saved measurement template. Only the fields that already exist on
// the template are shown — the user is editing what they previously saved,
// not adding new measurements from the catalogue.
//
// The bespoke body-measurement guide (/bodyMeasurementGuide/bespoke?gender=…)
// is still fetched in the background so each input can offer a "Show
// Measurement Guide" pill with the field's image + description when there's
// a match. Fields the guide doesn't know about still render as plain
// editable inputs without the guide affordance.
//
// On Save → PUT /bodyMeasurementTemplate/update with
//   { template_id, templateName, measurements: [{field, value}, ...] }
// — gender is intentionally not sent (the backend keeps what it already has).

interface ISavedField {
    field: string;
    value: string; // kept as string for TextInput; coerced on submit
}

const EditMeasurementTemplateScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch<AppDispatch>();

    const { selectedMeasurementTemplate, bodyMeasurementGuides, selectedUnit } = useSelector(
        (state: RootState) => state.measurementState,
    );

    const { handleGetBodyMeasurementGuides, handleGetAllSavedMeasurements } = useMeasurementHook();
    const [updateBodyMeasurementTemplate] = useUpdateBodyMeasurementTemplateMutation();

    const templateId = selectedMeasurementTemplate?._id ?? "";
    const templateName = selectedMeasurementTemplate?.templateName ?? "";
    const templateGender = ((selectedMeasurementTemplate as any)?.gender as string | undefined)?.toLowerCase() || "male";

    // Pull a flat saved-fields list from the template. Supports both the new
    // flat shape ([{field, value}, ...]) and the legacy nested shape
    // ([{name, measurements: [{field, value}, ...]}, ...]).
    const initialSavedFields = useMemo<ISavedField[]>(() => {
        const raw: any[] = (selectedMeasurementTemplate?.measurements as any[]) ?? [];
        const isFlat = raw.length > 0 && raw[0]?.field !== undefined && raw[0]?.measurements === undefined;
        const flat = isFlat
            ? raw
            : raw.flatMap((group: any) => group?.measurements ?? []);
        return flat
            .filter((item: any) => item?.field)
            .map((item: any) => ({
                field: String(item.field),
                value: item.value == null ? "" : String(item.value),
            }));
    }, [selectedMeasurementTemplate]);

    // Lookup table built from the bespoke guide: field-name (lowercased) →
    // { image, description }. Used to enrich each input with the visual guide
    // when the guide knows about that field.
    const guideByField = useMemo(() => {
        const map = new Map<string, { image?: string; description?: string }>();
        (bodyMeasurementGuides ?? []).forEach((guide: IBodyMeasurementGuide) => {
            guide.fields.forEach((f) => {
                const key = f.field.trim().toLowerCase();
                if (!map.has(key)) {
                    map.set(key, {
                        image: f.imageUrl?.link,
                        description: f.description?.trim(),
                    });
                }
            });
        });
        return map;
    }, [bodyMeasurementGuides]);

    const [fields, setFields] = useState<ISavedField[]>([]);
    const [expandedGuides, setExpandedGuides] = useState<Record<string, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);
    const hasInitializedRef = useRef(false);

    // Fetch the bespoke guide for the template's gender on mount if not
    // already loaded. The guide is optional — it only enriches the UI with
    // images/descriptions. Inputs render either way.
    useEffect(() => {
        if (bodyMeasurementGuides.length === 0) {
            handleGetBodyMeasurementGuides(templateGender);
        }
    }, []);

    // Seed the local edit state from the saved template exactly once.
    useEffect(() => {
        if (hasInitializedRef.current) return;
        if (initialSavedFields.length === 0) return;
        setFields(initialSavedFields);
        hasInitializedRef.current = true;
    }, [initialSavedFields]);

    const handleChange = (idx: number, value: string) => {
        setFields((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], value };
            return next;
        });
    };

    const toggleGuide = (field: string) => {
        setExpandedGuides((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        if (!templateId) {
            Alert.alert("Update failed", "No template selected to update.");
            return;
        }

        const measurements = fields
            .map((f) => ({ field: f.field, value: Number(f.value) }))
            .filter((m) => Number.isFinite(m.value));

        if (measurements.length === 0) {
            Alert.alert("Update failed", "Enter at least one measurement value before saving.");
            return;
        }

        setIsSaving(true);
        try {
            const updated = await updateBodyMeasurementTemplate({
                template_id: templateId,
                templateName: templateName.trim(),
                measurements,
            }).unwrap();

            if (updated) {
                dispatch(setSelectedMeasurementTemplate(updated));
            }
            await handleGetAllSavedMeasurements();
            navigation.goBack();
        } catch (error) {
            handleError(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Show the skeleton until the saved fields have been seeded into local
    // state. The bespoke guide loading on its own doesn't block — inputs
    // render with or without guide enrichment.
    const showSkeleton = fields.length === 0 && initialSavedFields.length === 0;

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-white">
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />

            {/*==== Header ====*/}
            <View className="h-auto w-full px-5 pt-5 pb-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={ () => navigation.pop() }>
                    <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                        <ArrowLeft color="white" />
                    </View>
                </TouchableOpacity>
                <Text className="font-montserratSemiBold text-lg text-baseGreen">Edit Measurement</Text>
                <View className="h-[40px] w-[40px]" />
            </View>

            <LinearGradient
                colors={[
                    "rgba(229, 231, 235, 0)",
                    "#e5e7eb",
                    "#9ca3af",
                    "#e5e7eb",
                    "rgba(229, 231, 235, 0)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-[1px] w-full rounded"
            />

            { showSkeleton ? (
                <EditMeasurementTemplateSkeletonLoader />
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={ false }
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}
                >
                    {/*==== Template name (read-only) ====*/}
                    <View className="px-3 py-4 rounded-xl border border-gray-200">
                        <Text className="my-2 font-montserratSemiBold text-base text-gray-700">Template Name</Text>
                        <View className="px-3 py-3 border border-gray-200 rounded-xl bg-gray-50">
                            <Text className="font-montserratMedium text-base text-gray-700">{ templateName || "—" }</Text>
                        </View>
                        <Text className="mt-2 text-xs text-gray-500">
                            Gender: { templateGender.charAt(0).toUpperCase() + templateGender.slice(1) }
                        </Text>
                    </View>

                    {/*==== Saved fields — render each as an editable input ====*/}
                    <View className="mt-5 px-3 py-4 border border-gray-200 rounded-2xl">
                        <Text className="font-montserratSemiBold text-base text-gray-700">Measurements</Text>

                        { fields.map((f, idx) => {
                            const guide = guideByField.get(f.field.trim().toLowerCase());
                            const hasGuide = !!(guide?.image || guide?.description);
                            const isGuideExpanded = !!expandedGuides[f.field];

                            return (
                                <View key={ `${f.field}-${idx}` }>
                                    <Text className="mt-4 font-montserratMedium">{ f.field }</Text>

                                    <View className="mt-1.5 px-3 flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50">
                                        <TextInput
                                            keyboardType="number-pad"
                                            placeholder="0.00"
                                            placeholderTextColor="#9ca3af"
                                            className="h-[44px] flex-1 font-montserratMedium text-base"
                                            value={ f.value }
                                            onChangeText={ (v) => handleChange(idx, v) }
                                        />
                                        <View className="w-[40px] flex-row items-center">
                                            <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                                            <Text className="font-montserratMedium">{ selectedUnit }</Text>
                                        </View>
                                    </View>

                                    { hasGuide && (
                                        <TouchableOpacity
                                            onPress={ () => toggleGuide(f.field) }
                                            className="mt-2 self-start flex-row items-center justify-center px-3 py-1.5 rounded-full"
                                            style={{ backgroundColor: "rgba(19, 53, 34, 0.10)" }}
                                        >
                                            <Text className="font-montserratMedium text-xs text-baseGreen">
                                                { isGuideExpanded ? "Hide Measurement Guide" : "Show Measurement Guide" }
                                            </Text>
                                            { isGuideExpanded
                                                ? <ArrowUp2 size={ 14 } color="#133522" className="ml-1" />
                                                : <ArrowDown2 size={ 14 } color="#133522" className="ml-1" />
                                            }
                                        </TouchableOpacity>
                                    ) }

                                    { hasGuide && isGuideExpanded && (
                                        <View className="mt-2 p-3 rounded-xl border border-gray-200 bg-[#FFFAF2]">
                                            <Text className="font-montserratSemiBold text-sm text-gray-800">{ f.field }</Text>
                                            { guide?.image && (
                                                <FastImage
                                                    source={{ uri: guide.image, priority: FastImage.priority.normal }}
                                                    resizeMode={ FastImage.resizeMode.contain }
                                                    style={{ width: "100%", height: 220, marginTop: 8, borderRadius: 8, backgroundColor: "#f3f4f6" }}
                                                />
                                            ) }
                                            { !!guide?.description && (
                                                <Text className="mt-2 font-Montserrat text-xs text-gray-700">{ guide.description }</Text>
                                            ) }
                                        </View>
                                    ) }
                                </View>
                            );
                        }) }
                    </View>

                    {/*==== Save CTA ====*/}
                    <TouchableOpacity
                        onPress={ handleSave }
                        disabled={ isSaving }
                        activeOpacity={ 0.85 }
                        style={{ opacity: isSaving ? 0.7 : 1 }}
                        className="h-[55px] w-auto mt-7 flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                        { isSaving ? (
                            <>
                                <ActivityIndicator size="small" color="#ffffff" />
                                <Text className="ml-2 text-lg text-white">Saving…</Text>
                            </>
                        ) : (
                            <>
                                <Text className="text-lg text-white mr-2">Save Changes</Text>
                                <ArrowRight className="text-white" />
                            </>
                        ) }
                    </TouchableOpacity>
                </ScrollView>
            ) }
        </SafeAreaView>
    );
};

export default EditMeasurementTemplateScreen;
