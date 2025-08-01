import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IProductState, { ICategory } from "../models/productState_model";
import IProduct from "../models/product_model";
import { IColorEnum } from "../../../general/models/productOptions_model";
import IProductDetails from "../models/productDetails_model";
import { set } from "react-hook-form";
import IPromoProduct from "../models/promotion_model";
import IReview from "../../../general/models/review_model";
import IReviewAndRating from "../../../general/models/review_model";

const initialState: IProductState = {
    productID: "",
    tabs: ["Description", "Reviews", "Timeline"],
    selectedTab: "Description",
    timelines: ["Once measurement received", "Cutting - 2days", "Sewing - 2 weeks", "Finishing 3 days", "Dispatch 2 days", "Delivery"],

    
    promoProducts: [],
    productPromotion: {},
    product: {},
    allProducts: [],
    recentlyViewedProducts: [],
    recommendedProducts: [],
    wishListProducts: [],
    selectedCategory:{
        id: 1,
        name: "Female Clothings",
        totalCount: 0,
        color: ["#FFF4DF", "#FFE9BC"],
        image: require("../../../../../assets/images/home/category_one.png"),
    },
    categories: [
        {
            id: 1,
            name: "Female Clothings",
            totalCount: 0,
            color: ["#FFF4DF", "#FFE9BC"],
            image: require("../../../../../assets/images/home/category_one.png"),
        },
        {
            id: 2,
            name: "Male Clothings",
            totalCount: 0,
            color: ["#FEF4E6", "#FDD8A5"],
            image: require("../../../../../assets/images/home/category_four.png"),
        },
        {
            id: 3,
            name: "Shoes",
            totalCount: 0,
            color: ["#EAE2FF", "#CCBAFF"],
            image: require("../../../../../assets/images/home/category_two.png"),
        },
        {
            id: 4,
            name: "Accessories",
            totalCount: 0,
            color: ["#FFEFE5", "#FFDCC7"],
            image: require("../../../../../assets/images/home/category_three.png"),
        },
        {
            id: 5,
            name: "Bags",
            totalCount: 0,
            color: ["#FFECEA", "#FEBCB4"],
            image: require("../../../../../assets/images/home/category_five.png"),
        },
    ],
    femaleClothing: [],
    maleClothing: [],
    shoes: [],
    accessories: [],
    bags: [],
    popularProducts: [],
    newestArrivals: [],

    featuredPrice: 0,
    selectedColor: {
        background: "",
        name: "",
        hex: ""
    },
    selectedSize: "",
    selectedQuantity: 1,

    searchPhrases: ["Women jacket", "Men jacket", "Men’s summer sweater", "Joggers", "Kids hoodie"],
    filteredSearchPhrases: ["Women jacket", "Men jacket", "Men’s summer sweater", "Joggers", "Kids hoodie"],
    searchWord: "",
    showSizedGuideBottomSheet: false,

    reviewAndRating: {
        averageRating: 0,
        reviews: [],
        imageMatch: {}
    },

    sizeGuide: {},

    isLoading: false,
    loadingMessage: "",
};

export const productSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {
        setSearchWord: (state: IProductState, action: PayloadAction<string>) => {
            state.searchWord = action.payload;
            if (action.payload === "") {
                state.filteredSearchPhrases = state.searchPhrases;
                return;
            }
            state.filteredSearchPhrases = state.searchPhrases.filter(phrase => phrase.toLowerCase().includes(action.payload.toLowerCase()));
        },
        setProductID: (state: IProductState, action: PayloadAction<string>) => {
            state.productID = action.payload;
        },
        setPromoProducts: (state: IProductState, action: PayloadAction<IPromoProduct[]>) => {
            state.promoProducts = action.payload;
        },
        setProductPromotion: (state: IProductState, action: PayloadAction<IPromoProduct>) => {
            state.productPromotion = action.payload;
        },
        setProduct: (state: IProductState, action: PayloadAction<IProductDetails>) => {
            state.product = action.payload;
        },
        setAllProducts: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.allProducts = action.payload;
        },
        setRecentlyViewedProducts: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.recentlyViewedProducts = action.payload;
        },
        setRecommendedProducts: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.recommendedProducts = action.payload;
        },
        setWishListProducts: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.wishListProducts = action.payload;
        },
        setSelectedTab: (state: IProductState, action: PayloadAction<string>) => {
            state.selectedTab = action.payload;
        },
        setNewestArrivals: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.newestArrivals = action.payload;
        },
        setFemaleClothing: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.femaleClothing = action.payload;
        },
        setMaleClothing: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.maleClothing = action.payload;
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
            );
        },
        setSelectedCategory: (state: IProductState, action: PayloadAction<ICategory>) => {
            state.selectedCategory = action.payload;
        },
        setPopularProducts: (state: IProductState, action: PayloadAction<IProduct[]>) => {
            state.popularProducts = action.payload;
        },
        setFeaturedPrice: (state: IProductState, action: PayloadAction<number>) => {
            state.featuredPrice = action.payload;
        },
        setSelectedColor: (state: IProductState, action: PayloadAction<IColorEnum>) => {
            state.selectedColor = action.payload;
        },
        setSelectedSize: (state: IProductState, action: PayloadAction<string>) => {
            state.selectedSize = action.payload;
        },
        setSelectedQuantity: (state: IProductState, action: PayloadAction<number>) => {
            state.selectedQuantity = action.payload;
        },
        setShowSizedGuideBottomSheet: (state: IProductState, action: PayloadAction<boolean>) => {
            state.showSizedGuideBottomSheet = action.payload;
        },
        setReviewAndRating: (state: IProductState, action: PayloadAction<IReviewAndRating>) => {
            state.reviewAndRating = action.payload;
        },
        setSizeGuide: (state: IProductState, action: PayloadAction<any>) => {
            state.sizeGuide = action.payload;
        },
        setIsLoading: (state: IProductState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setLoadingMessage: (state: IProductState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        }
    }
});

const { actions, reducer } = productSlice;

export const {
    setSearchWord,
    setPromoProducts,
    setProductPromotion,
    setProduct,
    setAllProducts,
    setRecentlyViewedProducts,
    setRecommendedProducts,
    setWishListProducts,
    setProductID,
    setSelectedTab,
    setNewestArrivals,
    setFemaleClothing,
    setMaleClothing,
    setShoes,
    setAccessories,
    setBags,
    setCategories,
    setSelectedCategory,
    setPopularProducts,
    setFeaturedPrice,
    setSelectedColor,
    setSelectedSize,
    setSelectedQuantity,
    setShowSizedGuideBottomSheet,
    setReviewAndRating,
    setSizeGuide,
    setIsLoading,
    setLoadingMessage,
} = actions;
export default reducer;