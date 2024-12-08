import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootNavigationStackModel from './model/routes_model';

// Import Screens.
import SplashScreen from '../modules/splash/screens/splash_screen';
import OnboardingOneScreen from '../modules/onboarding/screens/onboarding_screen';
import WelcomeScreen from "../modules/onboarding/screens/welcome_screen";
import LoginScreen from "../modules/auths/screen/login_screen";
import ForgotPasswordScreen from '../modules/auths/screen/forgotPassword_screen';
import OTPScreen from '../modules/auths/screen/otp_screen';
import ResetPasswordScreen from '../modules/auths/screen/resetPassword_screen';
import RegisterScreen from '../modules/auths/screen/register_screen';
import ProfileSetupScreen from '../modules/profile/screen/profileSetup_screen';
import ShopSetupScreen from "../modules/vendor/setting/screen/shopSetup_screen";
import HomeScreen from '../modules/user/home/screens/home_screen';
import DashboardScreen from '../modules/user/home/screens/dashboard_screen';
import CartScreen from '../modules/user/cart/screen/cart_screen';
import SavedScreen from '../modules/user/saved/screen/saved_screen';
import ProfileScreen from '../modules/profile/screen/profile_screen';
import CategoryScreen from '../modules/user/product/screen/allCategory_screen';
import ProductListScreen from '../modules/user/product/screen/productList_screen ';
import InviteFriendScreen from '../modules/user/home/screens/inviteFriend_screen ';
import ProductDetailScreen from '../modules/user/product/screen/productDetails_screen';
import MeasurementScreen from '../modules/user/product/screen/measurement_screen';
import DeliveryAddressScreen from '../modules/user/product/screen/deliveryAddress_screen';
import VendorHomeScreen from '../modules/vendor/home/screens/vendorHome_screen';
import ItemsScreen from '../modules/vendor/items/screens/items_screen';
import MarketScreen from '../modules/vendor/market/screens/market_screen';
import VendorDashboardScreen from '../modules/vendor/home/screens/vendorDashboard_screen';
import NotificationsScreen from '../modules/vendor/notifications/screens/notifications_screen';
import PaymentMethodScreen from '../modules/user/product/screen/paymentMethod_screen';
import ReviewListScreen from '../modules/user/product/screen/reviewList_screen';
import PersonalInformationScreen from '../modules/profile/screen/personalInformation_screen';
import EditAccountDetailsScreen from '../modules/profile/screen/editAccountDetails_screen';
import EditDeliveryAddressScreen from '../modules/profile/screen/editDeliveryAddress_screen';

const Stack = createNativeStackNavigator<RootNavigationStackModel>();

const AppRoutes = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="splashScreen">

            {/* ==== Splash & Onboarding ==== */}
            <Stack.Screen name ="splashScreen" component={ SplashScreen } options={{ headerShown: false }} />
            <Stack.Screen name="onboardingOneScreen" component={ OnboardingOneScreen } options={{ headerShown: false }} />
            <Stack.Screen name="welcomeScreen" component={ WelcomeScreen } options={{ headerShown: false }} />

            {/* ==== Auths ==== */}
            <Stack.Screen name="loginScreen" component={ LoginScreen } options={{ headerShown: false }} />
            <Stack.Screen name="forgotPasswordScreen" component={ ForgotPasswordScreen } options={{ headerShown: false }} />
            <Stack.Screen name="otpScreen" component={ OTPScreen } options={{ headerShown: false }} />
            <Stack.Screen name="resetPasswordScreen" component={ ResetPasswordScreen } options={{ headerShown: false }} />
            <Stack.Screen name="signUpScreen" component={ RegisterScreen } options={{ headerShown: false }} />


            {/**
             * USERS ROUTES
             */}
            {/* ==== Home ==== */}
            <Stack.Screen name="homeScreen" component={ HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="dashboardScreen" component={ DashboardScreen } options={{ headerShown: false }} />
            <Stack.Screen name="inviteFriendScreen" component={ InviteFriendScreen } options={{ headerShown: false }} />

            {/* ==== Product ==== */}
            <Stack.Screen name="allCategoryScreen" component={ CategoryScreen } options={{ headerShown: false }} />
            <Stack.Screen name="productListScreen" component={ ProductListScreen } options={{ headerShown: false }} />
            <Stack.Screen name="productDetailScreen" component={ ProductDetailScreen } options={{ headerShown: false }} />
            <Stack.Screen name="measurementScreen" component={ MeasurementScreen } options={{ headerShown: false }} />
            <Stack.Screen name="deliveryAddressScreen" component={ DeliveryAddressScreen } options={{ headerShown: false }} />
            <Stack.Screen name="reviewListScreen" component={ ReviewListScreen } options={{ headerShown: false }} />
            <Stack.Screen name="paymentMethodScreen" component={ PaymentMethodScreen } options={{ headerShown: false }} />

            {/* ==== Cart ==== */}
            <Stack.Screen name="cartScreen" component={ CartScreen } options={{ headerShown: false }} />

            {/* ==== Save ==== */}
            <Stack.Screen name="savedScreen" component={ SavedScreen } options={{ headerShown: false }} />

            {/* ==== Profile ==== */}
            <Stack.Screen name="profileScreen" component={ ProfileScreen } options={{ headerShown: false }} />
            <Stack.Screen name="personalInformationScreen" component={ PersonalInformationScreen } options={{ headerShown: false }} />
            <Stack.Screen name="editAccountDetailsScreen" component={ EditAccountDetailsScreen } options={{ headerShown: false }} />
            <Stack.Screen name="editDeliveryAddressScreen" component={ EditDeliveryAddressScreen } options={{ headerShown: false }} />

            {/* ==== Settings ==== */}
            <Stack.Screen name="profileSetupScreen" component={ ProfileSetupScreen } options={{ headerShown: false }} />



            {/**
             * VENDORS ROUTES
             */}
            {/* ==== Home ==== */}
            <Stack.Screen name="vendorHomeScreen" component={ VendorHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="vendorDashboardScreen" component={ VendorDashboardScreen } />

            {/* ==== Items ==== */}
            <Stack.Screen name="itemsScreen" component={ ItemsScreen} options={{ headerShown: false }} />

            {/* ==== Market ==== */}
            <Stack.Screen name="marketScreen" component={ MarketScreen } options={{ headerShown: false }} />

            {/* ==== Settings ==== */}
            <Stack.Screen name="shopSetupScreen" component={ ShopSetupScreen } options={{ headerShown: false }} />

            {/* ==== Notifications ==== */}
            <Stack.Screen name="notificationsScreen" component={ NotificationsScreen } options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppRoutes;