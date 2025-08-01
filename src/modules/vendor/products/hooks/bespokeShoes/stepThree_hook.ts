import { useEffect, useState } from "react";
import { IBodyMeasurementEnum } from "../../../../general/models/productOptions_model";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { RootState } from "../../../../../redux/store/store";
import { useLazyGetProductBodyMeasurementsQuery, useUpdateWithBodyMeasurementsMutation } from "../../apis/bespokeProduct_api";
import { setLoadingMessage, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { stepThreeAddBespokeShoesSchema } from "../../validations/addProduct_validation";
import { Alert } from "react-native";
import handleError from "../../../../general/hooks/errorHandler_hook";

const useStepThreeHook = () => {
    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { bespokeShoesOptions } = useSelector((state: RootState) => state.generalState);
    const [measurementOptions, setMeasurementOptions] = useState<IBodyMeasurementEnum[]>([]);
    const [formattedMeasurements, setFormattedMeasurements] = useState<any[]>([]);
    const dispatch = useDispatch();
    
    const [getProductBodyMeasurements] = useLazyGetProductBodyMeasurementsQuery();
    const [updateWithBodyMeasurements] = useUpdateWithBodyMeasurementsMutation();
    

    // Handle submit
    const handleSubmit = async () => {
        dispatch(setLoadingMessage("Updating body measurements..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            const requestData = {
                productId,
                measurements: formattedMeasurements,
                currentStep: 3,
            };

            // Validate request data
            const validatedRequestData = await stepThreeAddBespokeShoesSchema.validate(requestData);
            // console.log("REQUEST DATA::: ", validatedRequestData);

            const updateWithBodyMeasurementsResponseData = await updateWithBodyMeasurements(validatedRequestData).unwrap();
            console.log("RESPONSE::: ", updateWithBodyMeasurementsResponseData);

            if (updateWithBodyMeasurementsResponseData) {
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
                dispatch(setSelectedStep(4));
            }
        } catch (error: any) {
            let errorMessage = "";
        
            // Handle Yup validation errors
            if (error instanceof yup.ValidationError) {
                errorMessage = error.message;
            } 
            // Handle RTK Query API errors (assuming they follow a standard structure)
            else if (error?.status) {
                errorMessage = error["data"]["error"];
            } 
            // Handle other generic errors
            else {
                errorMessage = error.message || "An unexpected error occurred.";
            }

            Alert.alert("Error", errorMessage);
            console.log("Error: ", errorMessage);
            
        };
    };

    // Handle get peoduct body measurements
    const handleGetProductMeasurements = async () => {
        if (!product) return;

        dispatch(setLoadingMessage("Getting product measurements..."));
        dispatch(setProductIsLoading(true));

        const productId = product.productId!;
        // console.log("PRODUCT ID: ", productId);

        try {
            const responseData = await getProductBodyMeasurements(productId).unwrap();
            // console.log("BODY MEASUREMENTS RESPONSE: ", JSON.stringify(responseData.measurements!));
            
            if (responseData) {
                setFormattedMeasurements(responseData.measurements!);
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };

    // Handle format measurement options
    const handleFormatMeasurementOptions = async () => {
        if (!bespokeShoesOptions) return;

        // Set measurement options
        const formattedMeasurementOptions = bespokeShoesOptions.bodyMeasurementEnums ?? [];
        setMeasurementOptions(formattedMeasurementOptions);
    };
    
    const handleSelectMeasurementField = (
        selectedValue: boolean,
        measurementName: string,
        fieldName: string
    ) => {
        const measurements = (prevMeasurements: any) => {
            // Create a deep clone of the current measurements
            let updatedMeasurements = JSON.parse(JSON.stringify(prevMeasurements));
            
            // Find if the section already exists in formattedMeasurements
            const sectionIndex = updatedMeasurements.findIndex((m: any) => m.name === measurementName);
            
            if (selectedValue) { 
                // When checkbox is checked
                if (sectionIndex === -1) {
                    // If section doesn't exist, add new section with the field
                    updatedMeasurements.push({
                        name: measurementName,
                        fields: [fieldName]
                    });
                } else {
                    // If section exists, add field if it's not already there
                    const section = updatedMeasurements[sectionIndex];
                    if (!section.fields.includes(fieldName)) {
                        section.fields.push(fieldName);
                    }
                }
            } else {
                // When checkbox is unchecked
                if (sectionIndex !== -1) {
                    const section = updatedMeasurements[sectionIndex];

                    // Remove the field from the section
                    section.fields = section.fields.filter((field: string) => field !== fieldName);
                    
                    // If no fields remain in the section, remove the entire section
                    if (section.fields.length === 0) {
                        updatedMeasurements = updatedMeasurements.filter((measurement: any) => measurement.name !== measurementName);
                        // updatedMeasurements.splice(sectionIndex, 1);
                    }
                }
            }
            
            console.log("UPDATED MEASUREMENTS: ", updatedMeasurements);
            return updatedMeasurements;
        };
        
        setFormattedMeasurements(measurements);
    };

    useEffect(() => {
        if (bespokeShoesOptions!) {
            handleFormatMeasurementOptions();
        }
    }, [bespokeShoesOptions]);
    useEffect(() => {
        if (product) {
            handleGetProductMeasurements();
        }
    }, [product]);


    return {
        formattedMeasurements,
        measurementOptions,
        handleSelectMeasurementField,
        handleSubmit,
    };
};

export default useStepThreeHook;