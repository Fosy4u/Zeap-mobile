import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { Add, ArrowDown, ArrowRight, ArrowUp, Calendar, Edit2, Notification } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from "react-native-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { BarChart } from "react-native-gifted-charts";
import useVendorHomeHook from "../hooks/vendorHome_hook";
import useGeneralHook from "../../../general/hooks/general_hook";
import FastImage from "react-native-fast-image";
import useVendorProductHook from "../../products/hooks/vendorProduct_hook";
import useVendorPaymentHook from "../../payments/hooks/payment_hook";
import formatCurrency from "../../../../utils/formatCurrency";
import formatDate from "../../../../utils/formatDate";
import EmptyListComponent from "../../../general/components/emptyList_component";


const VendorDashboardScreen = () => {
  const { productIsLoading } = useSelector((state: RootState) => state.vendorProductState);
  const { isLoading: paymentIsLoading } = useSelector((state: RootState) => state.vendorPaymentState);
  const { analytics, overviews, weeklySalesChartData } = useSelector((state: RootState) => state.vendorHomeState);
  const { products } = useSelector((state: RootState) => state.vendorProductState);
  const { payments } = useSelector((state: RootState) => state.vendorPaymentState);
  const { shop } = useSelector((state: RootState) => state.vendorGeneralState);
  const { userData } = useSelector((state: RootState) => state.profileState);
  const [productIndex, setProductIndex] = useState<number | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  
  const product = productIndex !== null ? products?.[productIndex] : undefined;

  const { handleGetShop, handleGeVendortAnalytics } = useVendorHomeHook();
  const { generateRandomInteger, handleGetProductOptions } = useGeneralHook();
  const { handleGetProductReviews } = useVendorProductHook();
  const { handleGetVendorPayments } = useVendorPaymentHook();

  useEffect(() => {
    (async () => {
      await handleGetShop(userData.shopId!);
      await handleGetProductOptions();
    })();
  }, [userData]);

  useEffect(() => {
    (async () => {
      await handleGeVendortAnalytics(userData.shopId!)
    })();
  }, [userData]);

  useEffect(() => {
    handleGetProductReviews(product?.productId!);
  }, [product])

  useEffect(() => {
    if (products?.length) {
      setProductIndex(generateRandomInteger(products.length - 1));
    }
  }, [products]);

  useEffect(() => {
      handleGetVendorPayments("7601605");
  }, []);

  return (
    <SafeAreaView className="h-full w-screen flex-1 pb-[1px] bg-gray-50">
      <StatusBar
          backgroundColor="#133522"
          barStyle="light-content"
      />

      {/* ==== Hero Section ==== */}
      <View className="h-[290px] w-full px-5 pt-2 rounded-b-3xl bg-baseGreen">
        <View className="flex-row items-center justify-between">
          <Image
            className="h-[60px] w-[60px] rounded-xl"
            resizeMode="cover"
            source={require("../../../../../assets/images/app_logo.png")}
          />
          <Pressable
            className="bg-[#20704329] p-2.5 rounded-xl"
            onPress={ () => navigation.navigate("vendorNotificationsScreen") }
          >
            <Notification color="#D5B07B" size={24} variant="Bold" />
          </Pressable>
        </View>


        <View className="mt-1">
          <Text className="text-gray-300 text-sm">{ shop.shopName! }</Text>
          <Text className="mt-1  text-white">{ (userData.firstName) ? `Hello, ${userData.firstName} ${userData.lastName} ✌🏽` : "User" }</Text>
          <Text className="text-gray-400 text-xs">Let’s sell something today</Text>
        </View>

        <View className="mt-5 p-5 py-6 rounded-3xl flex-row justify-between items-center bg-[#20704329]">
          <View>
            <Text className="text-white text-sm">Total revenue</Text>
            <Text className="text-white text-xl">{ `₦${ !analytics.shopRevenuesByPaymentStatus?.paid?.value ? 0.0 : analytics.shopRevenuesByPaymentStatus?.paid?.value }`}</Text>
            <Text className="mt-2 text-white text-[10px]">{ `Last month’s revenue = N/A`}</Text>
          </View>

          <View className="flex-row items-center">
            <ArrowUp color="#FFFFFF" size={13} className="mr-1" />
            <Text className="text-white text-xs">{ `0%`}</Text>
          </View>
        </View>
        
      </View>

      <ScrollView>
        <View className="px-5">

          {/* ==== Add Product ==== */}
          <View className="h-auto w-full flex-row">
            <TouchableOpacity
              onPress={ () => navigation.navigate("addProductScreen") }
              className="h-[55px] mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
              <Add className="text-baseGreen" />
              <View className="w-[5px]" />
              <Text className="font-normal text-base text-baseGreen">Add Product</Text>
            </TouchableOpacity>
            <View className="w-[20px]" />

            <TouchableOpacity 
              onPress={ () => navigation.navigate("promoScreen") }
              className="h-[55px] mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-lightGold"
            >
              <View className="w-[5px]" />
              <Text className="font-normal text-base text-baseGreen">Available Promo</Text>
            </TouchableOpacity>
          </View>

          {/* ==== Overview Section ==== */}
          <View className="mt-4">
            <View className="flex-row justify-between items-center">
              <Text className="font-normal text-base text-baseGreen">Overview</Text>
              <TouchableOpacity onPress={ () => navigation.navigate("overviewScreen") }>
                <Text className="text-sm text-baseGreen">View all</Text>
              </TouchableOpacity>
            </View>

           <ScrollView
            horizontal
            showsHorizontalScrollIndicator={ false }
            className="h-auto w-full mt-2"
           >
            { overviews.map((overview) => (
              <View
                key={ overview.name } 
                className="w-[170px] mr-3 px-4 py-2.5 border border-gray-200 rounded-xl bg-lightGray"
              >
                <Text className="font-medium text-lg">{ overview.count }</Text>
                <Text className="text-sm">{ overview.name }</Text>
              </View>
            )) }
           </ScrollView>
          </View>
          
          {/* ==== Weekly Sales Chart ==== */}
          <View className="h-auto w-full mt-5 px-2.5 py-3.5 border border-gray-200 rounded-xl bg-lightGray">
            <View className="flex-row items-center justify-between">
              <Text className="font-normal text-base text-baseGreen">Weekly Sales</Text>
              <View className="px-2 py-1.5 flex-row items-center border border-gray-200 rounded-lg bg-gray-50">
                <Text className="mr-2 text-xs text-gray-600">12-18, Aug</Text>
                <Calendar color="#6b7280" size={ 14 } />
              </View>
            </View>

            <View className="h-auto w-full mt-2 overflow-hidden">
              <BarChart
                data={ weeklySalesChartData }
                barWidth={ 20 }
                cappedBars
                capColor={ "rgb(17, 47, 30)" }
                capRadius={ 2 }
                capThickness={ 4 }
                showGradient
                gradientColor={ "rgba(17, 47, 30, 0.7)" }
                frontColor={ "rgba(17, 47, 30, 0.1)" }
                yAxisTextStyle={{ color: "#6b7280", fontSize: 12 }}
                xAxisLabelTextStyle={{ color: "#6b7280", fontSize: 12 }}
                yAxisLabelSuffix="K"
              />
            </View>
          </View>

          {/* ==== Recent Payment ==== */}
          <View className="h-auto w-full mt-5 p-3 border border-gray-200 rounded-xl bg-lightGray">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="font-normal text-base text-baseGreen">Recent Payment</Text>
              <TouchableOpacity 
                  onPress={ () => navigation.navigate("paymentScreen") }
                  className="px-3 py-2 flex flex-row items-center justify-center rounded-lg bg-gold"
                >
                  <Text className="text-sm text-baseGreen mr-2">View All</Text>
                  <ArrowRight size={ 18 } className="text-baseGreen" /> 
                </TouchableOpacity>
            </View>

            <FlatList
              data={payments}
              keyExtractor={(item) => item.productOrder_id!}
              showsVerticalScrollIndicator={ false }
              ListEmptyComponent={<EmptyListComponent message={"payments at the moment."} />}
              renderItem={({ item: payment }) => (!paymentIsLoading) ? (
                  <View key={ payment.productOrder_id } className="py-3 flex-row items-center border-t border-gray-200">
                    <View className={`h-[55px] w-[55px] mr-3 ${ payment.shopRevenue!.status == "success" ? "bg-lightGreen/70" : "bg-orange/10" } flex items-center justify-center rounded-full`}>
                      { (payment.shopRevenue!.status === "success")
                        ? <ArrowDown color="green" size={ 20 } className="rotate-[30deg]" />
                        : <Text className="text-3xl text-orange">!</Text>
                      }
                    </View>
                    <View>
                      <Text className="text-sm">{ payment.purchasedProduct!.title }</Text>
                      <Text className="font-montserratSemiBold text-base">{ formatCurrency(payment.shopRevenue!.value!, payment.shopRevenue!.currency!) }</Text>
                      <Text className="text-xs">{ formatDate(payment.purchaseDate!, true) }</Text>
                    </View>
                  </View>
              ) : (
                <ShimmerPlaceHolder
                  // visible={!productIsLoading}
                  LinearGradient={LinearGradient}
                  shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                  height={80}
                  width={Dimensions.get('window').width - 40}
                  shimmerStyle={{ borderRadius: 16, marginTop: 20 }}
                />
              )}
            />
          </View>

          {/* ==== Product List ==== */}
          { !productIsLoading ? (
            <View className="h-auto w-full mt-5 mb-4 p-3 pb-4 border border-gray-200 rounded-xl bg-lightGray">
              <View className="flex-row items-center justify-between">
                <Text className="font-normal text-base text-baseGreen">Product List</Text>
                <TouchableOpacity 
                  onPress={ () => navigation.getParent()?.navigate('Products') }
                  className="px-3 py-2 flex flex-row items-center justify-center rounded-lg bg-gold"
                >
                  <Text className="text-sm text-baseGreen mr-2">View All</Text>
                  <ArrowRight size={ 18 } className="text-baseGreen" /> 
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={ () => navigation.navigate("vendorProductDetailsScreen", { productID: product?.productId! }) }>
                <View className="relative mt-2 flex items-center justify-center">
                  {!productIsLoading && product?.colors?.[0]?.images?.[0]?.link ? (
                    <FastImage
                      source={{
                        uri: product.colors[0].images[0].link,
                        priority: FastImage.priority.normal
                      }}
                      defaultSource={require("../../../../../assets/images/app_logo.png")}
                      resizeMode={FastImage.resizeMode.cover}
                      className="h-[300px] w-[180px] rounded-lg"
                      style={{ aspectRatio: 0.7 }}
                      fallback
                    />
                  ) : (
                    <ShimmerPlaceHolder
                      LinearGradient={LinearGradient}
                      shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                      height={250}
                      width={Dimensions.get('window').width - 40}
                    />
                  )}

                  <View className="absolute top-5 left-2 right-2 flex-row justify-between">
                    <View />

                    <View className="flex-row items-center gap-2">
                      <View className={`p-2 flex items-center justify-center rounded-lg border backdrop-blur-lg ${
                        product?.status === "live" 
                        ? "border-green-300 bg-green-50" 
                        : product?.status === "draft"
                        ? "border-blue-300 bg-blue-50"
                        : product?.status === "under review"
                        ? "border-orange/30 bg-orange/10"
                        : "border-red-300 bg-red-50"
                      }`}>
                        <Text className={`font-montserratMedium text-xs ${
                          product?.status === "live" 
                          ? "text-green-600" 
                          : product?.status === "draft"
                          ? "text-blue-600"
                          : product?.status === "under review"
                          ? "text-orange-800"
                          : "text-red-600"
                        }`}>
                          { product && product.status!.charAt(0).toUpperCase() + product.status!.slice(1) }
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="h-auto w-full mt-4 flex-row items-center justify-between">
                    <View className="h-auto flex-row items-center">
                      <View className="mr-1.5 px-2 py-1 flex-row items-center border border-[#9EBDF8] rounded-md bg-[#E3ECFF]">
                        <Text className="text-xs text-[#3461B9] ">{ product?.categories?.gender! }'s wear</Text>
                      </View>
                      <View className="px-2 py-1 flex-row items-center border border-[#9EBDF8] rounded-md bg-[#E3ECFF]">
                        <Text className="text-xs text-[#3461B9] ">{ product?.categories?.age?.ageGroup! }</Text>
                      </View>
                    </View>

                    <TouchableOpacity onPress={ () => null } 
                      className="p-2 rounded-lg border border-gray-200/70 backdrop-blur-lg bg-white/40"
                    >
                      <Edit2 color="#3461B9" size={18} variant="Bold" className="mr-1" /> 
                    </TouchableOpacity>
                  </View>

                  <View>
                    <View className="h-auto w-full flex-row items-end justify-between">
                      <Text className="flex-1 font-montserratMedium text-base">{ product?.title }</Text>
                      <Text className={`font-montserratMedium text-xs ${ product?.variations?.[0].quantity! >= 10 ? "text-green-600" : "text-red-600" }`}>{ product?.variations?.[0].quantity! } in stock</Text>
                    </View>
                    <Text className="font-montserratMedium text-base">₦{ product?.variations?.[0].price!.toLocaleString() }</Text> 
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <ShimmerPlaceHolder
              // visible={!productIsLoading}
              LinearGradient={LinearGradient}
              shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
              height={330}
              width={Dimensions.get('window').width - 40}
              shimmerStyle={{ borderRadius: 16, marginTop: 20 }}
            />
          ) }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorDashboardScreen;