import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IMeasurementState from "../models/measurementState_model.ts";
import IRequiredMeasurementFormFields from "../models/requiredMeasurementFormField_model.ts";
import IBodyMeasurement from "../models/bodyMeasurement_model.ts";

const initialState: IMeasurementState = {
    saveMeasurementForNextTime: false,
    showSavedMeasurementBottomSheet: false,
    selectedUnit: "inch",
    unitOptions: [
        { "key": "inch", "value": "inch" },
        { "key": "cm", "value": "cm" },
    ],
    allBodyMeasurementTemplates: [],
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
        setRequiredMeasurementFormFields: (state: IMeasurementState, action: PayloadAction<IRequiredMeasurementFormFields>) => {
            state.requiredMeasurementFormFields = action.payload;
        },
    }
});

const { actions, reducer } = measurementSlice;

export const {
    setSaveMeasurementForNextTime,
    setShowSavedMeasurementBottomSheet,
    setSelectedUnit,
    setAllBodyMeasurementTemplates,
    setRequiredMeasurementFormFields
} = actions;
export default reducer;