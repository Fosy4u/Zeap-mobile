import { createSlice } from "@reduxjs/toolkit";
import phoneCodes from "../../../../utils/countriesPhoneCodes.json";
import ISettingState from "../models/settingsState_model";


const initialState: ISettingState = {
    phoneCodeOptions: phoneCodes,
};

const settingsSlice = createSlice({
    name: "settingsSlice",
    initialState,
    reducers: {}
});

const { actions, reducer } = settingsSlice;

export const {} = actions; 
export default reducer;