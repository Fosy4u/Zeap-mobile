import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../modules/auths/slices/auth_slice";
import settingsReducer from "../../modules/setting/slices/settings_slice";
import homeReducer from "../../modules/home/slices/home_slice";
import settingsAPI from "../../modules/setting/apis/settings_api";


const store = configureStore({
    reducer: {
        authState: authReducer,
        homeState: homeReducer,
        settingsState: settingsReducer,

        [settingsAPI.reducerPath]: settingsAPI.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat([
        settingsAPI.middleware
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;