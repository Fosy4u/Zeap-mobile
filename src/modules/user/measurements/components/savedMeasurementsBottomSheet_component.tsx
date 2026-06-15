import { useDispatch, useSelector } from 'react-redux';
import { ArrowDown2, ArrowRight, ArrowUp2 } from 'iconsax-react-native';
import React, { useState, useRef } from 'react';
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
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { setSaveMeasurementForNextTime, setShowAddNewMeasurementBottomSheet } from '../slices/measurement_slice.ts';
import useMeasurementHook from '../hooks/measurement_hook.ts';
import { Controller } from 'react-hook-form';
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const SavedMeasurementsBottomSheet = () => {
    const { requiredMeasurementFormFields, bodyMeasurementGuides, saveMeasurementForNextTime, selectedUnit, isLoading } = useSelector((state: RootState) => state.measurementState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const isGuest = !!userData?.isGuest;
    const [expandedGuides, setExpandedGuides] = useState<Record<string, boolean>>({});

    // Find the guide entry for a given measurement category + field name.
    // Comparison is case-insensitive — the API payload mixes casing
    // ("shirt (short sleeve)" vs "Shirt (Long Sleeve)").
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
    // Sheet caps at ~90% of the viewport so the rounded top + header always
    // peek above the keyboard. The actual lift above the keyboard is handled
    // by KeyboardAvoidingView (iOS) + Android's adjustResize, so we no longer
    // measure keyboard height manually.
    const { height: screenHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch<AppDispatch>();

    // Android's adjustResize moves the window but does NOT auto-scroll a
    // focused input into the visible area inside a nested ScrollView. We do
    // that ourselves on every input focus by asking the ScrollView's response
    // chain to bring the focused node into view above the keyboard. iOS gets
    // the same behavior for free via `automaticallyAdjustKeyboardInsets`.
    const scrollRef = useRef<ScrollView>(null);
    const handleInputFocus = (event: any) => {
        if (Platform.OS !== "android") { return; }
        const node = findNodeHandle(event?.target);
        if (!node) { return; }
        const responder: any = scrollRef.current?.getScrollResponder?.();
        responder?.scrollResponderScrollNativeHandleToKeyboard?.(node, 120, true);
    };

    const {
        control, handleSubmit, onSubmitFromMeasurementForm, errors,
    } = useMeasurementHook();

    const handleCloseAddNewMeasurementBottomSheet = () => {
        // Dismiss immediately — no slide-out wait.
        dispatch(setShowAddNewMeasurementBottomSheet(false));
    };
    
    return (
        <View className="h-full w-full absolute bg-black/40">
            <KeyboardAvoidingView
                behavior={ Platform.OS === "ios" ? "padding" : undefined }
                style={{ flex: 1, justifyContent: "flex-end" }}
            >
                <View
                    className="w-full px-5 pt-7 bg-white"
                    style={{
                        maxHeight: screenHeight * 0.9,
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

                    <ScrollView
                        ref={ scrollRef }
                        showsVerticalScrollIndicator={ false }
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        automaticallyAdjustKeyboardInsets={ Platform.OS === "ios" }
                        contentContainerStyle={{ paddingBottom: 24 }}
                    >
                    <View className="flex-1 flex-col justify-between">
                        
                        {/*==== Template Name ====*/}
                        <View className="h-auto w-full mt-5 px-3 py-4 rounded-xl border border-gray-200">
                            <Text aria-label="TemplateName" nativeID="templateName" className="my-2 font-montserratSemiBold text-base text-gray-700 capitalize">Template Name</Text>
                            <View className="h-auto w-full mt-1.5 px-3 border border-gray-200 rounded-xl bg-gray-50">
                            <Controller
                                control={ control }
                                name="templateName"
                                rules={{ required: true }}
                                render={ ({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        aria-label="TemplateName"
                                        aria-labelledby="templateName"
                                        keyboardType="default"
                                        placeholder="Enter a template name"
                                        placeholderTextColor="#9ca3af"
                                        className="font-montserratMedium text-base"
                                        onFocus={ handleInputFocus }
                                        onBlur={ onBlur }
                                        onChangeText={ onChange }
                                        value={ value }
                                    />
                                ) }
                            />
                            { errors.templateName && (<Text className="text-red-500 text-xs">{errors.templateName.message}</Text>) }
                            </View>
                        </View>

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

                                return (
                                <View key={field}>
                                    <Text aria-label={formattedField.label} nativeID={formattedField.name} className="mt-4 font-montserratMedium">
                                    {formattedField.label}
                                    </Text>

                                    <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50">
                                    <Controller
                                        control={control}
                                        name={`measurements.${measurementIndex}.fields.${fieldIndex}`}
                                        // name={`measurements[${measurementIndex}].fields[${fieldIndex}]` as any}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            aria-label={formattedField.label}
                                            aria-labelledby={formattedField.name}
                                            keyboardType="number-pad"
                                            placeholder="0.00"
                                            placeholderTextColor="#9ca3af"
                                            className="flex-1 font-montserratMedium text-base"
                                            onFocus={ handleInputFocus }
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                        )}
                                    />
                                    <View className="h-auto w-[40px] flex-row items-center">
                                        <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                                        <Text className="font-montserratMedium">{selectedUnit}</Text>
                                    </View>
                                    </View>
                                    {errors.measurements?.[measurementIndex]?.fields?.[fieldIndex] && (
                                    <Text className="text-red-500 text-xs">
                                        {errors.measurements?.[measurementIndex]?.fields?.[fieldIndex]?.message}
                                    </Text>
                                    )}

                                    {/*==== Show Measurement Guide toggle ====*/}
                                    { guideEntry && (
                                        <View>
                                            <TouchableOpacity
                                                onPress={ () => toggleGuide(guideKey) }
                                                className="mt-3 self-start flex-row items-center justify-center px-4 py-2 rounded-full"
                                                style={{ backgroundColor: "rgba(19, 53, 34, 0.10)" }}
                                            >
                                                <Text className="font-montserratMedium text-xs text-baseGreen">
                                                    { isGuideExpanded ? "Hide Measurement Guide" : "Show Measurement Guide" }
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

                        {/*==== Measurements Instructions ====*/}
                        <View className="h-auto w-full mt-5 px-3 py-4 rounded-xl border border-gray-200">
                            <View className="my-2 flex-row items-center">
                            <Text aria-label="Instructions" nativeID="instructions" className="font-montserratSemiBold text-base text-gray-700 capitalize">Additional Instructions</Text>
                            <Text className="ml-2 font-montserratNormal text-xs">(Optional)</Text>
                            </View>
                            <View className="h-auto w-full mt-1.5 px-3 border border-gray-200 rounded-xl bg-gray-50">
                            <Controller
                                control={ control }
                                name="instructions"
                                rules={{ required: true }}
                                render={ ({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        aria-label="Instructions"
                                        aria-labelledby="instructions"
                                        keyboardType="default"
                                        placeholder="Add instructions for measurement"
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

                        {/*==== Save measurement ====*/}
                        <View className="mt-5 flex-row items-center">
                            <CheckBox
                                value={saveMeasurementForNextTime}
                                onValueChange={(newValue) => dispatch(setSaveMeasurementForNextTime(newValue))}
                                tintColors={{ true: "#133522", false: "#151518" }}
                            />
                            <Text className="ml-2 font-montserratMedium text-base">Save my measurement for next time</Text>
                        </View>
                        { isGuest && (
                            <Text className="mt-1 ml-1 font-montserratMedium text-xs text-blue-500">
                                Zeaper will save your measurement for the next 30 days. Sign in to keep for as long as you want.
                            </Text>
                        ) }

                        <TouchableOpacity
                            onPress={ handleSubmit(onSubmitFromMeasurementForm) }
                            disabled={ isLoading }
                            className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-lg text-white mr-2">{isLoading ? "Please wait..." : "Proceed"}</Text>
                            {!isLoading && <ArrowRight className="text-white" />}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SavedMeasurementsBottomSheet;