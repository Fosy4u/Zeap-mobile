import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight } from 'iconsax-react-native';
import React, { useRef, useEffect } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { setSaveMeasurementForNextTime, setShowAddNewMeasurementBottomSheet } from '../slices/measurement_slice.ts';
import useMeasurementHook from '../hooks/measurement_hook.ts';
import { Controller } from 'react-hook-form';
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';


const SavedMeasurementsBottomSheet = () => {
    const { requiredMeasurementFormFields, saveMeasurementForNextTime, selectedUnit, isLoading } = useSelector((state: RootState) => state.measurementState);
    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight / 1.15;
    const slideAnimation = useRef<Animatable.View>(null);
    const dispatch = useDispatch<AppDispatch>();

    const {
        control, onSubmitFromMeasurementForm, errors, getValues,
        onSubmitFromSavedMeasurementTemplate,
    } = useMeasurementHook();
    

    useEffect(() => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: modalHeight },
                1: { translateY: 0 }
            }, 1000);
        }
    }, [modalHeight]);

    const handleCloseAddNewMeasurementBottomSheet = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                dispatch(setShowAddNewMeasurementBottomSheet(false));
            });
        } else {
            dispatch(setShowAddNewMeasurementBottomSheet(false));
        }
    };
    
    return (
        <SafeAreaView className="h-full w-full absolute bg-black/40">

           <Animatable.View 
                ref={slideAnimation}
                className="w-full px-5 pt-7 pb-5 absolute bottom-0 bg-white"
                style={{ 
                    height: modalHeight,
                    transform: [{ translateY: modalHeight }]
                }}
            >
                <View>
                    <View className="h-auto w-full flex-row items-start justify-between">
                        <Text className="font-montserratMedium text-2xl text-gray-700">Kindly Provide Us Your Measurement</Text>

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

                <ScrollView showsVerticalScrollIndicator={ false }>
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
                            <Controller
                                control={control}
                                name={`measurements.${measurementIndex}.name`}
                                defaultValue={measurement.name}
                                render={({ field: { onChange, value } }) => {
                                useEffect(() => {
                                    onChange(measurement.name);
                                }, [measurement.name]);
                                
                                return (
                                    <TextInput
                                    value={value}
                                    editable={false}
                                    className="hidden"
                                    />
                                );
                                }}
                            />

                            {measurement?.fields?.map((field, fieldIndex) => {

                                const formattedField = {
                                name: field.toLowerCase(),
                                label: field.charAt(0).toUpperCase() + field.slice(1)
                                }

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
                                </View>
                                )
                            })}
                            </View>
                        ))}

                        {/*==== Measurements Instructions ====*/}
                        <View className="h-auto w-full mt-5 px-3 py-4 rounded-xl border border-gray-200">
                            <View className="my-2 flex-row items-center">
                            <Text aria-label="Instructions" nativeID="instructions" className="font-montserratSemiBold text-base text-gray-700 capitalize">Measurement Instructions</Text>
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

                        <TouchableOpacity 
                            onPress={ () => {
                                // dispatch(setShowAddNewMeasurementBottomSheet(false));
                                // onSubmitFromSavedMeasurementTemplate();
                                onSubmitFromMeasurementForm(getValues());
                            } }
                            disabled={ isLoading }
                            className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-lg text-white mr-2">{isLoading ? "Please wait..." : "Proceed"}</Text>
                            {!isLoading && <ArrowRight className="text-white" />}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </SafeAreaView>
    )
}

export default SavedMeasurementsBottomSheet;