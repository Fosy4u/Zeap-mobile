import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

import { RootState } from '../../../../redux/store/store';
import SavedMeasurementsBottomSheet from "../components/savedMeasurementsBottomSheet_component.tsx";
import SelectGenderBottomSheetComponent from '../components/selectGenderBottomSheet_component.tsx';
import SelectExistingMeasurementBottomSheet from '../components/selectExistingMeasurementBottomSheet_component.tsx';
import MeasurementSkeletonLoader from '../components/measurementSkeletonLoader_component.tsx';
import AppHeaderComp from '../../../vendor/general/components/appHeader_comp.tsx';
import useMeasurementHook from '../hooks/measurement_hook';
import { setSelectedGender, setSelectedMeasurementTemplate, setShowSelectGenderBottomSheet } from '../slices/measurement_slice';
import IBodyMeasurement from '../models/bodyMeasurement_model.ts';

const MeasurementScreen = () => {
  const {
    selectedMeasurementTemplate, showAddNewMeasurementBottomSheet, showSelectGenderBottomSheet,
    isLoading,
  } = useSelector((state: RootState) => state.measurementState);
  const { product } = useSelector((state: RootState) => state.productState);
  const dispatch = useDispatch();

  const {
    requiredMeasurementFormFieldsLoading, handleGetAllSavedMeasurements,
    handleGetRequiredMeasurementFormFields, handleGetBodyMeasurementGuides,
  } = useMeasurementHook();

  // Drives the "Select Existing Measurement" bottom sheet (screen-local).
  const [showSelectExistingSheet, setShowSelectExistingSheet] = useState(false);
  const isBusy = isLoading || requiredMeasurementFormFieldsLoading;

  useEffect(() => {
    if (product?.productId) {
      handleGetAllSavedMeasurements();
      handleGetRequiredMeasurementFormFields();
      const productGender = ((product as any)?.categories?.gender?.[0] as string | undefined)?.toLowerCase();
      if (productGender) {
        dispatch(setSelectedGender(productGender));
        handleGetBodyMeasurementGuides(productGender);
      }
    }
  }, [product?.productId]);

  // Clear the selected measurement template when leaving this screen, so the
  // built-in fields don't auto-prefill with a previously selected saved
  // measurement when the user comes back — they should start blank each visit.
  useFocusEffect(
    useCallback(() => {
      return () => {
        dispatch(setSelectedMeasurementTemplate({}));
      };
    }, [dispatch])
  );

  // When the user taps "Add New Measurement", we clear the selected template
  const handleAddNewMeasurement = () => {
    dispatch(setSelectedMeasurementTemplate({}));
    dispatch(setSelectedGender(""));
    dispatch(setShowSelectGenderBottomSheet(true));
  };

  // Handle when the user selects an existing measurement template from the bottom sheet. We set it as the selected template and fetch its
  const handleApplyExistingMeasurement = (template: IBodyMeasurement) => {
    dispatch(setSelectedMeasurementTemplate(template));
    const gender = ((template as any)?.gender as string | undefined)?.toLowerCase();
    if (gender) {
      dispatch(setSelectedGender(gender));
      handleGetBodyMeasurementGuides(gender);
    }
    setShowSelectExistingSheet(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="h-full w-full relative flex-1 bg-white">
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />

        {/*==== Header ====*/}
        <AppHeaderComp title="Measurement" />

        <View className="flex-1 px-[20px]">
          <Text className="pt-[24px] pb-1 font-montserratMedium text-xl text-gray-700">
            Kindly provide us your measurements
          </Text>

          {/*==== Actions — sit directly under the caption ====*/}
          <View className="mt-4">
            <TouchableOpacity
              onPress={ handleAddNewMeasurement }
              className="h-[55px] w-full flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="font-montserratMedium text-base text-white">Add New Measurement</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={ () => setShowSelectExistingSheet(true) }
              className="h-[55px] w-full mt-3 flex-row items-center justify-center rounded-xl bg-lightGold"
            >
              <Text className="font-montserratMedium text-base text-green-800">Select Existing Measurement</Text>
            </TouchableOpacity>
          </View>

          {/*==== Required measurement form (inline) ====*/}
          { isBusy ? (
            <View className="pt-[20px]">
              <MeasurementSkeletonLoader />
            </View>
          ) : (
            <SavedMeasurementsBottomSheet
              embedded
              key={ selectedMeasurementTemplate?._id ?? "blank" }
            />
          ) }
        </View>

        {/*==== Bottom sheets ====*/}
        { showAddNewMeasurementBottomSheet && (
          <SavedMeasurementsBottomSheet />
        ) }
        { showSelectGenderBottomSheet && (
          <SelectGenderBottomSheetComponent />
        ) }
        { showSelectExistingSheet && (
          <SelectExistingMeasurementBottomSheet
            onApply={ handleApplyExistingMeasurement }
            onClose={ () => setShowSelectExistingSheet(false) }
          />
        ) }
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default MeasurementScreen;
