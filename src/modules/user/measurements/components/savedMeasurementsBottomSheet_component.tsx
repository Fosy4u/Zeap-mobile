import { useDispatch, useSelector } from 'react-redux';
import { ArrowDown2, ArrowRight, ArrowUp2, Warning2 } from 'iconsax-react-native';
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
    useWindowDimensions,
    Platform,
    KeyboardAvoidingView,
    findNodeHandle,
    Switch,
    Modal,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { setSaveMeasurementForNextTime, setShowAddNewMeasurementBottomSheet } from '../slices/measurement_slice.ts';
import useMeasurementHook from '../hooks/measurement_hook.ts';
import { Controller } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IProps {
    embedded?: boolean;
    header?: React.ReactNode;
}

const REQUIRED_WARNING_MS = 4000;

const SavedMeasurementsBottomSheet: React.FC<IProps> = ({ embedded = false, header }) => {
    const { requiredMeasurementFormFields, bodyMeasurementGuides, selectedUnit, isLoading, selectedMeasurementTemplate } = useSelector((state: RootState) => state.measurementState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const isGuest = !!userData?.isGuest;
    const [expandedGuides, setExpandedGuides] = useState<Record<string, boolean>>({});

    const getGuideEntry = (measurementName?: string, fieldName?: string) => {
        if (!measurementName || !fieldName) return null;
        const guide = bodyMeasurementGuides?.find(
            (g) => g.name?.toLowerCase() === measurementName.toLowerCase()
        );
        return guide?.fields?.find(
            (entry) => entry.field?.toLowerCase() === fieldName.toLowerCase()
        ) ?? null;
    };

    const toggleGuide = (key: string) => {
        setExpandedGuides((prev) => ({ ...prev, [key]: !prev[key] }));
    };
    const { height: screenHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch<AppDispatch>();

    const scrollRef = useRef<ScrollView>(null);
    const handleInputFocus = (event: any) => {
        if (Platform.OS !== "android") { return; }
        const node = findNodeHandle(event?.target);
        if (!node) { return; }
        const responder: any = scrollRef.current?.getScrollResponder?.();
        responder?.scrollResponderScrollNativeHandleToKeyboard?.(node, 120, true);
    };

    const {
        control, handleSubmit, onSubmitFromMeasurementForm, errors, watch, handleSaveMeasurementTemplate,
    } = useMeasurementHook();

    useEffect(() => {
        dispatch(setSaveMeasurementForNextTime(false));
    }, []);

    const watchedMeasurements = watch("measurements");
    const requiredFieldCount = requiredMeasurementFormFields?.measurements?.reduce((total, measurement) => total + (measurement?.fields?.length ?? 0), 0) ?? 0;
    const allRequiredFieldsFilled = requiredFieldCount > 0 && !!requiredMeasurementFormFields?.measurements?.every((measurement, measurementIndex) =>
        (measurement?.fields ?? []).every((_, fieldIndex) => `${ watchedMeasurements?.[measurementIndex]?.fields?.[fieldIndex] ?? "" }`.trim() !== "")
    );

    const [isTailorNoteDismissed, setIsTailorNoteDismissed] = useState(false);
    const [showTemplateSheet, setShowTemplateSheet] = useState(false);
    const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);

    useEffect(() => {
        if (Platform.OS !== "android" || !showTemplateSheet) return;
        const showSub = Keyboard.addListener("keyboardDidShow", (event) => setAndroidKeyboardHeight(event.endCoordinates.height));
        const hideSub = Keyboard.addListener("keyboardDidHide", () => setAndroidKeyboardHeight(0));
        return () => {
            showSub.remove();
            hideSub.remove();
            setAndroidKeyboardHeight(0);
        };
    }, [showTemplateSheet]);
    const [templateName, setTemplateName] = useState("");
    const [templateNameError, setTemplateNameError] = useState("");
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [savedTemplateName, setSavedTemplateName] = useState<string>(selectedMeasurementTemplate?.templateName ?? "");

    const closeTemplateSheet = () => {
        setShowTemplateSheet(false);
        setTemplateNameError("");
    };

    const handleSaveNewTemplate = async () => {
        if (!templateName.trim()) {
            setTemplateNameError("Template name is required");
            return;
        }
        setIsSavingTemplate(true);
        const saved = await handleSaveMeasurementTemplate(templateName);
        setIsSavingTemplate(false);
        if (saved) {
            setSavedTemplateName(templateName.trim());
            closeTemplateSheet();
        }
    };

    const fieldRefs = useRef<Record<string, View | null>>({});
    const [showRequiredWarning, setShowRequiredWarning] = useState(false);

    useEffect(() => {
        if (!showRequiredWarning) return;
        const timer = setTimeout(() => setShowRequiredWarning(false), REQUIRED_WARNING_MS);
        return () => clearTimeout(timer);
    }, [showRequiredWarning]);

    const handleInvalidSubmit = (formErrors: any) => {
        const missingKeys: string[] = [];
        requiredMeasurementFormFields?.measurements?.forEach((measurement, measurementIndex) => {
            measurement?.fields?.forEach((_, fieldIndex) => {
                if (formErrors?.measurements?.[measurementIndex]?.fields?.[fieldIndex]) {
                    missingKeys.push(`${measurementIndex}-${fieldIndex}`);
                }
            });
        });

        setShowRequiredWarning(true);

        const firstMissing = missingKeys.length > 0 ? fieldRefs.current[missingKeys[0]] : null;
        const scrollContent = (scrollRef.current as any)?.getInnerViewRef?.();
        if (firstMissing && scrollContent) {
            firstMissing.measureLayout(
                scrollContent,
                (_x, y) => scrollRef.current?.scrollTo({ y: Math.max(y - 80, 0), animated: true }),
                () => {},
            );
        }
    };

    const handleCloseAddNewMeasurementBottomSheet = () => {
        dispatch(setShowAddNewMeasurementBottomSheet(false));
    };

    const formContent = (
        <View className="flex-1 flex-col justify-between">

            { !isTailorNoteDismissed && !!requiredMeasurementFormFields?.additionalMeasurementNote?.trim() && (
                <View className="h-auto w-full mt-5 px-4 py-4 rounded-xl border border-[#D5B07B] bg-[#FFFAF2]">
                    <View className="flex-row items-start justify-between">
                        <Text className="flex-1 font-montserratSemiBold text-sm text-[#8a6d3b]">Note from the tailor</Text>
                        <TouchableOpacity
                            onPress={ () => setIsTailorNoteDismissed(true) }
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            accessibilityLabel="Close note from the tailor"
                            className="ml-3"
                        >
                            <Image className="h-[16px] w-[16px]" style={{ tintColor: "#8a6d3b" }} source={ require("../../../../../assets/images/close.png") } />
                        </TouchableOpacity>
                    </View>
                    <Text className="mt-1.5 font-montserratMedium text-sm text-gray-700 leading-5">
                        { requiredMeasurementFormFields.additionalMeasurementNote }
                    </Text>
                </View>
            ) }

            {/* ===== Dynamic Measurement Fields ===== */}
            {requiredMeasurementFormFields?.measurements?.map((measurement, measurementIndex) => (
                <View key={measurement._id} className="h-auto w-full mt-5 px-3 py-4 relative border border-gray-200 rounded-2xl">
                <Text className="mt-2 font-montserratSemiBold text-base text-gray-700 capitalize">
                    {measurement.name}
                </Text>
                {measurement?.fields?.map((field, fieldIndex) => {

                    const formattedField = {
                    name: field.toLowerCase(),
                    label: field.charAt(0).toUpperCase() + field.slice(1)
                    }

                    const guideKey = `${measurementIndex}-${fieldIndex}`;
                    const isGuideExpanded = !!expandedGuides[guideKey];
                    const guideEntry = getGuideEntry(measurement.name, field);

                    const hasFieldError = !!errors.measurements?.[measurementIndex]?.fields?.[fieldIndex];

                    return (
                    <View key={field} ref={ (node) => { fieldRefs.current[guideKey] = node; } }>
                        <Text aria-label={formattedField.label} nativeID={formattedField.name} className="mt-4 font-montserratMedium">
                        {formattedField.label}
                        </Text>

                        <View className={`h-auto w-full mt-1.5 px-3 flex flex-row items-center justify-between rounded-xl border bg-gray-50 ${ hasFieldError ? "border-red-400" : "border-gray-200" }`}>
                        <Controller
                            control={control}
                            name={`measurements.${measurementIndex}.fields.${fieldIndex}`}
                            render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                aria-label={formattedField.label}
                                aria-labelledby={formattedField.name}
                                keyboardType="number-pad"
                                placeholder="0.00"
                                placeholderTextColor="#9ca3af"
                                className="h-[44px] flex-1 font-montserratMedium text-base"
                                onFocus={ handleInputFocus }
                                onBlur={onBlur}
                                onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
                                value={value}
                            />
                            )}
                        />
                        <View className="h-auto w-[40px] flex-row items-center">
                            <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                            <Text className="font-montserratMedium">{selectedUnit}</Text>
                        </View>
                        </View>
                        { hasFieldError && (
                        <Text className="mt-1 text-red-500 text-xs">{ formattedField.label } is required</Text>
                        ) }

                        {/*==== Show Measurement Guide toggle ====*/}
                        { guideEntry && (
                            <View>
                                <TouchableOpacity
                                    onPress={ () => toggleGuide(guideKey) }
                                    className="mt-3 self-start flex-row items-center justify-center px-4 py-2 rounded-full"
                                    style={{ backgroundColor: "rgba(19, 53, 34, 0.10)" }}
                                >
                                    <Text className="font-montserratMedium text-xs text-baseGreen">
                                        { isGuideExpanded ? "Hide Measurement Guide" : "View Measurement Guide" }
                                    </Text>
                                    { isGuideExpanded
                                        ? <ArrowUp2 size={ 16 } color="#133522" className="ml-1" />
                                        : <ArrowDown2 size={ 16 } color="#133522" className="ml-1" />
                                    }
                                </TouchableOpacity>

                                { isGuideExpanded && (
                                    <View className="mt-2 p-3 rounded-xl border border-gray-200 bg-[#FFFAF2]">
                                        <Text className="font-montserratSemiBold text-sm text-gray-800">{ guideEntry.field }</Text>
                                        { guideEntry.imageUrl?.link && (
                                            <FastImage
                                                source={{ uri: guideEntry.imageUrl.link, priority: FastImage.priority.normal }}
                                                resizeMode={ FastImage.resizeMode.contain }
                                                style={{ width: "100%", height: 220, marginTop: 8, borderRadius: 8, backgroundColor: "#f3f4f6" }}
                                            />
                                        ) }
                                        { !!guideEntry.description && (
                                            <Text className="mt-2 font-Montserrat text-xs text-gray-700">{ guideEntry.description.trim() }</Text>
                                        ) }
                                    </View>
                                ) }
                            </View>
                        ) }
                    </View>
                    )
                })}
                </View>
            ))}

            {/*==== Additional instructions (optional) ====*/}
            <View className="h-auto w-full mt-5 px-3 py-4 rounded-xl border border-gray-200">
                <View className="my-2 flex-row items-center">
                <Text aria-label="Instructions" nativeID="instructions" className="font-montserratSemiBold text-base text-gray-700">Additional Instructions</Text>
                <Text className="ml-2 font-montserratNormal text-xs">(Optional)</Text>
                </View>
                <View className="h-auto w-full mt-1.5 px-3 border border-gray-200 rounded-xl bg-gray-50">
                <Controller
                    control={ control }
                    name="instructions"
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            aria-label="Instructions"
                            aria-labelledby="instructions"
                            keyboardType="default"
                            placeholder="Add any additional instructions"
                            placeholderTextColor="#9ca3af"
                            multiline={ true }
                            textAlignVertical="top"
                            className="h-[80px] font-montserratMedium text-base"
                            onFocus={ handleInputFocus }
                            onBlur={ onBlur }
                            onChangeText={ onChange }
                            value={ value }
                        />
                    ) }
                />
                { errors.instructions && (<Text className="text-red-500 text-xs">{errors.instructions.message}</Text>) }
                </View>
            </View>

            { allRequiredFieldsFilled && (
                <View>
                    <View className="mt-5 flex-row items-center">
                        <Switch
                            value={ !!savedTemplateName || showTemplateSheet }
                            onValueChange={ (isOn) => { if (isOn) setShowTemplateSheet(true); } }
                            disabled={ !!savedTemplateName }
                            trackColor={{ false: "#d1d5db", true: "#133522" }}
                            thumbColor="#ffffff"
                            ios_backgroundColor="#d1d5db"
                            style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                        />
                        <Text className="ml-1 flex-1 font-montserratMedium text-base">Save my measurement for next time</Text>
                    </View>
                    { !!savedTemplateName && (
                        <Text className="mt-1 ml-1 font-montserratMedium text-xs text-green-700">Saved as “{ savedTemplateName }”</Text>
                    ) }
                    { isGuest && (
                        <Text className="mt-1 ml-1 font-montserratMedium text-xs text-blue-500">
                            Zeaper keeps your saved measurement templates for 30 days. Sign in to keep for as long as you want.
                        </Text>
                    ) }
                </View>
            ) }

            <TouchableOpacity
                onPress={ handleSubmit(onSubmitFromMeasurementForm, handleInvalidSubmit) }
                disabled={ isLoading }
                className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
                <Text className="text-lg text-white mr-2">{isLoading ? "Please wait..." : "Add to Cart"}</Text>
                {!isLoading && <ArrowRight className="text-white" />}
            </TouchableOpacity>
        </View>
    );

    const templateSheet = (
        <Modal visible={ showTemplateSheet } transparent animationType="slide" statusBarTranslucent onRequestClose={ closeTemplateSheet }>
            <KeyboardAvoidingView behavior={ Platform.OS === "ios" ? "padding" : undefined } className="flex-1 justify-end bg-black/40">
                <TouchableOpacity activeOpacity={ 1 } onPress={ closeTemplateSheet } className="flex-1" />
                <View className="w-full px-5 pt-3 rounded-t-3xl bg-white" style={{ paddingBottom: (androidKeyboardHeight || insets.bottom) + 20 }}>
                    <View className="h-[5px] w-[44px] self-center rounded-full bg-gray-300" />

                    <View className="mt-4 flex-row items-center justify-between">
                        <Text className="font-montserratSemiBold text-lg text-gray-800">Save Measurement Template</Text>
                        <TouchableOpacity onPress={ closeTemplateSheet } hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Image className="h-[22px] w-[22px]" style={{ tintColor: "#6B7280" }} source={ require("../../../../../assets/images/close.png") } />
                        </TouchableOpacity>
                    </View>

                    <View className="h-auto w-full mt-4 px-3 py-4 rounded-xl border border-gray-200">
                        <Text nativeID="templateName" className="my-2 font-montserratSemiBold text-base text-gray-700">New Template Name</Text>
                        <View className={`h-auto w-full mt-1.5 px-3 border rounded-xl bg-gray-50 ${ templateNameError ? "border-red-400" : "border-gray-200" }`}>
                            <TextInput
                                aria-labelledby="templateName"
                                placeholder="Enter a template name"
                                placeholderTextColor="#9ca3af"
                                className="h-[44px] font-montserratMedium text-base"
                                autoFocus
                                value={ templateName }
                                onChangeText={ (value) => {
                                    setTemplateName(value);
                                    if (templateNameError) setTemplateNameError("");
                                } }
                            />
                        </View>
                        { !!templateNameError && (<Text className="mt-1 text-red-500 text-xs">{ templateNameError }</Text>) }
                    </View>

                    <TouchableOpacity
                        onPress={ handleSaveNewTemplate }
                        disabled={ isSavingTemplate }
                        className="h-[55px] w-full mt-5 flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                        { isSavingTemplate
                            ? <ActivityIndicator size="small" color="#ffffff" />
                            : <Text className="font-montserratMedium text-base text-white">Save New Template</Text>
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );

    const requiredWarning = showRequiredWarning ? (
        <View pointerEvents="none" className="absolute top-2 left-0 right-0 z-10" style={{ elevation: 6 }}>
            <View className="px-4 py-3 flex-row items-center rounded-xl border border-red-200 bg-red-50" style={{ shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }}>
                <Warning2 size={ 20 } color="#DC2626" variant="Bold" />
                <Text className="ml-2 flex-1 font-montserratSemiBold text-sm text-red-700">Please fill all required fields.</Text>
            </View>
        </View>
    ) : null;

    if (embedded) {
        return (
            <View className="flex-1">
                <ScrollView
                    ref={ scrollRef }
                    showsVerticalScrollIndicator={ false }
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    automaticallyAdjustKeyboardInsets={ Platform.OS === "ios" }
                    contentContainerStyle={{ paddingBottom: 24 }}
                >
                    { header }
                    { formContent }
                </ScrollView>
                { requiredWarning }
                { templateSheet }
            </View>
        );
    }

    return (
        <View className="h-full w-full absolute bg-black/40">
            <KeyboardAvoidingView
                behavior={ Platform.OS === "ios" ? "padding" : undefined }
                style={{ flex: 1, justifyContent: "flex-end", paddingTop: insets.top + 12 }}
            >
                <View
                    className="w-full px-5 pt-7 bg-white"
                    style={{
                        maxHeight: screenHeight * 0.9,
                        flexShrink: 1,
                        paddingBottom: 20 + insets.bottom,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                    }}
                >
                    <View>
                        <View className="h-auto w-full flex-row items-start justify-between">
                            <Text className="font-montserratMedium text-2xl text-gray-700">{"Kindly Provide Us With\nYour Measurements"}</Text>

                            <TouchableOpacity
                                onPress={ () => handleCloseAddNewMeasurementBottomSheet() }
                            >
                                <Image
                                    className="h-[30px] w-[30px]"
                                source={ require("../../../../../assets/images/close.png") }
                                />
                            </TouchableOpacity>
                        </View>
                        <LinearGradient
                            colors={[
                                "rgba(229, 231, 235, 0)",
                                "#e5e7eb",
                                "#9ca3af",
                                "#e5e7eb",
                                "rgba(229, 231, 235, 0)"
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="h-[1px] w-full mt-3 rounded"
                        />
                    </View>

                    <View style={{ flexShrink: 1 }}>
                        <ScrollView
                            ref={ scrollRef }
                            showsVerticalScrollIndicator={ false }
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="on-drag"
                            automaticallyAdjustKeyboardInsets={ Platform.OS === "ios" }
                            contentContainerStyle={{ paddingBottom: 24 }}
                        >
                            { formContent }
                        </ScrollView>
                        { requiredWarning }
                        { templateSheet }
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SavedMeasurementsBottomSheet;
