import { createSlice } from "@reduxjs/toolkit";
import IVendorHomeState from "../models/vendorHomeState_model";


const initialState: IVendorHomeState = {
    overviews: [
        {
            name: "Product sold",
            count: 203
        },
        {
            name: "Orders received",
            count: 529
        },
        {
            name: "Orders delivered",
            count: 490
        },
        {
            name: "Orders pending",
            count: 26
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
    reducers: {}
});

const { actions, reducer } = vendorHomeSlice;

export const {} = actions;
export default reducer;