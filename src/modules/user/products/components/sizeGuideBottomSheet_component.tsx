import { useDispatch, useSelector } from 'react-redux';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, SafeAreaView, Switch, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { setShowSizedGuideBottomSheet } from '../slices/product_slice.ts';

type SizeGuideTab = "Top" | "Bottom" | "Footwear";

// Map a product to the size-guide tab it belongs under. Shoes are Footwear by
// product type. Clothing defaults to "Top" (blouse, shirt, t-shirt, dress…)
// and only flips to "Bottom" when the category/title clearly names a lower
// garment — matching how the size guide is split (top / bottom / footwear).
const resolveSizeGuideTab = (product: any): SizeGuideTab => {
    const productType = product?.productType;
    if (productType === "readyMadeShoe" || productType === "bespokeShoe") return "Footwear";

    const haystack = `${(product?.categories?.main ?? []).join(" ")} ${product?.title ?? ""}`.toLowerCase();
    if (/(footwear|shoe|sneaker|boot|sandal|heel|loafer|slipper)/.test(haystack)) return "Footwear";
    if (/(bottom|trouser|pant|jean|skirt|short|legging|jogger|chino|cargo|skort)/.test(haystack)) return "Bottom";
    return "Top";
};

const SizeGuideBottomSheet = () => {
    const { sizeGuide, product } = useSelector((state: RootState) => state.productState);
    const dispatch = useDispatch<AppDispatch>();
    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight / 1.45;
    const slideAnimation = useRef<Animatable.View>(null);

    // Preselect the gender tab to match the product being viewed. Falls back to
    // Female when the product has no gender tag (or has multiple/unisex).
    const productGender = product?.categories?.gender?.[0]?.toLowerCase();
    const initialGender = productGender === "male" ? "Male" : "Female";
    const [selectedGender, setSelectedGender] = useState(initialGender);
    // Auto-select the tab that matches the product (e.g. a blouse/shirt opens on
    // "Top"), instead of always defaulting to "Bottom".
    const [selectedCategory, setSelectedCategory] = useState<SizeGuideTab>(() => resolveSizeGuideTab(product));
    const [isCm, setIsCm] = useState(true);

    // Re-resolve if the sheet is reused for a different product after mount.
    useEffect(() => {
        setSelectedCategory(resolveSizeGuideTab(product));
    }, [product?._id, product?.productType]);


    useEffect(() => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: modalHeight },
                1: { translateY: 20 }
            }, 500);
        }
    }, [modalHeight]);

    const handleCloseSizeGuideBottomSheet = () => {
        // Dismiss immediately so the dark overlay disappears in sync with the
        // bottom sheet. Waiting on the slide-out animation kept the overlay
        // hanging around behind a no-longer-visible sheet.
        dispatch(setShowSizedGuideBottomSheet(false));
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
                <View className="h-auto w-full flex-row items-center justify-between">
                    <Text className="font-montserratSemiBold text-2xl text-gray-700">Size Guide</Text>

                    <TouchableOpacity 
                        onPress={ () => handleCloseSizeGuideBottomSheet() }
                    >
                        <Image
                            className="h-[30px] w-[30px]"
                            source={ require("../../../../../assets/images/close.png") }
                        />
                    </TouchableOpacity>
                </View>
                
                <View className="mt-7 flex-1 flex-col">
                    {/* Gender selector */}
                    <View className="h-auto w-full flex-row justify-center ">
                        {['Female', 'Male'].map(gender => {
                            const isSelected = selectedGender === gender;
                            const selectedClasses = gender === "Male"
                                ? "bg-blue-50 border-blue-400 border-b-2"
                                : "bg-pink-50 border-pink-400 border-b-2";
                            return (
                                <TouchableOpacity
                                    key={gender}
                                    onPress={() => setSelectedGender(gender)}
                                    className={`flex-1 flex-row  justify-center px-4 py-2 ${isSelected ? selectedClasses : 'border-gray-300 border-b'}`}
                                >
                                    <Text className="text-black">{gender}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View className="h-auto w-full mt-3 flex-row items-center justify-between">

                      {/* Category Tabs */}
                      <View className="mt-3 flex-row justify-start mb-4">
                          {(['Top', 'Bottom', 'Footwear'] as SizeGuideTab[]).map(category => (
                          <TouchableOpacity
                              key={category}
                              onPress={() => setSelectedCategory(category)}
                              className={`mr-1 px-4 py-2 rounded-full border ${selectedCategory === category ? 'bg-green-900' : 'border-gray-300'}`}
                          >
                              <Text className={selectedCategory === category ? 'text-white' : 'text-black'}>{category}</Text>
                          </TouchableOpacity>
                          ))}
                      </View>

                      {/* CM Switch */}
                      <View className="items-start justify-center mb-2">
                          <Text className="mr-2">Switch to</Text>
                          <View className="flex-row items-center">
                            <Text className="w-[35px] mr-1">{  isCm ? "CM" : "INCH"}</Text>
                            <Switch value={isCm} onValueChange={setIsCm} />
                          </View>
                      </View>
                    </View>

                    {/* ==== Table ==== */}
                    <ScrollView
                      showsVerticalScrollIndicator={true}
                    >
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={true}
                        showsVerticalScrollIndicator={true}
                      >
                        <View className="mt-4">
                          {/* Table Header */}
                          <View className={`flex-row border-b border-gray-200 ${selectedGender === "Male" ? "bg-blue-100" : "bg-pink-100"}`}>
                              {Object.keys(sizeGuide[selectedGender.toLowerCase()]?.[selectedCategory.toLowerCase()]?.[isCm ? 'cm' : 'inch']?.[0] || {}).map((key, index) => (
                              <Text key={index} className="px-4 py-2 font-montserratSemiBold text-sm text-gray-700 min-w-[100px]">
                                  {key}
                              </Text>
                              ))}
                          </View>
                          
                          {/* ==== Table Body ==== */}
                          {sizeGuide[selectedGender.toLowerCase()]?.[selectedCategory.toLowerCase()]?.[isCm ? 'cm' : 'inch']?.map((row: any, rowIndex: number) => (
                              <View key={rowIndex} className="flex-row border-b border-gray-200">
                              {Object.values(row).map((value: any, cellIndex) => (
                                  <Text key={cellIndex} className="px-4 py-2 font-montserratMedium text-xs text-gray-600 min-w-[100px]">
                                  {value}
                                  </Text>
                              ))}
                              </View>
                          ))}
                        </View>
                      </ScrollView>
                    </ScrollView>
                </View>
            </Animatable.View>
        </SafeAreaView>
    )
};

export default SizeGuideBottomSheet;