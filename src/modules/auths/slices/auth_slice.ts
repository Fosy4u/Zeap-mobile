import { createSlice } from "@reduxjs/toolkit";
import IAuthState from "../models/auth_model";


const initialState: IAuthState = {

};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {}
});

const { actions, reducer } = authSlice;

export const {} = actions;
export default reducer;