import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVendorOnboardingState, { ISellerPolicy, IVendorOnboardingFormData } from "../models/vendorOnboardingState_model";

const initialFormData: IVendorOnboardingFormData = {
    businessName: "",

    isTailor: null,
    isShoeMaker: null,

    businessEmail: "",
    // Phone code starts empty so stepThree_hook can seed it from the user's
    // currency (NGN → +234, USD/CAD → +1, GBP → +44) on first render.
    businessPhoneCode: "",
    businessPhone: "",

    address: "",
    country: "",
    region: "",

    bankName: "",
    accountName: "",
    accountNumber: "",

    website: "",
    tiktok: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",

    agreedToTerms: false,

    referralSource: "",
};

const initialState: IVendorOnboardingState = {
    selectedStep: 1,
    formData: initialFormData,
    sellerPolicies: [],
    isSubmitting: false,
    loadingMessage: "",
};

export const vendorOnboardingSlice = createSlice({
    name: "vendorOnboardingSlice",
    initialState,
    reducers: {
        setSelectedOnboardingStep: (state, action: PayloadAction<number>) => {
            state.selectedStep = action.payload;
        },
        setOnboardingFormData: (state, action: PayloadAction<Partial<IVendorOnboardingFormData>>) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        setSellerPolicies: (state, action: PayloadAction<ISellerPolicy[]>) => {
            state.sellerPolicies = action.payload;
        },
        setOnboardingIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setOnboardingLoadingMessage: (state, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },
        resetOnboarding: (state) => {
            state.selectedStep = 1;
            state.formData = initialFormData;
            state.isSubmitting = false;
            state.loadingMessage = "";
        },
    },
});

const { actions, reducer } = vendorOnboardingSlice;

export const {
    setSelectedOnboardingStep,
    setOnboardingFormData,
    setSellerPolicies,
    setOnboardingIsSubmitting,
    setOnboardingLoadingMessage,
    resetOnboarding,
} = actions;

export default reducer;
