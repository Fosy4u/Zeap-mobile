import IReview from "../../modules/general/models/review_model";

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
    // homeScreen: undefined;
    homeScreen: {
        screen?: "Cart" | "Dashboard" | "Saved" | "Profile";
      };
    dashboardScreen: undefined;
    inviteFriendScreen: undefined;

    allCategoryScreen: undefined;
    productListScreen: { screenTitle: string } | undefined;
    productDetailScreen: { productID: string } | undefined;
    measurementScreen: undefined;
    deliveryAddressScreen: undefined;
    reviewListScreen: { reviews: IReview[], productID: string };


    cartScreen: undefined;
    savedScreen: undefined;
    
    userPaymentScreen: undefined;
    // paymentMethodScreen: undefined;

    profileScreen: undefined;
    profileSetupScreen: undefined;
    personalInformationScreen: undefined;
    editAccountDetailsScreen: undefined;
    editDeliveryAddressScreen: undefined;
    searchItemScreen: undefined;
    searchResultsScreen: undefined;
    userNotificationsScreen: undefined;

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
    paymentScreen: undefined;

  vendorProductsScreen: undefined;
  vendorProductDetailsScreen: {productID: string} | undefined;
  addProductScreen: undefined;
  addBespokeClothesScreen: undefined;
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