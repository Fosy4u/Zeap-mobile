import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { RootState } from "../../../../../redux/store/store";
import { IBodyMeasurementEnum } from "../../../../general/models/productOptions_model";
import { stepThreeAddBespokeClothesSchema } from "../../validations/addBespokeClothes_validation";
import { useUpdateWithBodyMeasurementsMutation } from "../../apis/bespokeProduct_api";
import { Alert } from "react-native";


const useStepThreeHook = () => {

    const { selectedDraftProduct } = useSelector((state: RootState) => state.vendorProductState );
    const { bespokeClothesOptions } = useSelector((state: RootState) => state.generalState);
    const [bodyMeasurementOptions, setBodyMeasurementOptions] = useState<IBodyMeasurementEnum[]>([]);
    const [formattedMeasurements, setFormattedMeasurements] = useState<any[]>([]);
    const [loadingMessage, setLoadingMessage] = useState("");
    // console.log("FORMATTED MEASUREMENTS::: ", selectedDraftProduct);
    

    const [updateWithBodyMeasurements, { isLoading, isSuccess }] = useUpdateWithBodyMeasurementsMutation();
    

    const handleSubmit = async () => {
        setLoadingMessage("Updating body measurements...");
        const productId = selectedDraftProduct?.productId || "";

        try {
            const requestData = {
                productId,
                measurements: formattedMeasurements,
            };

            // Validate request data
            const validatedRequestData = await stepThreeAddBespokeClothesSchema.validate(requestData);
            // console.log("REQUEST DATA::: ", JSON.stringify(validatedRequestData));

            const updateWithBodyMeasurementsResponseData = await updateWithBodyMeasurements(requestData).unwrap();
            // console.log("RESPONSE::: ", updateWithBodyMeasurementsResponseData);

            if (updateWithBodyMeasurementsResponseData) {
                setLoadingMessage("");
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
        setFormattedMeasurements((prevMeasurements: any) => {
            // Create a copy of the current measurements
            let updatedMeasurements = [...prevMeasurements];
            
            // Find if the section already exists in formattedMeasurements
            const sectionIndex = updatedMeasurements.findIndex(m => m.name === measurementName);
            
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
                    const isIncluded = !updatedMeasurements[sectionIndex].fields.includes(fieldName);
                    if (isIncluded) {
                        updatedMeasurements[sectionIndex].fields.push(fieldName);
                    }
                }
            } else { 
                // When checkbox is unchecked
                if (sectionIndex !== -1) {
                    // Remove the field from the section
                    updatedMeasurements[sectionIndex].fields = updatedMeasurements[sectionIndex].fields.filter((field: string) => field !== fieldName);
                    
                    // If no fields remain in the section, remove the entire section
                    if (updatedMeasurements[sectionIndex].fields.length === 0) {
                        updatedMeasurements = updatedMeasurements.filter(measurement => measurement.name !== measurementName);
                    }
                }
            }
            
            return updatedMeasurements;
        });
        
        // Call the original onChange if it exists
        // onChange && onChange(selectedValue);
    };
    // console.log("FORMATTED MEASUREMENTS::: ", formattedMeasurements);

    
    useEffect(() => {
        if (bespokeClothesOptions?.mainEnums) {
            handleFormatBodyMeasurementOptions();
        }
    }, [bespokeClothesOptions])


    return {
        handleSubmit,
        isLoading, isSuccess, loadingMessage,
        bodyMeasurementOptions,
        formattedMeasurements,
        handleSelectMeasurementField,
    };
};

export default useStepThreeHook;