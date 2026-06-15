import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISavedState {
    // productIds currently in the user's wishlist. Kept as an optimistic local
    // mirror so hearts toggle instantly; seeded/reconciled from getWishlist.
    savedProductIds: string[];
}

const initialState: ISavedState = {
    savedProductIds: [],
};

const savedSlice = createSlice({
    name: "savedState",
    initialState,
    reducers: {
        setSavedProductIds: (state, action: PayloadAction<string[]>) => {
            state.savedProductIds = Array.from(new Set(action.payload));
        },
        addSavedProductId: (state, action: PayloadAction<string>) => {
            if (!state.savedProductIds.includes(action.payload)) {
                state.savedProductIds.push(action.payload);
            }
        },
        removeSavedProductId: (state, action: PayloadAction<string>) => {
            state.savedProductIds = state.savedProductIds.filter((id) => id !== action.payload);
        },
    },
});

export const { setSavedProductIds, addSavedProductId, removeSavedProductId } = savedSlice.actions;
export default savedSlice.reducer;
