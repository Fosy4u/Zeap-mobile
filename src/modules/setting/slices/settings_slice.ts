import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import phoneCodes from "../../../utils/countriesPhoneCodes.json";
import ISettingState from "../models/settingsState_model";


const initialState: ISettingState = {
    phoneCodeOptions: phoneCodes,
    isSellerOptions: [
        { key: "Yes", value: "Yes" },
        { key: "No", value: "No" },
    ],
    heightUnitOptions: [
        { "key": "Inches", "value": "Inches" },
        { "key": "Centimeter", "value": "Centimeter" },
    ],
    weightUnitOptions: [
        { "key": "Kilogram", "value": "Kilogram" },
        { "key": "Pounds", "value": "Pounds" },
    ],
    complexionOptions: [
        { "key": "Fair", "value": "Fair" },
        { "key": "Brown", "value": "Brown" },
        { "key": "Dark", "value": "Dark" },
    ],
    shoeSizeOptions: [
        { "key": "Option A", "value": "Option A" },
        { "key": "Option B", "value": "Option B" },
    ],
    bestOutfitOptions: [
        { "key": "Option A", "value": "Option A" },
        { "key": "Option B", "value": "Option B" },
    ],
    bestColorOptions: [
        { "key": "Green", "value": "Green" },
        { "key": "Blue", "value": "Blue" },
        { "key": "Red", "value": "Red" },
        { "key": "Orange", "value": "Orange" },
        { "key": "Pink", "value": "Pink" },
        { "key": "Purple", "value": "Purple" },
        { "key": "Black", "value": "Black" },
        { "key": "White", "value": "White" },
        { "key": "Brown", "value": "Brown" },
    ],

    showSuccessModal: false,
    showBottomSheetModal: false,
};

const settingsSlice = createSlice({
    name: "settingsSlice",
    initialState,
    reducers: {
        setShowSuccessModal: (state: ISettingState, action: PayloadAction<boolean>) => {
            state.showSuccessModal = action.payload;
        },
        setShowBottomSheetModal: (state: ISettingState, action: PayloadAction<boolean>) => {
            state.showBottomSheetModal = action.payload;
        },
    }
});

const { actions, reducer } = settingsSlice;

export const { setShowSuccessModal, setShowBottomSheetModal } = actions; 
export default reducer;