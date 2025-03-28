import React, { useEffect } from "react";
import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { Add, ArrowDown, ArrowRight, ArrowUp, Calendar, Edit2, Notification, Star1 } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from "react-native-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { BarChart } from "react-native-gifted-charts";
import useVendorHomeHook from "../hooks/vendorHome_hook";
import useGeneralHook from "../../../general/hooks/general_hook";
import FastImage from "react-native-fast-image";


const VendorDashboardScreen = () => {
  const { isLoadingProducts } = useSelector((state: RootState) => state.vendorProductState);
  const { analytics, overviews, weeklySalesChartData } = useSelector((state: RootState) => state.vendorHomeState);
  const { products } = useSelector((state: RootState) => state.vendorProductState);
  const { payments } = useSelector((state: RootState) => state.paymentState);
  const { shop } = useSelector((state: RootState) => state.vendorGeneralState);
  const { userData } = useSelector((state: RootState) => state.profileState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const product = products?.[0];

  const {
    handleGetShop,
    handleGeVendortAnalytics,
  } = useVendorHomeHook();
  const { handleGetProductOptions } = useGeneralHook();

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
  
  

  return (
    <SafeAreaView className="flex-1 h-auto w-screen pb-24 bg-gray-50">
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
              <TouchableOpacity onPress={ () => navigation.navigate("paymentScreen") }>
                <Text className="text-sm text-baseGreen">View all</Text>
              </TouchableOpacity>
            </View>

            { payments.map((payment) => (
              <View key={ payment.id } className="my-3 flex-row items-center">
                <View className={`h-9 w-9 mr-3 ${ payment.status == "Success" ? "bg-lightGreen/70" : "bg-orange/10" } flex items-center justify-center rounded-full`}>
                  { (payment.status === "Success")
                    ? <ArrowDown color="green" size={ 20 } className="rotate-[30deg]" />
                    : <Text className="text-2xl text-orange">!</Text>
                  }
                </View>
                <View>
                  <Text className="text-base">₦{ payment.amount }</Text>
                  <Text className="text-xs">{ payment.productName }  -  { payment.date }</Text>
                </View>
              </View>
            )) }
          </View>

          {/* ==== Product List ==== */}
          { !isLoadingProducts ? (
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
                {!isLoadingProducts && product?.colors?.[0]?.images?.[0]?.link ? (
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

                  <View className="absolute top-5 left-4 right-4 flex-row justify-between">
                    <View className="w-[110px] px-2 py-1 rounded-lg border border-white/60 backdrop-blur-lg bg-white/50">
                      <View className="flex-row items-center">
                        <Star1 color="#E4A01C" size={14} variant="Bold" className="mr-1" />
                        <Text className="text-xs">4.3</Text>
                      </View>
                      <Text className="text-[11px]">200 reviews</Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <View className="p-2 flex items-center justify-center rounded-lg border border-orange/30 backdrop-blur-lg bg-orange/20">
                        <Text className="text-xs text-orange/90">{product?.status?.charAt(0).toUpperCase() + product?.status?.slice(1)}</Text>
                      </View>
                    </View>
                  </View>

                  <View className="absolute bottom-24 right-4 p-2 flex items-center justify-center rounded-lg border border-gray-200/70 backdrop-blur-lg bg-white/40">
                    <Edit2 color="#3461B9" size={18} variant="Bold" className="mr-1" />
                  </View>

                  <View className="h-auto w-full mt-4 flex-row items-center">
                    <View className="mr-1.5 px-2 py-1 flex-row items-center border border-[#9EBDF8] rounded-md bg-[#E3ECFF]">
                      <Text className="text-xs text-[#3461B9] ">{ product?.categories?.gender! }'s wear</Text>
                    </View>
                    <View className="px-2 py-1 flex-row items-center border border-[#9EBDF8] rounded-md bg-[#E3ECFF]">
                      <Text className="text-xs text-[#3461B9] ">{ product?.categories?.age?.ageGroup! }</Text>
                    </View>
                  </View>

                  <View>
                    <View className="h-auto w-full flex-row items-center justify-between">
                      <Text className="flex-1 font-montserratMedium text-base">{ product?.title }</Text>
                      <Text className={`font-montserratMedium text-xs ${product?.variation?.[0].quantity! >= 10 ? "text-green-600" : "text-red-600"}`}>{ product?.variations?.[0].quantity! } in stock</Text>
                    </View>
                    <Text className="font-montserratMedium text-base">₦{ product?.variations?.[0].price!.toLocaleString() }</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <ShimmerPlaceHolder
              // visible={!isLoadingProducts}
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