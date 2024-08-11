import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IHomeState, { ICategory } from "../models/homeState_model";

const initialState: IHomeState = {
    selectedCategory:{
        id: 1,
        name: "Female Clothings",
        itenCount: 3630,
        color: ["#FFF4DF", "#FFE9BC"],
        image: require("../../../assets/home/category_one.png"),
    },
    categories: [
        {
            id: 1,
            name: "Female Clothings",
            itenCount: 3630,
            color: ["#FFF4DF", "#FFE9BC"],
            image: require("../../../assets/home/category_one.png"),
        },
        {
            id: 2,
            name: "Shoes",
            itenCount: 940,
            color: ["#EAE2FF", "#CCBAFF"],
            image: require("../../../assets/home/category_two.png"),
        },
        {
            id: 3,
            name: "Accessories",
            itenCount: 1782,
            color: ["#FFEFE5", "#FFDCC7"],
            image: require("../../../assets/home/category_three.png"),
        },
        {
            id: 4,
            name: "Men Clothings",
            itenCount: 3630,
            color: ["#FEF4E6", "#FDD8A5"],
            image: require("../../../assets/home/category_four.png"),
        },
        {
            id: 5,
            name: "Bags",
            itenCount: 610,
            color: ["#FFECEA", "#FEBCB4"],
            image: require("../../../assets/home/category_five.png"),
        },
    ],
    bestDeals: [
        {
          id: "001",
          name: "Classic Leather Handbag",
          productType: "Ready-made",
          price: "230.99",
          rating: 4.3,
          isFavorite: false,
          image: require("../../../assets/home/hand_bag.png")
        },
        {
          id: "002",
          name: "Swedish stylish women flay gown",
          productType: "Tailor-made",
          price: "230.99",
          rating: 4.3,
          isFavorite: false,
          image: require("../../../assets/home/gown_one.png")
        }
    ]
};

export const homeSlice = createSlice({
    name: "homeSlice",
    initialState,
    reducers: {
        setSelectedCategory: (state: IHomeState, action: PayloadAction<ICategory>) => {
            state.selectedCategory = action.payload;
        },
        // setBestDeal: (state: IHomeState, action: PayloadAction<ICategory>) => {
        //     state.bestDeal = action.payload;
        // }
    }
});

const { actions, reducer } = homeSlice;

export const { setSelectedCategory } = actions;
export default reducer;