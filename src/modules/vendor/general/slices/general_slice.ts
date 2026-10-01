import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVendorGeneralState from "../models/vendorGeneralState_model";
import IShop from "../models/shop_model";

/* Starts null instead of a hollow placeholder shop: the placeholder claimed the
   account had a shop with blank details, and a real null crashed consumers. */
const initialState: IVendorGeneralState = {
    shop: null,
};

export const vendorGeneralSlice = createSlice({
    name: "vendorGeneralSlice",
    initialState,
    reducers: {
        /* Accepts null so callers can record a definitive "no shop on this
           account" instead of leaving stale details on screen. */
        setShop: (state: IVendorGeneralState, action: PayloadAction<IShop | null>) => {
            state.shop = action.payload;
        },
    },
});

const { actions, reducer } = vendorGeneralSlice;

export const {
    setShop
} = actions;
export default reducer;
