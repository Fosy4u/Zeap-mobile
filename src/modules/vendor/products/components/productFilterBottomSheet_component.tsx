import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Add, ArrowDown2, ArrowRight, ArrowRight2} from 'iconsax-react-native';
import { useDispatch } from 'react-redux';
import { setShowProductFilterBottomSheet } from '../../home/slices/vendorHome_slice.tsx';
import useVendorProductHook from '../hooks/vendorProduct_hook.ts';
import Slider from '@react-native-community/slider';
import AppLoader from '../../../general/components/appLoader.tsx';


const ProductFilterBottomSheetComponent = () => {
  const dispatch = useDispatch();
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 1.3;
  const slideAnimation = useRef<Animatable.View>(null);

  const {
    requestParams, setRequestParams,
    handleFetchFilteredProducts, isLoading, loadingMessage,

    productTypeOptions,
    mainCategoryOptions,
    styleOptions,
    genderOptions,
    ageGroupOptions,
    ageRangeOptions,
    brandOptions,
    designOptions,
    occasionOptions,
    sleeveLengthOptions,
    fasteningOptions,
    fitOptions,

    showClothingType, setShowClothingType,
    showMainCategory, setShowMainCategory,
    showStyle, setShowStyle,
    showGender, setShowGender,
    showAgeGroup, setShowAgeGroup,
    showAgeRange, setShowAgeRange,
    showBrand, setShowBrand,
    showDesign, setShowDesign,
    showOccasion, setShowOccasion,
    showSleeveLength, setShowSleeveLength,
    showFastening, setShowFastening,
    showFit, setShowFit,
    showPriceAdjustment, setShowPriceAdjustment,

    selectedProductType, setSelectedProductType,
    selectedMainCategory, setSelectedMainCategory,
    selectedStyle, setSelectedStyle,
    selectedGender, setSelectedGender,
    selectedAgeGroup, setSelectedAgeGroup,
    selectedAgeRange, setSelectedAgeRange,
    selectedBrand, setSelectedBrand,
    selectedDesign, setSelectedDesign,
    selectedOccasion, setSelectedOccasion,
    selectedSleeveLength, setSelectedSleeveLength,
    selectedFastening, setSelectedFastening,
    selectedFit, setSelectedFit,
    selectedPrice, setSelectedPrice,
  } = useVendorProductHook();
  console.log("REQUEST PARAMS::: ", requestParams);



  useEffect(() => {
    if (slideAnimation.current) {
      slideAnimation.current.animate(
        {
          0: {translateY: modalHeight},
          1: {translateY: 0},
        },
        1000,
      );
    }
  }, [modalHeight]);

  const handleCloseOrderFilterBottomSheet = () => {
    if (slideAnimation.current) {
      slideAnimation.current
        .animate(
          {
            0: {translateY: 0, opacity: 1},
            1: {translateY: modalHeight, opacity: 0},
          },
          500,
        )
        .then(() => {
          dispatch(setShowProductFilterBottomSheet(false));
        });
    } else {
      dispatch(setShowProductFilterBottomSheet(false));
    }
  };

  return (
    <SafeAreaView className="h-full w-full absolute bg-black/70">
      <Animatable.View
        ref={slideAnimation}
        className="w-full absolute bottom-0 rounded-t-xl bg-white"
        style={{
          height: modalHeight,
          transform: [{translateY: modalHeight}],
        }}>

        {/*==== Header ====*/}
        <View className="h-[110px] w-full px-5 pb-4 flex-row items-center justify-between rounded-t-xl rounded-b-3xl bg-baseGreen">
          <View className="px-5" />

          <Text className="font-montserratMedium text-xl text-white">
            Filter All Product
          </Text>

          <TouchableOpacity
            onPress={() => handleCloseOrderFilterBottomSheet()}
            className="bg-[#20704329] p-1 rounded-xl">
            <Add color="#D5B07B" size={36} className="rotate-45" />
          </TouchableOpacity>
        </View>

        <View className="h-auto w-full px-5 flex-col justify-between">
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            stickyHeaderHiddenOnScroll={true}
            contentContainerStyle={{paddingHorizontal: 0, paddingBottom: 140}}
          >

            <Text className="font-montserratMedium mt-7 text-base text-gray-700">
              Filter order request by:
            </Text>

            {/*==== Product Type ====*/}
            <View className="mt-6">
              <TouchableOpacity
                onPress={() => setShowClothingType(!showClothingType)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Product type
                  </Text>
                  {showClothingType ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showClothingType && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { productTypeOptions.map((productType: string, index: number) => (
                   <TouchableOpacity key={ index } onPress={ () => {
                    setSelectedProductType(productType);
                    setRequestParams({ ...requestParams, "productType": productType });
                   } }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedProductType === productType ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className={`text-[12px] ${ selectedProductType === productType ? "text-white" : "text-gray-700" }`}>{ productType }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Main Category ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowMainCategory(!showMainCategory)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Main category
                  </Text>
                  {showMainCategory ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showMainCategory && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { mainCategoryOptions.map((mainCategory: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => {
                      setSelectedMainCategory(mainCategory);
                      setRequestParams({ ...requestParams, "main": mainCategory });
                    } }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedMainCategory === mainCategory ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className={`text-[12px] ${ selectedMainCategory === mainCategory ? "text-white" : "text-gray-700" }`}>{ mainCategory }</Text>
                      </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Style ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowStyle(!showStyle)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Style
                  </Text>
                  {showStyle ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showStyle && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { styleOptions.map((style: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => {
                      setSelectedStyle(style);
                      setRequestParams({ ...requestParams, "style": style });
                    } }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedStyle === style ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className="text-[12px] text-gray-700">{ style }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Gender ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowGender(!showGender)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Gender
                  </Text>
                  {showGender ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showGender && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { genderOptions.map((gender: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => {
                      setSelectedGender(gender)
                      setRequestParams({ ...requestParams, "gender": gender })
                    } }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedGender === gender ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className="text-[12px] text-gray-700">{ gender }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Age Group ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowAgeGroup(!showAgeGroup)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Age group
                  </Text>
                  {showAgeGroup ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showAgeGroup && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { ageGroupOptions.map((ageGroup: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => {
                      setSelectedAgeGroup(ageGroup);
                      setRequestParams({ ...requestParams, "ageGroup": ageGroup })
                    } }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedAgeGroup === ageGroup ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className="text-[12px] text-gray-700">{ ageGroup }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Age Range ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowAgeRange(!showAgeRange)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Age range
                  </Text>
                  {showAgeRange ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showAgeRange && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { ageRangeOptions.map((ageRange: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => setSelectedAgeRange(ageRange) }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedAgeRange === ageRange ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className="text-[12px] text-gray-700">{ ageRange }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Brand ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowBrand(!showBrand)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Brand
                  </Text>
                  {showBrand ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showBrand && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { brandOptions.map((brand: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => setSelectedBrand(brand) }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedBrand === brand ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className="text-[12px] text-gray-700">{ brand }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Design ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowDesign(!showDesign)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Design
                  </Text>
                  {showDesign ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showDesign && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { designOptions.map((design: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => setSelectedDesign(design) }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedDesign === design ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className="text-[12px] text-gray-700">{ design }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Occasion ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowOccasion(!showOccasion)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Occasion
                  </Text>
                  {showOccasion ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showOccasion && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { occasionOptions.map((occasion: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => setSelectedOccasion(occasion) }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedOccasion === occasion ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className="text-[12px] text-gray-700">{ occasion }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Sleeve Length ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowSleeveLength(!showSleeveLength)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Sleeve length
                  </Text>
                  {showSleeveLength ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showSleeveLength && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { sleeveLengthOptions.map((sleeveLength: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => setSelectedSleeveLength(sleeveLength) }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedSleeveLength === sleeveLength ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className="text-[12px] text-gray-700">{ sleeveLength }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Fastening ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowFastening(!showFastening)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Fastening
                  </Text>
                  {showFastening ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showFastening && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { fasteningOptions.map((fastning: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => setSelectedFastening(fastning) }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedFastening === fastning ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className="text-[12px] text-gray-700">{ fastning }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/*==== Fit ====*/}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowFit(!showFit)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Fit
                  </Text>
                  {showFit ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showFit && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  { fitOptions.map((fit: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => setSelectedFit(fit) }
                      className={`p-[11px_16px] rounded-[8px] border-[1px] ${ selectedFit === fit ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]" }`}
                    >
                      <Text className="text-[12px] text-gray-700">{ fit }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              )}
            </View>

            {/* ==== Price Adjustment ==== */}
            <View className="mt-5">
              <TouchableOpacity
                onPress={() => setShowPriceAdjustment(!showPriceAdjustment)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Price
                  </Text>
                  {showPriceAdjustment ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showPriceAdjustment && (
                <View>
                  <View className="h-auto w-[50%] flex-row items-center justify-between space-x-2">
                    <Text className="text-base">₦</Text>
                    <View className="h-auto px-3 flex-1 border border-gray-300 rounded-lg bg-gray-100">
                      <TextInput
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor="#9ca3af"
                        className="h-[40px] text-base text-center"
                        value={ selectedPrice ? selectedPrice.toString() : "0" }
                        onChangeText={ (text: string) => setSelectedPrice(parseInt(text)) }
                      />
                    </View>
                  </View>

                  {/* Slider Bar */}
                  <Slider
                    minimumValue={300}
                    maximumValue={500000}
                    step={100}
                    value={selectedPrice}
                    onValueChange={ (value: number) => setSelectedPrice(value) }
                    style={{ marginTop: 10 }}
                  />
                </View>
              )}
            </View>

            {/* ==== FILTER Button ==== */}
            <TouchableOpacity
              onPress={() => handleFetchFilteredProducts()}
              className="h-[55px] w-auto mt-7 flex flex-row items-center justify-center rounded-xl bg-baseGreen">
              <Text className="text-lg text-white mr-2">Filter Result</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animatable.View>

      { isLoading &&
        <AppLoader loadingAdditionalMessage={ loadingMessage } />
      }
    </SafeAreaView>
  );
};
export default ProductFilterBottomSheetComponent;
