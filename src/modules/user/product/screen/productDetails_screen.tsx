import React, { useRef, useState } from 'react'
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight, Heart, Ruler, ShoppingBag, Star1 } from 'iconsax-react-native';
import { Animated, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DescriptionComponent from '../components/description_component';
import ReviewComponent from '../components/review_component';
import TimelineComponent from '../components/timeline_component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { setSelectedTab } from '../slices/product_slice';
import { useGetProductByProductIDQuery } from '../apis/product_api';
import { useGetProductReviewsQuery } from '../apis/review_api';
import AppLoader from '../../../general/components/appLoader';

const Tab = createMaterialTopTabNavigator();

interface IProps {
  route: RouteProp<RootNavigationStackModel, "productDetailScreen">
}

const ProductDetailScreen: React.FC<IProps> = ({ route }) => {
  const { selectedTab, tabs, popularProducts } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const { productID } = route.params || {};

  const slideAnim = useRef(new Animated.Value(300)).current;
  const [visible, setVisible] = useState(false);

  const toggleSlide = () => {
    Animated.timing(slideAnim, {
      toValue: visible ? 300 : 0, // Slide in (toValue=0) or slide out (toValue=300)
      duration: 500, // Duration in milliseconds
      useNativeDriver: true,
    }).start(() => setVisible(!visible)); // Toggle visibility after animation
  };

  const { data: product, isLoading: productsLoading } = useGetProductByProductIDQuery(productID!);
  const { data: reviews, isLoading: reviewsLoading } = useGetProductReviewsQuery(productID!);
  // console.log("REVIEWS::: ", productID);
  
  
  return (
    <SafeAreaView className="h-full w-full relative flex-1 pt-[20px] bg-lightGray">
      <StatusBar
        backgroundColor="#d5f4e3"
        barStyle="dark-content"
      />

      {/*==== Header ====*/}
      <View className="h-auto w-full px-[25px] flex-row items-center justify-between z-10">
        <TouchableOpacity onPress={ () => navigation.pop() }>
          <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" />
          </View>
        </TouchableOpacity>
        <Text className="font-semibold text-lg text-baseGreen">Product Details</Text>
        <View className="h-[40px] w-[40px]" />
      </View>

      {(!productsLoading) ? (
        <>
          {/*==== Top Skewed Light Green Background ====*/}
          <Image
            source={require("../../../../assets/product_detail_top_background.png")}
            className="h-[400px] w-full absolute top-0 left-0 z-0"
            resizeMode="stretch"
          />

          <ScrollView showsVerticalScrollIndicator={ false } className="mt-[30px]">

            {/*==== Product Name And Price ====*/}
            <View className="h-auto w-full px-[25px] flex-row items-start justify-between">
              <View className="h-auto w-[220px]">
                <Text className="px-[8px] py-[3px] text-xs rounded-md self-start bg-white">{ product!.categories!.productGroup!.split("-").join(" ") }</Text>
                <Text className="mt-2 font-medium text-[24px] text-baseGreen">{ product!.title }</Text>
                <View className="mt-2.5 flex-row items-center">
                  <Text className="mr-5 font-medium text-base text-baseGreen">{ product!.currency!.symbol! + product!.variations![0].price!.toLocaleString() }</Text> 
                  <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                  <Text className="text-xs">4.3</Text>
                </View>
              </View>

              <View>
                <View className="h-[40px] w-[40px] flex items-center justify-center border border-baseGreen rounded-full">
                  <Heart size={ 18 } className="text-baseGreen" />
                </View>
                <View className="h-[40px] w-[40px] mt-6 flex items-center justify-center border border-baseGreen rounded-full">
                  <ShoppingBag size={ 18 } className="text-baseGreen" />
                </View>
              </View>
            </View>

            {/*==== Product Image And Color Palete ====*/}
            <View className="h-auto w-full mt-10 pl-[25px] flex-row items-center justify-between">
              <View className="h-auto w-[200px] p-4 rounded-xl bg-[#F8F9FE]">
                <View className="h-auto w-auto p-0 flex items-center justify-center rounded-xl bg-[#FFFFFF]">
                  <Image
                    source={ 
                      product!.colors![0]?.images![0]?.link!
                      ? { uri: product!.colors![0]?.images![1]?.link! }
                      : require("../../../../assets/app_logo.png")
                    }
                    resizeMode="cover"
                    className="h-[240px] w-full rounded-2xl"
                  />
                </View>
              </View>

              <View className="h-[280px] w-[150px] items-end flex justify-center relative">
                <TouchableOpacity onPress={ () => toggleSlide() }>
                    <Image
                      source={ require("../../../../assets/drawer_button.png") }
                      resizeMode="contain"
                      className="h-[150px] w-[41px]"
                    />
                  </TouchableOpacity>

                  <Animated.View className="h-[260px] w-[150px] pr-0 items-end justify-center rounded-l-full border border-[#0D986A] bg-white absolute"
                    style={[
                      { transform: [{ translateX: slideAnim }] },
                    ]}
                  >
                    <TouchableOpacity onPress={ () => toggleSlide() } className="absolute right-4 top-4">
                      <View className={`h-6 w-6 rounded-full ${"bg-blue-600"} ${"border border-blue-600"}`} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => toggleSlide() } className="absolute left-10 top-[55px]">
                      <View className={`h-6 w-6 rounded-full ${"bg-red-600"} ${"border border-red-600"}`} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => toggleSlide() } className="absolute left-4 top-[120px]">
                      <View className={`h-6 w-6 rounded-full ${"bg-green-600"} ${"border border-white"}`} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => toggleSlide() } className="absolute left-10 bottom-[55px]">
                      <View className={`h-6 w-6 rounded-full ${"bg-black"} ${"border border-black"}`} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => toggleSlide() } className="absolute right-4 bottom-4">
                      <View className={`h-6 w-6 rounded-full ${"bg-gray-400"} ${"border border-gray-400"}`} />
                    </TouchableOpacity>
                    
                    <View className="h-[35px] w-[120px] flex-row items-center justify-center absolute -right-7 -rotate-90 border border-gray-400 rounded-3xl  bg-gray-200">
                      <Text className="mr-1.5">Colors</Text>
                      <Text className="ml-1.5">Sizes</Text>
                    </View>
                  </Animated.View>
              </View>
              
            </View>


            <View className="mt-10 px-[25px] pt-5 bg-lightGray">

              {/*==== Checkout And Measurement Guid ====*/}
              <View>
                <View className="flex-row items-center">
                  <TouchableOpacity 
                    onPress={ () => navigation.navigate("measurementScreen") }
                    className="h-[55px] w-[60%] mr-3 flex-row items-center justify-center rounded-xl bg-baseGreen"
                  >
                    <Text className="text-lg text-white mr-2">Checkout</Text>
                    <ArrowRight className="text-white" />
                  </TouchableOpacity>
                  
                  <View className="mr-3">
                    <Text className="text-xs">Color</Text>
                    <Text className="font-medium text-green-800">{ product!.colors![0]!.value! }</Text>
                  </View>

                  <View>
                    <Text className="text-xs">Size</Text>
                    <Text className="font-medium text-black">Medium</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  onPress={ () => navigation.navigate("measurementScreen") }
                  className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGreen"
                >
                  <Ruler size={ 28 } className="mr-2 text-baseGreen" />
                  <Text className="font-normal text-base text-baseGreen">Body Measurement Guide</Text>
                </TouchableOpacity>
              </View>


              {/*==== Tab View ====*/}
              <View className="h-auto w-full mt-5 px-0.5">
                <View className="h-auto w-full flex-row justify-between">
                  { tabs.map((tab, index) => (
                    <TouchableOpacity key={ index }
                    onPress={ () => dispatch(setSelectedTab(tab)) }>
                      <Text className={`${(selectedTab === tab) ? "font-semibold text-gray-700 text-[15px]" : "text-gray-500"}`}>{ tab }</Text>
                    </TouchableOpacity>
                  )) }
                </View>
              </View>
              { (selectedTab === "Description") ? (
                <DescriptionComponent product={ product! } />
              ) : (selectedTab === "Reviews") ? (
                <ReviewComponent reviews={ reviews! } productID={ productID! } />
              ) : (
                <TimelineComponent timelines={ product!.timeLine! } />
              ) }

            
              {/*==== Similar Items Section ====*/}
              <View className="my-12">
                <Text className="font-medium text-base text-baseGreen">Similar items</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={ false }
                  className="h-auto w-full mt-3"
                >
                  { popularProducts.map((popularProduct) => (
                    <TouchableOpacity key={ popularProduct.productId }
                      onPress={ () => {
                        navigation.navigate("productDetailScreen", { productID: popularProduct.productId });
                      } }
                      className="h-auto w-[170px] mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE]"
                    >
                      <View className="h-auto w-full relative py-1 rounded-xl bg-white">
                        <Image
                          className="h-[100px] w-full rounded-t-2xl"
                          resizeMode="contain"
                          source={ 
                            popularProduct.colors[0]?.images[1]?.link
                            ? { uri: popularProduct.colors[0]?.images[1]?.link }
                            : require("../../../../assets/app_logo.png")
                          }
                        />
                        <View className="h-[35px] w-[35px] absolute top-1 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                          <Heart color="gray" />
                        </View>
                      </View>
                      <View className="mt-3">
                        <Text className="text-sm text-gray-800">{ popularProduct.title }</Text>
                        <View className="mt-1.5 flex-row items-center justify-between">
                          <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ popularProduct.categories.productGroup.split("-").join(" ") }</Text>

                          <View className="flex-row">
                            <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                            <Text>4.3</Text>
                          </View>
                        </View>
                        <Text className="mt-2.5 text-base font-medium text-gray-900">{ product!.currency!.symbol! + popularProduct.variations[0].price.toLocaleString() }</Text>
                      </View>
                    </TouchableOpacity>
                  )) }
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </>
      ) : (
        // Render loading indicator
        <AppLoader />
      )}

    </SafeAreaView>
  )
}

export default ProductDetailScreen;