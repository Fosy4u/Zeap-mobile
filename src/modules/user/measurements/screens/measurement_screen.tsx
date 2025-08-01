import React, { useEffect } from 'react'
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import SavedMeasurementsBottomSheet from "../components/savedMeasurementsBottomSheet_component.tsx";
import useMeasurementHook from '../hooks/measurement_hook';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { setSelectedMeasurementTemplate, setShowAddNewMeasurementBottomSheet, setShowSelectGenderBottomSheet } from '../slices/measurement_slice';
import AppLoader from '../../../general/components/appLoader.tsx';
import AppHeaderComp from '../../../vendor/general/components/appHeader_comp.tsx';
import FastImage from 'react-native-fast-image';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import IBodyMeasurement from '../models/bodyMeasurement_model.ts';
import { Dispatch, UnknownAction } from '@reduxjs/toolkit/react';
import SelectGenderBottomSheetComponent from '../components/selectGenderBottomSheet_component.tsx';



const MeasurementScreen = () => {
  const {
    allSavedMeasurements, selectedMeasurementTemplate, requiredMeasurementFormFields, showAddNewMeasurementBottomSheet, showSelectGenderBottomSheet,
    isLoading
  } = useSelector((state: RootState) => state.measurementState);
  const { product } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();

  const {
    requiredMeasurementFormFieldsLoading, handleGetAllSavedMeasurements,
    handleGetRequiredMeasurementFormFields, handleGetBodyMeasurementGuides,
  } = useMeasurementHook();
  
  useEffect(() => {
    if (product) {
      handleGetAllSavedMeasurements();
      // handleGetRequiredMeasurementFormFields();
    }
  }, [requiredMeasurementFormFields]);
  

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full w-full relative flex-1 bg-white">
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        {/*==== Header ====*/}
        <AppHeaderComp title="Measurement" />
        
        <View className="pt-[30px] pb-5 px-[20px]">
          <Text className="font-montserratMedium text-2xl text-gray-700">
            {/* Kindly provide us your measurement */}
            List all the measurements that you've saved
          </Text>

          <TouchableOpacity 
            onPress={() => {
              // dispatch(setShowAddNewMeasurementBottomSheet(true));
              dispatch(setShowSelectGenderBottomSheet(true));
              handleGetBodyMeasurementGuides("male");
            }}
            className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGold"
          >
            <Text className="font-montserratMedium text-base text-green-800">
              Enter New Measurement
            </Text>
          </TouchableOpacity>

          { allSavedMeasurements.length === 0 && (
            <View className="h-auto w-full mt-5 p-10 bg-gray-50">
              <FastImage
                source={ require("../../../../../assets/images/empty_box.png") }
                defaultSource={ require("../../../../../assets/images/empty_box.png") }
                resizeMode={ FastImage.resizeMode.contain }
                className="h-[70px] w-full"
              />

              <Text className="mt-4 text-center text-gray-400">It's like you've not saved any measurement yet. Please add a new measurement</Text>
            </View>
          )}

          <FlatList
            data={ allSavedMeasurements }
            keyExtractor={ (item) => item._id! }
            renderItem={ ({ item }) => (
              <MeasurementCard
                savedMeasurement={ item }
                selectedMeasurementTemplate={ selectedMeasurementTemplate }
                dispatch={ dispatch }
              />
            ) }
            showsVerticalScrollIndicator={ false }
            refreshControl={
              <RefreshControl
                refreshing={ false }
                onRefresh={ () => {} }
              />
            }
          />
        </View>   

        {(isLoading) && <AppLoader loadingAdditionalMessage="Loading saved measurement templates." />}
        
        {(requiredMeasurementFormFieldsLoading) && <AppLoader loadingAdditionalMessage="Loading measurement forms." />}

        {(isLoading) && <AppLoader loadingAdditionalMessage="Loading product to cart." />}
        
        {(isLoading) && <AppLoader loadingAdditionalMessage="Creating measurement template." />}

        {showAddNewMeasurementBottomSheet && (
          <SavedMeasurementsBottomSheet />
        )}
        {showSelectGenderBottomSheet && (
          <SelectGenderBottomSheetComponent />
        )}

      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default MeasurementScreen;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Measurement Card
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface IMeasurementCardProps {
  savedMeasurement?: IBodyMeasurement;
  selectedMeasurementTemplate?: IBodyMeasurement;
  dispatch: Dispatch<UnknownAction>;
}

const MeasurementCard: React.FC<IMeasurementCardProps> = (props) => {
  const { savedMeasurement, selectedMeasurementTemplate, dispatch } = props;
  return (
    <TouchableOpacity 
      onPress={ () => dispatch(setSelectedMeasurementTemplate(savedMeasurement!)) }
      key={ savedMeasurement!._id! } 
      className={`h-auto w-full mt-4 px-5 py-5 border ${ savedMeasurement!._id! === selectedMeasurementTemplate!._id! ? "border-[#D5B07B] bg-[#FFFAF2]" : "border-gray-200 bg-[#F8F9FE]" } rounded-xl`}>
      <View className="flex-row items-center justify-between">
          <Text className="font-montserratSemiBold text-lg text-gray-700">{ savedMeasurement!.templateName! }</Text>
          <TouchableOpacity>
              <Text>Edit</Text>
          </TouchableOpacity>
      </View>
      <View  className="mt-2">
          { savedMeasurement!.measurements!.map((measurement) => (
              <View key={ measurement._id! } className="h-auto w-full mt-2">
                  <Text className="mt-2 font-montserratSemiBold text-base text-gray-700">
                      { measurement.name!.charAt(0).toUpperCase() + measurement.name!.slice(1) }
                  </Text>


                  <View className="h-auto w-full flex-row flex-wrap items-center gap-x-8">
                      { measurement.measurements!.map((measurementItem) => (
                          <Text key={ measurementItem._id! }
                              className="my-1 font-Montserrat font-normal text-base text-gray-700"
                          >
                              { `${measurementItem?.field!.charAt(0).toUpperCase() + measurementItem.field!.slice(1)}: ${measurementItem?.value}` }
                          </Text>
                      )) }
                  </View>
              </View>
          )) }
      </View>
  </TouchableOpacity>
  );
};