import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IOrderState from "../models/orderState_model";
import IOrder from "../models/oder_model";
import IOrderHistory from "../models/orderHistory_model";
import IOrderDetails from "../models/orderDetails_model";

const initialState: IOrderState = {
    orders: [],
    order: {} as IOrderDetails,
    orderHistory: {},
    showUpdateOrderBottomSheet: false,
    loadingMessage: "",
    isLoading: false,
};

const orderSlice = createSlice({
    name: "orderSlice",
    initialState,
    reducers: {
        setOrders: (state: IOrderState, action: PayloadAction<IOrder[]>) => {
            state.orders = action.payload;
        },
        setOrder: (state: IOrderState, action: PayloadAction<IOrderDetails>) => {
            state.order = action.payload;
        },
        setOrderHistory: (state: IOrderState, action: PayloadAction<IOrderHistory>) => {
            state.orderHistory = action.payload;
        },
        setShowUpdateOrderBottomSheet: (state: IOrderState, action: PayloadAction<boolean>) => {
            state.showUpdateOrderBottomSheet = action.payload;
        },
        setLoadingMessage: (state: IOrderState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },
        setIsLoading: (state: IOrderState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

const { actions, reducer } = orderSlice;

export const {
    setOrders,
    setOrder,
    setOrderHistory,
    setShowUpdateOrderBottomSheet,
    setLoadingMessage,
    setIsLoading,
} = actions;
export default reducer;