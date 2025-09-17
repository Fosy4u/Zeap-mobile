import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IPaymentState from "../models/paymentState_model";
import IPaymentReference from "../models/paymentReference_model";


const initialState: IPaymentState = {
    paymentReference: {},
};

const paymentSlice = createSlice({
    name: "paymentSlice",
    initialState,
    reducers: {
        setPaymentReference: (state: IPaymentState, action: PayloadAction<IPaymentReference>) => {
            state.paymentReference = action.payload;
        },
    },
});

const { actions, reducer } = paymentSlice;

export const {
    setPaymentReference,
} = actions;
export default reducer