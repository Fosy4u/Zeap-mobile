import React, { useEffect } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Whatsapp } from 'iconsax-react-native';

import CartScreen from '../../cart/screens/cart_screen';
import DashboardWrapperScreen from './dashboardWrapper_screen';
import SavedScreen from '../../saved/screen/saved_screen';
import ProfileScreen from '../../../profile/screens/profile_screen';
import AppBottomBarComponent from '../components/appBottomBar_component';
import useHomeHook from '../hooks/home_hook';
import useCartHook from '../../cart/hooks/cart_hook';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const { handleOpenWhatsApp } = useHomeHook();
  const { handleGetCarts } = useCartHook();
  const { currencyRefreshToken } = useDisplayCurrency();

  // Prewarm the cart on login/home mount: a single background fetch that
  // populates `cartState.cart` in Redux. This drives the bottom-bar Cart
  // badge (a live selector) so the count is correct before the user ever
  // opens the Cart tab, and seeds the cart state so the Cart screen renders
  // its items instantly while it refetches in the background on focus.
  useEffect(() => {
    handleGetCarts();
    // Run once per mount — the badge stays in sync afterwards via cart
    // mutations (add/remove/quantity) that update the same Redux state, and
    // again on a currency switch so the cart totals come back re-priced.
  }, [currencyRefreshToken]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => <AppBottomBarComponent {...props} />}
        screenOptions={{
          headerShown: false,
          /* Freeze the 3 inactive tabs so cart/Redux updates don't re-render
             them while the user is on another tab. */
          freezeOnBlur: true,
        }}
      >
        <Tab.Screen name="Home" component={ DashboardWrapperScreen } />
        <Tab.Screen name="Cart" component={ CartScreen } />
        <Tab.Screen name="Saved" component={ SavedScreen } />
        {/* See the vendor stack's Profile tab — `mode` drives which app bar
            ProfileScreen renders. */}
        <Tab.Screen
          name="Profile"
          component={ ProfileScreen }
          initialParams={{ mode: "buyer" }}
        />
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