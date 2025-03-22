import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IAddressState from "../models/addressState_model";
import { set } from "react-hook-form";
import IAddress from "../models/address_model";

const initialState: IAddressState = {
    allSavedAddresses: [],
    selectedAddress: {},

    selectedDeliveryAddressID: "",
    saveAddressForNextTime: false,
    showSavedAddressesBottomSheet: false,
    selectedCountry: "Nigeria",
};

export const addressSlice = createSlice({
    name: "addressSlice",
    initialState,
    reducers: {
        setAllSavedAddresses: (state: IAddressState, action: PayloadAction<IAddress[]>) => {
            state.allSavedAddresses = action.payload;
        },
        setSelectedAddress: (state: IAddressState, action: PayloadAction<IAddress>) => {
            state.selectedAddress = action.payload;
            
        },
        setSelectedDeliveryAddressID: (state: IAddressState, action: PayloadAction<string>) => {
            state.selectedDeliveryAddressID = action.payload;
        },
        setSaveAddressForNextTime: (state: IAddressState, action: PayloadAction<boolean>) => {
            state.saveAddressForNextTime = action.payload;
        },
        setShowSavedAddressesBottomSheet: (state: IAddressState, action: PayloadAction<boolean>) => {
            state.showSavedAddressesBottomSheet = action.payload;
        },
        setSelectedCountry: (state: IAddressState, action: PayloadAction<string>) => {
            state.selectedCountry = action.payload;
        },
    },
    
});

const { actions, reducer } = addressSlice;

export const {
    setAllSavedAddresses,
    setSelectedAddress,
    setSelectedDeliveryAddressID,
    setSaveAddressForNextTime,
    setShowSavedAddressesBottomSheet,
    setSelectedCountry,
} = actions;

export default reducer;