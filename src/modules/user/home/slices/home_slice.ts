import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IHomeState from "../models/homeState_model";

const initialState: IHomeState = {
    bestDeals: [
        {
          id: "001",
          name: "Classic Leather Handbag",
          productType: "Ready-made",
          price: "230.99",
          rating: 4.3,
          isFavorite: false,
          image: require("../../../../assets/home/hand_bag.png")
        },
        {
          id: "002",
          name: "Swedish stylish women flay gown",
          productType: "Tailor-made",
          price: "230.99",
          rating: 4.3,
          isFavorite: false,
          image: require("../../../../assets/home/gown_one.png")
        }
    ]
};

export const homeSlice = createSlice({
    name: "homeSlice",
    initialState,
    reducers: {
        // setBestDeal: (state: IHomeState, action: PayloadAction<ICategory>) => {
        //     state.bestDeal = action.payload;
        // }
    }
});

const { actions, reducer } = homeSlice;

export const {  } = actions;
export default reducer;