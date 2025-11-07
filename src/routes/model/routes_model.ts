import IReviewAndRating from "../../modules/general/models/review_model";
import IReviewIndicator from "../../modules/general/models/reviewIndicator_model";
import IPaymentReferenceParams from "../../modules/user/payment/models/paymentReferenceParams_model";
import IOrder from "../../modules/vendor/orders/models/oder_model";

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
    screen?: "Dashboard" | "Cart" | "Saved" | "Profile";
  };

  inviteFriendScreen: undefined;

  allCategoryScreen: undefined;
  productListScreen: { screenTitle: string } | undefined;
  productDetailScreen: undefined;
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
  
  paystackPaymentScreen: undefined;
  // paymentMethodScreen: undefined;

  profileSetupScreen: undefined;
  personalInformationScreen: undefined;
  editAccountDetailsScreen: undefined;
  searchItemScreen: undefined;
  searchResultsScreen: undefined;
  userNotificationsScreen: undefined;
  userDashboardScreen: undefined;

  // Point & Voucher
  pointAndVoucherScreen: {
    from: string,
    code?: string,
  } | undefined;

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
  orderDetailsScreen: {
    from: string,
    orderId: string,
    itemNumber?: string | undefined,
  } | undefined;

  // VENDORS
  vendorHomeScreen: {
    screen?: "Dashboard" | "Products" | "Orders" | "Profile" | "Market";
    shopId?: string;
  };
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
  vendorOrderDetailsScreen: {
    from: string,
    orderId: string,
    itemNumber?: string | undefined,
  } | undefined;
};

export default RootNavigationStackModel;