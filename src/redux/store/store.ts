import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../modules/auths/slices/authState_slice";
import createReducer from "../../modules/user/cart/slices/cart_slice";
import homeReducer from "../../modules/user/home/slices/home_slice";
import productReducer from "../../modules/user/product/slices/product_slice";
import profileReducer from "../../modules/profile/slices/profileState_slice";
import settingsAPI from "../../modules/profile/apis/settings_api";
import vendorHomeReducer from "../../modules/vendor/home/slices/vendorHome_slice";
import api from "../api/api";


const appStore = configureStore({
    reducer: {
        //  General
        authState: authReducer,
        profileState: profileReducer,

        //  Users
        cartState: createReducer,
        homeState: homeReducer,
        productState: productReducer,

        //  Vendors
        vendorHomeState: vendorHomeReducer,

        [api.reducerPath]: api.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat([
        api.middleware,
        settingsAPI.middleware
    ]),
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
// setupListeners(appStore.dispatch);

export default appStore;