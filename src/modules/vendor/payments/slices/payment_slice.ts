import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IPaymentState from "../models/paymentState_model";
import IPayment from "../models/payment_model";

const initialState: IPaymentState = {
    payments: [],
    tabs: ["All", "Received", "Pending"],
    selectedTab: "All",


    loadingMessage: "",
    isLoading: false,
};

export const paymentSlice = createSlice({
    name: "paymentSlice",
    initialState,
    reducers: {
        setSelectedTab: (state: IPaymentState, action: PayloadAction<string>) => {
            state.selectedTab = action.payload;
        },
        setPayments: (state: IPaymentState, action: PayloadAction<IPayment[]>) => {
            state.payments = action.payload;
        },
        setLoadingMessage: (state: IPaymentState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },
        setIsLoading: (state: IPaymentState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    }
});

const { actions, reducer } = paymentSlice;

export const {
    setSelectedTab,
    setPayments,
    setLoadingMessage,
    setIsLoading,
} = actions;
export default reducer;