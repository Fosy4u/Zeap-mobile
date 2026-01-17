import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IAuthState from "../models/authState_model";

const initialState : IAuthState= {
    isVendorData: [
        { "key": true, "value": "Yes" },
        { "key": false, "value": "No" },
    ],

    showPassword: false,
    showConfirmPassword: false,
    rememberMe: false,
    showSuccessModal: false,
    showBottomSheetModal: false,
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setShowPassword: (state: IAuthState, action: PayloadAction<boolean>) => {
            state.showPassword = action.payload;
        },
        setShowConfirmPassword: (state: IAuthState, action: PayloadAction<boolean>) => {
            state.showConfirmPassword = action.payload;
        },
        setRememberMe: (state: IAuthState, action: PayloadAction<boolean>) => {
            state.rememberMe = action.payload;
        },
        setShowSuccessModal: (state: IAuthState, action: PayloadAction<boolean>) => {
            state.showSuccessModal = action.payload;
        },
        setShowBottomSheetModal: (state: IAuthState, action: PayloadAction<boolean>) => {
            state.showBottomSheetModal = action.payload;
        },
    }
});

const { actions, reducer } = authSlice;

export const { setShowPassword, setShowConfirmPassword, setRememberMe, setShowSuccessModal, setShowBottomSheetModal } = actions;
export default reducer;