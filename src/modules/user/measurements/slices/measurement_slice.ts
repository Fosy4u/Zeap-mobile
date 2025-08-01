import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IMeasurementState from "../models/measurementState_model.ts";
import IRequiredMeasurementFormFields from "../models/requiredMeasurementFormField_model.ts";
import IBodyMeasurement from "../models/bodyMeasurement_model.ts";
import { set } from "react-hook-form";
import IBodyMeasurementGuide from "../models/bodyMeasurementGuide_model.ts";

const initialState: IMeasurementState = {
    selectedCartID: "",
    saveMeasurementForNextTime: false,
    showAddNewMeasurementBottomSheet: false,
    showSelectGenderBottomSheet: false,
    selectedUnit: "inch",
    unitOptions: [
        { "key": "inch", "value": "inch" },
        { "key": "cm", "value": "cm" },
    ],
    allSavedMeasurements: [],
    selectedMeasurementTemplate: {},
    requiredMeasurementFormFields: {
        _id: "",
        productId: "",
        measurements: [
            {
                name: "",
                fields: [""],
                _id: ""
            }
        ]
    },
    bodyMeasurementGuides: [],

    loadingMessage: "",
    isLoading: false
};

export const measurementSlice = createSlice({
    name: "measurementSlice",
    initialState,
    reducers: {
        setSelectedCartID: (state: IMeasurementState, action: PayloadAction<string>) => {
            state.selectedCartID = action.payload;
        },
        setSaveMeasurementForNextTime: (state: IMeasurementState, action: PayloadAction<boolean>) => {
            state.saveMeasurementForNextTime = action.payload;
        },
        setShowAddNewMeasurementBottomSheet: (state: IMeasurementState, action: PayloadAction<boolean>) => {
            state.showAddNewMeasurementBottomSheet = action.payload;
        },
        setShowSelectGenderBottomSheet: (state: IMeasurementState, action: PayloadAction<boolean>) => {
            state.showSelectGenderBottomSheet = action.payload;
        },
        setSelectedUnit: (state: IMeasurementState, action: PayloadAction<string>) => {
            state.selectedUnit = action.payload; 
        },
        setAllSavedMeasurements: (state: IMeasurementState, action: PayloadAction<IBodyMeasurement[]>) => {
            state.allSavedMeasurements = action.payload;
        },
        setSelectedMeasurementTemplate: (state: IMeasurementState, action: PayloadAction<IBodyMeasurement>) => {
            state.selectedMeasurementTemplate = action.payload;
        },
        setRequiredMeasurementFormFields: (state: IMeasurementState, action: PayloadAction<IRequiredMeasurementFormFields>) => {
            state.requiredMeasurementFormFields = action.payload;
        },
        setBodyMeasurementGuides: (state: IMeasurementState, action: PayloadAction<IBodyMeasurementGuide[]>) => {
            state.bodyMeasurementGuides = action.payload;
        },
        setLoadingMessage: (state: IMeasurementState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },
        setIsLoading: (state: IMeasurementState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
});

const { actions, reducer } = measurementSlice;

export const {
    setSelectedCartID,
    setSaveMeasurementForNextTime,
    setShowAddNewMeasurementBottomSheet,
    setShowSelectGenderBottomSheet,
    setSelectedUnit,
    setAllSavedMeasurements,
    setSelectedMeasurementTemplate,
    setRequiredMeasurementFormFields,
    setBodyMeasurementGuides,
    setLoadingMessage,
    setIsLoading
} = actions;
export default reducer;