import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVendorProductState from "../models/vendorProductState_model.ts";

const initialState: IVendorProductState = {
    tabs: ["Description", "Reviews", "Timeline"],
    selectedTab: "Description",
    timelines: ["Once measurement received", "Cutting - 2days", "Sewing - 2 weeks", "Finishing 3 days", "Dispatch 2 days", "Delivery"],
    savedMeasurements: [],
    savedAddresses: [],
};

export const vendorProductSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {
        setSelectedTab: (state: IVendorProductState, action: PayloadAction<string>) => {
            state.selectedTab = action.payload;
        },
    }
});

const { actions, reducer } = vendorProductSlice;

export const {
    setSelectedTab,
} = actions;
export default reducer;