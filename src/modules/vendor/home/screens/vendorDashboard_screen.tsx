import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { Add, ArrowRight, ArrowUp, Calendar, Edit2, Notification, Shop } from "iconsax-react-native";
import VendorDashboardSkeletonComponent from "../components/vendorDashboardSkeleton_component";
import useShopGuardHook from "../../general/hooks/shopGuard_hook";
import NoShopPopupModal from "../../general/modals/noShopPopup_modal";
import { useNavigation } from "@react-navigation/native";
import SkeletonBlock from '../../../general/components/skeletonBlock_component';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { BarChart } from "react-native-gifted-charts";
import useVendorHomeHook from "../hooks/vendorHome_hook";
import useGeneralHook from "../../../general/hooks/general_hook";
import FastImage from "react-native-fast-image";
import useVendorProductHook from "../../products/hooks/vendorProduct_hook";
import useVendorPaymentHook from "../../payments/hooks/payment_hook";
import useNotificationHook from "../../../notifications/hooks/notification_hook";
import { setProduct, setProductMode, setSelectedStep } from "../../products/slices/vendorProductState_slice";
import formatCurrency from "../../../../utils/formatCurrency";
import formatDate from "../../../../utils/formatDate";
import EmptyListComponent from "../../../general/components/emptyList_component";
import VendorHomeHeaderComponent from "../components/vendorHomeHeader_component";
import useDisplayCurrency from "../../../general/hooks/displayCurrency_hook";
import AppStatusBar from "../../../general/components/appStatusBar";

const VendorDashboardScreen = () => {
  const { productIsLoading } = useSelector((state: RootState) => state.vendorProductState);
  const { isLoading: paymentIsLoading, hasFetched: paymentsHaveFetched } = useSelector((state: RootState) => state.vendorPaymentState);
  const { analytics, overviews } = useSelector((state: RootState) => state.vendorHomeState);
  const { products } = useSelector((state: RootState) => state.vendorProductState);
  const { payments } = useSelector((state: RootState) => state.vendorPaymentState);
  const { userData } = useSelector((state: RootState) => state.profileState);
  const { notifications } = useSelector((state: RootState) => state.notificationsState);
  const [productIndex, setProductIndex] = useState<number | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const { formatPrice, currencyRefreshToken } = useDisplayCurrency();

  const { shop, shopStatus, isResolvingShop, isCheckingShop, hasNoShop, recheckShop } = useShopGuardHook();

  const product = productIndex !== null ? products?.[productIndex] : undefined;

  const recentPayments = React.useMemo(
    () => [...(payments ?? [])]
      .sort((a, b) => new Date(b.purchaseDate ?? 0).getTime() - new Date(a.purchaseDate ?? 0).getTime())
      .slice(0, 3),
    [payments],
  );

  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight, setHeaderHeight] = useState(0);
  const isLoadingPayments = paymentIsLoading || !paymentsHaveFetched;

  const weeklySales = React.useMemo(() => {
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    return Array.from({ length: 7 }, (_, offset) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - offset));

      const total = (payments ?? [])
        .filter((payment) => {
          if (!/^(success|paid)$/i.test(payment.shopRevenue?.status ?? "")) return false;
          const paidOn = new Date(payment.purchaseDate ?? 0);
          return paidOn.toDateString() === day.toDateString();
        })
        .reduce((sum, payment) => sum + (payment.shopRevenue?.value ?? 0), 0);

      return { label: dayLabels[day.getDay()], value: Number((total / 1000).toFixed(1)) };
    });
  }, [payments]);

  useNotificationHook();
  const unreadNotifications = notifications.filter((n) => n?.seen !== true).length;

  const { handleGetShop, handleGeVendortAnalytics } = useVendorHomeHook();
  const { generateRandomInteger, handleGetProductOptions } = useGeneralHook();
  const { handleGetProductReviews } = useVendorProductHook();
  const { handleGetVendorPayments } = useVendorPaymentHook();

  useEffect(() => {
    if (shopStatus === "new") {
      navigation.reset({ index: 0, routes: [{ name: "vendorWelcomeScreen" }] });
    }
  }, [shopStatus]);

  useEffect(() => {
    (async () => {
      if (userData?.shopId) {
        await handleGetShop(userData.shopId);
      }
      await handleGetProductOptions();
    })();
  }, [userData, currencyRefreshToken]);

  useEffect(() => {
    if (!userData?.shopId) { return; }
    (async () => {
      await handleGeVendortAnalytics(userData.shopId!)
    })();
  }, [userData, currencyRefreshToken]);

  useEffect(() => {
    handleGetProductReviews(product?.productId!);
  }, [product])

  useEffect(() => {
    if (products?.length) {
      setProductIndex(generateRandomInteger(products.length - 1));
    }
  }, [products]);

  useEffect(() => {
    if (userData?.shopId) {
      handleGetVendorPayments(userData.shopId);
    }
  }, [userData?.shopId, currencyRefreshToken]);

  if (isResolvingShop) {
    return <VendorDashboardSkeletonComponent />;
  }

  if (hasNoShop) {
    return (
      <View className="h-full w-full flex-1 bg-gray-50">
        <NoShopPopupModal onRetry={ recheckShop } isRetrying={ isCheckingShop } />
      </View>
    );
  }

  return (
    <SafeAreaView className="h-full w-screen flex-1 pb-[1px] bg-gray-50">
      <AppStatusBar backgroundColor="#133522" barStyle="light-content" />

      {/* ==== Hero Section ==== */}
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={ false }
        scrollEventThrottle={ 16 }
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 16 }}
        onScroll={ Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        ) }
      >
        <View className="px-5">

          {/* ==== Add Product ==== */}
          <View className="h-auto w-full flex-row">
            <TouchableOpacity
              onPress={ () => navigation.navigate("addProductScreen") }
              className="h-[55px] w-full mt-5 flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
              <Add className="text-baseGreen" />
              <View className="w-[5px]" />
              <Text className="font-normal text-base text-baseGreen">Add Product</Text>
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
                data={ weeklySales }
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

            { isLoadingPayments ? (
              <View className="py-3 border-t border-gray-200">
                <SkeletonBlock
                  width={ Dimensions.get('window').width - 70 }
                  height={ 200 }
                  radius={ 12 }
                />
              </View>
            ) : (!recentPayments || recentPayments.length === 0) ? (
              <EmptyListComponent message={"payments at the moment."} />
            ) : (
              recentPayments.map((payment) => (
                <View key={ payment.productOrder_id } className="py-3 flex-row items-center border-t border-gray-200">
                  <View className="h-[55px] w-[55px] mr-3 rounded-lg overflow-hidden bg-gray-100">
                    <FastImage
                      source={{
                        uri: payment.purchasedProduct?.images?.[0]?.link ?? "",
                        priority: FastImage.priority.normal,
                      }}
                      defaultSource={ require("../../../../../assets/images/image_placeholder.png") }
                      resizeMode={ FastImage.resizeMode.cover }
                      className="h-[55px] w-[55px]"
                      fallback
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm" numberOfLines={ 2 }>{ payment.purchasedProduct?.title ?? "" }</Text>
                    <Text className="font-montserratSemiBold text-base">{ formatCurrency(payment.shopRevenue!.value!, payment.shopRevenue!.currency!) }</Text>
                    <Text className="text-xs">{ formatDate(payment.purchaseDate!, true) }</Text>
                  </View>
                </View>
              ))
            ) }
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
                  { productIsLoading ? (
                    <SkeletonBlock
                      width={ Dimensions.get('window').width - 40 }
                      height={ 250 }
                      radius={ 12 }
                    />
                  ) : product?.colors?.[0]?.images?.[0]?.link ? (
                    <FastImage
                      source={{
                        uri: product.colors[0].images[0].link,
                        priority: FastImage.priority.normal
                      }}
                      defaultSource={require("../../../../../assets/images/image_placeholder.png")}
                      resizeMode={FastImage.resizeMode.cover}
                      className="h-[300px] w-[180px] rounded-lg"
                      style={{ aspectRatio: 0.7 }}
                      fallback
                    />
                  ) : (
                    <View className="h-[300px] w-[180px] rounded-lg bg-gray-100 border border-gray-200 items-center justify-center">
                      <Image
                        source={ require("../../../../../assets/images/image_placeholder.png") }
                        resizeMode="contain"
                        className="h-[80px] w-[80px]"
                      />
                      <Text className="mt-2 font-montserratMedium text-xs text-gray-400">No image</Text>
                    </View>
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

                    <TouchableOpacity
                      onPress={ () => {
                        if (!product) { return; }
                        /* Mirrors the products-screen edit flow: seed the draft,
                           reset to step 1, open the stepper for its type. */
                        dispatch(setProduct(product));
                        dispatch(setProductMode("Draft"));
                        dispatch(setSelectedStep(1));
                        navigation.navigate(
                          product.productType === "bespokeCloth" ? "addBespokeClothesScreen" :
                          product.productType === "readyMadeCloth" ? "addReadyMadeClothesScreen" :
                          product.productType === "bespokeShoe" ? "addBespokeShoesScreen" :
                          product.productType === "readyMadeShoe" ? "addReadyMadeShoesScreen" :
                          "addAccessoriesScreen"
                        );
                      } }
                      className="p-2 rounded-lg border border-gray-200/70 backdrop-blur-lg bg-white/40"
                    >
                      <Edit2 color="#3461B9" size={18} variant="Bold" className="mr-1" />
                    </TouchableOpacity>
                  </View>

                  <View>
                    <View className="h-auto w-full flex-row items-end justify-between">
                      <Text className="flex-1 font-montserratMedium text-base">{ product?.title }</Text>
                      <Text className={`font-montserratMedium text-xs ${ (product?.variations?.[0]?.quantity ?? 0) >= 10 ? "text-green-600" : "text-red-600" }`}>{ product?.variations?.[0]?.quantity ?? 0 } in stock</Text>
                    </View>
                    <Text className="font-montserratMedium text-base">{ formatPrice(product?.variations?.[0]?.price, product?.variations?.[0]?.currency) }</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginTop: 20 }}>
              <SkeletonBlock
                width={ Dimensions.get('window').width - 40 }
                height={ 330 }
                radius={ 16 }
              />
            </View>
          ) }
        </View>
      </Animated.ScrollView>

      {/* ==== Reusable floating header: pinned app bar + collapsible band,
          both sharing the same rounded bottom corners. ==== */}
      <VendorHomeHeaderComponent
        scrollY={ scrollY }
        onHeaderHeightChange={ setHeaderHeight }
        appBarContent={
          <View className="flex-row items-center justify-between">
            <Image
              className="h-[60px] w-[90px] rounded-sm"
              resizeMode="contain"
              source={require("../../../../../assets/images/app_logo_gold.png")}
            />

            <View className="flex-row items-center gap-x-2">
              <TouchableOpacity
                onPress={ () => navigation.navigate("homeScreen", { screen: "Home" }) }
                className="px-3 py-2 flex-row items-center rounded-full bg-gold/20"
              >
                <Shop color="#D5B07B" size={ 16 } variant="Bold" />
                <Text className="ml-1.5 font-montserratSemiBold text-xs text-gold">Marketplace</Text>
              </TouchableOpacity>

              <Pressable
                className="bg-[#20704329] p-2.5 rounded-xl"
                onPress={ () => navigation.navigate("vendorNotificationsScreen") }
              >
                <Notification color="#D5B07B" size={24} variant="Bold" />

                {/* Unread badge — hidden at 0, caps at "9+" so a long count can't
                    break the circle. */}
                { unreadNotifications > 0 && (
                  <View
                    className="absolute -top-1 -right-1 px-1 items-center justify-center rounded-full bg-red-500"
                    style={{ minWidth: 18, height: 18 }}
                  >
                    <Text className="font-montserratSemiBold text-[10px] text-white">
                      { unreadNotifications > 9 ? "9+" : unreadNotifications }
                    </Text>
                  </View>
                ) }
              </Pressable>
            </View>
          </View>
        }
        collapsibleContent={
          <>
            <View className="mt-1">
              <Text className="text-gray-300 text-sm">{ shop?.shopName ?? "" }</Text>
              <Text className="mt-1  text-white">{ (userData.firstName) ? `Hello, ${userData.firstName} ${userData.lastName} ✌🏽` : "User" }</Text>
              <Text className="text-gray-400 text-xs">Let’s sell something today</Text>
            </View>

            <View className="mt-5 p-5 py-6 rounded-3xl flex-row justify-between items-center bg-[#20704329]">
              <View>
                <Text className="text-white text-sm">Total revenue</Text>
                <Text className="text-white text-xl">{ formatPrice(analytics.shopRevenuesByPaymentStatus?.paid?.value, analytics.shopRevenuesByPaymentStatus?.paid?.currency) }</Text>
                <Text className="mt-2 text-white text-[10px]">{ `Last month’s revenue = N/A`}</Text>
              </View>

              <View className="flex-row items-center">
                <ArrowUp color="#FFFFFF" size={13} className="mr-1" />
                <Text className="text-white text-xs">{ `0%`}</Text>
              </View>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default VendorDashboardScreen;
