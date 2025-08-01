import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IAddressState from "../models/addressState_model";
import IAddress from "../models/address_model";

const initialState: IAddressState = {
    deliveryAddresses: [],
    selectedAddress: {},

    selectedDeliveryAddressID: "",
    saveAddressForNextTime: false,
    selectedCountry: "Nigeria",

    showEditEmail: false,
    showNewDeliveryAddressForm: false,

    isLoading: false,
    loadingMessage: "",
};

export const addressSlice = createSlice({
    name: "addressSlice",
    initialState,
    reducers: {
        setDeliveryAddresses: (state: IAddressState, action: PayloadAction<IAddress[]>) => {
            state.deliveryAddresses = action.payload;
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
        setSelectedCountry: (state: IAddressState, action: PayloadAction<string>) => {
            state.selectedCountry = action.payload;
        },
        setShowEditEmail: (state: IAddressState, action: PayloadAction<boolean>) => {
            state.showEditEmail = action.payload;
        },
        setShowNewDeliveryAddressForm: (state: IAddressState, action: PayloadAction<boolean>) => {
            state.showNewDeliveryAddressForm = action.payload;
        },
        setIsLoading: (state: IAddressState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setLoadingMessage: (state: IAddressState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        }
    },
    
});

const { actions, reducer } = addressSlice;

export const {
    setDeliveryAddresses,
    setSelectedAddress,
    setSelectedDeliveryAddressID,
    setSaveAddressForNextTime,
    setSelectedCountry,
    setShowEditEmail,
    setShowNewDeliveryAddressForm,
    setIsLoading,
    setLoadingMessage
} = actions;

export default reducer;