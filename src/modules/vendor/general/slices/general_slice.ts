import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVendorGeneralState from "../models/vendorGeneralState_model";
import IShop from "../models/shop_model";

const initialState: IVendorGeneralState = {
    shop: {
        isMakeUpArtist: false,
        _id: "",
        shopId: "",
        user: {
            createdBy: "",
            _id: "",
            userId: "",
            uid: "",
            shopEnabled: false,
            signInCount: 0,
            firstName: "",
            lastName: "",
            displayName: "",
            disabled: false,
            isAdmin: false,
            superAdmin: false,
            email: "",
            emailVerified: false,
            isVendor: false,
            points: 0,
            updatedAt: new Date,
            createdAt: new Date,
            __v: 0,
            shopId: "",
            address: "",
            phoneNumber: "",
            phoneNumberVerified: false,
            social: {
                instagram: "",
                website: "",
                _id: "",
            },
        },

        userId: "",
        shopName: "",
        isTailor: false,
        isShoeMaker: false,
        disabled: false,
        currency: {
            name: "",
            symbol: "",
            _id: "",
        },
        updatedAt: new Date,
        createdAt: new Date,
        __v: 0,
    },
};

export const vendorGeneralSlice = createSlice({
    name: "vendorGeneralSlice",
    initialState,
    reducers: {
        setShop: (state: IVendorGeneralState, action: PayloadAction<IShop>) => {
            state.shop = action.payload;
        },
    },
});

const { actions, reducer } = vendorGeneralSlice;

export const {
    setShop
} = actions;
export default reducer;