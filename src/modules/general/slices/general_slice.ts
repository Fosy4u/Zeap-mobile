import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IGeneralStateModel from "../models/generalState_model";
import {IAccessories, IClothes, IShoes} from "../models/productOptions_model";
import { setProduct } from "../../user/products/slices/product_slice";

const initialState: IGeneralStateModel = {
    productTypes: [],

    readyMadeClothesOptions: {
        mainEnums:          [],
        genderEnums:        [],
        ageGroupEnums:      [],
        ageRangeEnums:      [],
        statusEnums:        [],
        clothStyleEnums:    [],
        sleeveLengthEnums:  [],
        designEnums:        [],
        fasteningEnums:     [],
        occasionEnums:      [],
        fitEnums:           [],
        brandEnums:         [],
        clothSizeEnums:     [],
        colorEnums:         [],
    },
    readyMadeShoesOptions: {
        genderEnums:          [],
        ageGroupEnums:        [],
        ageRangeEnums:        [],
        statusEnums:          [],
        shoeStyleEnums:       [],
        shoeTypeEnums:        [],
        designEnums:          [],
        fasteningEnums:       [],
        occasionEnums:        [],
        brandEnums:           [],
        colorEnums:           [],
        heelHeightEnums:      [],
        heelTypeEnums:        [],
        bodyMeasurementEnums: [],
        shoeSizeEnums:        [],
    },
    bespokeClothesOptions: {
        mainEnums:          [],
        genderEnums:        [],
        ageGroupEnums:      [],
        ageRangeEnums:      [],
        statusEnums:        [],
        clothStyleEnums:    [],
        sleeveLengthEnums:  [],
        designEnums:        [],
        fasteningEnums:     [],
        occasionEnums:      [],
        fitEnums:           [],
        brandEnums:         [],
        clothSizeEnums:     [],
        colorEnums:         [],
    },
    bespokeShoesOptions: {
        genderEnums:          [],
        ageGroupEnums:        [],
        ageRangeEnums:        [],
        statusEnums:          [],
        shoeStyleEnums:       [],
        shoeTypeEnums:        [],
        designEnums:          [],
        fasteningEnums:       [],
        occasionEnums:        [],
        brandEnums:           [],
        colorEnums:           [],
        heelHeightEnums:      [],
        heelTypeEnums:        [],
        bodyMeasurementEnums: [],
        shoeSizeEnums:        [],
    },
    accessoriesOptions: {
        genderEnums:          [],
        ageGroupEnums:        [],
        ageRangeEnums:        [],
        statusEnums:          [],
        accessoryTypeEnums:   [],
        accessoryStyleEnums:  [],
        accessorySizeEnums:   [],
        designEnums:          [],
        fasteningEnums:       [],
        occasionEnums:        [],
        brandEnums:           [],
        colorEnums:           [],
    },

    isLoading: false,
    loadingMessage: "",
};

export const generalSlice = createSlice({
    name: "generalSlice",
    initialState,
    reducers: {
        setProductTypes: (state: IGeneralStateModel, action: PayloadAction<string[]>) => {
            state.productTypes = action.payload;
        },
        setReadyMadeClothesOptions: (state: IGeneralStateModel, action: PayloadAction<IClothes>) => {
            state.readyMadeClothesOptions = action.payload;
        },
        setReadyMadeShoesOptions: (state: IGeneralStateModel, action: PayloadAction<IShoes>) => {
            state.readyMadeShoesOptions = action.payload;
        },
        setBespokeClothesOptions: (state: IGeneralStateModel, action: PayloadAction<IClothes>) => {
            state.bespokeClothesOptions = action.payload;
        },
        setBespokeShoesOptions: (state: IGeneralStateModel, action: PayloadAction<IShoes>) => {
            state.bespokeShoesOptions = action.payload;
        },
        setAccessoriesOptions: (state: IGeneralStateModel, action: PayloadAction<IAccessories>) => {
            state.accessoriesOptions = action.payload;
        },

        setIsLoading: (state: IGeneralStateModel, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setLoadingMessage: (state: IGeneralStateModel, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },
    }
});

const { actions, reducer } = generalSlice;

export const {
    setProductTypes,
    setReadyMadeClothesOptions,
    setReadyMadeShoesOptions,
    setBespokeClothesOptions,
    setBespokeShoesOptions,
    setAccessoriesOptions,

    setIsLoading,
    setLoadingMessage,
} = actions;
export default reducer;