import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IProfileState, { IUser } from "../models/profileState_model";
import phoneCodes from "../../../utils/countriesPhoneCodes.json";

const initialState: IProfileState = {
    userData: {
        _id: "",
        userId: "",
        uid: "",
        shopEnabled: false,
        signInCount: 0,
        firstName: "",
        lastName: "",
        disabled: false,
        isAdmin: false,
        superAdmin: false,
        email: "",
        createdBy: "",
        social: {
            _id: ""
        },
        emailVerified: false,
        phoneNumberVerified: false,
        isVendor: false,
        points: 0,
        updatedAt: new Date,
        createdAt: new Date,
        __v: 0,
        shopId: ""
    },
    token: "",

    phoneCodeOptions: phoneCodes,
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
};


const profileSlice = createSlice({
    name: "profileSlice",
    initialState,
    reducers: {
        setUserData: (state: IProfileState, action: PayloadAction<IUser>) => {
            state.userData = action.payload;
        },
        setToken: (state: IProfileState, action: PayloadAction<string>) => {
            state.token = action.payload;
        }
    }
});

const { actions, reducer } = profileSlice;
export const { setUserData, setToken } = actions;
export default reducer;