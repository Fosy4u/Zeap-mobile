import React, { useEffect } from "react"
import { SafeAreaView } from "react-native"
import useLoginHook from "../../../auths/hooks/login_hook";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VendorDashboardScreen from "./vendorDashboard_screen";
import ItemsScreen from "../../items/screens/items_screen";
import MarketScreen from "../../market/screens/market_screen";
import OrdersScreen from "../../orders/screens/orders_screen";
import ProfileScreen from "../../../profile/screen/profile_screen";
import AppBottomBarComponent from "../components/appBottomBar_component";

const Tab = createBottomTabNavigator();

const VendorHomeScreen = () => {
    const { validateAndRefreshToken } = useLoginHook();

  useEffect(() => {
    (async () => {
      await validateAndRefreshToken();
    })();
  }, [validateAndRefreshToken]);

  
  return (
    <SafeAreaView className="h-screen w-full flex-1">
        <Tab.Navigator
            initialRouteName="Dashboard"
            tabBar={ (props) => <AppBottomBarComponent {...props} /> }
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Dashboard" component={ VendorDashboardScreen } />
            <Tab.Screen name="Items" component={ ItemsScreen } />
            <Tab.Screen name="Orders" component={ OrdersScreen } />
            <Tab.Screen name="Profile" component={ ProfileScreen } />
            <Tab.Screen name="Market" component={ MarketScreen } />
        </Tab.Navigator>
    </SafeAreaView>
  )
}

export default VendorHomeScreen;