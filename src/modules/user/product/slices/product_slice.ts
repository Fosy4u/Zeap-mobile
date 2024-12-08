import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IProductState, { ICategory, INewestProduct } from "../models/productState_model";
import IProduct from "../models/product_model";

const initialState: IProductState = {
    tabs: ["Description", "Reviews", "Timeline"],
    selectedTab: "Description",
    timelines: ["Once measurement received", "Cutting - 2days", "Sewing - 2 weeks", "Finishing 3 days", "Dispatch 2 days", "Delivery"],
    savedMeasurements: [
        {
            id: "01",
            title: "Trouser",
            items: ["Waist: 32cm", "Length: 37cm", "Thigh: 16cm", "Hip: 34cm"]
        },
        {
            id: "02",
            title: "Long sleeve shirt",
            items: ["Shoulder: 28cm", "Sleeve: 37cm", "Neck: 16cm", "Chest: 34cm", "Wrist: 10cm"]
        },
    ],
    savedAddresses: [
        {
            id: "01",
            title: "Otor John Stephen",
            phone: "08130000000",
            email: "otorjohn@gmail.com",
            streetAddress: "No.38 Ashiek Jarma street, Jabi Abuja"
        },
        {
            id: "02",
            title: "Otor John Stephen",
            phone: "08130000000",
            email: "otorjohn@gmail.com",
            streetAddress: "No.38 Ashiek Jarma street, Jabi Abuja"
        },
    ],

    
    selectedCategory:{
        id: 1,
        name: "Female Clothings",
        totalCount: 0,
        color: ["#FFF4DF", "#FFE9BC"],
        image: require("../../../../assets/home/category_one.png"),
    },
    categories: [
        {
            id: 1,
            name: "Female Clothings",
            totalCount: 0,
            color: ["#FFF4DF", "#FFE9BC"],
            image: require("../../../../assets/home/category_one.png"),
        },
        {
            id: 2,
            name: "Male Clothings",
            totalCount: 0,
            color: ["#FEF4E6", "#FDD8A5"],
            image: require("../../../../assets/home/category_four.png"),
        },
        {
            id: 3,
            name: "Shoes",
            totalCount: 0,
            color: ["#EAE2FF", "#CCBAFF"],
            image: require("../../../../assets/home/category_two.png"),
        },
        {
            id: 4,
            name: "Accessories",
            totalCount: 0,
            color: ["#FFEFE5", "#FFDCC7"],
            image: require("../../../../assets/home/category_three.png"),
        },
        {
            id: 5,
            name: "Bags",
            totalCount: 0,
            color: ["#FFECEA", "#FEBCB4"],
            image: require("../../../../assets/home/category_five.png"),
        },
    ],
    newestProducts: [],
    femaleClothings: [],
    maleClothings: [],
    shoes: [],
    accessories: [],
    bags: [],
    popularProducts: [],
};

export const productSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {
        setSelectedTab: (state: IProductState, action: PayloadAction<string>) => {
            state.selectedTab = action.payload;
        },
        setNewestProducts: (state: IProductState, action: PayloadAction<INewestProduct[]>) => {
            state.newestProducts = action.payload;
        },
        setFemaleClothings: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.femaleClothings = action.payload;
        },
        setMaleClothings: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.maleClothings = action.payload;
        },
        setShoes: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.shoes = action.payload;
        },
        setAccessories: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.accessories = action.payload;
        },
        setBags: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.bags = action.payload;
        },
        setCategories: (state: IProductState, action: PayloadAction<{ name: string, totalCount: number} >) => {
            const { name, totalCount } = action.payload;

            // Update only the matching category
            state.categories = state.categories.map(category => 
                category.name === name
                ? { ...category, totalCount }
                : category
            )
        },
        setSelectedCategory: (state: IProductState, action: PayloadAction<ICategory>) => {
            state.selectedCategory = action.payload;
        },
        setPopularProducts: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.popularProducts = action.payload;
        },
    }
});

const { actions, reducer } = productSlice;

export const {
    setSelectedTab,
    setNewestProducts,
    setFemaleClothings,
    setMaleClothings,
    setShoes,
    setAccessories,
    setBags,
    setCategories,
    setSelectedCategory,
    setPopularProducts,
} = actions;
export default reducer;