import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICartState from "../models/cartState_model";
import ICart from "../models/cart_model";
import IDeliveryMethod, { DeliveryFee } from "../../address/models/deliveryMethod_model";
import { set } from "react-hook-form";
import IOrderSummary from "../models/orderSummary_model";
import IDeliveryDate from "../models/deliveryDate_model";

const initialState: ICartState = {
    cart: {
        _id: "",
        user: "",
        basketId: "",
        basketItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    cartTotal: 0,
    deliveryMethod: {
        currency: "",
        country: "",
        deliveryFees: []
    },
    selectedDeliveryFee: {
        label: "",
        fee: "",
        method: ""
    },
    orderSummary: {
        currency: '',
        subTotal: "",
        deliveryFee: "",
        total: "",
        totalWithoutVoucher: null,
        voucherAmount: 0,
        appliedVoucherAmount: 0,
    },
    deliveryDates: [],

    isLoading: false,
    loadingMessage: "",
};

export const cartSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {
        setCart: (state: ICartState, action: PayloadAction<ICart>) => {
            state.cart = action.payload;
        },
        setCartTotal: (state: ICartState, action: PayloadAction<number>) => {
            state.cartTotal = action.payload;
        },
        setDeliveryMethod: (state: ICartState, action: PayloadAction<IDeliveryMethod>) => {
            state.deliveryMethod = action.payload;
        },
        setSelectedDeliveryFee: (state: ICartState, action: PayloadAction<DeliveryFee>) => {
            state.selectedDeliveryFee = action.payload;
        },
        setOrderSummary: (state: ICartState, action: PayloadAction<IOrderSummary>) => {
            state.orderSummary = action.payload;
        },
        setDeliveryDates: (state: ICartState, action: PayloadAction<IDeliveryDate[]>) => {
            state.deliveryDates = action.payload;
        },
        setIsLoading: (state: ICartState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setLoadingMessage: (state: ICartState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        }
    },
});

const { actions, reducer } = cartSlice;

export const {
    setCart,
    setCartTotal,
    setDeliveryMethod,
    setSelectedDeliveryFee,
    setOrderSummary,
    setDeliveryDates,
    setIsLoading,
    setLoadingMessage
} = actions;

export default reducer;