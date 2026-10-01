import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IPaymentState from "../models/paymentState_model";
import IPaymentReference from "../models/paymentReference_model";


const initialState: IPaymentState = {
    paymentReference: {},
    showOrderSuccessModal: false,
    newOrderId: "",
    gainedPoints: 0,
};

const paymentSlice = createSlice({
    name: "paymentSlice",
    initialState,
    reducers: {
        setPaymentReference: (state: IPaymentState, action: PayloadAction<IPaymentReference>) => {
            state.paymentReference = action.payload;
        },
        setShowOrderSuccessModal: (state: IPaymentState, action: PayloadAction<boolean>) => {
            state.showOrderSuccessModal = action.payload;
        },
        setNewOrderId: (state: IPaymentState, action: PayloadAction<string>) => {
            state.newOrderId = action.payload;
        },
        setGainedPoints: (state: IPaymentState, action: PayloadAction<number>) => {
            state.gainedPoints = action.payload;
        },
    },
});

const { actions, reducer } = paymentSlice;

export const {
    setPaymentReference,
    setShowOrderSuccessModal,
    setNewOrderId,
    setGainedPoints,
} = actions;
export default reducer