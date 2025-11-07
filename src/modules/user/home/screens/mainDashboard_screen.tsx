import React from "react";
import { Image, Text, View, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ArrowRight } from "iconsax-react-native";
import Video from "react-native-video";
import { useDispatch, useSelector } from "react-redux";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

import { RootState } from "../../../../redux/store/store";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import Carousel from "react-native-reanimated-carousel";
import { setProductID, setSelectedCategory } from "../../products/slices/product_slice";
import IProduct from "../../products/models/product_model";
import FastImage from "react-native-fast-image";
import { ICategory } from "../../products/models/productState_model";
import ProductCardComponent from "../../../general/components/productCard_component";

const MainDashboardScreen = () => {
  const { promoProducts, categories, selectedCategory, popularProducts, newestPrpducts, popularProductsIsLoading, newestProductsIsLoading } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const width = useWindowDimensions().width - 40;
  // console.log("PROMO PRODUCTS::: ", promoProducts);


  return (
    <GestureHandlerRootView>
        <SafeAreaView className="flex-1 h-auto w-screen pb-20 bg-white">
            <StatusBar
                backgroundColor="#112F1E"
                barStyle="light-content"
            />

            {/*==== Main Body Section ====*/}
            <View className="h-auto w-[90%]">
                {/*==== New Promo Section ====*/}
                { (promoProducts.length !== 0) ? (
                  <View className="h-[150px] rounded-2xl bg-lightGold">
                    <Carousel
                      loop
                      width={width}
                      height={width / 2}
                      autoPlay={true}
                      data={promoProducts}
                      scrollAnimationDuration={1000}
                      autoPlayInterval={5000}
                      style={{ height: 150, width: width, borderRadius: 5 }}
                      renderItem={({ index }: { index: number }) => {
                        const item = promoProducts[index];
                    
                        return (item?.largeScreenImageUrl?.type === "video") ? (
                          <Video
                            source={{ uri: item.largeScreenImageUrl.link }}
                            style={{ width: "100%", height: 150 }}
                            resizeMode="cover"
                            repeat
                            muted
                          />
                        ) : (
                          <FastImage
                            key={index}
                            className="h-[150px] w-full"
                            resizeMode="cover"
                            source={
                              item?.largeScreenImageUrl?.type === "image"
                                ? { uri: item.largeScreenImageUrl.link }
                                : require("../../../../../assets/images/app_logo.png")
                            }
                          />
                        );
                      }}
                    />
                  </View>
                ) : (
                  <ShimmerPlaceHolder
                    LinearGradient={LinearGradient}
                    shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                    width={width}
                    height={150}
                    shimmerStyle={{ borderRadius: 5, marginTop: 5, marginRight: 15 }}
                  />
                ) }
                

                {/*==== Categories Section ====*/}
                <View className="mt-6">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-normal text-base text-baseGreen">Category</Text>
                    <TouchableOpacity onPress={ () => navigation.navigate("allCategoryScreen") }>
                      <Text className="text-sm text-baseGreen">See all</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={ false }
                    className="mt-3"
                  >
                    { categories.map((category: ICategory) => (
                      <TouchableOpacity
                        key={ category.id }
                        onPress={ () => dispatch(setSelectedCategory(category)) }
                      >
                        <View className={ `mr-3 px-4 py-2.5 rounded-lg ${ (selectedCategory.id === category.id) ? 'bg-baseGreen' : 'bg-gray-200' }` }>
                          <Text className={ `text-sm ${ (selectedCategory.id === category.id) ? 'text-white' : 'text-gray-800' }` }>{ category.name }</Text>
                        </View>
                      </TouchableOpacity>
                      
                    )) }
                  </ScrollView>

                  <View className="h-[400px] w-full mt-4 pb-4 relative flex items-center justify-end overflow-hidden"
                    style={{ backgroundColor: selectedCategory.color[0] }}
                  >
                    <FastImage
                      source={
                        typeof selectedCategory.image === "string"
                          ? {
                              uri: selectedCategory.image,
                              priority: FastImage.priority.normal
                            }
                          : selectedCategory.image as any
                      }
                      resizeMode={ FastImage.resizeMode.contain }
                      className="h-[380px] w-full absolute bottom-0 -right-4"
                    />
                    <TouchableOpacity
                      onPress={ () => navigation.navigate("productListScreen", { screenTitle: selectedCategory.name }) }
                      className="h-[50px] w-[160px] mt-6 flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                      <Text className="text-sm text-white mr-2">Shop Now</Text>
                      <ArrowRight className="text-white" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/*==== Popular Items Section ====*/}
                <View className="mt-6">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-medium text-base text-baseGreen">Popular items</Text>
                    <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Popular Products" }) }>
                      <Text className="text-sm text-baseGreen">See all</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={ false }
                    className="h-auto w-full mt-2"
                  >
                    { popularProductsIsLoading ? (
                      Array.from({ length: 5 }, (_, index) => (
                        <ShimmerPlaceHolder
                          key={`item-${index}`}
                          // visible={!popularProductIsLoading}
                          LinearGradient={LinearGradient}
                          shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                          height={220}
                          width={150}
                          shimmerStyle={{ borderRadius: 16, marginTop: 5, marginRight: 15 }}
                        />
                      ))
                    ) : (
                      popularProducts.slice(0, 10).map((popularProduct: IProduct) => (
                        <ProductCardComponent
                          key={ popularProduct.productId }
                          product={ popularProduct }
                          handleOnPress={ () => {
                            dispatch(setProductID(popularProduct.productId));
                            navigation.navigate("productDetailScreen");
                          } }
                          orientation="Vertical"
                        />
                      ))
                    ) }
                  </ScrollView>  
                </View>
                
                {/*==== Newest Arrivals Section ====*/}
                <View className="mt-6">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-medium text-base text-baseGreen">Newest arrivals</Text>
                    <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Newest Arrivals" }) }>
                      <Text className="text-sm text-baseGreen">See all</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={ false }
                    className="h-auto w-full mt-2"
                  >
                    { newestProductsIsLoading ? (
                      Array.from({ length: 5 }, (_, index) => (
                        <ShimmerPlaceHolder
                          key={`item-${index}`}
                          // visible={!newestArrivalsIsLoading}
                          LinearGradient={LinearGradient}
                          shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                          height={150}
                          width={300}
                          shimmerStyle={{ borderRadius: 16, marginTop: 5, marginRight: 15 }}
                        />
                      ))
                    ) : (
                      newestPrpducts.slice(0, 10).map((newestArrival: IProduct) => (
                        <ProductCardComponent
                          key={ newestArrival.productId }
                          product={ newestArrival }
                          handleOnPress={ () => {
                            dispatch(setProductID(newestArrival.productId));
                            navigation.navigate("productDetailScreen");
                          } }
                          orientation="Horizontal"
                        />
                      ))
                    ) }
                  </ScrollView>
                </View>

                {/*==== Invite a Friend Section ====*/}
                <View className="mt-6 px-5 pt-5 pb-14 rounded-2xl bg-lightGreen">
                  <Text className="text-lg leading-tight text-gray-800">Invite a friend and earn delivery points</Text>
                  <View className="mt-2 flex-row items-center justify-start">
                    <View className="mr-4">
                      <Text className="text-sm text-gray-600">Redeem points and</Text>
                      <Text className="text-sm text-gray-600">get free coupons</Text>
                    </View>
                    <TouchableOpacity onPress={ () => navigation.navigate("inviteFriendScreen") }
                      className="px-4 py-2 rounded-lg bg-baseGreen">
                      <Text className="text-white text-sm font-medium">Invite</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={require("../../../../../assets/images/home/invite_tree.png")}
                    className="absolute bottom-0 right-0"
                    resizeMode="contain"
                  />
                </View>
            </View>

        </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default MainDashboardScreen;
