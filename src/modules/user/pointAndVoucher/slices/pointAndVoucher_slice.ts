import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IPointAndVoucherState from "../models/pointAndVoucherState_model";
import IPoint from "../models/point_model";
import IVoucher from "../models/voucher_model";

const initialState: IPointAndVoucherState = {
    tabs: ["Points", "Vouchers"],
    points: {
        _id: "",
        user: "",
        availablePoints: 0,
        redeemedPoints: 0,
        totalPoints: 0,
        updatedAt: "",
        createdAt: "",
        __v: 0
    },
    selectedTab: "Points",

    activeVouchers: [],
    inactiveVouchers: [],
    selectedVoucher: {
        _id: "",
        code: "",
        amount: 0,
        expiryDate: "",
        isUsed: false,
        source: "",
        user: "",
        currency: "",
        updatedAt: "",
        createdAt: "",
        __v: 0
    },
    selectedVoucherType: "Active",
    showVoucherDetailBottomSheet: false,

    isLoading: false,
    loadingMessage: "",
};

const pointAndVoucherState = createSlice({
    name: "pointAndVoucherState",
    initialState,

    reducers: {
        setSelectedTab: (state: IPointAndVoucherState, action: PayloadAction<string>) => {
            state.selectedTab = action.payload;
        },
        setPoints: (state: IPointAndVoucherState, action: PayloadAction<IPoint>) => {
            state.points = action.payload;
        },
        setActiveVouchers: (state: IPointAndVoucherState, action: PayloadAction<IVoucher[]>) => {
            state.activeVouchers = action.payload;
        },
        setInactiveVouchers: (state: IPointAndVoucherState, action: PayloadAction<IVoucher[]>) => {
            state.inactiveVouchers = action.payload;
        },
        setSelectedVoucher: (state: IPointAndVoucherState, action: PayloadAction<IVoucher>) => {
            state.selectedVoucher = action.payload;
        },
        setSelectedVoucherType: (state: IPointAndVoucherState, action: PayloadAction<string>) => {
            state.selectedVoucherType = action.payload;
        },
        setShowVoucherDetailBottomSheet: (state: IPointAndVoucherState, action: PayloadAction<boolean>) => {
            state.showVoucherDetailBottomSheet = action.payload;
        },
        setIsLoading: (state: IPointAndVoucherState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setLoadingMessage: (state: IPointAndVoucherState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },
    }
});

const { actions, reducer } = pointAndVoucherState;
export const {
    setSelectedTab,
    setPoints,
    setActiveVouchers,
    setInactiveVouchers,
    setSelectedVoucher,
    setSelectedVoucherType,
    setShowVoucherDetailBottomSheet,
    setIsLoading,
    setLoadingMessage
} = actions;
export default reducer;