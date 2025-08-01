import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVendorProductState from "../models/vendorProductState_model.ts";
import IVendorProductDetails from "../models/vendorProductDetails_model.ts";
import IPromotion from "../models/promotion_model.ts";

const initialState: IVendorProductState = {
    productMode: "New",
    selectedStep: 1,
    productType: "",
    clotheType: "Bespoke",
    shoeType: "Bespoke",
    tabs: ["Description", "Reviews", "Timeline"],
    selectedTab: "Description",
    timelines: ["Once measurement received", "Cutting - 2days", "Sewing - 2 weeks", "Finishing 3 days", "Dispatch 2 days", "Delivery"],
    savedMeasurements: [],
    savedAddresses: [],

    products: [],
    product: {},
    draftProducts: [],
    productPromotion: {},

    showProductTypeBottomSheet: false,

    productIsLoading: false,
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
        setProductType: (state: IVendorProductState, action: PayloadAction<string>) => {
            state.productType = action.payload;
        },
        setClotheType: (state: IVendorProductState, action: PayloadAction<string>) => {
            state.clotheType = action.payload;
        },
        setShoeType: (state: IVendorProductState, action: PayloadAction<string>) => {
            state.shoeType = action.payload;
        },
        setSelectedTab: (state: IVendorProductState, action: PayloadAction<string>) => {
            state.selectedTab = action.payload;
        },
        setProducts: (state: IVendorProductState, action: PayloadAction<IVendorProductDetails[]>) => {
            state.products = action.payload;
        },
        setProduct: (state: IVendorProductState, action: PayloadAction<IVendorProductDetails>) => {
            state.product = action.payload;
        },
        setDraftProducts: (state: IVendorProductState, action: PayloadAction<IVendorProductDetails[]>) => {
            state.draftProducts = action.payload;
        },
        setProductPromotion: (state: IVendorProductState, action: PayloadAction<IPromotion>) => {
            state.productPromotion = action.payload;
        },
        setShowProductTypeBottomSheet: (state: IVendorProductState, action: PayloadAction<boolean>) => {
            state.showProductTypeBottomSheet = action.payload;
        },
        setProductIsLoading: (state: IVendorProductState, action: PayloadAction<boolean>) => {
            state.productIsLoading = action.payload;
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
    setProductType,
    setClotheType,
    setShoeType,
    setSelectedTab,
    setProducts,
    setProduct,
    setDraftProducts,
    setProductPromotion,
    setShowProductTypeBottomSheet,
    setProductIsLoading,
    setLoadingMessage,
} = actions;
export default reducer;