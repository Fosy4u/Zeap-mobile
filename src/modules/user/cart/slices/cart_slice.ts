import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICartState from "../models/cartState_model";
import ICart from "../models/cart_model";

const initialState: ICartState = {
    cart: {
        _id: "",
        user: "",
        basketId: "",
        basketItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    cartTotal: 0,
    cartLoading: false,
    cartError: false,
};

export const cartSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {
        setCart: (state: ICartState, action: PayloadAction<ICart>) => {
            state.cart = action.payload;
        },
        setCartTotal: (state: ICartState, action: PayloadAction<number>) => {
            state.cartTotal = action.payload;
        },
        setCartLoading: (state: ICartState, action: PayloadAction<boolean>) => {
            state.cartLoading = action.payload;
        },
        setCartError: (state: ICartState, action: PayloadAction<boolean>) => {
            state.cartError = action.payload;
        },
    },
});

const { actions, reducer } = cartSlice;

export const { setCart, setCartTotal, setCartLoading, setCartError } = actions;

export default reducer;