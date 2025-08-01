import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IReviewAndRatingState from "../models/reviewAndRatingState_model";
import IReview, { IReviewOrder } from "../models/review_model";

const initialState: IReviewAndRatingState = {
    tabs: ["Pending Reviews", "Given Reviews"],
    selectedTab: "Pending Reviews",
    
    pendingReviews: [],
    givenReviews: [],
    reviewOrder: {
        productId: "",
        title: "",
        images: [],
        orderId: "",
        color: "",
        size: "",
        sku: "",
        quantity: 0,
        deliveryDate: ""
    },

    isLoading: false,
    loadingMessage: "",
};

const reviewAndRatingState = createSlice({
    name: "reviewAndRatingState",
    initialState,

    reducers: {
        setSelectedTab: (state: IReviewAndRatingState, action: PayloadAction<string>) => {
            state.selectedTab = action.payload;
        },
        setPendingReviews: (state: IReviewAndRatingState, action: PayloadAction<IReview["pendingReviews"]>) => {
            state.pendingReviews = action.payload;
        },
        setGivenReviews: (state: IReviewAndRatingState, action: PayloadAction<IReview["givenReviews"]>) => {
            state.givenReviews = action.payload;
        },
        setReviewOrder: (state: IReviewAndRatingState, action: PayloadAction<IReviewOrder>) => {
            state.reviewOrder = action.payload;
        },
        setIsLoading: (state: IReviewAndRatingState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setLoadingMessage: (state: IReviewAndRatingState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },
    }
});

const { actions, reducer } = reviewAndRatingState;
export const {
    setSelectedTab,
    setPendingReviews,
    setGivenReviews,
    setReviewOrder,
    setIsLoading,
    setLoadingMessage,
} = actions;
export default reducer; 