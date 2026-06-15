import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import SavedMeasurementsBottomSheet from "../components/savedMeasurementsBottomSheet_component.tsx";
import useMeasurementHook from '../hooks/measurement_hook';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { setSelectedGender, setSelectedMeasurementTemplate, setShowSelectGenderBottomSheet } from '../slices/measurement_slice';
import AppLoader from '../../../general/components/appLoader.tsx';
import AppHeaderComp from '../../../vendor/general/components/appHeader_comp.tsx';
import MeasurementSkeletonLoader from '../components/measurementSkeletonLoader_component.tsx';
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
    handleEditMeasurementTemplate, handleDeleteMeasurementTemplate,
    onSubmitFromSavedMeasurementTemplate,
  } = useMeasurementHook();

  const hasSelectedTemplate = !!selectedMeasurementTemplate?._id;
  
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
        
        <View className="flex-1 px-[20px]">
          { (isLoading && (!allSavedMeasurements || allSavedMeasurements.length === 0)) ? (
            <View className="pt-[30px]">
              <MeasurementSkeletonLoader />
            </View>
          ) : (
          <FlatList
            data={ allSavedMeasurements }
            keyExtractor={ (item) => item._id! }
            renderItem={ ({ item }) => (
              <MeasurementCard
                savedMeasurement={ item }
                selectedMeasurementTemplate={ selectedMeasurementTemplate }
                dispatch={ dispatch }
                onEdit={ handleEditMeasurementTemplate }
                onDelete={ handleDeleteMeasurementTemplate }
              />
            ) }
            showsVerticalScrollIndicator={ false }
            // Heading + CTA scroll along with the list so users can reach every
            // saved template; the wrapping View now has flex-1 so the FlatList
            // has a bounded height and actually becomes scrollable.
            ListHeaderComponent={
              <View className="pt-[30px] pb-2">
                <Text className="font-montserratMedium text-2xl text-gray-700">
                  Kindly provide us your measurements
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    // Reset any template/gender lingering from a previous Edit
                    // tap so the form opens empty for a brand-new measurement
                    // instead of inheriting old values.
                    dispatch(setSelectedMeasurementTemplate({}));
                    dispatch(setSelectedGender(""));
                    dispatch(setShowSelectGenderBottomSheet(true));
                  }}
                  className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGold"
                >
                  <Text className="font-montserratMedium text-base text-green-800">
                    Add New Measurement
                  </Text>
                </TouchableOpacity>
              </View>
            }
            ListEmptyComponent={
              <View className="h-auto w-full mt-5 p-10 bg-gray-50">
                <FastImage
                  source={ require("../../../../../assets/images/empty_box.png") }
                  defaultSource={ require("../../../../../assets/images/empty_box.png") }
                  resizeMode={ FastImage.resizeMode.contain }
                  className="h-[70px] w-full"
                />

                <Text className="mt-4 text-center text-gray-400">It's like you've not saved any measurement yet. Please add a new measurement</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: hasSelectedTemplate ? 110 : 24 }}
            refreshControl={
              <RefreshControl
                refreshing={ false }
                onRefresh={ () => {} }
              />
            }
          />
          ) }
        </View>

        {/* Sticky CTA — only renders once a saved template has been picked.
            Without this the saved-template path was a dead end: the form path
            had its own Save button, but selecting a template just sat there. */}
        { hasSelectedTemplate && (
          <View
            className="absolute left-0 right-0 bottom-0 px-5 pt-3 pb-6 bg-white border-t border-gray-100"
            style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: -2 }, elevation: 8 }}
          >
            <TouchableOpacity
              onPress={ () => onSubmitFromSavedMeasurementTemplate() }
              disabled={ isLoading }
              activeOpacity={ 0.85 }
              className={ `h-[55px] w-full flex-row items-center justify-center rounded-xl bg-baseGreen ${ isLoading ? "opacity-60" : "" }` }
            >
              <Text className="font-montserratMedium text-base text-white">
                { isLoading ? "Adding to cart…" : "Use This Measurement" }
              </Text>
            </TouchableOpacity>
          </View>
        ) }


        {/* Action-time overlay (kicks in for measurement-form submission etc.,
            once saved templates are already on screen). Initial-fetch loading
            is owned by the inline MeasurementSkeletonLoader above. */}
        { (requiredMeasurementFormFieldsLoading) && (
          <AppLoader loadingAdditionalMessage="Loading measurement form…" />
        ) }
        { (isLoading && allSavedMeasurements && allSavedMeasurements.length > 0) && (
          <AppLoader loadingAdditionalMessage="Please wait…" />
        ) }

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
  onEdit?: (template: IBodyMeasurement) => void;
  onDelete?: (templateId: string) => Promise<boolean>;
}

// Title-cases a possibly-undefined string; never throws.
const titleCase = (value?: string | null) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const MeasurementCard: React.FC<IMeasurementCardProps> = (props) => {
  const { savedMeasurement, selectedMeasurementTemplate, dispatch, onEdit, onDelete } = props;

  // Templates may arrive in two shapes:
  //  • legacy nested:  [{ name, measurements: [{ field, value }] }, ...]
  //  • new flat:       [{ field, value }, ...]
  // Flatten both so the card can render a uniform list.
  const rawList: any[] = (savedMeasurement?.measurements as any[]) ?? [];
  const isFlat = rawList.length > 0 && rawList[0]?.field !== undefined && rawList[0]?.measurements === undefined;
  const allItems: any[] = isFlat
    ? rawList
    : rawList.flatMap((group: any) => group?.measurements ?? []);

  // Collapsed: show first 4 + "+N more / View More" toggle.
  // Expanded:  show everything + "View Less" + "Delete" action row.
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const visibleItems = isExpanded ? allItems : allItems.slice(0, 4);
  const remainingCount = Math.max(allItems.length - 4, 0);

  const handleDeletePress = () => {
    const templateId = savedMeasurement?._id;
    if (!templateId || !onDelete) return;
    Alert.alert(
      "Delete measurement template?",
      `Are you sure you want to delete “${ savedMeasurement?.templateName ?? "this template" }”? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await onDelete(templateId);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      onPress={ () => dispatch(setSelectedMeasurementTemplate(savedMeasurement!)) }
      key={ savedMeasurement!._id! }
      activeOpacity={ 0.9 }
      className={`h-auto w-full mt-4 px-5 py-5 border ${ savedMeasurement!._id! === selectedMeasurementTemplate!._id! ? "border-[#D5B07B] bg-[#FFFAF2]" : "border-gray-200 bg-[#F8F9FE]" } rounded-xl`}>
      <View className="flex-row items-center justify-between">
          <Text className="flex-1 font-montserratSemiBold text-lg text-gray-700">{ savedMeasurement?.templateName ?? "" }</Text>
          {/* Top-right slot is now the "Selected" status badge. The Edit
              affordance moved into the footer next to View More so this slot
              can do double-duty as the applied-measurement indicator. */}
          { savedMeasurement!._id! === selectedMeasurementTemplate!._id! && (
              <View
                  className="ml-3 px-3 py-1 flex-row items-center rounded-full"
                  style={{ backgroundColor: "#D5B07B" }}
              >
                  <View className="h-1.5 w-1.5 mr-1.5 rounded-full bg-white" />
                  <Text className="font-montserratSemiBold text-[11px] text-white">Selected</Text>
              </View>
          ) }
      </View>

      {/* 2-column grid of measurements — preview (4 items) or full when expanded. */}
      <View className="mt-3 flex-row flex-wrap">
          { visibleItems.map((measurementItem: any, itemIndex: number) => (
              <View
                  key={ measurementItem?._id ?? `mi-${itemIndex}` }
                  className="w-1/2 mt-2 pr-3"
              >
                  <Text className="font-Montserrat text-xs text-gray-500" numberOfLines={ 1 }>
                      { titleCase(measurementItem?.field) || "Field" }
                  </Text>
                  <Text className="mt-0.5 font-montserratMedium text-base text-gray-800" numberOfLines={ 1 }>
                      { measurementItem?.value ?? "" }
                  </Text>
              </View>
          )) }
      </View>

      {/* Footer toggle row.
          Collapsed: "+N more" hint + "View More" pill (only when there are
                     more than 4 items to reveal).
          Expanded:  "View Less" pill + Delete CTA on the right. */}
      { remainingCount > 0 && !isExpanded && (
          <View className="mt-3 flex-row items-center justify-between">
              <Text className="font-montserratMedium text-xs text-gray-500">
                  +{ remainingCount } more
              </Text>
              <View className="flex-row items-center">
                  <TouchableOpacity
                      onPress={ () => savedMeasurement && onEdit?.(savedMeasurement) }
                      hitSlop={ { top: 8, bottom: 8, left: 8, right: 8 } }
                      className="mr-2 px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "rgba(19, 53, 34, 0.10)" }}
                  >
                      <Text className="font-montserratSemiBold text-xs text-baseGreen">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={ () => setIsExpanded(true) }
                      hitSlop={ { top: 8, bottom: 8, left: 8, right: 8 } }
                      className="px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "rgba(19, 53, 34, 0.10)" }}
                  >
                      <Text className="font-montserratSemiBold text-xs text-baseGreen">View More</Text>
                  </TouchableOpacity>
              </View>
          </View>
      ) }

      {/* Short templates with no overflow still need an Edit affordance — the
          header no longer carries one. Render an Edit-only footer for them. */}
      { remainingCount === 0 && !isExpanded && (
          <View className="mt-3 flex-row items-center justify-end">
              <TouchableOpacity
                  onPress={ () => savedMeasurement && onEdit?.(savedMeasurement) }
                  hitSlop={ { top: 8, bottom: 8, left: 8, right: 8 } }
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(19, 53, 34, 0.10)" }}
              >
                  <Text className="font-montserratSemiBold text-xs text-baseGreen">Edit</Text>
              </TouchableOpacity>
          </View>
      ) }

      { isExpanded && (
          <View className="mt-4 flex-row items-center justify-between">
              <TouchableOpacity
                  onPress={ () => setIsExpanded(false) }
                  hitSlop={ { top: 8, bottom: 8, left: 8, right: 8 } }
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(19, 53, 34, 0.10)" }}
              >
                  <Text className="font-montserratSemiBold text-xs text-baseGreen">View Less</Text>
              </TouchableOpacity>

              <View className="flex-row items-center">
              <TouchableOpacity
                  onPress={ () => savedMeasurement && onEdit?.(savedMeasurement) }
                  hitSlop={ { top: 8, bottom: 8, left: 8, right: 8 } }
                  className="mr-2 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(19, 53, 34, 0.10)" }}
              >
                  <Text className="font-montserratSemiBold text-xs text-baseGreen">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  onPress={ handleDeletePress }
                  disabled={ isDeleting }
                  hitSlop={ { top: 8, bottom: 8, left: 8, right: 8 } }
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(220, 38, 38, 0.10)", opacity: isDeleting ? 0.6 : 1 }}
              >
                  <Text className="font-montserratSemiBold text-xs text-red-600">
                      { isDeleting ? "Deleting…" : "Delete" }
                  </Text>
              </TouchableOpacity>
              </View>
          </View>
      ) }
  </TouchableOpacity>
  );
};