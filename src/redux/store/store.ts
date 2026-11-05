import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { cleanupSensitiveFiles } from '../../utils/sensitiveFiles';
import { setSessionReset, syncSession } from '../services/session';
import authReducer from "../../modules/auths/slices/authState_slice";
import dashboardWrapperReducer from "../../modules/user/home/slices/dashboardWrapper_slice";
import productReducer from "../../modules/user/products/slices/product_slice";
import measurementReducer from "../../modules/user/measurements/slices/measurement_slice";
import addressReducer from "../../modules/user/address/slices/address_slice";
import profileReducer from "../../modules/profile/slices/profileState_slice";
import generalReducer from "../../modules/general/slices/general_slice";
import cartReducer from "../../modules/user/cart/slices/cart_slice";
import paymentReducer from "../../modules/user/payment/slices/payment_slice";
import orderReducer from "../../modules/user/orders/slices/order_slice";
import savedReducer from "../../modules/user/saved/slices/saved_slice";
import pointAndVoucherReducer from "../../modules/user/pointAndVoucher/slices/pointAndVoucher_slice";
import vendorHomeReducer from "../../modules/vendor/home/slices/vendorHome_slice";
import vendorGeneralReducer from "../../modules/vendor/general/slices/general_slice";
import vendorOnboardingReducer from "../../modules/vendor/general/slices/vendorOnboardingState_slice";
import vendorPaymentReducer from "../../modules/vendor/payments/slices/payment_slice";
import vendorProductReducer from "../../modules/vendor/products/slices/vendorProductState_slice";
import vendorOrderReducer from "../../modules/vendor/orders/slices/orderState_slice"
import settingsReducer from "../../modules/settings/slices/settingsState_slice";
import notificationsReducer from "../../modules/notifications/slices/notifications_slice";
import rootAPI from "../api/rootAPI.ts";
import reviewAndRatingReducer from "../../modules/user/raviewAndRating/slices/reviewAndRating_slice";


const combinedReducer = combineReducers({
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
        paymentState: paymentReducer,
        orderState: orderReducer,
        savedState: savedReducer,
        pointAndVoucherState: pointAndVoucherReducer,
        reviewAndRatingState: reviewAndRatingReducer,

        //  Vendors
        vendorHomeState: vendorHomeReducer,
        vendorGeneralState: vendorGeneralReducer,
        vendorOnboardingState: vendorOnboardingReducer,
        notificationsState: notificationsReducer,
        vendorPaymentState: vendorPaymentReducer,
        vendorProductState: vendorProductReducer,
        vendorOrderState: vendorOrderReducer,

        [rootAPI.reducerPath]: rootAPI.reducer,
});

const appStore = configureStore({
    reducer: (state: ReturnType<typeof combinedReducer> | undefined, action: any) => {
        if (action.type !== 'session/reset') return combinedReducer(state, action);
        const freshState = combinedReducer(undefined, action);
        const pendingDestination = state?.authState?.pendingDestination ?? null;
        return { ...freshState, authState: { ...freshState.authState, pendingDestination } };
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    }).concat([
        rootAPI.middleware
    ]),
});

setSessionReset(() => {
    appStore.dispatch(rootAPI.util.getRunningQueriesThunk()).forEach(request => request.abort());
    appStore.dispatch(rootAPI.util.getRunningMutationsThunk()).forEach(request => request.abort());
    appStore.dispatch(rootAPI.util.resetApiState());
    appStore.dispatch({ type: 'session/reset' });
    cleanupSensitiveFiles();
});
syncSession();
onAuthStateChanged(getAuth(), () => { syncSession(); });

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
// setupListeners(appStore.dispatch);

export default appStore;
