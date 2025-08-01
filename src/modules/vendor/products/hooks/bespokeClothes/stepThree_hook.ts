import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { RootState } from "../../../../../redux/store/store";
import { IBodyMeasurementEnum } from "../../../../general/models/productOptions_model";
import { stepThreeAddBespokeClothesSchema } from "../../validations/addProduct_validation";
import { useLazyGetProductBodyMeasurementsQuery, useUpdateWithBodyMeasurementsMutation } from "../../apis/bespokeProduct_api";
import { Alert } from "react-native";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useLazyGetProductByProductIDQuery } from "../../apis/product_api";


const useStepThreeHook = () => {

    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { bespokeClothesOptions } = useSelector((state: RootState) => state.generalState);
    const [bodyMeasurementOptions, setBodyMeasurementOptions] = useState<IBodyMeasurementEnum[]>([]);
    const [formattedMeasurements, setFormattedMeasurements] = useState<any[]>([]);
    const dispatch = useDispatch();    

    const [getProductBodyMeasurements] = useLazyGetProductBodyMeasurementsQuery();
    const [updateWithBodyMeasurements] = useUpdateWithBodyMeasurementsMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery(); 
    

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
            const validatedRequestData = await stepThreeAddBespokeClothesSchema.validate(requestData);
            // console.log("REQUEST DATA::: ", JSON.stringify(validatedRequestData));

            const updateWithBodyMeasurementsResponseData = await updateWithBodyMeasurements(validatedRequestData).unwrap();
            // console.log("RESPONSE::: ", updateWithBodyMeasurementsResponseData);

            if (updateWithBodyMeasurementsResponseData) {

                dispatch(setLoadingMessage("Getting product details..."));

                // Get the updated product data
                const updatedProduct = await getProductByProductID(productId).unwrap();
                console.log("UPDATED PRODUCT::: ", updatedProduct);

                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setSelectedStep(4));
                }
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
    const handleGetProductBodyMeasurements = async () => {
        if (!product) return;
        dispatch(setLoadingMessage("Getting product measurements..."));
        dispatch(setProductIsLoading(true));

        const productId = product.productId!;
        // console.log("PRODUCT ID: ", productId);

        const responseData = await getProductBodyMeasurements(productId).unwrap();
        // console.log("BODY MEASUREMENTS RESPONSE: ", JSON.stringify(responseData.measurements!));
        
        if (responseData) {
            setFormattedMeasurements(responseData.measurements!);
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    const handleFormatBodyMeasurementOptions = async () => {
        if (!bespokeClothesOptions) return;

        // Set body measurement options
        const formattedAfricanAgbadaOptions = bespokeClothesOptions.bodyMeasurementEnums ?? [];
        setBodyMeasurementOptions(formattedAfricanAgbadaOptions);
    };

    // handleSelectMeasurementField: This format the measurements and appends it to the formattedMeasurements array
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
            
            return updatedMeasurements;
        };
        
        setFormattedMeasurements(measurements);
    };

    
    useEffect(() => {
        if (bespokeClothesOptions?.mainEnums) {
            handleFormatBodyMeasurementOptions();
        }
    }, [bespokeClothesOptions]);
    useEffect(() => {
        if (product) {
            handleGetProductBodyMeasurements();
        }
    }, [product]);


    return {
        handleSubmit,
        bodyMeasurementOptions,
        formattedMeasurements,
        handleSelectMeasurementField,
    };
};

export default useStepThreeHook;