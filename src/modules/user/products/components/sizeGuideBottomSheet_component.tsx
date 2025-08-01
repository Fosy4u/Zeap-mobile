import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, SafeAreaView, Switch, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { setShowSizedGuideBottomSheet } from '../slices/product_slice.ts';


const SizeGuideBottomSheet = () => {
    const { sizeGuide } = useSelector((state: RootState) => state.productState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch<AppDispatch>();
    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight / 1.45;
    const slideAnimation = useRef<Animatable.View>(null);

    const [selectedGender, setSelectedGender] = useState('Female');
    const [selectedCategory, setSelectedCategory] = useState('Bottom');
    const [isCm, setIsCm] = useState(true);
    

    useEffect(() => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: modalHeight },
                1: { translateY: 20 }
            }, 1000);
        }
    }, [modalHeight]);

    const handleCloseSizeGuideBottomSheet = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                dispatch(setShowSizedGuideBottomSheet(false));
            });
        } else {
            dispatch(setShowSizedGuideBottomSheet(false));
        }
    };

        // Get current data based on selections
    const getCurrentData = () => {
        const unit = isCm ? 'cm' : 'inch';
        return sizeGuide[selectedGender]?.[selectedCategory]?.[unit] || [];
    };
    console.log("CURRENT DATA::: ", getCurrentData());
    
    
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
                        {['Female', 'Male'].map(gender => (
                            <TouchableOpacity
                                key={gender}
                                onPress={() => setSelectedGender(gender)}
                                className={`flex-1 flex-row  justify-center px-4 py-2 ${selectedGender === gender ? 'bg-pink-50 border-pink-400 border-b-2' : 'border-gray-300 border-b'}`}
                            >
                                <Text className="text-black">{gender}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="h-auto w-full mt-3 flex-row items-center justify-between">

                      {/* Category Tabs */}
                      <View className="mt-3 flex-row justify-start mb-4">
                          {['Top', 'Bottom', 'Footwear'].map(category => (
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
                          <View className="flex-row bg-pink-100 border-b border-gray-200">
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