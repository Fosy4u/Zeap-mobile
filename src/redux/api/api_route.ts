// Base URL
const baseURL = "https://zeap-api.onrender.com";


//////////////////////////////////////////////////////////////////////////////////////////////////////
//  GENERAL ROUTES
/////////////////////////////////////////////////////////////////////////////////////////////////////
//  Auth Routes
const registerUserRoute = "/user/guest/create";
const loginUserRoute = "/userByUid";
const mergeUserDataRoute = "/user/guest/login/password/merge";
const checkUserEmailRoute = "/user/checkEmail";
const convertGuestToPasswordUserRoute = "/user/guest/convert/emailPassword";

//  Notification Routes
const registerFCMToken = "/notification/pushToken/register";
const getNotificationsRoute = "/notification/inbox";
const markNotificationAsReadRoute = "/notifications/markAsRead";
const markNotificationAsSeenRoute = "/notification/inbox/markAsSeen";
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
const wishAddRoute = "/wish/add";        // POST { productId, color }
const wishListRoute = "/wish/auth/user"; // GET the auth user's wishlist
const wishRemoveRoute = "/wish/remove";  // DELETE { wish_id } — POST is not routed

// Order 
const getOrdersRoute = "/orders/authUser/buyer";
const getOrderDetailsRoute = "/order/authUser/buyer/orderId";
const getOrderHistoryRoute = "/orders/product-order/status/history";
const getProductOrderRoute = "/orders/product";
const cancelOrderRoute = "/order/cancel";


// Voucher Routes
const getPointsRoute = "/point/authUser";
const getActiveVouchersRoute = "/vouchers/authUser/active";
const getInactiveVouchersRoute = "/vouchers/authUser/inactive";
const getVoucherByCodeRoute = "/voucher";
const convertPointsRoute = "/point/convert/voucher";
const applyVoucherRoute = "/voucher/apply";
const removeVoucherRoute = "/voucher/remove";

// Help Routes
const getHelpArticlesRoute = "/help/articles";
const getPopularHelpArticlesRoute = "/help/articles/popular";
const getHelpArticleRoute = "/help/article";
const markHelpArticleHelpfulRoute = "/help/article/update/markHelpful";

// Review Routes
const getAllReviewsRoute = "/reviews/user";
const createReviewRoute = "/review/create";
const updateReviewRoute = "/review/update";




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
const rejectOrderRoute = "/order/reject";
const orderHistoryRoute = "/orders/product-order/status/history"
// const updateOrderStatusRoute = "/orders/authUser/vendor/product/status";
// const orderHistoryRoute = "/orders/authUser/vendor/product/status/history";


// Payments
const getVendorPaymentsRoute = "/shop/revenues";
const getVendorPaymentDetailsRoute = "/vendor/payment";
// const updatePaymentStatusRoute = "/vendor/payment/status";

// Product Routes
// Permanent delete of a draft product (removes it entirely).
const deleteDraftProductRoute = "/product/delete/absolute";
const productCommissionRoute = "/products/commission";







export {
    // Auth Routes exports
    registerUserRoute,
    loginUserRoute,
    mergeUserDataRoute,
    checkUserEmailRoute,
    convertGuestToPasswordUserRoute,
    
    // Notification Routes exports
    registerFCMToken,
    getNotificationsRoute,
    markNotificationAsReadRoute,
    markNotificationAsSeenRoute,
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
    getProductOrderRoute,
    cancelOrderRoute,

    // Voucher Routes exports
    getPointsRoute,
    getActiveVouchersRoute,
    getInactiveVouchersRoute,
    getVoucherByCodeRoute,
    applyVoucherRoute,
    removeVoucherRoute,
    getHelpArticlesRoute,
    getPopularHelpArticlesRoute,
    getHelpArticleRoute,
    markHelpArticleHelpfulRoute,
    convertPointsRoute,

    // Review Routes exports
    getAllReviewsRoute,
    createReviewRoute,
    updateReviewRoute,


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //  VENDOR ROUTES
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // Order Routes exports
    getVendorOrdersRoute,
    getVendorOrderDetailsRoute,
    updateOrderStatusRoute,
    rejectOrderRoute,
    orderHistoryRoute,

    // Payment Routes exports
    getVendorPaymentsRoute,
    getVendorPaymentDetailsRoute,
    // updatePaymentStatusRoute,

    // Product Routes exports
    deleteDraftProductRoute,
    productCommissionRoute,

    // Vendor Onboarding Routes exports
    registerVendorRoute,
    getSellerPoliciesRoute,
    getAuthShopRoute,
    getOnboardingDocumentsRoute,
    uploadOnboardingDocumentRoute,
}

export default baseURL;