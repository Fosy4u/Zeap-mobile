import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IProductState from "../models/productState_model";

const initialState: IProductState = {
    tabs: ["Description", "Reviews", "Timeline"],
    selectedTab: "Description",
    timelines: ["Once measurement received", "Cutting - 2days", "Sewing - 2 weeks", "Finishing 3 days", "Dispatch 2 days", "Delivery"],
};

export const productSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {
        setSelectedTab: (state: IProductState, action: PayloadAction<string>) => {
            state.selectedTab = action.payload;
        }
    }
});

const { actions, reducer } = productSlice;

export const { setSelectedTab } = actions;
export default reducer;