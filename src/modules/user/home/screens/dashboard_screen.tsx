import React, { useEffect } from "react";
import { Image, Text, View, Pressable, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Linking } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ArrowRight, Heart, Notification, SearchNormal1, Star1 } from "iconsax-react-native";
import Video from "react-native-video";
import { useDispatch, useSelector } from "react-redux";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

import { RootState } from "../../../../redux/store/store";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import Carousel from "react-native-reanimated-carousel";
import { setProductID, setSelectedCategory } from "../../products/slices/product_slice";
import useGeneralHook from "../../../general/hooks/general_hook";
import useHomeHook from "../hooks/home_hook";
import IProduct from "../../products/models/product_model";
import FastImage from "react-native-fast-image";
import { ICategory } from "../../products/models/productState_model";
import FormatWords from "../../../../utils/formatWords";

const DashboardScreen = () => {
  const { promoProducts, categories, selectedCategory, popularProducts, newestArrivals } = useSelector((state: RootState) => state.productState);
  const { userData } = useSelector((state: RootState) => state.profileState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const width = useWindowDimensions().width - 40;
  // console.log("PROMO PRODUCTS::: ", promoProducts);
  
  const {
    handleGetAllLiveProducts,
    handleGetPopularProducts,
    handleGetNewestArrivals,
    handleGetFemaleClothing,
    handleGetMaleClothing,
    handleGetShoes,
    handleGetAccessories,
    handleGetBags,
    handleGetPromoProducts,
    popularProductIsLoading,
    newestArrivalsIsLoading,
  } = useHomeHook();
  const { handleGetProductOptions } = useGeneralHook();

  useEffect(() => {
    const fetchAllData = async () => {
      const fetchFunctions = [
        handleGetProductOptions,
        handleGetPromoProducts,
        handleGetPopularProducts,
        handleGetNewestArrivals,
        handleGetAllLiveProducts,
        handleGetFemaleClothing,
        handleGetMaleClothing,
        handleGetShoes,
        handleGetAccessories,
        handleGetBags,
      ];
  
      await Promise.all(fetchFunctions.map(fn => fn()));
    };
  
    fetchAllData();
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
                          source={require("../../../../../assets/images/home/profile_image.png")}
                        />
                        <View className="ml-2">
                          <Text className="text-gray-400 text-base">Welcome back,</Text>
                          <View className="mt-1 flex-row items-center space-x-2">
                            <Text className="font-medium text-base text-white">
                              { (userData.isGuest) ? (userData.lastName) && userData.lastName : userData.firstName }
                            </Text>
                            { (userData.isGuest) && (
                              <TouchableOpacity
                                className="px-5 py-1 flex items-center justify-center rounded-lg bg-white/[.2]"
                                onPress={ () => navigation.navigate("loginScreen") }>
                                <Text className="text-sm text-white">
                                  { (userData.isGuest) && "Login" }
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                      <Pressable
                        className="bg-lightGreen p-2.5 rounded-full"
                        onPress={ () => navigation.navigate("userNotificationsScreen") }
                      >
                        <Notification color="#133522" size={24} variant="Bold" />
                      </Pressable>
                    </View>
                    
                    {/*==== Search Box ====*/}
                    <View className="h-auto w-full mt-8 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                        <TextInput
                            placeholder="Search item"
                            placeholderTextColor="#9ca3af"
                            className="text-base flex-1"
                            onChangeText={() => null}
                            onFocus={ () => navigation.navigate("searchItemScreen") }
                        />
                        <TouchableOpacity onPress={ () => null }> 
                            <SearchNormal1 color="#9ca3af" className="mr-1" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-5 py-6">
                  
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
                              <Image
                                key={index}
                                className="h-[150px] w-full"
                                resizeMode="cover"
                                source={
                                  item?.largeScreenImageUrl?.link
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
                        className="h-auto w-full mt-2"
                      >
                        { popularProductIsLoading ? (
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
                            <ProductCardItem
                              key={ popularProduct.productId }
                              product={ popularProduct }
                              handleOnPress={ () => {
                                dispatch(setProductID(popularProduct.productId));
                                navigation.navigate("productDetailScreen");
                              } }
                              orrientation="Vertical"
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
                        { newestArrivalsIsLoading ? (
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
                          newestArrivals.slice(0, 10).map((newestArrival: IProduct) => (
                            <ProductCardItem
                              key={ newestArrival.productId }
                              product={ newestArrival }
                              handleOnPress={ () => {
                                dispatch(setProductID(newestArrival.productId));
                                navigation.navigate("productDetailScreen");
                              } }
                              orrientation="Horizontal"
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

            </ScrollView>
        </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DashboardScreen;



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Product Card Item
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface IProductCardItemProps {
  product: IProduct;
  handleOnPress: () => void;
  orrientation: "Horizontal" | "Vertical";
}

const ProductCardItem = (props: IProductCardItemProps) => {
  const { product, handleOnPress, orrientation } = props;

  return (
    <TouchableOpacity
      onPress={ handleOnPress }
      className={`h-auto mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE] ${ orrientation === "Horizontal" ? "w-[340px] flex-row justify-start" : "w-[170px]" }`}
    >
      <View className={`relative p-2 flex rounded-xl bg-white ${ orrientation === "Horizontal" ? "h-[150px] w-[130px] mr-4 justify-center" : "items-center" }`}>
        <FastImage
          source={{
              uri: product?.colors?.[0]?.images?.[0]?.link!,
              priority: FastImage.priority.normal
          }}
          defaultSource={ require("../../../../../assets/images/app_logo.png") }
          resizeMode={ FastImage.resizeMode.cover }
          className="h-[120px] w-[100px] rounded-lg"
          fallback
        />
        <View className="h-[35px] w-[35px] absolute top-2 right-2 flex items-center justify-center rounded-xl bg-gray-200">
          <Heart color="gray" />
        </View>
      </View>
      <View className={`mt-3 ${ orrientation === "Horizontal" ? "w-[160px]" : "" }`}>
        <Text className={`text-gray-800 ${ orrientation === "Horizontal" ? "text-base" : "text-sm" }`}>{ FormatWords.truncateWords(product.title, 30) }</Text>
        <View className="mt-1.5 flex-row items-center justify-between">
          <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ product.categories.productGroup.split("-").join(" ") }</Text>

          <View className="flex-row">
            <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
            <Text>4.3</Text>
          </View>
        </View>
        <Text className="mt-2.5 text-base font-medium text-gray-900">₦{ product.variations[0].price.toLocaleString() }</Text>
      </View>
    </TouchableOpacity>
  );
};
