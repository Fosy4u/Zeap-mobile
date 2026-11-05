import React, { useEffect, useState } from "react";
import { Text, View, Pressable, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Notification, SearchNormal1 } from "iconsax-react-native";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../../redux/store/store";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import MainDashboardScreen from "./mainDashboard_screen";
import { setSelectedDashboard } from "../slices/dashboardWrapper_slice";
import BespokeDashboardScreen from "./bespokeDashboard_screen";
import ReadyMadeDashboardScreen from './readyMadeDashboard_screen.tsx';
import AccessoriesDashboardScreen from "./accessoriesDashboard_screen.tsx";
import useGeneralHook from "../../../general/hooks/general_hook.ts";
import useFilterAndSearchHook from "../../products/hooks/filterAndSearch_hook.ts";
import UserAvatar from "../../../general/components/userAvatar_component";
import { useGetWishlistQuery } from "../../saved/apis/saved_api";
import { setSavedWishEntries } from "../../saved/slices/saved_slice";
import useDisplayCurrency from "../../../general/hooks/displayCurrency_hook";
import useNotificationHook from "../../../notifications/hooks/notification_hook";
import AppStatusBar from "../../../general/components/appStatusBar";

const DashboardWrapperScreen = () => {
  const { dashboards, selectedDashboard } = useSelector((state: RootState) => state.dashboardWrapperState);
  const { userData } = useSelector((state: RootState) => state.profileState);
  const { notifications } = useSelector((state: RootState) => state.notificationsState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();

    const { handleGetProductOptions } = useGeneralHook();
    const { handleGetPromoProducts, handleGetFilteredProducts, handleGetPopularProducts, handleGetNewestProducts } = useFilterAndSearchHook();
    const { currencyRefreshToken } = useDisplayCurrency();

    const [homeSearchText, setHomeSearchText] = useState("");

    const handleHomeSearch = () => {
      const term = homeSearchText.trim();
      navigation.navigate("searchItemScreen", term ? { initialSearch: term } : undefined);
      setHomeSearchText("");
    };

    useNotificationHook();
    const unreadNotifications = notifications.filter((n) => n?.seen !== true).length;

    useEffect(() => {
      handleGetProductOptions();
      handleGetPromoProducts();
      handleGetFilteredProducts({ screenTitle: "All Products" });
      handleGetPopularProducts("Popular Products");
      handleGetNewestProducts("Newest Products");
    }, [currencyRefreshToken]);

    const { data: wishItems } = useGetWishlistQuery(undefined, {
      skip: !userData?.uid || !!userData?.isGuest,
    });
    useEffect(() => {
      if (!wishItems) { return; }
      dispatch(setSavedWishEntries(
        wishItems
          .filter((item: any) => !!item.product?.productId)
          .map((item: any) => ({ productId: item.product.productId, wishId: item._id })),
      ));
    }, [wishItems]);

  return (
    <GestureHandlerRootView>
        <AppStatusBar backgroundColor="#112F1E" barStyle="light-content" />
        <SafeAreaView className="flex-1 h-auto w-screen pb-20 bg-white">

            <ScrollView
              key={ (selectedDashboard.name === "Home") ? "home" : "category" }
              contentContainerStyle={{ paddingBottom: 120 }}
              stickyHeaderIndices={ (selectedDashboard.name === "Home") ? undefined : [0] }
            >

              {/*==== Header Section ==== */}
              <View className="px-5 pt-6 bg-baseGreen">
                {/*==== Top Header ====*/}
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={ () => navigation.navigate("homeScreen", { screen: "Profile" } as any) }
                  >
                    <UserAvatar
                      photoURL={ userData.imageUrl?.link }
                      firstName={userData.firstName}
                      lastName={userData.lastName}
                      displayName={(userData as any).displayName}
                      email={userData.email}
                      isGuest={!!userData.isGuest}
                      seed={userData.uid || userData.email}
                      size={50}
                    />
                    { !userData.isGuest && (
                      <Text className="ml-2 font-medium text-base text-white">{ userData.firstName }</Text>
                    ) }
                  </TouchableOpacity>
                  <View className="flex-row items-center">
                    <Pressable
                      className="bg-lightGreen p-2.5 rounded-full"
                      onPress={ () => navigation.navigate("userNotificationsScreen") }
                    >
                      <Notification color="#133522" size={24} variant="Bold" />

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

                {/*==== Search Bar ====*/}
                <View className="h-[48px] mt-5 pl-4 pr-1.5 flex-row items-center rounded-xl bg-white">
                  <TextInput
                    value={ homeSearchText }
                    onChangeText={ setHomeSearchText }
                    onSubmitEditing={ handleHomeSearch }
                    placeholder="Search for products"
                    placeholderTextColor="#9ca3af"
                    returnKeyType="search"
                    className="flex-1 h-full font-montserratMedium text-sm text-baseGreen"
                  />
                  <TouchableOpacity
                    onPress={ handleHomeSearch }
                    className="h-[36px] w-[36px] items-center justify-center rounded-lg bg-gold"
                  >
                    <SearchNormal1 color="#133522" size={18} variant="Linear" />
                  </TouchableOpacity>
                </View>

                {/*==== Section Tabs ====*/}
                <View className="mt-6 flex-row justify-between" style={{ columnGap: 12 }}>
                  { dashboards.map((dashboard) => {
                    const isActive = selectedDashboard.name === dashboard.name;
                    return (
                      <TouchableOpacity
                        key={ dashboard.id }
                        onPress={ () => dispatch(setSelectedDashboard(dashboard)) }
                        hitSlop={{ top: 8, bottom: 4, left: 6, right: 6 }}
                      >
                        <Text numberOfLines={ 1 } className={ `font-montserratSemiBold text-[11px] ${ isActive ? "text-white" : "text-white/60" }` }>
                          { dashboard.name.toUpperCase() }
                        </Text>
                        <View className={ `h-[3px] mt-2 mb-3 rounded-full ${ isActive ? "bg-white" : "bg-transparent" }` } />
                      </TouchableOpacity>
                    );
                  }) }
                </View>
              </View>

              {/*==== Main Body Section ====*/}
              <View className="w-[90%] px-5 pt-5 pb-6">
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
                    <AccessoriesDashboardScreen />
                  </View>
                ) }
              </View>

            </ScrollView>
        </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DashboardWrapperScreen;
