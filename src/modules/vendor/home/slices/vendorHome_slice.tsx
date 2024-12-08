import { createSlice } from "@reduxjs/toolkit";
import IVendorHomeState from "../models/vendorHome_model";


const initialState: IVendorHomeState = {
    overviews: [
        {
            name: "Product sold",
            count: 203
        },
        {
            name: "Orders received",
            count: 529
        }
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

    recentPayments: [
        {
            id: "01",
            amount: 1500.50,
            productName: "Men’s Vintage Shirt",
            status: "Success",
            date: "31/10/2024"
        },
        {
            id: "02",
            amount: 1500.50,
            productName: "Men’s Vintage Shirt",
            status: "Pending",
            date: "31/10/2024"
        },
        {
            id: "03",
            amount: 1500.50,
            productName: "Men’s Vintage Shirt",
            status: "Success",
            date: "31/10/2024"
        },
        {
            id: "04",
            amount: 1500.50,
            productName: "Men’s Vintage Shirt",
            status: "Success",
            date: "31/10/2024"
        },
    ]
};

export const vendorHomeSlice = createSlice({
    name: "vendorHomeSlice",
    initialState,
    reducers: {

    }
});

const { actions, reducer } = vendorHomeSlice;

export const {} = actions;
export default reducer;