import { createSlice } from "@reduxjs/toolkit";
import ICartState from "../models/cartState_model";


const initialState: ICartState = {
    carts: [
        {
            id: "01",
            productId: "0123456",
            title: "Classic Leather Handbag",
            color: "Brown",
            price: 2500,
            count: 1,
            image: require("../../../../assets/home/hand_bag.png")
        },
        {
            id: "02",
            productId: "0987654",
            title: "Swedish stylish women flay gown",
            color: "Dark Ash",
            price: 2500,
            count: 1,
            image: require("../../../../assets/home/gown_one.png")
        },
    ]
};

const cartSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {}
});

const { actions, reducer } = cartSlice;

export const {  } = actions;
export default reducer;