import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IOrder from "../models/order_model";
import IOrderState from "../models/orderState_model";
import IOrderHistory from "../models/orderHistory_model";
import IOrderDetails, { IStatus } from "../models/orderDetails_model";


const initialState: IOrderState = {
    orderID: "",
    orderDetails: {} as IOrderDetails,
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
    selectedOrderStatus: {} as IStatus,
    isLoading: false,
    loadingMessage: "",
};

const orderSlice = createSlice({
    name: "orderState",
    initialState,
    reducers: {
        setOrderID: (state: IOrderState, action: PayloadAction<string>) => {
            state.orderID = action.payload;
        },
        setOrderDetails: (state: IOrderState, action: PayloadAction<IOrderDetails>) => {
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
        setSelectedOrderStatus: (state: IOrderState, action: PayloadAction<IStatus>) => {
            state.selectedOrderStatus = action.payload;
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
    setOrderID,
    setOrderDetails,
    setOrders,
    setFilteredOrders,
    setOrderHistory,
    setSelectedOrderStatus,
    setIsLoading,
    setLoadingMessage,
} = orderSlice.actions;
export default orderSlice.reducer; 