import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
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
import ProductFilterBottomSheetComponent from "../../products/components/productFilterBottomSheet_component.tsx";
import OrderFilterBottomSheetComponent from "../../orders/components/orderFilterBottomSheet_component.tsx";
import useVendorProductHook from "../../products/hooks/vendorProduct_hook.ts";
import AppLoader from "../../../general/components/appLoader.tsx";

const Tab = createBottomTabNavigator();

const VendorHomeScreen = () => {

  const { showProductFilterBottomSheet, showOrderFilterBottomSheet } = useSelector((state: RootState) => state.vendorHomeState);
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.generalState);
  const { handleFetchFilteredProducts } = useVendorProductHook();

  useEffect(() => {
    (async () => {
      await handleFetchFilteredProducts();
    })();
  }, []);

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
            <Tab.Screen name="Profile" component={ ProfileScreen } />
            <Tab.Screen name="Market" component={ MarketScreen } />
          </Tab.Navigator>

          {/*
            NOTE: The custom BottomSheets are been moved to this parent component is to make sure it's always on top
            of the "AppBottomBarComponent" component. This is because the "AppBottomBarComponent" is being always on top
            of the "BottomSheetModalProvider" component. So, if we move the custom BottomSheets to this parent component,
            it will always be on top of the "AppBottomBarComponent" component.

            A better easier approach would have been to move the "AppBottomBarComponent" component to their respective
            parent component and remove the and wrap them with the "BottomSheetModal" component. But, this will make the
            "AppBottomBarComponent" component have a transparent backdrop which will always be clickable. So, this is
            not a good effect we want to achieve.
          */}
          { showProductFilterBottomSheet && (
            <ProductFilterBottomSheetComponent />
          ) }
          { showOrderFilterBottomSheet && (
            <OrderFilterBottomSheetComponent />
          ) }

          { isLoading &&
            <AppLoader loadingAdditionalMessage={ loadingMessage } />
          }
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default VendorHomeScreen;
