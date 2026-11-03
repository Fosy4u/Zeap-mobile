import React, { useEffect } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Whatsapp } from "iconsax-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VendorDashboardScreen from "./vendorDashboard_screen";
import MarketScreen from "../../market/screens/market_screen";
import OrdersScreen from "../../orders/screens/orders_screen";
import ProfileScreen from "../../../profile/screens/profile_screen.tsx";
import AppBottomBarComponent from "../components/appBottomBar_component";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import VendorProductsScreen from "../../products/screens/vendorProducts_screen.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store.ts";
import OrderFilterBottomSheetComponent from "../../orders/components/orderFilterBottomSheet_component.tsx";
import useVendorProductHook from "../../products/hooks/vendorProduct_hook.ts";
import useDisplayCurrency from "../../../general/hooks/displayCurrency_hook.ts";
import useHomeHook from "../../../user/home/hooks/home_hook.ts";

const Tab = createBottomTabNavigator();

const VendorHomeScreen = () => {

  const { showOrderFilterBottomSheet } = useSelector((state: RootState) => state.vendorHomeState);
  const { handleFetchFilteredProducts } = useVendorProductHook();
  const { currencyRefreshToken } = useDisplayCurrency();
  const { handleOpenWhatsApp } = useHomeHook();

  useEffect(() => {
    (async () => {
      await handleFetchFilteredProducts();
    })();
  }, [currencyRefreshToken]);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-screen w-full flex-1">
          <Tab.Navigator
            initialRouteName="Dashboard"
            tabBar={ (props) => <AppBottomBarComponent {...props} /> }
            screenOptions={{
              headerShown: false,
            }}
          >
            <Tab.Screen name="Dashboard" component={ VendorDashboardScreen } />
            <Tab.Screen name="Products" component={ VendorProductsScreen } />
            <Tab.Screen name="Orders" component={ OrdersScreen } />
            <Tab.Screen
              name="Profile"
              component={ ProfileScreen }
              initialParams={{ mode: "vendor" }}
            />
            <Tab.Screen
              name="Market"
              component={ MarketScreen }
              listeners={ ({ navigation: tabNavigation }) => ({
                tabPress: (e) => {
                  e.preventDefault();
                  tabNavigation.getParent()?.navigate("homeScreen", { screen: "Home" });
                },
              }) }
            />
          </Tab.Navigator>

          {/* WhatsApp FAB Button */}
          <TouchableOpacity
            onPress={ handleOpenWhatsApp }
            className="w-12 h-12 absolute bottom-24 right-2 bg-green-500 rounded-full items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Whatsapp color="#FFFFFF" size={ 28 } />
          </TouchableOpacity>

          { showOrderFilterBottomSheet && (
            <OrderFilterBottomSheetComponent />
          ) }

        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default VendorHomeScreen;
