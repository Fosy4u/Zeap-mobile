import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IPaymentState, { IPayment } from "../models/payment_model";

const initialState: IPaymentState = {
    payments: [
        {
            id: "01",
            title: "Payment",
            description: "Payment description",
            date: "31/10/2024",
            status: "Success",
            amount: 100,
            productName: "Sweat Shirt",
            productImage: require("../../../../../assets/images/home/sweat_shirt.png"),
        },
        {
            id: "02",
            title: "Payment",
            description: "Payment description",
            date: "31/10/2024",
            status: "Success",
            amount: 100,
            productName: "Sweat Shirt",
            productImage: require("../../../../../assets/images/home/sweat_shirt.png"),
        },
        {
            id: "03",
            title: "Payment",
            description: "Payment description",
            date: "31/10/2024",
            status: "Pending",
            amount: 100,
            productName: "Sweat Shirt",
            productImage: require("../../../../../assets/images/home/sweat_shirt.png"),
        },
        {
            id: "04",
            title: "Payment",
            description: "Payment description",
            date: "31/10/2024",
            status: "Success",
            amount: 100,
            productName: "Sweat Shirt",
            productImage: require("../../../../../assets/images/home/sweat_shirt.png"),
        },
    ],
    tabs: ["All", "Received", "Pending"],
    selectedTab: "All",
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
    }
});

const { actions, reducer } = paymentSlice;

export const {
    setSelectedTab,
    setPayments,
} = actions;
export default reducer;