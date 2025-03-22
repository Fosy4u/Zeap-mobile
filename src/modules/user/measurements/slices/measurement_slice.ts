import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IMeasurementState from "../models/measurementState_model.ts";
import IRequiredMeasurementFormFields from "../models/requiredMeasurementFormField_model.ts";
import IBodyMeasurement from "../models/bodyMeasurement_model.ts";
import { set } from "react-hook-form";

const initialState: IMeasurementState = {
    selectedCartID: "",
    saveMeasurementForNextTime: false,
    showSavedMeasurementBottomSheet: false,
    selectedUnit: "inch",
    unitOptions: [
        { "key": "inch", "value": "inch" },
        { "key": "cm", "value": "cm" },
    ],
    allBodyMeasurementTemplates: [],
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
    }
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
        setShowSavedMeasurementBottomSheet: (state: IMeasurementState, action: PayloadAction<boolean>) => {
            state.showSavedMeasurementBottomSheet = action.payload;
        },
        setSelectedUnit: (state: IMeasurementState, action: PayloadAction<string>) => {
            state.selectedUnit = action.payload; 
        },
        setAllBodyMeasurementTemplates: (state: IMeasurementState, action: PayloadAction<IBodyMeasurement[]>) => {
            state.allBodyMeasurementTemplates = action.payload;
        },
        setSelectedMeasurementTemplate: (state: IMeasurementState, action: PayloadAction<IBodyMeasurement>) => {
            state.selectedMeasurementTemplate = action.payload;
        },
        setRequiredMeasurementFormFields: (state: IMeasurementState, action: PayloadAction<IRequiredMeasurementFormFields>) => {
            state.requiredMeasurementFormFields = action.payload;
        },
    }
});

const { actions, reducer } = measurementSlice;

export const {
    setSelectedCartID,
    setSaveMeasurementForNextTime,
    setShowSavedMeasurementBottomSheet,
    setSelectedUnit,
    setAllBodyMeasurementTemplates,
    setSelectedMeasurementTemplate,
    setRequiredMeasurementFormFields
} = actions;
export default reducer;