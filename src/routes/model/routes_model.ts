import IReviewAndRating from "../../modules/general/models/review_model";
import IReviewIndicator from "../../modules/general/models/reviewIndicator_model";

type RootNavigationStackModel = {
  splashScreen: undefined;
  onboardingOneScreen: undefined;
  welcomeScreen: undefined;

  loginScreen: undefined;
  forgotPasswordScreen: undefined;
  signUpScreen: undefined;
  loginInfoScreen: undefined;

  // USERS
  // homeScreen: undefined;
  homeScreen: {
    screen?: "Home" | "Cart" | "Saved" | "Profile";
  };

  inviteFriendScreen: undefined;

  allCategoryScreen: undefined;
  productListScreen: { screenTitle: string } | undefined;
  productDetailScreen: undefined;
  measurementScreen: undefined;
  editMeasurementTemplateScreen: undefined;
  savedMeasurementsScreen: undefined;
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
  receiptScreen: { orderId: string };

  // VENDORS
  vendorOnboardingScreen: undefined;
  vendorRegistrationScreen: undefined;
  vendorWelcomeScreen: undefined;
  vendorDocumentUploadScreen: undefined;
  contactSupportScreen: undefined;
  vendorHomeScreen: {
    screen?: "Dashboard" | "Products" | "Orders" | "Profile" | "Market";
    shopId?: string;
  };
  shopSetupScreen: undefined;
  shopInformationScreen: undefined;
  bankDetailsScreen: undefined;
  shopDocumentsScreen: undefined;
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