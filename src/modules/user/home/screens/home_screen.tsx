import React from 'react';
import { SafeAreaView, TouchableOpacity, Text, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Whatsapp } from 'iconsax-react-native';

import CartScreen from '../../cart/screens/cart_screen';
import DashboardWrapperScreen from './dashboardWrapper_screen';
import SavedScreen from '../../saved/screen/saved_screen';
import ProfileScreen from '../../../profile/screens/profile_screen';
import AppBottomBarComponent from '../components/appBottomBar_component';
import useHomeHook from '../hooks/home_hook';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {  
  const { handleOpenWhatsApp } = useHomeHook();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Dashboard"
        tabBar={(props) => <AppBottomBarComponent {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Dashboard" component={ DashboardWrapperScreen } />
        <Tab.Screen name="Cart" component={ CartScreen } />
        <Tab.Screen name="Saved" component={ SavedScreen } />
        <Tab.Screen name="Profile" component={ ProfileScreen } />
      </Tab.Navigator>
      
      {/* WhatsApp FAB Button */}
      <TouchableOpacity
        onPress={handleOpenWhatsApp}
        className="w-12 h-12 absolute bottom-20 right-2 bg-green-500 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Whatsapp color="#FFFFFF" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;