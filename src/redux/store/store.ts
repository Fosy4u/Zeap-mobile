import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../modules/auths/slices/authState_slice";
import createReducer from "../../modules/user/cart/slices/cart_slice";
import homeReducer from "../../modules/user/home/slices/home_slice";
import productReducer from "../../modules/user/products/slices/product_slice";
import measurementReducer from "../../modules/user/measurements/slices/measurement_slice";
import profileReducer from "../../modules/profile/slices/profileState_slice";
import generalReducer from "../../modules/general/slices/general_slice";
import vendorHomeReducer from "../../modules/vendor/home/slices/vendorHome_slice";
import vendorGeneralReducer from "../../modules/vendor/general/slices/general_slice";
import notificationsReducer from "../../modules/vendor/notifications/slices/notifications_slice";
import paymentReducer from "../../modules/vendor/payments/slices/payment_slice";
import vendorProductReducer from "../../modules/vendor/products/slices/vendorProduct_slice";
import api from "../api/api";


const appStore = configureStore({
    reducer: {
        //  General
        authState: authReducer,
        profileState: profileReducer,
        generalState: generalReducer,

        //  Users
        cartState: createReducer,
        homeState: homeReducer,
        productState: productReducer,
        measurementState: measurementReducer,

        //  Vendors
        vendorHomeState: vendorHomeReducer,
        vendorGeneralState: vendorGeneralReducer,
        notificationsState: notificationsReducer,
        paymentState: paymentReducer,
        vendorProductState: vendorProductReducer,

        [api.reducerPath]: api.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat([
        api.middleware
    ]),
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
// setupListeners(appStore.dispatch);

export default appStore;