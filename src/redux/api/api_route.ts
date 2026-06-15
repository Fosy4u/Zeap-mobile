// Base URL
const baseURL = "https://zeap-api.onrender.com";


//////////////////////////////////////////////////////////////////////////////////////////////////////
//  GENERAL ROUTES
/////////////////////////////////////////////////////////////////////////////////////////////////////
//  Auth Routes
const registerUserRoute = "/user/guest/create";
const loginUserRoute = "/userByUid";
const mergeUserDataRoute = "/user/guest/login/password/merge";
const forgotPasswordRoute = "";

//  Notification Routes
const registerFCMToken = "/notification/pushToken/register";
const getNotificationsRoute = "/notification/inbox";
const markNotificationAsReadRoute = "/notifications/markAsRead";
const deleteNotificationRoute = "/notification/inbox/delete";




//////////////////////////////////////////////////////////////////////////////////////////////////////
//  USER ROUTES
/////////////////////////////////////////////////////////////////////////////////////////////////////
//  Measurement Routes
const allBodyMeasurementTemplateRoute = "/bodyMeasurementTemplate/authUser";
const singleBodyMeasurementTemplateRoute = "/bodyMeasurementTemplate";
const updateBodyMeasurementTemplateRoute = "/bodyMeasurementTemplate/update";
const deleteBodyMeasurementTemplateRoute = "/bodyMeasurementTemplate/delete";
const requiredMeasurementFormFieldsRoute = "/bodyMeasurement/product";
const bodyMeasurementEnumsRoute = "/bodyMeasurementEnums";
const bodyMeasurementGuideRoute = "/bodyMeasurementGuide/bespoke";

// Product Routes
const filterProductsRoute = "/products/live";
const searchProductsRoute = "/products/live/searchProducts";
const addProductToCartRoute = "/basket/product/add";
const promoProductRoute = "/promos/live";
const productPromotionRoute = "/product/promo";
const recentlyViewedProductsRoute = "/products/recentViews";
const sizeGuideRoute = "/bodyMeasurementGuide/readyMade";
const dynamicFiltersRoute = "/products/list/dynamicFilters";

// Wishlist Routes
// `/wish/add` (POST { productId, color }) and `/wish/auth/user` (GET list) are
// confirmed. The remove URL follows the same convention — CONFIRM/ADJUST.
const wishAddRoute = "/wish/add";
const wishListRoute = "/wish/auth/user"; // GET the auth user's wishlist
const wishRemoveRoute = "/wish/remove";  // ASSUMED: POST { productId } to unsave

// Order 
const getOrdersRoute = "/orders/authUser/buyer";
const getOrderDetailsRoute = "/order/authUser/buyer/orderId";
const getOrderHistoryRoute = "/orders/product-order/status/history";


// Voucher Routes
const getPointsRoute = "/point/authUser";
const getActiveVouchersRoute = "/vouchers/authUser/active";
const getInactiveVouchersRoute = "/vouchers/authUser/inactive";
const getVoucherByCodeRoute = "/voucher";
const convertPointsRoute = "/point/convert/voucher";

// Review Routes
const getAllReviewsRoute = "/reviews/user";




//////////////////////////////////////////////////////////////////////////////////////////////////////
//  VENDOR ONBOARDING ROUTES
/////////////////////////////////////////////////////////////////////////////////////////////////////
const registerVendorRoute = "/shop/create";
const getSellerPoliciesRoute = "/policy/seller";
const getAuthShopRoute = "/shop/auth";
const getOnboardingDocumentsRoute = "/shop/onboarding-documents";
const uploadOnboardingDocumentRoute = "/shop/onboarding-document/add";





//////////////////////////////////////////////////////////////////////////////////////////////////////
//  VENDOR ROUTES
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Order Routes
const getVendorOrdersRoute = "/orders/authUser/vendor";
const getVendorOrderDetailsRoute = "/orders/authUser/vendor/product";
const updateOrderStatusRoute = "/order/status";
const orderHistoryRoute = "/orders/product-order/status/history"
// const updateOrderStatusRoute = "/orders/authUser/vendor/product/status";
// const orderHistoryRoute = "/orders/authUser/vendor/product/status/history";


// Payments
const getVendorPaymentsRoute = "/shop/revenues";
const getVendorPaymentDetailsRoute = "/vendor/payment";
// const updatePaymentStatusRoute = "/vendor/payment/status";







export {
    // Auth Routes exports
    registerUserRoute,
    loginUserRoute,
    mergeUserDataRoute,
    forgotPasswordRoute,
    
    // Notification Routes exports
    registerFCMToken,
    getNotificationsRoute,
    markNotificationAsReadRoute,
    deleteNotificationRoute,


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //  USER ROUTES
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // Measurement Routes exports
    allBodyMeasurementTemplateRoute,
    singleBodyMeasurementTemplateRoute,
    updateBodyMeasurementTemplateRoute,
    deleteBodyMeasurementTemplateRoute,
    requiredMeasurementFormFieldsRoute,
    bodyMeasurementEnumsRoute,
    bodyMeasurementGuideRoute,

    // Product Routes exports
    filterProductsRoute,
    searchProductsRoute,
    addProductToCartRoute,
    promoProductRoute,
    productPromotionRoute,
    recentlyViewedProductsRoute,
    sizeGuideRoute,
    dynamicFiltersRoute,

    // Wishlist Routes exports
    wishAddRoute,
    wishListRoute,
    wishRemoveRoute,

    // Order Routes exports
    getOrdersRoute,
    getOrderDetailsRoute,
    getOrderHistoryRoute,

    // Voucher Routes exports
    getPointsRoute,
    getActiveVouchersRoute,
    getInactiveVouchersRoute,
    getVoucherByCodeRoute,
    convertPointsRoute,

    // Review Routes exports
    getAllReviewsRoute,


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //  VENDOR ROUTES
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // Order Routes exports
    getVendorOrdersRoute,
    getVendorOrderDetailsRoute,
    updateOrderStatusRoute,
    orderHistoryRoute,

    // Payment Routes exports
    getVendorPaymentsRoute,
    getVendorPaymentDetailsRoute,
    // updatePaymentStatusRoute,

    // Vendor Onboarding Routes exports
    registerVendorRoute,
    getSellerPoliciesRoute,
    getAuthShopRoute,
    getOnboardingDocumentsRoute,
    uploadOnboardingDocumentRoute,
}

export default baseURL;