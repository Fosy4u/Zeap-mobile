import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ArrowDown2, ArrowRight2 } from "iconsax-react-native";
import React, { useState } from "react";
import { View, Image, Text } from "react-native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";

export type ICategoryFilterBottomSheetComponent = {
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  snapPoints: string[];
  setShowBottomSheetModal: (value: boolean) => void;
};

const CategoryFilterBottomSheetComponent = ({ bottomSheetModalRef, snapPoints, setShowBottomSheetModal }: ICategoryFilterBottomSheetComponent) => {
  const [showClothingType, setShowClothingType] = useState(false);
  const [showClothingCategoryMale, setShowClothingCategoryMale] = useState(false);
  const [showClothingCategoryFemale, setShowClothingCategoryFemale] = useState(false);
  const [showWeddingAndEvents, setShowWeddingAndEvents] = useState(false);
  const [showFootwearType, setShowFootwearType] = useState(false);
  const [showFootwearCategoryMale, setShowFootwearCategoryMale] = useState(false);
  const [showFootwearCategoryFemale, setShowFootwearCategoryFemale] = useState(false);
  const [showFashionCategoryMale, setShowFashionCategoryMale] = useState(false);
  const [showFashionCategoryFemale, setShowFashionCategoryFemale] = useState(false);

  return (
    <BottomSheetModal
      ref={ bottomSheetModalRef }
      index={ 0 }
      snapPoints={ snapPoints }
      // enableHandlePanningGesture={ false }
      // enableOverDragenableContentPanningGesture={ false }
      enablePanDownToClose={ false }
      handleStyle={{ display: "none" }}
      // onChange={ handleSheetChanges }
    >
      <BottomSheetView className="flex-1">

        <View className="h-full w-full pt-7">

          {/*==== Modal Header ====*/}
          <View className="mx-[25px]">
            <View className="h-auto w-full mb-4 flex-row items-center justify-between">
              <Text className="text-[24px] leading-[34px] text-black">
                Filter
              </Text>
              <TouchableOpacity onPress={ () => setShowBottomSheetModal(false) }>
                <Image
                  className="h-[30px] w-[30px]"
                  source={require("../../../../assets/close.png")}
                />
              </TouchableOpacity>
            </View>
            <Text className="mt-3 text-[16px] text-gray-700 ">
              Filter your search with the following
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={ false }
            showsHorizontalScrollIndicator={ false }
            stickyHeaderHiddenOnScroll={ true }
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
          >
            {/*==== Clothing Type ====*/}
            <View className="mt-6">
              <TouchableOpacity onPress={ () => setShowClothingType(!showClothingType) }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Clothing type
                  </Text>
                    { showClothingType ? (
                      <ArrowDown2 size={ 24 } className="text-gray-700" />
                    ) : (
                      <ArrowRight2 size={ 24 } className="text-gray-700" />
                    ) }
                </View>
              </TouchableOpacity>
              { showClothingType && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Ready-made</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Tailor sewn</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] hidden bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Child</Text>
                  </View>
                </View>
              ) }
            </View>

            {/*==== Clothing Category Male ====*/}
            <View className="mt-6">
              <TouchableOpacity onPress={ () => setShowClothingCategoryMale(!showClothingCategoryMale) }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Clothing category male
                  </Text>
                    { showClothingCategoryMale ? (
                      <ArrowDown2 size={ 24 } className="text-gray-700" />
                    ) : (
                      <ArrowRight2 size={ 24 } className="text-gray-700" />
                    ) }
                </View>
              </TouchableOpacity>
              { showClothingCategoryMale && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  <View className="bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                    <Text className="text-[12px] text-gray-700">Adult</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Boy</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Child</Text>
                  </View>
                </View>
              ) }
            </View>

            {/*==== Clothing Category Female ====*/}
            <View className="mt-6">
              <TouchableOpacity onPress={ () => setShowClothingCategoryFemale(!showClothingCategoryFemale) }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Clothing category female
                  </Text>
                    { showClothingCategoryFemale ? (
                      <ArrowDown2 size={ 24 } className="text-gray-700" />
                    ) : (
                      <ArrowRight2 size={ 24 } className="text-gray-700" />
                    ) }
                </View>
              </TouchableOpacity>
              { showClothingCategoryFemale && (
                <View className="mb-2 flex-row flex-wrap gap-4">
                  <View className="bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                    <Text className="text-[12px] text-gray-700">Adult</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Girl</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Child</Text>
                  </View>
                </View>
              ) }
            </View>

            {/*==== Wedding And Events ====*/}
            <View className="mt-6">
              <TouchableOpacity onPress={ () => setShowWeddingAndEvents(!showWeddingAndEvents) }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-gray-700 text-[14px]">
                    Wedding and events
                  </Text>
                  { showWeddingAndEvents ? (
                    <ArrowDown2 size={ 24 } className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={ 24 } className="text-gray-700" />
                  ) }
                </View>
              </TouchableOpacity>             
              { showWeddingAndEvents && (
                <View className="mt-9 flex-row flex-wrap gap-4">
                  <View className="bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                    <Text className="text-[12px] text-gray-700">White wedding</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Groom's men</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Bridal train</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Bridal shower</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Asoebi</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Pre-wedding</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Traditional wedding</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Birthday</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Burial ceremony</Text>
                  </View>
                </View>
              ) }
            </View>

            {/*==== Footwear Type ====*/}
            <View className="mt-6">
              <TouchableOpacity onPress={ () => setShowFootwearType(!showFootwearType) }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-gray-700 text-[14px]">
                    Footwear type
                  </Text>
                  { showFootwearType ? (
                    <ArrowDown2 size={ 24 } className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={ 24 } className="text-gray-700" />
                  ) }
                </View>
              </TouchableOpacity>             
              { showFootwearType && (
                <View className="mt-9 flex-row flex-wrap gap-4">
                  <View className="bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                    <Text className="text-[12px] text-gray-700">Ready made</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Tailor sewn</Text>
                  </View>
                </View>
              ) }
            </View>

            {/*==== Footwear Category Male ====*/}
            <View className="mt-6">
              <TouchableOpacity onPress={ () => setShowFootwearCategoryMale(!showFootwearCategoryMale) }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Footwear category male
                  </Text>
                    { showFootwearCategoryMale ? (
                      <ArrowDown2 size={ 24 } className="text-gray-700" />
                    ) : (
                      <ArrowRight2 size={ 24 } className="text-gray-700" />
                    ) }
                </View>
              </TouchableOpacity>
              { showFootwearCategoryMale && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  <View className="bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                    <Text className="text-[12px] text-gray-700">Adult</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Boy</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Child</Text>
                  </View>
                </View>
              ) }
            </View>

            {/*==== Footwear Category Female ====*/}
            <View className="mt-6">
              <TouchableOpacity onPress={ () => setShowFootwearCategoryFemale(!showFootwearCategoryFemale) }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Footwear category female
                  </Text>
                    { showFootwearCategoryFemale ? (
                      <ArrowDown2 size={ 24 } className="text-gray-700" />
                    ) : (
                      <ArrowRight2 size={ 24 } className="text-gray-700" />
                    ) }
                </View>
              </TouchableOpacity>
              { showFootwearCategoryFemale && (
                <View className="mb-2 flex-row flex-wrap gap-4">
                  <View className="bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                    <Text className="text-[12px] text-gray-700">Adult</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Girl</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Child</Text>
                  </View>
                </View>
              ) }
            </View>

            {/*==== Fashion Category Male ====*/}
            <View className="mt-6">
              <TouchableOpacity onPress={ () => setShowFashionCategoryMale(!showFashionCategoryMale) }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Fashion category male
                  </Text>
                    { showFashionCategoryMale ? (
                      <ArrowDown2 size={ 24 } className="text-gray-700" />
                    ) : (
                      <ArrowRight2 size={ 24 } className="text-gray-700" />
                    ) }
                </View>
              </TouchableOpacity>
              { showFashionCategoryMale && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  <View className="bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                    <Text className="text-[12px] text-gray-700">Adult</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Boy</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Child</Text>
                  </View>
                </View>
              ) }
            </View>

            {/*==== Fashion Category Female ====*/}
            <View className="mt-6">
              <TouchableOpacity onPress={ () => setShowFashionCategoryFemale(!showFashionCategoryFemale) }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Fashion category female
                  </Text>
                    { showFashionCategoryFemale ? (
                      <ArrowDown2 size={ 24 } className="text-gray-700" />
                    ) : (
                      <ArrowRight2 size={ 24 } className="text-gray-700" />
                    ) }
                </View>
              </TouchableOpacity>
              { showFashionCategoryFemale && (
                <View className="mb-2 flex-row flex-wrap gap-4">
                  <View className="bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                    <Text className="text-[12px] text-gray-700">Adult</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Girl</Text>
                  </View>
                  <View className="p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] bg-[#f8f9fe]">
                    <Text className="text-[12px] text-gray-700">Child</Text>
                  </View>
                </View>
              ) }
            </View>
          </ScrollView>
          
          {/*==== Buttons ====*/}
          {/* <View className="mt-8 flex-row">
            <View className="items-center justify-center w-[140px] h-[40px] bg-[#101828] rounded-[8px]">
              <Text className="text-[14px] font-semibold text-white">Apply</Text>
            </View>
            <View className="items-center justify-center w-[140px] h-[40px] bg-[#f8f9fe] border-[1px] border-solid border-[#d0d5dd] rounded-[8px]">
              <Text className="text-[14px] font-semibold text-[#344054]">
                Cancel
              </Text>
            </View>
          </View> */}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default CategoryFilterBottomSheetComponent;


{/* 
<View className="h-auto w-full mb-4 flex-row items-center justify-between">
  <Text className="font-medium text-[14px] text-gray-700">
    Clothing category male
  </Text>
  <TouchableOpacity onPress={ () => setShowClothingType(!showClothingType) }>
    { showClothingType ? (
      <ArrowDown2 size={ 24 } className="text-gray-700" />
    ) : (
      <ArrowRight2 size={ 24 } className="text-gray-700" />
    ) }
  </TouchableOpacity>
</View>
{ showClothingType && (
  
) } 
*/}