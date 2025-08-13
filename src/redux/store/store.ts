import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../modules/auths/slices/authState_slice";
import dashboardWrapperReducer from "../../modules/user/home/slices/dashboardWrapper_slice";
import productReducer from "../../modules/user/products/slices/product_slice";
import measurementReducer from "../../modules/user/measurements/slices/measurement_slice";
import addressReducer from "../../modules/user/address/slices/address_slice";
import profileReducer from "../../modules/profile/slices/profileState_slice";
import generalReducer from "../../modules/general/slices/general_slice";
import cartReducer from "../../modules/user/cart/slices/cart_slice";
import orderReducer from "../../modules/user/orders/slices/order_slice";
import pointAndVoucherReducer from "../../modules/user/pointAndVoucher/slices/pointAndVoucher_slice";
import vendorHomeReducer from "../../modules/vendor/home/slices/vendorHome_slice";
import vendorGeneralReducer from "../../modules/vendor/general/slices/general_slice";
import paymentReducer from "../../modules/vendor/payments/slices/payment_slice";
import vendorProductReducer from "../../modules/vendor/products/slices/vendorProductState_slice";
import settingsReducer from "../../modules/settings/slices/settingsState_slice";
import notificationsReducer from "../../modules/notifications/slices/notifications_slice";
import rootAPI from "../api/rootAPI.ts";
import reviewAndRatingReducer from "../../modules/user/raviewAndRating/slices/reviewAndRating_slice";


const appStore = configureStore({
    reducer: {
        //  General
        authState: authReducer,
        profileState: profileReducer,
        generalState: generalReducer,
        settingsState: settingsReducer,

        //  Users
        dashboardWrapperState: dashboardWrapperReducer,
        productState: productReducer,
        measurementState: measurementReducer,
        addressState: addressReducer,
        cartState: cartReducer,
        orderState: orderReducer,
        pointAndVoucherState: pointAndVoucherReducer,
        reviewAndRatingState: reviewAndRatingReducer,

        //  Vendors
        vendorHomeState: vendorHomeReducer,
        vendorGeneralState: vendorGeneralReducer,
        notificationsState: notificationsReducer,
        paymentState: paymentReducer,
        vendorProductState: vendorProductReducer,

        [rootAPI.reducerPath]: rootAPI.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat([
        rootAPI.middleware
    ]),
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
// setupListeners(appStore.dispatch);

export default appStore;
