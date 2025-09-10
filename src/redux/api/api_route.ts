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
const getNotificationsRoute = "/notification/inbox";
const markNotificationAsReadRoute = "/notifications/markAsRead";
const deleteNotificationRoute = "/notification/inbox/delete";




//////////////////////////////////////////////////////////////////////////////////////////////////////
//  USER ROUTES
/////////////////////////////////////////////////////////////////////////////////////////////////////
//  Measurement Routes
const allBodyMeasurementTemplateRoute = "/bodyMeasurementTemplate/authUser";
const singleBodyMeasurementTemplateRoute = "/bodyMeasurementTemplate";
const requiredMeasurementFormFieldsRoute = "/bodyMeasurement/product";
const bodyMeasurementEnumsRoute = "/bodyMeasurementEnums";
const bodyMeasurementGuideRoute = "/bodyMeasurementGuide/bespoke";

// Product Routes
const liveProductsRoute = "/products/live";
const newestProductsRoute = "/products/live/newest";
const popularProductsRoute = "/products/live/mostPopular";
const recommendedProductsRoute = "/products/live/recommended";
const searchProductsRoute = "/products/live/searchProducts";
const addProductToCartRoute = "/basket/product/add";
const promoProductRoute = "/promos/live";
const productPromotionRoute = "/product/promo";
const recentlyViewedProductsRoute = "/products/recentViews";
const sizeGuideRoute = "/bodyMeasurementGuide/readyMade";
const dynamicFiltersRoute = "/products/dynamicFilters";


// Voucher Routes
const getPointsRoute = "/point/authUser";
const getActiveVouchersRoute = "/vouchers/authUser/active";
const getInactiveVouchersRoute = "/vouchers/authUser/inactive";
const convertPointsRoute = "/point/convert/voucher";

// Review Routes
const getAllReviewsRoute = "/reviews/user";





//////////////////////////////////////////////////////////////////////////////////////////////////////
//  VENDOR ROUTES
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Order Routes
const getVendorOrdersRoute = "/orders/authUser/vendor";
const updateOrderStatusRoute = "/order/status";
const orderHistoryRoute = "/orders/product-order/status/history"







export {
    // Auth Routes exports
    registerUserRoute,
    loginUserRoute,
    mergeUserDataRoute,
    forgotPasswordRoute,
    
    // Notification Routes exports
    getNotificationsRoute,
    markNotificationAsReadRoute,
    deleteNotificationRoute,


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //  USER ROUTES
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // Measurement Routes exports
    allBodyMeasurementTemplateRoute,
    singleBodyMeasurementTemplateRoute,
    requiredMeasurementFormFieldsRoute,
    bodyMeasurementEnumsRoute,
    bodyMeasurementGuideRoute,

    // Product Routes exports
    liveProductsRoute,
    newestProductsRoute,
    popularProductsRoute,
    addProductToCartRoute,
    promoProductRoute,
    productPromotionRoute,
    recommendedProductsRoute,
    recentlyViewedProductsRoute,
    sizeGuideRoute,
    searchProductsRoute,
    dynamicFiltersRoute,

    // Voucher Routes exports
    getPointsRoute,
    getActiveVouchersRoute,
    getInactiveVouchersRoute,
    convertPointsRoute,

    // Review Routes exports
    getAllReviewsRoute,


    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //  VENDOR ROUTES
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // Order Routes exports
    getVendorOrdersRoute,
    updateOrderStatusRoute,
    orderHistoryRoute,
}

export default baseURL;