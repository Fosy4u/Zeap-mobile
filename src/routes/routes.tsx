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
import LoginInfoScreen from '../modules/auths/screen/loginInfo_screen';
import ProfileSetupScreen from '../modules/profile/screens/profileSetup_screen.tsx';
import ShopSetupScreen from "../modules/vendor/setting/screen/shopSetup_screen";
import HomeScreen from '../modules/user/home/screens/home_screen';
import CategoryScreen from '../modules/user/products/screens/allCategory_screen.tsx';
import ProductListScreen from '../modules/user/products/screens/productList_screen .tsx';
import InviteFriendScreen from '../modules/user/home/screens/inviteFriend_screen ';
import ProductDetailScreen from '../modules/user/products/screens/productDetails_screen.tsx';
import MeasurementScreen from '../modules/user/measurements/screens/measurement_screen.tsx';
import VendorHomeScreen from '../modules/vendor/home/screens/vendorHome_screen';
import MarketScreen from '../modules/vendor/market/screens/market_screen';
import VendorDashboardScreen from '../modules/vendor/home/screens/vendorDashboard_screen';
import VendorNotificationsScreen from '../modules/notifications/screens/notifications_screen';
import ReviewListScreen from '../modules/general/screens/reviewList_screen.tsx';
import PersonalInformationScreen from '../modules/profile/screens/personalInformation_screen.tsx';
import EditAccountDetailsScreen from '../modules/profile/screens/editAccountDetails_screen.tsx';
import EditDeliveryAddressScreen from '../modules/user/address/screens/editDeliveryAddress_screen.tsx';
import PaymentScreen from '../modules/vendor/payments/screens/payment_screen';
import OverviewScreen from '../modules/vendor/home/screens/overview_screen';
import PromoScreen from '../modules/vendor/products/screens/promo_screen.tsx';
import VendorProductsScreen from "../modules/vendor/products/screens/vendorProducts_screen.tsx";
import VendorProductDetailsScreen from "../modules/vendor/products/screens/vendorProductDetails_screen.tsx";
import AddProductScreen from "../modules/vendor/products/screens/addProduct_screen.tsx";
import AddReadyMadeClothesScreen from "../modules/vendor/products/screens/addReadyMadeClothes_screen.tsx";
import SearchItemScreen from '../modules/user/products/screens/searchItem_screen.tsx';
import SearchResultsScreen from '../modules/user/products/screens/searchResults_screen.tsx';
import UserPaymentScreen from '../modules/user/payment/screens/userPayment_screen.tsx';
import UserNotificationsScreen from '../modules/notifications/screens/notifications_screen.tsx';
import VendorOrderDetailsScreen from '../modules/vendor/orders/screens/orderDetails_screen.tsx';
import OrdersScreen from '../modules/vendor/orders/screens/orders_screen.tsx';
import AddBespokeClothesScreen from '../modules/vendor/products/screens/addBespokeClothes_screen.tsx';
import AddBespokeShoesScreen from '../modules/vendor/products/screens/addBespokeShoes_screen.tsx';
import AddReadyMadeShoesScreen from '../modules/vendor/products/screens/addReadyMadeShoes_screen.tsx';
import AddAccessoriesScreen from '../modules/vendor/products/screens/addAccessories_screen.tsx';
import PromotionScreen from '../modules/vendor/products/screens/promotion_screen.tsx';
import UserOrdersScreen from '../modules/user/orders/screens/orders_screen';
import UserOrderDetailsScreen from '../modules/user/orders/screens/orderDetails_screen';
import AddressScreen from '../modules/user/address/screens/address_screen.tsx';
import CheckoutScreen from '../modules/user/cart/screens/checkout_screen.tsx';
import SettingsScreen from '../modules/settings/screens/settings_screen.tsx';
import CurrencySettingsScreen from '../modules/settings/screens/currencySettings_screen.tsx';
import LanguageSettingsScreen from '../modules/settings/screens/languageSettings_screen.tsx';
import NotificationSettingsScreen from '../modules/settings/screens/notificationSettings_screen.tsx';
import SecuritySettingsScreen from '../modules/settings/screens/securitySettings_screen.tsx';
import ChangePasswordSettingsScreen from '../modules/settings/screens/changePasswordSettings_screen.tsx';
import UserDashboardScreen from '../modules/profile/screens/userDashboard_screen.tsx';
import PointAndVoucherScreen from '../modules/user/pointAndVoucher/screens/pointAndVoucher_screen.tsx';
import ReviewAndRatingScreen from '../modules/user/raviewAndRating/screens/reviewAndRating_screen.tsx';
import RateAndReviewScreen from '../modules/user/raviewAndRating/screens/rateAndReview_screen.tsx';

const Stack = createNativeStackNavigator<RootNavigationStackModel>();

const AppRoutes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="splashScreen">
        {/* ==== Splash & Onboarding ==== */}
        <Stack.Screen
          name="splashScreen" component={SplashScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="onboardingOneScreen" component={OnboardingOneScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="welcomeScreen" component={WelcomeScreen} options={{ headerShown: false }}
        />

        {/* ==== Auths ==== */}
        <Stack.Screen
          name="loginScreen" component={LoginScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="otpScreen" component={OTPScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="resetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="signUpScreen" component={RegisterScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="loginInfoScreen" component={LoginInfoScreen} options={{ headerShown: false }}
        />

        {/**
         * USERS ROUTES
         */}
        {/* ==== Home ==== */}
        <Stack.Screen
          name="homeScreen" component={HomeScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="inviteFriendScreen" component={InviteFriendScreen} options={{ headerShown: false }}
        />

        {/* ==== Product ==== */}
        <Stack.Screen name="allCategoryScreen" component={CategoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="productListScreen" component={ProductListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="productDetailScreen" component={ProductDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="reviewListScreen" component={ReviewListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="searchItemScreen" component={SearchItemScreen} options={{ headerShown: false }} />
        <Stack.Screen name="searchResultsScreen" component={SearchResultsScreen} options={{ headerShown: false }} />

        {/*==== Measurement ====*/}
        <Stack.Screen
          name="measurementScreen" component={MeasurementScreen} options={{ headerShown: false }}
        />

        {/* ==== Cart Checkout ==== */}
        <Stack.Screen name="checkoutScreen" component={CheckoutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="deliveryMethodScreen" component={AddressScreen} options={{ headerShown: false }} />

        {/*==== Address ====*/}
        <Stack.Screen name="addressScreen" component={AddressScreen} options={{ headerShown: false }} />

        {/*==== User Payment ====*/}
        <Stack.Screen name="userPaymentScreen" component={UserPaymentScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="paymentMethodScreen" component={ PaymentMethodScreen } options={{ headerShown: false }} /> */}

        {/* ==== Profile ==== */}
        <Stack.Screen name="profileSetupScreen" component={ProfileSetupScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="personalInformationScreen" component={PersonalInformationScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="editAccountDetailsScreen" component={EditAccountDetailsScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="editDeliveryAddressScreen" component={EditDeliveryAddressScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="userDashboardScreen" component={UserDashboardScreen} options={{ headerShown: false }}
        />

        {/* ==== Points & Vouchers ==== */}
        <Stack.Screen name="pointAndVoucherScreen" component={PointAndVoucherScreen} options={{ headerShown: false }} />

        {/* ==== Review & Rating ==== */}
        <Stack.Screen name="reviewAndRatingScreen" component={ReviewAndRatingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="rateAndReviewScreen" component={RateAndReviewScreen} options={{ headerShown: false }} />

        {/* ==== Settings ==== */}
        <Stack.Screen name="userNotificationsScreen" component={UserNotificationsScreen} options={{ headerShown: false }} />

        {/* ==== Orders ==== */}
        <Stack.Screen name="ordersScreen" component={UserOrdersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="orderDetailsScreen" component={UserOrderDetailsScreen} options={{ headerShown: false }} />

        {/**
         * VENDORS ROUTES
         */}
        {/* ==== Home ==== */}
        <Stack.Screen
          name="vendorHomeScreen" component={VendorHomeScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="vendorDashboardScreen" component={VendorDashboardScreen} options={{ headerShown: false }}
        />

        {/* ==== Products ==== */}
        <Stack.Screen
          name="vendorProductsScreen" component={VendorProductsScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="vendorProductDetailsScreen" component={VendorProductDetailsScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="addProductScreen" component={AddProductScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="addBespokeClothesScreen" component={AddBespokeClothesScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="addReadyMadeClothesScreen" component={AddReadyMadeClothesScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="addBespokeShoesScreen" component={AddBespokeShoesScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="addReadyMadeShoesScreen" component={AddReadyMadeShoesScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="addAccessoriesScreen" component={AddAccessoriesScreen} options={{ headerShown: false }}
        />

        {/* ==== Orders ==== */}
        <Stack.Screen
          name="orderRequestsScreen" component={OrdersScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="vendorOrderDetailsScreen" component={VendorOrderDetailsScreen} options={{ headerShown: false }}
        />

        {/* ==== Market ==== */}
        <Stack.Screen
          name="marketScreen" component={MarketScreen}  options={{ headerShown: false }}
        />
        <Stack.Screen
          name="shopSetupScreen" component={ShopSetupScreen} options={{ headerShown: false }}
        />

        {/* ==== Others ==== */}
        <Stack.Screen name="vendorNotificationsScreen" component={VendorNotificationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="paymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="overviewScreen" component={OverviewScreen} options={{ headerShown: false }} />
        <Stack.Screen name="promoScreen" component={PromoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="promotionScreen" component={PromotionScreen} options={{ headerShown: false }} />

        {/* ==== Settings ==== */}
        <Stack.Screen name="settingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="languageSettingsScreen" component={LanguageSettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="currencySettingsScreen" component={CurrencySettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="notificationSettingsScreen" component={NotificationSettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="securitySettingsScreen" component={SecuritySettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="changePasswordSettingsScreen" component={ChangePasswordSettingsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;