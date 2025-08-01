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

    // Measurement Routes exports
    allBodyMeasurementTemplateRoute,
    singleBodyMeasurementTemplateRoute,
    requiredMeasurementFormFieldsRoute,
    bodyMeasurementEnumsRoute,
    bodyMeasurementGuideRoute,

    // Voucher Routes exports
    getPointsRoute,
    getActiveVouchersRoute,
    getInactiveVouchersRoute,
    convertPointsRoute,

    // Review Routes exports
    getAllReviewsRoute
}

export default baseURL;