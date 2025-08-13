import IReviewAndRating from "../../modules/general/models/review_model";
import IReviewIndicator from "../../modules/general/models/reviewIndicator_model";
import IPaymentReferenceParams from "../../modules/user/payment/models/paymentReferenceParams_model";

type RootNavigationStackModel = {
  splashScreen: undefined;
  onboardingOneScreen: undefined;
  welcomeScreen: undefined;

  loginScreen: undefined;
  forgotPasswordScreen: undefined;
  resetPasswordScreen: undefined;
  otpScreen: undefined;
  resetPasswordSuccessPopupModal: undefined;
  signUpScreen: undefined;
  loginInfoScreen: undefined;

    // USERS
    // homeScreen: undefined;
    homeScreen: {
        screen?: "Cart" | "Dashboard" | "Saved" | "Profile";
      };

    inviteFriendScreen: undefined;

    allCategoryScreen: undefined;
    productListScreen: { screenTitle: string } | undefined;
    productDetailScreen: { productID: string } | undefined;
    measurementScreen: undefined;
    reviewListScreen: {
      reviewAndRating: IReviewAndRating,
      reviewIndicators: IReviewIndicator[],
      productID: string
    };

    // Address Routes
    addressScreen: undefined;
    editDeliveryAddressScreen: undefined;

    checkoutScreen: undefined;
    deliveryMethodScreen: undefined;
    
    userPaymentScreen: { data: IPaymentReferenceParams } | undefined;
    // paymentMethodScreen: undefined;

    profileSetupScreen: undefined;
    personalInformationScreen: undefined;
    editAccountDetailsScreen: undefined;
    searchItemScreen: undefined;
    searchResultsScreen: undefined;
    userNotificationsScreen: undefined;
    userDashboardScreen: undefined;

    // Point & Voucher
    pointAndVoucherScreen: undefined;

    // Review & Rating
    reviewAndRatingScreen: undefined;
    rateAndReviewScreen: { productData: any } | undefined;

    // Settings
    settingsScreen: undefined;
    languageSettingsScreen: undefined;
    currencySettingsScreen: undefined;
    notificationSettingsScreen: undefined;
    securitySettingsScreen: undefined;
    changePasswordSettingsScreen: undefined;

    // Order Routes
    ordersScreen: undefined;
    orderDetailsScreen: undefined;

    

    // VENDORS
    vendorHomeScreen: {
      screen?: "Dashboard" | "Products" | "Orders" | "Profile" | "Market";
    };
    vendorDashboardScreen: undefined;
    marketScreen: undefined;
    shopSetupScreen: undefined;
    vendorNotificationsScreen: undefined;
    overviewScreen: undefined;
    promoScreen: undefined;
    promotionScreen: undefined;
    paymentScreen: undefined;

  vendorProductsScreen: undefined;
  vendorProductDetailsScreen: {productID: string} | undefined;
  addProductScreen: undefined;
  addBespokeClothesScreen: undefined;
  addReadyMadeClothesScreen: undefined;
  addBespokeShoesScreen: undefined;
  addReadyMadeShoesScreen: undefined;
  addAccessoriesScreen: undefined;

  orderRequestsScreen: undefined;
  OrdersScreen: {screenTitle: string} | undefined;
  orderRequestDetailsScreen: {
    orderId: string;
    order: {
      productImage: string;
      productName: string;
      date: string;
      status: string;
      orderBy: string;
      time: string;
      amount: number;
    };
  };
};

export default RootNavigationStackModel;