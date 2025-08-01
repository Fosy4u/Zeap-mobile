import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IOrder from "../models/order_model";
import IOrderState from "../models/orderState_model";
import IOrderHistory from "../models/orderHistory_model";


const initialState: IOrderState = {
    orderDetails: {} as IOrder,
    orders: [],
    filteredOrders: [],
    orderHistory: {
        statusHistory: [],
        nextStatus: {
            name: "",
            value: "",
            sellerAction: false,
            percentage: 0
        },
        currentStatus: {
            name: "",
            value: ""
        }
    },
    showStatusHistory: false,
    isLoading: false,
    loadingMessage: "",
};

const orderSlice = createSlice({
    name: "orderState",
    initialState,
    reducers: {
        setOrderDetails: (state: IOrderState, action: PayloadAction<IOrder>) => {
            state.orderDetails = action.payload;
        },
        setOrders: (state: IOrderState, action: PayloadAction<IOrder[]>) => {
            state.orders = action.payload;
        },
        setFilteredOrders: (state: IOrderState, action: PayloadAction<IOrder[]>) => {
            state.filteredOrders = action.payload;
        },
        setOrderHistory: (state: IOrderState, action: PayloadAction<IOrderHistory>) => {
            state.orderHistory = action.payload;
        },
        setShowStatusHistory: (state: IOrderState, action: PayloadAction<boolean>) => {
            state.showStatusHistory = action.payload;
        },
        setIsLoading: (state: IOrderState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setLoadingMessage: (state: IOrderState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },
    },
});

export const {
    setOrderDetails,
    setOrders,
    setFilteredOrders,
    setOrderHistory,
    setShowStatusHistory,
    setIsLoading,
    setLoadingMessage,
} = orderSlice.actions;
export default orderSlice.reducer; 