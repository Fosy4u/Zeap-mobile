import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IPaymentState from "../models/paymentState_model";
import IPayment from "../models/payment_model";

const initialState: IPaymentState = {
    payments: [],
    /* Mirrors the web's payment filters. "Received" was renamed to "Paid" to
       match, and "Cancelled" added. */
    tabs: ["All", "Pending", "Paid", "Cancelled"],
    selectedTab: "All",


    loadingMessage: "",
    isLoading: false,
    hasFetched: false,
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
        setHasFetched: (state: IPaymentState, action: PayloadAction<boolean>) => {
            state.hasFetched = action.payload;
        },
    }
});

const { actions, reducer } = paymentSlice;

export const {
    setSelectedTab,
    setPayments,
    setLoadingMessage,
    setIsLoading,
    setHasFetched,
} = actions;
export default reducer;