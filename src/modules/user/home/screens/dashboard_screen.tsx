import React, { useState, useCallback, useEffect } from "react";
import { Image, Text, View, Pressable, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ArrowRight, Heart, Notification, SearchNormal1, Star1 } from "iconsax-react-native";
import { useDispatch, useSelector } from "react-redux";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

import { RootState } from "../../../../redux/store/store";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import Carousel from "react-native-reanimated-carousel";
import useProductsHook from "../../product/hooks/products_hook"
import { setSelectedCategory } from "../../product/slices/product_slice";

const DashboardScreen = () => {
  const { categories, selectedCategory, popularProducts } = useSelector((state: RootState) => state.productState);
  const { newestProducts } = useSelector((state: RootState) => state.productState);
  const { userData } = useSelector((state: RootState) => state.profileState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const width = Dimensions.get('window').width - 44;
  
  const {
    handleGetNewestProducts,
    handleGetFemaleClothings,
    handleGetMaleClothings,
    handleGetShoes,
    handleGetAccessories,
    handleGetBags,
    handleGetPopularProducts,
    popularProductIsLoading,
  } = useProductsHook();
  

  const [buttonContainerVisible, setButtonContainerVisible] = useState(false);
  const bestDeals = popularProducts;

  const openButtonContainer = useCallback(() => {
    setButtonContainerVisible(true);
  }, []);

  const closeButtonContainer = useCallback(() => {
    setButtonContainerVisible(false);
  }, []);

  
  useEffect(() => {
    (async () => {
      await handleGetNewestProducts();
      await handleGetFemaleClothings();
      await handleGetMaleClothings();
      await handleGetShoes();
      await handleGetAccessories();
      await handleGetBags();
      await handleGetPopularProducts();
    })();
  }, []);

  return (
    <GestureHandlerRootView>
        <SafeAreaView className="flex-1 h-auto w-screen pb-20 bg-white">
            <StatusBar
                backgroundColor="#112F1E"
                barStyle="light-content"
            />
            <ScrollView className="pb-[120px]">

                <View className="px-5 py-6 bg-baseGreen">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Image
                          className="h-[60px] w-[60px] rounded-full"
                          resizeMode="cover"
                          source={require("../../../../assets/home/profile_image.png")}
                        />
                        <View className="ml-2">
                          <Text className="text-gray-400 text-base">Welcome back,</Text>
                          <Text className="mt-1 font-medium text-base text-white">{ (userData.firstName) ? userData.firstName : "User" }</Text>
                        </View>
                      </View>
                      <Pressable
                        className="bg-lightGreen p-2.5 rounded-full"
                        onPress={ () => null }
                      >
                        <Notification color="#133522" size={24} variant="Bold" />
                      </Pressable>
                    </View>
                    
                    <View className="h-auto w-full mt-8 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                        <TextInput
                            placeholder="Search item"
                            placeholderTextColor="#9ca3af"
                            className="text-base"
                            onChangeText={(value) => null}
                        />
                        <TouchableOpacity onPress={ () => null }>
                            <SearchNormal1 color="#9ca3af" className="mr-1" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-5 py-6">
                  
                    {/*==== New Arrivals Section ====*/}
                    <View className="flex flex-row items-center justify-between rounded-2xl bg-lightGold">
                      <Carousel
                        loop
                        width={width}
                        height={width / 2}
                        autoPlay={true}
                        data={newestProducts}
                        scrollAnimationDuration={1000}
                        autoPlayInterval={5000}
                        renderItem={({ index }) => (
                            <View key={index} className="px-5 py-7 flex flex-row items-center justify-between">
                              <View className="w-[60%]">
                                <Text className="text-sm text-gray-600">New Arrivals</Text>
                                <Text className="mt-1 font-semibold text-2xl text-gray-600">{ newestProducts[index].discount }% OFF</Text>
                                <Text className="mt-1.5 text-sm text-gray-800">{ newestProducts[index].message }</Text>
                              </View>
                              <Image
                                className="h-[120px] w-[100px] mr-2 rounded-lg"
                                resizeMode="cover"
                                source={
                                  newestProducts[index]?.imageLink
                                    ? { uri: newestProducts[index].imageLink }
                                    : require("../../../../assets/app_logo.png")
                                }
                              />
                            </View>
                        )}
                      />
                    </View>

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
                        { categories.map((category) => (
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
                          style={{ backgroundColor: selectedCategory.color[0] }}>
                        <Image
                          source={ selectedCategory.image }
                          resizeMode="contain"
                          className="h-[370px] w-full absolute bottom-0 -right-4"
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
                        className="h-auto w-full"
                      >
                        { Array.from({ length: 5 }, (_, index) => (
                          <ShimmerPlaceHolder
                            key={`item-${index}`}
                            visible={!popularProductIsLoading}
                            LinearGradient={LinearGradient}
                            shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                            height={220}
                            width={150}
                            shimmerStyle={{ borderRadius: 16, marginTop: 5, marginRight: 15 }}
                          />
                        ))}
                      </ScrollView>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full mt-2"
                      >
                        { popularProducts.length > 0 && popularProducts.slice(0, 10).map((popularProduct) => (
                          <TouchableOpacity key={ popularProduct.productId }
                            onPress={ () => {
                              navigation.navigate("productDetailScreen", { productID: popularProduct.productId });
                            } }
                            className="h-auto w-[170px] mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE]"
                          >
                            <View className="relative p-2 flex items-center rounded-xl bg-white">
                              <Image
                                className="h-[120px] w-[100px] rounded-lg"
                                resizeMode="cover"
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
                              <Text className="text-sm text-gray-800">{ (popularProduct.title.length >= 35) ? popularProduct.title.slice(0, 33) + "..." : popularProduct.title }</Text>
                              <View className="mt-1.5 flex-row items-center justify-between">
                                <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ popularProduct.categories.productGroup.split("-").join(" ") }</Text>

                                <View className="flex-row">
                                  <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                                  <Text>4.3</Text>
                                </View>
                              </View>
                              <Text className="mt-2.5 text-base font-medium text-gray-900">₦{ popularProduct.variations[0].price.toLocaleString() }</Text>
                            </View>
                          </TouchableOpacity>
                        )) }
                      </ScrollView>
                    </View>
                    
                    {/*==== Best Deals Section ====*/}
                    <View className="mt-6">
                      <View className="flex-row justify-between items-center">
                        <Text className="font-medium text-base text-baseGreen">Best deals</Text>
                        <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Best Deals" }) }>
                          <Text className="text-sm text-baseGreen">See all</Text>
                        </TouchableOpacity>
                      </View>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full"
                      >
                        { Array.from({ length: 5 }, (_, index) => (
                          <ShimmerPlaceHolder
                            key={`item-${index}`}
                            visible={!popularProductIsLoading}
                            LinearGradient={LinearGradient}
                            shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                            height={150}
                            width={300}
                            shimmerStyle={{ borderRadius: 16, marginTop: 5, marginRight: 15 }}
                          />
                        ))}
                      </ScrollView>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full mt-2"
                      >
                        { bestDeals.length > 0 && bestDeals.slice(0, 10).map((bestDeal) => (
                          <TouchableOpacity key={ bestDeal.productId }
                            onPress={ () => {
                              navigation.navigate("productDetailScreen", { productID: bestDeal.productId });
                            } }
                            className="h-auto w-[340px] mr-4 px-3 py-3 flex-row justify-start rounded-2xl overflow-hidden bg-[#F8F9FE]"
                          >
                            <View className="h-[150px] w-[130px] relative mr-4 p-2 flex justify-center rounded-xl bg-white">
                              <Image
                                className="h-[120px] w-[100px] rounded-lg"
                                resizeMode="cover"
                                source={ 
                                  bestDeal.colors[0]?.images[1]?.link
                                  ? { uri: bestDeal.colors[0]?.images[1]?.link }
                                  : require("../../../../assets/app_logo.png")
                                }
                              />
                              <View className="h-[35px] w-[35px] absolute top-2 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                                <Heart color="gray" />
                              </View>
                            </View>

                            <View className="w-[160px] mt-3">
                              <Text className="text-base text-gray-800">{ (bestDeal.title.length >= 40) ? bestDeal.title.slice(0, 40) + "..." : bestDeal.title }</Text>
                              <View className="mt-3 flex-row items-center justify-between">
                                <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ bestDeal.categories.productGroup.split("-").join(" ") }</Text>

                                <View className="flex-row">
                                  <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                                  <Text>4.3</Text>
                                </View>
                              </View>
                              <Text className="mt-2.5 text-base font-medium text-gray-900">₦{ bestDeal.variations[0].price.toLocaleString() }</Text>
                            </View>
                          </TouchableOpacity>
                        )) }
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
                        source={require("../../../../assets/home/invite_tree.png")}
                        className="absolute bottom-0 right-0"
                        resizeMode="contain"
                      />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DashboardScreen;
