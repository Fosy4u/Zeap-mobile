import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Animated, Image, SafeAreaView, StatusBar, Text, TextInput, View } from 'react-native';
import { ArrowLeft, Heart, SearchNormal1, Star1 } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import CategoryFilterBottomSheetComponent from '../components/categoryFilterBottomSheet_component';

interface IProps {
  route: RouteProp<RootNavigationStackModel, "productListScreen">;
}

const ProductListScreen: React.FC<IProps> = ({ route }) => {
  const { femaleClothings, maleClothings, shoes, accessories, bags, popularProducts } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();  const { screenTitle } = route.params || {};
  
  const [isFocused, setIsFocused] = useState(false);
  const iconTranslateX = useRef(new Animated.Value(0)).current;
  const inputTranslateX = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(iconTranslateX, {
        toValue: 220, // Move icon to the right
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(inputTranslateX, {
        toValue: -25, // Move input to the left
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(iconTranslateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(inputTranslateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  const AnimatedSearchIcon = Animated.createAnimatedComponent(SearchNormal1);
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);



  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["100%"], []);

  const setShowBottomSheetModal = useCallback((value: boolean) => {
    if (value === true) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, []);

  const products = screenTitle === "Female Clothings"
  ? femaleClothings
  : screenTitle === "Male Clothings"
  ? maleClothings
  : screenTitle === "Shoes"
  ? shoes
  : screenTitle === "Accessories"
  ? accessories
  : screenTitle === "Bags"
  ? bags
  : screenTitle === "Popular Products"
  ? popularProducts
  : screenTitle === "Best Deals"
  ? popularProducts
  :[];
  // console.log("SCREEN TITLE::: ", screenTitle);


  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1 px-[25px] pt-[20px]">
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
          />

          {/*==== Header ====*/}
          <View className="h-auto w-full flex-row items-center justify-between">
            <TouchableOpacity onPress={ () => navigation.pop() }>
              <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                <ArrowLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="font-semibold text-lg text-baseGreen">Products</Text>
            <View className="h-[40px] w-[40px]" />
          </View>

          {/*==== Search Box ====*/}
          <View className="h-auto w-full mt-8 flex-row items-center justify-center">
            <View className="h-auto w-full px-3 py-1 flex-1 flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
              <TouchableOpacity onPress={() => null}>
                <Animated.View style={{ 
                  transform: [{ translateX: iconTranslateX }],
                  marginRight: 5 
                }}>
                  <AnimatedSearchIcon 
                    color="#9ca3af" 
                  />
                </Animated.View>
              </TouchableOpacity>
              <Animated.View style={{ 
                flex: 1,
                transform: [{ translateX: inputTranslateX }]
              }}>
                <AnimatedTextInput
                  placeholder="Search item"
                  placeholderTextColor="#9ca3af"
                  className="text-base"
                  onChangeText={(value) => null}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </Animated.View>
            </View>

            <TouchableOpacity onPress={ () => setShowBottomSheetModal(true) }>
              <View className="h-[55px] w-[55px] ml-3  flex items-center justify-center rounded-xl bg-gold">
                <Image
                  source={ require("../../../../assets/filter.png") }
                  className="h-[25px] w-[25px]"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/*==== Product List ====*/}
          <ScrollView showsVerticalScrollIndicator={false} 
            className="h-auto w-full mt-3">
            {
              products.length !== 0
              ? products.map((product) => (
                  <TouchableOpacity key={ product.productId }
                    onPress={ () => {
                      navigation.navigate("productDetailScreen", { productID: product.productId });
                    } }
                  >
                    <View className="h-auto w-full mt-4 p-4 flex-row rounded-xl bg-[#F8F9FE]">
                      <View className="h-[150px] w-[130px] relative mr-4 py-2 flex justify-center items-center rounded-xl bg-white">
                        <Image
                          className="h-[120px] w-[90px] rounded-2xl"
                          resizeMode="cover"
                          source={ 
                            product.colors[0]?.images[1]?.link
                            ? { uri: product.colors[0]?.images[1]?.link }
                            : require("../../../../assets/app_logo.png")
                          }
                        />
                        <View className="h-[35px] w-[35px] absolute top-2 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                          <Heart color="gray" />
                        </View>
                      </View>
    
                      <View className="w-[160px] mt-3">
                        <Text className="text-base text-gray-800">{ product.title }</Text>
                        <View className="mt-3 flex-row items-center justify-between">
                          <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ product.categories.productGroup.split("-").join(" ") }</Text>
    
                          <View className="flex-row">
                            <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                            <Text>4.3</Text>
                          </View>
                        </View>
                        <Text className="mt-2.5 text-base font-medium text-gray-900">₦{ product.variations[0].price.toLocaleString() }</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              : <View className="h-[300px] w-full flex-1 items-center justify-center">
                  <Text className="text-lg">No item available</Text>
                </View>
            }
          </ScrollView>

          <CategoryFilterBottomSheetComponent bottomSheetModalRef={ bottomSheetModalRef } snapPoints={ snapPoints }  setShowBottomSheetModal={ setShowBottomSheetModal } />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default ProductListScreen;