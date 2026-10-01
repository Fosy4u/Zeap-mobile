import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IOrderState from "../models/orderState_model";
import IOrder from "../models/oder_model";
import IOrderHistory from "../models/orderHistory_model";
import IOrderDetails from "../models/orderDetails_model";
import IVendorOrderFilter, { EMPTY_ORDER_FILTER } from "../models/orderFilter_model";

const initialState: IOrderState = {
    orders: [],
    order: {} as IOrderDetails,
    orderHistory: {},
    showConfirmOrderModal: false,
    showRejectOrderModal: false,
    showStatusSuccessModal: false,
    loadingMessage: "",
    isLoading: false,
    historyIsLoading: false,
    ordersHaveFetched: false,
    filters: EMPTY_ORDER_FILTER,
    searchPhrase: "",
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
        setShowConfirmOrderModal: (state: IOrderState, action: PayloadAction<boolean>) => {
            state.showConfirmOrderModal = action.payload;
        },
        setShowRejectOrderModal: (state: IOrderState, action: PayloadAction<boolean>) => {
            state.showRejectOrderModal = action.payload;
        },
        setShowStatusSuccessModal: (state: IOrderState, action: PayloadAction<boolean>) => {
            state.showStatusSuccessModal = action.payload;
        },
        setHistoryIsLoading: (state: IOrderState, action: PayloadAction<boolean>) => {
            state.historyIsLoading = action.payload;
        },
        setLoadingMessage: (state: IOrderState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },
        setIsLoading: (state: IOrderState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setOrdersHaveFetched: (state: IOrderState, action: PayloadAction<boolean>) => {
            state.ordersHaveFetched = action.payload;
        },
        setOrderFilters: (state: IOrderState, action: PayloadAction<IVendorOrderFilter>) => {
            state.filters = action.payload;
        },
        setOrderSearchPhrase: (state: IOrderState, action: PayloadAction<string>) => {
            state.searchPhrase = action.payload;
        },
    },
});

const { actions, reducer } = orderSlice;

export const {
    setOrders,
    setOrder,
    setOrderHistory,
    setShowConfirmOrderModal,
    setShowRejectOrderModal,
    setShowStatusSuccessModal,
    setLoadingMessage,
    setIsLoading,
    setHistoryIsLoading,
    setOrdersHaveFetched,
    setOrderFilters,
    setOrderSearchPhrase,
} = actions;
export default reducer;