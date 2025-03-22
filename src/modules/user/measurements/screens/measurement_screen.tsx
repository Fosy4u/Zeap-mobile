
import React, { useEffect } from 'react'
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { ArrowLeft, ArrowRight } from 'iconsax-react-native';
import { Controller } from 'react-hook-form';
import CheckBox from '@react-native-community/checkbox';
import SavedMeasurementsBottomSheet from "../components/savedMeasurementsBottomSheet_component.tsx";
import useMeasurementHook from '../hooks/measurement_hook';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { setSaveMeasurementForNextTime, setShowSavedMeasurementBottomSheet } from '../slices/measurement_slice';
import useProductsHook from '../../products/hooks/products_hook.ts';
import AppLoader from '../../../general/components/appLoader.tsx';



const MeasurementScreen = () => {
  const { requiredMeasurementFormFields, saveMeasurementForNextTime, showSavedMeasurementBottomSheet, selectedUnit } = useSelector((state: RootState) => state.measurementState);
  const { product } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();

  const {
    control, onSubmitFromMeasurementForm, errors, getValues,
    allBodyMeasurementTemplatesLoading, handleGetAllMeasurementsRelatedData,
    requiredMeasurementFormFieldsLoading, 
    addProductToCartLoading,
    addBodyMeasurementTemplateLoading
  } = useMeasurementHook();
  
  useEffect(() => {
    if (product) {
      handleGetAllMeasurementsRelatedData();
    }
  }, [requiredMeasurementFormFields]);
  

  return (
    <SafeAreaView className="h-full w-full relative flex-1 bg-white">
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/*==== Header ====*/}
      <View className="h-auto w-full px-[20px] flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.pop()}>
          <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" />
          </View>
        </TouchableOpacity>
        <Text className="font-montserratBold text-lg text-baseGreen">Measurement</Text>
        <View className="h-[40px] w-[40px]" />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pt-[30px] pb-5 px-[20px]">
          <Text className="font-montserratMedium text-2xl text-gray-700">
            Kindly provide us your measurement
          </Text>

          <TouchableOpacity 
            onPress={() => dispatch(setShowSavedMeasurementBottomSheet(true))}
            className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGold"
          >
            <Text className="font-montserratMedium text-base text-green-800">
              Apply Existing Measurement
            </Text>
          </TouchableOpacity>

          <Text className="mt-4 font-montserratSemiBold text-center">OR</Text>
          <Text className="mt-3 font-montserratSemiBold text-base text-center text-gray-700">
            Enter new measurement
          </Text>

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
            onPress={() => onSubmitFromMeasurementForm(getValues())}
            disabled={addProductToCartLoading && addBodyMeasurementTemplateLoading}
            className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
          >
            <Text className="text-lg text-white mr-2">{addProductToCartLoading || addBodyMeasurementTemplateLoading ? "Please wait..." : "Proceed"}</Text>
            {!addProductToCartLoading && !addBodyMeasurementTemplateLoading && <ArrowRight className="text-white" />}
          </TouchableOpacity>
        </View>   
      </ScrollView>
      {(allBodyMeasurementTemplatesLoading) && <AppLoader loadingAdditionalMessage="Loading saved measurement templates." />}
      
      {(requiredMeasurementFormFieldsLoading) && <AppLoader loadingAdditionalMessage="Loading measurement forms." />}

      {(addProductToCartLoading) && <AppLoader loadingAdditionalMessage="Loading product to cart." />}
      
      {(addBodyMeasurementTemplateLoading) && <AppLoader loadingAdditionalMessage="Creating measurement template." />}

      {showSavedMeasurementBottomSheet && (
        <SavedMeasurementsBottomSheet />
      )}
      
    </SafeAreaView>
  );
};

export default MeasurementScreen;