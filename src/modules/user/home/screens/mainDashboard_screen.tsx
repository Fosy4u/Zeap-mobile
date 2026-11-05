import React, { useState } from "react";
import { Image, Text, View, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ArrowRight } from "iconsax-react-native";
import Video from "react-native-video";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../../redux/store/store";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import Carousel from "react-native-reanimated-carousel";
import { setProductID, setSelectedCategory } from "../../products/slices/product_slice";
import IProduct from "../../products/models/product_model";
import FastImage from "react-native-fast-image";
import { ICategory } from "../../products/models/productState_model";
import ProductCardComponent from "../../../general/components/productCard_component";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";
import encodeMediaUri from "../../../../utils/encodeMediaUri";
import AppStatusBar from "../../../general/components/appStatusBar";

const HOME_CATEGORY_LINKS: { label: string; title?: string; filters?: Record<string, string>; screen?: "brands" | "sales"; categoryName?: string }[] = [
  { label: "Women", title: "All Women's Collections", filters: { gender: "Female", ageGroup: "Adults" }, categoryName: "Women" },
  { label: "Men", title: "All Men Collections", filters: { gender: "Male", ageGroup: "Adults" }, categoryName: "Men" },
  { label: "Kids", title: "All Kids Collections", filters: { ageGroup: "Kids" } },
  { label: "Clothings", title: "All Clothings", filters: { ageGroup: "Adults", productType: "bespokeCloth,bespokeShoe,readyMadeCloth,readyMadeShoe" } },
  { label: "Shoes", title: "All Shoes", filters: { ageGroup: "Adults", productType: "bespokeShoe,readyMadeShoe" }, categoryName: "Shoes" },
  { label: "Accessories", title: "All Accessories", filters: { ageGroup: "Adults", productType: "Accessory" }, categoryName: "Accessories" },
  { label: "Dresses", title: "All Dresses", filters: { ageGroup: "Adults", main: "Dress" } },
  { label: "Bags", title: "All Bags", filters: { ageGroup: "Adults", accessoryType: "Bag" }, categoryName: "Bags" },
  { label: "Weddings", title: "All Weddings", filters: { ageGroup: "Adults", occasion: "Wedding,Bride,Bridesmaid,Bride Shower,Groom,Groomsman" } },
  { label: "Tops", title: "All Tops", filters: { ageGroup: "Adults", main: "Top" } },
  { label: "Bottoms", title: "All Bottoms", filters: { ageGroup: "Adults", main: "Bottom" } },
  { label: "Matching Sets", title: "All Matching Sets", filters: { ageGroup: "Adults", main: "Matching Set" } },
  { label: "Jeans", title: "All Jeans", filters: { ageGroup: "Adults", style: "Jean" } },
  { label: "Brands", screen: "brands" },
  { label: "Sales", screen: "sales" },
];

const MainDashboardScreen = () => {
  const { promoProducts, categories, selectedCategory, popularProducts, newestPrpducts, promoProductsIsLoading, popularProductsIsLoading, newestProductsIsLoading } = useSelector((state: RootState) => state.productState);
  const { userData } = useSelector((state: RootState) => state.profileState);
  const isGuest = !!userData?.isGuest;
  const greetingName = userData?.firstName || (userData as any)?.displayName || "there";
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const [activeCategoryLabel, setActiveCategoryLabel] = useState("Women");
  const width = useWindowDimensions().width - 40;
  const promoHeight = Math.round(width * 9 / 16);


  return (
    <GestureHandlerRootView>
        <SafeAreaView className="flex-1 h-auto w-screen pb-20 bg-white">
            <AppStatusBar backgroundColor="#112F1E" barStyle="light-content" />

            {/*==== Main Body Section ====*/}
            <View className="h-auto w-[90%]">
                {/*==== New Promo Section ====*/}
                { (promoProducts.length === 0 && promoProductsIsLoading) ? (
                  <SkeletonBlock width={ width } height={ promoHeight } radius={ 16 } />
                ) : promoProducts.length === 0 ? (
                  <View className="h-[120px] w-full items-center justify-center rounded-2xl bg-gray-50">
                    <Text className="text-sm text-gray-400">No promotions available yet.</Text>
                  </View>
                ) : (
                  <View className="rounded-2xl bg-lightGold" style={{ height: promoHeight }}>
                    <Carousel
                      loop
                      width={width}
                      height={promoHeight}
                      autoPlay={true}
                      data={promoProducts}
                      scrollAnimationDuration={1000}
                      autoPlayInterval={5000}
                      style={{ height: promoHeight, width: width, borderRadius: 5 }}
                      renderItem={({ index }: { index: number }) => {
                        const item = promoProducts[index];
                        const mediaUri = encodeMediaUri(item?.largeScreenImageUrl?.link);
                        return (item?.largeScreenImageUrl?.type === "video") ? (
                          <Video
                            source={{ uri: mediaUri }}
                            style={{ width: width, height: promoHeight, borderRadius: 5 }}
                            resizeMode={ FastImage.resizeMode.cover }
                            repeat
                            muted
                          />
                        ) : (
                          <FastImage
                            key={index}
                            style={{ width: width, height: promoHeight, borderRadius: 5 }}
                            resizeMode={ FastImage.resizeMode.cover }
                            source={
                              item?.largeScreenImageUrl?.type === "image"
                                ? { uri: mediaUri }
                                : require("../../../../../assets/images/image_placeholder.png")
                            }
                          />
                        );
                      }}
                    />
                  </View>
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
                    { HOME_CATEGORY_LINKS.map((link) => {
                      const isActive = activeCategoryLabel === link.label;
                      return (
                        <TouchableOpacity
                          key={ link.label }
                          onPress={ () => {
                            setActiveCategoryLabel(link.label);
                            const matchingCategory = categories.find((category: ICategory) => category.name === link.categoryName);
                            if (matchingCategory) dispatch(setSelectedCategory(matchingCategory));

                            if (link.screen === "brands") navigation.navigate("brandsScreen");
                            else if (link.screen === "sales") navigation.navigate("salesScreen");
                            else navigation.navigate("productListScreen", { screenTitle: link.title!, filters: link.filters });
                          } }
                        >
                          <View className={ `mr-3 px-4 py-2.5 rounded-lg ${ isActive ? 'bg-baseGreen' : 'bg-gray-200' }` }>
                            <Text className={ `text-sm ${ isActive ? 'text-white' : (link.screen === "sales") ? 'font-montserratSemiBold text-[#B8862E]' : 'text-gray-800' }` }>{ link.label }</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }) }
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
                      resizeMode={ FastImage.resizeMode.cover }
                      className="h-[400px] w-full absolute bottom-0 -right-4"
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
                    { (popularProducts.length === 0 && popularProductsIsLoading) ? (
                      [0, 1, 2, 3, 4].map((i) => (
                        <View key={ `pop-skeleton-${i}` } style={{ marginRight: 12, marginTop: 5 }}>
                          <SkeletonBlock width={ 150 } height={ 220 } radius={ 16 } />
                        </View>
                      ))
                    ) : popularProducts.length === 0 ? (
                      <View className="h-[120px] w-full mt-1 items-center justify-center rounded-2xl bg-gray-50">
                        <Text className="text-sm text-gray-400">No popular products available yet.</Text>
                      </View>
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

                {/*==== Signup Section ====*/}
                <View className="mt-6 px-5 pt-5 pb-10 rounded-2xl bg-lightGreen">
                  <Text className="font-semibold text-base leading-tight text-gray-800">Guarantee return and cash back if tailor fails to deliver</Text>
                  <View className="mt-5 flex-row items-center justify-start">
                    <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Bespoke Collection" }) }
                      className="px-4 py-2 rounded-lg bg-gold">
                      <Text className="text-baseGreen text-sm font-medium">Browse our Bespoke Collection</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={require("../../../../../assets/images/home/invite_tree.png")}
                    className="absolute bottom-0 right-0"
                    resizeMode="contain"
                  />
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
                    { (newestPrpducts.length === 0 && newestProductsIsLoading) ? (
                      [0, 1, 2].map((i) => (
                        <View key={ `new-skeleton-${i}` } style={{ marginRight: 12, marginTop: 5 }}>
                          <SkeletonBlock width={ 300 } height={ 150 } radius={ 16 } />
                        </View>
                      ))
                    ) : newestPrpducts.length === 0 ? (
                      <View className="h-[120px] w-full mt-1 items-center justify-center rounded-2xl bg-gray-50">
                        <Text className="text-sm text-gray-400">No new arrivals available yet.</Text>
                      </View>
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

                { isGuest ? (
                  <View className="mt-6 px-5 pt-5 pb-14 rounded-2xl bg-lightGreen">
                    <Text className="font-semibold text-base leading-tight text-gray-800">Join the Zeaper family</Text>
                    <View className="mt-2 flex-row items-center justify-start">
                      <View className="mr-4">
                        <Text className="text-sm text-gray-600">Create your free account</Text>
                        <Text className="text-sm text-gray-600">and shop faster</Text>
                      </View>
                      <TouchableOpacity
                        onPress={ () => navigation.navigate("signUpScreen") }
                        className="px-4 py-2 rounded-lg bg-baseGreen"
                      >
                        <Text className="text-white text-sm font-medium">Sign Up</Text>
                      </TouchableOpacity>
                    </View>
                    <Image
                      source={ require("../../../../../assets/images/home/invite_tree.png") }
                      className="absolute bottom-0 right-0"
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View className="mt-6 px-5 pt-5 pb-14 rounded-2xl bg-lightGold">
                    <Text className="font-semibold text-base leading-tight text-gray-800">
                      Welcome back, { greetingName.split(" ")[0] } 👋
                    </Text>
                    <Text className="mt-1 text-sm text-gray-600">
                      Fresh ready-to-wear styles, ready to ship.
                    </Text>
                    <View className="mt-3 flex-row items-center justify-start">
                      <TouchableOpacity
                        onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Ready to Wear" }) }
                        className="px-4 py-2 flex-row items-center rounded-lg bg-baseGreen"
                      >
                        <Text className="text-white text-sm font-medium mr-2">Shop Ready-to-Wear</Text>
                        <ArrowRight size={ 16 } color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                    <Image
                      source={ require("../../../../../assets/images/home/invite_tree.png") }
                      className="absolute bottom-0 right-0"
                      resizeMode="contain"
                    />
                  </View>
                ) }
            </View>

        </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default MainDashboardScreen;
