import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IDashboardWrapperState, { IDashboard } from "../models/dashboardWrapperState_model";

const initialState: IDashboardWrapperState = {
  dashboards: [
    {
      id: 1,
      name: "Home",
      children: ["Men", "Women", "Kids", "Clothings", "Shoes", "Bags", "Accesories", "Dresses", "Weddings", "Tops", "Bottoms", "Matching Sets", "Jeans", "Brands", "Sales"],
    },
    {
      id: 2,
      name: "Bespoke",
      children: ["Men", "Women", "Kids", "Clothings", "Shoes", "Dresses", "Weddings", "Tops", "Matching Sets", "Sales"],
    },
    {
      id: 3,
      name: "Ready To Wear",
      children: ["Men", "Women", "Kids", "Clothings", "Shoes", "Dresses", "Weddings", "Tops", "Bottoms", "Matching Sets", "Jeans", "Brands", "Sales"],
    },
    {
      id: 4,
      name: "Accessories",
      children: ["Men", "Women", "Kids", "Bags", "Accesories", "Weddings", "Sales"],
    },
  ],
  selectedDashboard: {
    id: 1,
    name: "Home",
    children: ["Men", "Women", "Kids", "Clothings", "Shoes", "Bags", "Accesories", "Dresses", "Weddings", "Tops", "Bottoms", "Matching Sets", "Jeans", "Brands", "Sales"],
  },
  isMobileMenuOpen: false,
};

export const dashboardWrapperSlice = createSlice({
  name: "dashboardWrapperSlice",
  initialState,
  reducers: {
    
    setSelectedDashboard: (state: IDashboardWrapperState, action: PayloadAction<IDashboard>) => {
        state.selectedDashboard = action.payload;
    },

    setIsMobileMenuOpen: (state: IDashboardWrapperState, action: PayloadAction<boolean>) => {
        state.isMobileMenuOpen = action.payload;
    },
  }
});

const { actions, reducer } = dashboardWrapperSlice;

export const {
  setSelectedDashboard,
  setIsMobileMenuOpen,
} = actions;
export default reducer;