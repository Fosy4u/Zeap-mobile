import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ArrowDown2, ArrowRight2 } from "iconsax-react-native";
import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IDynamicFilter from "../models/dynamicFilter_model";

interface IDynamicFilterBottomSheetComponent {
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  snapPoints: string[];
  setShowBottomSheetModal: (value: boolean) => void;
  selectedFilters: Record<string, (string | number)[]>;
  toggleCheckboxOption: (filterName: string, optionValue: string | number) => void;
  clearAllFilters: () => void;
  dynamicFilterOptions?: IDynamicFilter[];
  isloading: boolean;
  loadingMessage: string;
};

const DynamicFilterBottomSheetComponent: React.FC<IDynamicFilterBottomSheetComponent> = (props) => {
  const { bottomSheetModalRef, snapPoints, setShowBottomSheetModal, selectedFilters, toggleCheckboxOption, clearAllFilters, dynamicFilterOptions } = props;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  // console.log("DYNAMIC FILTER OPTIONS::: ", JSON.stringify(dynamicFilterOptions));

  // Toggle dropdown
  const toggleDropdown = (sectionName: string) => {
    setExpanded((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  return (
    <BottomSheetModal
      ref={ bottomSheetModalRef }
      index={ 0 }
      snapPoints={ snapPoints }
      enablePanDownToClose={ false }
      handleStyle={{ display: "none" }}
      backgroundStyle={{ backgroundColor: '#fff' }}
      handleIndicatorStyle={{ backgroundColor: '#ccc' }}
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
                  source={require("../../../../../assets/images/close.png")}
                />
              </TouchableOpacity>
            </View>
            
            <Text className="mt-3 text-[16px] text-gray-700 ">
              Filter your search with the following
            </Text>
          </View>

          {/*==== Filter Scroll ====*/}
          <ScrollView
            showsVerticalScrollIndicator={ false }
            showsHorizontalScrollIndicator={ false }
            stickyHeaderHiddenOnScroll={ true }
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
          >
            {/*==== Dynamic Filter Options ====*/}
            { dynamicFilterOptions && Array.isArray(dynamicFilterOptions) ? (
              dynamicFilterOptions.length > 0 ? (
                dynamicFilterOptions.map((filterOption, index) => (
                  <View key={ index } className="mt-6">
                  <TouchableOpacity onPress={ () => toggleDropdown(filterOption.name!) }>
                    <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                      <Text className="font-medium text-[14px] text-gray-700">
                        { filterOption.name }
                      </Text>
                      { expanded[filterOption.name!] ? (
                        <ArrowDown2 size={ 24 } className="text-gray-700" />
                      ) : (
                        <ArrowRight2 size={ 24 } className="text-gray-700" />
                      ) }
                    </View>
                  </TouchableOpacity>

                  {/*==== Dropdown Filter ====*/}
                  { expanded[filterOption.name!] && filterOption.type === "checkbox" && (
                    <View className="mb-2 flex-row flex-wrap gap-x-2 gap-y-3">
                      { Array.isArray(filterOption.options) && filterOption.options.map((option, index) => {
                        const current = selectedFilters[filterOption.name!];
                        let isSelected = false;

                        if (Array.isArray(current) && typeof option.value === 'string') {
                          isSelected = (current as string[]).includes(option.value);
                        }
                        if (Array.isArray(current) && typeof option.value === 'number') {
                          isSelected = (current as number[]).includes(option.value);
                        }

                        return (
                          <TouchableOpacity
                            key={ option.value! + index }
                            onPress={() => toggleCheckboxOption(filterOption.name!, option.value!)}
                            className={`p-[9px_9px] flex-row items-end justify-center rounded-[8px] border-[1px] border-[#e0e2e8] ${
                              isSelected ? 'bg-blue-100 border-blue-300' : 'bg-[#f8f9fe]'
                            }`}
                          >
                            <Text className={`font-montserratMedium text-[11px] ${isSelected ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>{ option.value! }</Text>
                            <Text className={`font-montserratRegular text-[10px] ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>({ option.count })</Text>
                          </TouchableOpacity>
                        );
                      }) }
                    </View>
                  ) }

                  {/*==== Range Filter ====*/}
                  { expanded[filterOption.name!] && filterOption.type === "range" && (
                    <View className="mb-2 flex-row  flex-wrap gap-x-2 gap-y-3">
                      <View className="p-[9px_14px] rounded-[8px] border-[1px] border-[#e0e2e8] bg-[#f8f9fe]">
                        <Text className="text-[12px] text-gray-700">Min</Text>
                      </View>
                      <View className="p-[9px_14px] rounded-[8px] border-[1px] border-[#e0e2e8] bg-[#f8f9fe]">
                        <Text className="text-[12px] text-gray-700">Max</Text>
                      </View>
                    </View>
                  ) }
                  </View>
                ))
              ) : (
                <View className="mt-6 items-center justify-center">
                  <TouchableOpacity onPress={clearAllFilters} className="px-6 py-3 bg-baseGreen rounded-lg">
                    <Text className="text-white font-medium">Clear All Filters</Text>
                  </TouchableOpacity>
                </View>
              )
            ) : null
            }

            {/*==== Clear All Filters Button ====*/}
            <View className="mt-6 items-center justify-center">
              <TouchableOpacity onPress={clearAllFilters} className="px-6 py-3 bg-baseGreen rounded-lg">
                <Text className="text-white font-medium">Clear All Filters</Text>
              </TouchableOpacity>
            </View>

            {/*==== Product Type ====*/}
            {/* <View className="mt-6">
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
            </View> */}
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

export default DynamicFilterBottomSheetComponent;
