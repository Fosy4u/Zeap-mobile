import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVendorProductState from "../models/vendorProductState_model.ts";
import IDraftProduct from "../models/vendorDraftProducts_model.ts";
import IVendorProduct from "../models/vendorProduct_model.ts";
import IVendorProductDetails from "../models/vendorProductDetails_model.ts";
import { State } from "react-native-gesture-handler";

const initialState: IVendorProductState = {
    productMode: "New",
    selectedStep: 1,
    clotheType: "Bespoke",
    tabs: ["Description", "Reviews", "Timeline"],
    selectedTab: "Description",
    timelines: ["Once measurement received", "Cutting - 2days", "Sewing - 2 weeks", "Finishing 3 days", "Dispatch 2 days", "Delivery"],
    savedMeasurements: [],
    savedAddresses: [],

    products: [],
    product: {},
    draftProducts: [],
    selectedDraftProduct: {},

    isLoadingProducts: false,
    loadingMessage: "Please wait...",
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
        setProducts: (state: IVendorProductState, action: PayloadAction<IVendorProduct[]>) => {
            state.products = action.payload;
        },
        setProduct: (state: IVendorProductState, action: PayloadAction<IVendorProductDetails>) => {
            state.product = action.payload;
        },
        setDraftProducts: (state: IVendorProductState, action: PayloadAction<IDraftProduct[]>) => {
            state.draftProducts = action.payload;
        },
        setSelectedDraftProduct: (state: IVendorProductState, action: PayloadAction<IDraftProduct>) => {
            state.selectedDraftProduct = action.payload;
        },
        setIsLoadingProducts: (state: IVendorProductState, action: PayloadAction<boolean>) => {
            state.isLoadingProducts = action.payload;
        },
        setLoadingMessage: (State: IVendorProductState, action: PayloadAction<string>) => {
            State.loadingMessage = action.payload;
        },
    }
});

const { actions, reducer } = vendorProductSlice;

export const {
    setProductMode,
    setSelectedStep,
    setClotheType,
    setSelectedTab,
    setProducts,
    setProduct,
    setDraftProducts,
    setSelectedDraftProduct,
    setIsLoadingProducts,
    setLoadingMessage,
} = actions;
export default reducer;