import React, { useEffect, useState } from "react";
import { Image, Text, View, Pressable, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Linking, Modal } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Heart, Notification, SearchNormal1, Star1, Menu, ArrowRight } from "iconsax-react-native";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../../redux/store/store";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import useGeneralHook from "../../../general/hooks/general_hook";
import useHomeHook from "../hooks/home_hook";
import IProduct from "../../products/models/product_model";
import FastImage from "react-native-fast-image";
import FormatWords from "../../../../utils/formatWords";
import MainDashboardScreen from "./mainDashboard_screen";
import { setIsMobileMenuOpen, setSelectedDashboard } from "../slices/dashboardWrapper_slice";
import BespokeDashboardScreen from "./bespokeDashboard_screen";
import ReadyMadeDashboardScreen from './readyMadeDashboard_screen.tsx';

const DashboardWrapperScreen = () => {
  const { dashboards, selectedDashboard, isMobileMenuOpen } = useSelector((state: RootState) => state.dashboardWrapperState);
  const { userData } = useSelector((state: RootState) => state.profileState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
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

    (async () => {
      await fetchAllData();
    })();
  }, []);


  return (
    <GestureHandlerRootView>
        <SafeAreaView className="flex-1 h-auto w-screen pb-20 bg-white">
            <StatusBar
                backgroundColor="#112F1E"
                barStyle="light-content"
            />

            {/*==== Mobile Navigation ====*/}
            <Modal
              visible={isMobileMenuOpen}
              animationType="slide"
              transparent
              onRequestClose={() => dispatch(setIsMobileMenuOpen(false))}
            >
              <View className="h-[60%] w-full bg-[#eafdf1] pt-24" style={{ zIndex: 100 }}>
                {/*==== Close Button ====*/}
                <TouchableOpacity
                  onPress={() => dispatch(setIsMobileMenuOpen(false))}
                  className="h-10 w-10 absolute top-4 right-4 flex-row items-center justify-center rounded-lg bg-lightGreen"
                >
                  <Text className="text-4xl text-baseGreen">&times;</Text>
                </TouchableOpacity>

                {/*==== Navigation Links ====*/}
                {dashboards.map((dashboard) => (
                  <TouchableOpacity
                    key={dashboard.id}
                    onPress={() => {
                      dispatch(setSelectedDashboard(dashboard));
                      dispatch(setIsMobileMenuOpen(false))
                    }}
                    className="mt-3 py-3"
                  >
                    <Text className="font-montserratSemiBold text-lg text-center text-green-700">{dashboard.name}</Text>
                  </TouchableOpacity>
                ))}


                {/*==== Sell on Zeaper Button ====*/}
                <TouchableOpacity
                  className="mt-16 mx-auto px-6 py-3 flex-row items-center bg-baseGreen rounded-md"
                  onPress={() => {
                    dispatch(setIsMobileMenuOpen(false));
                    // Add your action here
                  }}
                >
                  <Text className="text-lg text-white">Sell On Zeaper</Text>
                  <ArrowRight size={20} variant="Linear" color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
            </Modal>

            <ScrollView className="pb-[120px]">

              {/*==== Header Section ==== */}
              <View className="px-5 py-6 bg-baseGreen">
                {/*==== Top Header ====*/}
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
                  <View className="flex-row items-center space-x-3">
                    <Pressable
                      className="bg-lightGreen p-2.5 rounded-full"
                      onPress={ () => navigation.navigate("userNotificationsScreen") }
                    >
                      <Notification color="#133522" size={24} variant="Bold" />
                    </Pressable>
                    <Pressable
                      className="bg-lightGreen p-2.5 rounded-full"
                      onPress={ () => dispatch(setIsMobileMenuOpen(true)) }
                    >
                      <Menu color="#133522" size={24} variant="Linear" />
                    </Pressable>
                  </View>
                </View>

                {/*==== Search Box ====*/}
                { (selectedDashboard.name === "Home") && (
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
                ) }
              </View>

              {/*==== Main Body Section ====*/}
              <View className="w-[90%] px-5 py-6">
                { (selectedDashboard.name === "Home") ? (
                  <MainDashboardScreen />
                ) : (selectedDashboard.name === "Bespoke") ? (
                  <View className="bg-slate-500">
                    <BespokeDashboardScreen />
                  </View>
                ) : (selectedDashboard.name === "Ready To Wear") ? (
                  <View>
                    <ReadyMadeDashboardScreen />
                  </View>
                ) : (
                  <View>
                    <Text>ACCESSORIES DASHBOARD</Text>
                  </View>
                ) }
              </View>

            </ScrollView>
        </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DashboardWrapperScreen;



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
