import React from 'react';
import { SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CartScreen from '../../cart/screen/cart_screen';
import DashboardScreen from './dashboard_screen';
import SavedScreen from '../../saved/screen/saved_screen';
import ProfileScreen from '../../../profile/screen/profile_screen';
import AppBottomBarComponent from '../components/appBottomBar_component';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Dashboard"
        tabBar={(props) => <AppBottomBarComponent {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Cart" component={ CartScreen } />
        <Tab.Screen name="Dashboard" component={ DashboardScreen } />
        <Tab.Screen name="Saved" component={ SavedScreen } />
        <Tab.Screen name="Profile" component={ ProfileScreen } />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default HomeScreen;