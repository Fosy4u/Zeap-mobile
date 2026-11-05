import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVendorGeneralState from "../models/vendorGeneralState_model";
import IShop from "../models/shop_model";

const initialState: IVendorGeneralState = {
    shop: null,
};

export const vendorGeneralSlice = createSlice({
    name: "vendorGeneralSlice",
    initialState,
    reducers: {
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
