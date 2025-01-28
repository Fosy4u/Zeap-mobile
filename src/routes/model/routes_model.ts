import IReview from "../../modules/user/products/models/review_model";

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

  // USERS
  homeScreen: undefined;
  dashboardScreen: undefined;
  inviteFriendScreen: undefined;

  allCategoryScreen: undefined;
  productListScreen: {screenTitle: string} | undefined;
  productDetailScreen: {productID: string} | undefined;
  measurementScreen: undefined;
  deliveryAddressScreen: undefined;
  reviewListScreen: {reviews: IReview[]; productID: string};
  paymentMethodScreen: undefined;

  cartScreen: undefined;
  savedScreen: undefined;

  profileScreen: undefined;
  profileSetupScreen: undefined;
  personalInformationScreen: undefined;
  editAccountDetailsScreen: undefined;
  editDeliveryAddressScreen: undefined;
  searchItemScreen: undefined;
  searchResultsScreen: undefined;

  // VENDORS
  vendorHomeScreen: undefined;
  vendorDashboardScreen: undefined;
  marketScreen: undefined;
  shopSetupScreen: undefined;
  notificationsScreen: undefined;
  paymentScreen: undefined;
  overviewScreen: undefined;
  promoScreen: undefined;

  vendorProductsScreen: undefined;
  vendorProductDetailsScreen: {productID: string} | undefined;
  addProductScreen: undefined;
  addReadyMadeClothesScreen: undefined;

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