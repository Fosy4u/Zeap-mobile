import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IHomeState from "../models/homeState_model";
import { State } from "react-native-gesture-handler";

const initialState: IHomeState = {
    categories: ["Women clothes", "Men clothes", "Accessories", "Shoes", "Joweries"],
    selectedCategory:"Women clothes",
};

export const homeSlice = createSlice({
    name: "homeSlice",
    initialState,
    reducers: {
        setSelectedCategory: (State: IHomeState, action: PayloadAction<string>) => {
            State.selectedCategory = action.payload;
        }
    }
});

const { actions, reducer } = homeSlice;

export const { setSelectedCategory } = actions;
export default reducer;