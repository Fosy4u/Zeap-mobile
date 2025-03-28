import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVendorHomeState, { IOverview } from "../models/vendorHomeState_model";
import IAnalytic from "../models/analytic_model";


const initialState: IVendorHomeState = {
    showProductFilterBottomSheet: false,
    showOrderFilterBottomSheet: false,

    analytics: {},
    overviews: [
        {
            name: "Product sold",
            count: 0,
        },
        {
            name: "Orders placed",
            count: 0,
        },
        {
            name: "Orders confirmed",
            count: 0,
        },
        {
            name: "Orders processing",
            count: 0,
        },
        {
            name: "Orders dispatched",
            count: 0,
        },
        {
            name: "Orders delivered",
            count: 0,
        },
        {
            name: "Orders cancelled",
            count: 0,
        },
    ],
    weeklySalesChartData: [
        { label: "Sun", value: 45 },
        { label: "Mon", value: 60 },
        { label: "Tue", value: 20 },
        { label: "Wed", value: 90 },
        { label: "Thu", value: 35 },
        { label: "Fri", value: 70 },
        { label: "Sat", value: 30 },
    ],
    salesCountPieData: [
        {value: 121, color: "#133522", title: "Ready made"},
        {value: 82, color: "#D5B07B", title: "Bespoke"},
    ],
    salesRevenuePieData: [
        {value: 12500, color: "#225F3D", title: "Ready made"},
        {value: 10000, color: "#819656", title: "Bespoke"},
    ],
};

export const vendorHomeSlice = createSlice({
    name: "vendorHomeSlice",
    initialState,
    reducers: {
        setShowProductFilterBottomSheet: (state: IVendorHomeState, action: PayloadAction<boolean>) => {
            state.showProductFilterBottomSheet = action.payload;
        },
        setShowOrderFilterBottomSheet: (state: IVendorHomeState, action: PayloadAction<boolean>) => {
            state.showOrderFilterBottomSheet = action.payload;
        },
        setAnalytics: (state: IVendorHomeState, action: PayloadAction<IAnalytic>) => {
            state.analytics = action.payload;
        },
        setOverviews: (state: IVendorHomeState, action: PayloadAction<IOverview[]>) => {
            state.overviews = action.payload;
        }
    }
});

const { actions, reducer } = vendorHomeSlice;

export const {
    setShowProductFilterBottomSheet,
    setShowOrderFilterBottomSheet,
    setAnalytics,
    setOverviews,
} = actions;
export default reducer;