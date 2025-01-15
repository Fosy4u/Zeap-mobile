import React from "react";
import { SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VendorDashboardScreen from "./vendorDashboard_screen";
import MarketScreen from "../../market/screens/market_screen";
import OrdersScreen from "../../orders/screens/orders_screen";
import ProfileScreen from "../../../profile/screen/profile_screen";
import AppBottomBarComponent from "../components/appBottomBar_component";
import VendorProductScreen from "../../products/screens/vendorProducts_screen.tsx";

const Tab = createBottomTabNavigator();

const VendorHomeScreen = () => {

  
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
            <Tab.Screen name="Products" component={ VendorProductScreen } />
            <Tab.Screen name="Orders" component={ OrdersScreen } />
            <Tab.Screen name="Profile" component={ ProfileScreen } />
            <Tab.Screen name="Market" component={ MarketScreen } />
        </Tab.Navigator>
    </SafeAreaView>
  )
}

export default VendorHomeScreen;