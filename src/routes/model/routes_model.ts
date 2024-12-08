import IReview from "../../modules/user/product/models/review_model";

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
    productListScreen: { screenTitle: string } | undefined;
    productDetailScreen: { productID: string } | undefined;
    measurementScreen: undefined;
    deliveryAddressScreen: undefined;
    reviewListScreen: { reviews: IReview[], productID: string };
    paymentMethodScreen: undefined;

    cartScreen: undefined;
    savedScreen: undefined;

    profileScreen: undefined;
    profileSetupScreen: undefined;
    personalInformationScreen: undefined;
    editAccountDetailsScreen: undefined;
    editDeliveryAddressScreen: undefined;

    // VENDORS
    vendorHomeScreen: undefined;
    vendorDashboardScreen: undefined;
    itemsScreen: undefined;
    marketScreen: undefined;
    shopSetupScreen: undefined;
    notificationsScreen: undefined;
};

export default RootNavigationStackModel;