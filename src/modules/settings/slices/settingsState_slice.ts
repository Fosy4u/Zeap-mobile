import ISettingsState from "../models/settingsState_model";
import currencies from "../../../utils/currencies.json";
import { createSlice, PayloadAction } from "@reduxjs/toolkit/react";
import ICuurrency from "../models/currency_model";


const initialState: ISettingsState = {
    currencies: currencies,
    recommendedCurrency: {
        code: "",
        name: "",
        country: "",
        symbol: "",
        flag: undefined
    },
    
    // Password visibility states
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmNewPassword: false,

    isLoading: false,
    loadingMessage: "",
};

const settingsStateSlice = createSlice({
    name: "settingsSlice",
    initialState,
    reducers: {
        setRecommendedCurrency: (state: ISettingsState, action: PayloadAction<ICuurrency>) => {
            state.recommendedCurrency = action.payload;
        },
        setShowCurrentPassword: (state: ISettingsState, action: PayloadAction<boolean>) => {
            state.showCurrentPassword = action.payload;
        },
        setShowNewPassword: (state: ISettingsState, action: PayloadAction<boolean>) => {
            state.showNewPassword = action.payload;
        },
        setShowConfirmNewPassword: (state: ISettingsState, action: PayloadAction<boolean>) => {
            state.showConfirmNewPassword = action.payload;
        },
        setIsLoading: (state: ISettingsState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setLoadingMessage: (state: ISettingsState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },
    },
});

const { actions, reducer } = settingsStateSlice;
export const {
    setRecommendedCurrency,
    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmNewPassword,
    setIsLoading,
    setLoadingMessage,
} = actions;
export default reducer;