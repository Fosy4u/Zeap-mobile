import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISavedState {
    savedProductIds: string[];
    wishIdsByProductId: Record<string, string>;
}

const initialState: ISavedState = {
    savedProductIds: [],
    wishIdsByProductId: {},
};

const savedSlice = createSlice({
    name: "savedState",
    initialState,
    reducers: {
        setSavedProductIds: (state, action: PayloadAction<string[]>) => {
            state.savedProductIds = Array.from(new Set(action.payload));
        },
        setSavedWishEntries: (state, action: PayloadAction<{ productId: string; wishId?: string }[]>) => {
            state.savedProductIds = Array.from(new Set(action.payload.map((entry) => entry.productId)));
            state.wishIdsByProductId = action.payload.reduce<Record<string, string>>((lookup, entry) => {
                if (entry.wishId) { lookup[entry.productId] = entry.wishId; }
                return lookup;
            }, {});
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

export const {
    setSavedProductIds,
    setSavedWishEntries,
    addSavedProductId,
    removeSavedProductId,
} = savedSlice.actions;
export default savedSlice.reducer;
