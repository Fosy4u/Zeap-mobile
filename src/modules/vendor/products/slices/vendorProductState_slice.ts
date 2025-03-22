import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVendorProductState from "../models/vendorProductState_model.ts";
import IDraftProduct from "../models/vendorDraftProducts_model.ts";

const initialState: IVendorProductState = {
    productMode: "New",
    selectedStep: 1,
    clotheType: "Bespoke",
    tabs: ["Description", "Reviews", "Timeline"],
    selectedTab: "Description",
    timelines: ["Once measurement received", "Cutting - 2days", "Sewing - 2 weeks", "Finishing 3 days", "Dispatch 2 days", "Delivery"],
    savedMeasurements: [],
    savedAddresses: [],

    draftProducts: [],
    selectedDraftProduct: {},
};

export const vendorProductSlice = createSlice({
    name: "vendorProductSlice",
    initialState,
    reducers: {
        setProductMode: (state: IVendorProductState, action: PayloadAction<string>) => {
            state.productMode = action.payload;
        },
        setSelectedStep: (state: IVendorProductState, action: PayloadAction<number>) => {
            state.selectedStep = action.payload;
        },
        setClotheType: (state: IVendorProductState, action: PayloadAction<string>) => {
            state.clotheType = action.payload;
        },
        setSelectedTab: (state: IVendorProductState, action: PayloadAction<string>) => {
            state.selectedTab = action.payload;
        },
        setDraftProducts: (state: IVendorProductState, action: PayloadAction<IDraftProduct[]>) => {
            state.draftProducts = action.payload;
        },
        setSelectedDraftProduct: (state: IVendorProductState, action: PayloadAction<IDraftProduct>) => {
            state.selectedDraftProduct = action.payload;
        },
    }
});

const { actions, reducer } = vendorProductSlice;

export const {
    setProductMode,
    setSelectedStep,
    setClotheType,
    setSelectedTab,
    setDraftProducts,
    setSelectedDraftProduct,
} = actions;
export default reducer;