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
import SignUpScreen from '../modules/auths/screen/signup_screen';
import ProfileSetupScreen from '../modules/setting/screen/profileSetup_screen';
import ShopSetupScreen from '../modules/setting/screen/shopSetup_screen';
import HomeScreen from '../modules/home/screens/home_screen';
import DashboardScreen from '../modules/home/screens/dashboard_screen';
import CartScreen from '../modules/cart/screen/cart_screen';
import SavedScreen from '../modules/saved/screen/saved_screen';
import ProfileScreen from '../modules/profile/screen/profile_screen';
import CategoryScreen from '../modules/home/screens/category_screen';

const Stack = createNativeStackNavigator<RootNavigationStackModel>();

const AppRoutes = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="homeScreen">

            {/* ==== Splash & Onboarding ==== */}
            <Stack.Screen name ="splashScreen" component={ SplashScreen } options={{ headerShown: false }} />
            <Stack.Screen name="onboardingOneScreen" component={ OnboardingOneScreen } options={{ headerShown: false }} />
            <Stack.Screen name="welcomeScreen" component={ WelcomeScreen } options={{ headerShown: false }} />

            {/* ==== Auths ==== */}
            <Stack.Screen name="loginScreen" component={ LoginScreen } options={{ headerShown: false }} />
            <Stack.Screen name="forgotPasswordScreen" component={ ForgotPasswordScreen } options={{ headerShown: false }} />
            <Stack.Screen name="otpScreen" component={ OTPScreen } options={{ headerShown: false }} />
            <Stack.Screen name="resetPasswordScreen" component={ ResetPasswordScreen } options={{ headerShown: false }} />
            <Stack.Screen name="signUpScreen" component={ SignUpScreen } options={{ headerShown: false }} />

            {/* ==== Home ==== */}
            <Stack.Screen name="homeScreen" component={ HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="dashboardScreen" component={ DashboardScreen } options={{ headerShown: false }} />
            <Stack.Screen name="categoryScreen" component={ CategoryScreen } options={{ headerShown: false }} />

            {/* ==== Cart ==== */}
            <Stack.Screen name="cartScreen" component={ CartScreen } options={{ headerShown: false }} />

            {/* ==== Save ==== */}
            <Stack.Screen name="savedScreen" component={ SavedScreen } options={{ headerShown: false }} />

            {/* ==== Profile ==== */}
            <Stack.Screen name="profileScreen" component={ ProfileScreen } options={{ headerShown: false }} />

            {/* ==== Settings ==== */}
            <Stack.Screen name="profileSetupScreen" component={ ProfileSetupScreen } options={{ headerShown: false }} />
            <Stack.Screen name="shopSetupScreen" component={ ShopSetupScreen } options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppRoutes;