import { useEffect, useState } from "react";
import { IBodyMeasurementEnum, IValue } from "../../../../general/models/productOptions_model";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { RootState } from "../../../../../redux/store/store";
import { useLazyGetProductBodyMeasurementsQuery, useUpdateWithBodyMeasurementsMutation } from "../../apis/bespokeProduct_api";
import { useLazyGetBodyMeasurementGuideQuery } from "../../../../general/apis/general_api";
import IBodyMeasurementGuide, { IField } from "../../../../general/models/bodyMeasurementGuide_model";
import { setLoadingMessage, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { stepThreeAddBespokeShoesSchema } from "../../validations/addProduct_validation";
import { Alert } from "react-native";
import handleError from "../../../../general/hooks/errorHandler_hook";

const GENDER_TABS = [
    { gender: "male", label: "Male Measurement" },
    { gender: "female", label: "Female Measurement" },
];

const titleCase = (text: string) =>
    text.split(" ").map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word)).join(" ");

const useStepThreeHook = () => {
    const { product, selectedStep } = useSelector((state: RootState) => state.vendorProductState );
    const { bespokeShoesOptions } = useSelector((state: RootState) => state.generalState);
    const [measurementOptions, setMeasurementOptions] = useState<IBodyMeasurementEnum[]>([]);
    const [formattedMeasurements, setFormattedMeasurements] = useState<any[]>([]);
    const [additionalMeasurementNote, setAdditionalMeasurementNote] = useState<string>("");
    const [measurementGuides, setMeasurementGuides] = useState<Record<string, IBodyMeasurementGuide[]>>({});
    const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});
    const [hasLoadedGuides, setHasLoadedGuides] = useState(false);

    const selectedGenders = (product?.categories?.gender ?? []).map((gender: string) => gender.toLowerCase());
    const [activeGender, setActiveGender] = useState<string>(selectedGenders[0] ?? "male");
    const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);
    const dispatch = useDispatch();

    const [getProductBodyMeasurements] = useLazyGetProductBodyMeasurementsQuery();
    const [getBodyMeasurementGuide] = useLazyGetBodyMeasurementGuideQuery();
    const [updateWithBodyMeasurements] = useUpdateWithBodyMeasurementsMutation();

    const activeMeasurements: IValue[] = measurementOptions.find((option) => option.gender === activeGender)?.value ?? [];

    const getGuideField = (sectionName: string, field: string): IField | undefined =>
        measurementGuides[activeGender]
            ?.find((guide) => guide.name?.toLowerCase() === sectionName.toLowerCase())
            ?.fields?.find((guideField) => guideField.field?.toLowerCase() === field.toLowerCase());

    const isFieldChecked = (sectionName: string, field: string) =>
        !!formattedMeasurements?.find((fm) => fm.name === sectionName)?.fields.includes(field);

    const toggleField = (key: string) =>
        setExpandedFields((prev) => ({ ...prev, [key]: !prev[key] }));
    

    // Handle submit
    const handleSubmit = async () => {
        dispatch(setLoadingMessage("Updating body measurements..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            const requestData = {
                productId,
                measurements: formattedMeasurements,
                additionalMeasurementNote,
                currentStep: 3,
            };

            // Validate request data
            const validatedRequestData = await stepThreeAddBespokeShoesSchema.validate(requestData);
            // console.log("REQUEST DATA::: ", validatedRequestData);

            const updateWithBodyMeasurementsResponseData = await updateWithBodyMeasurements(validatedRequestData).unwrap();

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
            else if (error?.status) {
                errorMessage = error["data"]["error"];
            } 
            // Handle other generic errors
            else {
                errorMessage = error.message || "An unexpected error occurred.";
            }

            Alert.alert("Error", errorMessage);

        };
    };

    // Handle get peoduct body measurements
    const handleGetProductMeasurements = async () => {
        if (!product?.productId) return;

        setIsLoadingMeasurements(true);

        const productId = product.productId!;

        try {
            const responseData = await getProductBodyMeasurements(productId).unwrap();

            if (responseData) {
                setFormattedMeasurements(responseData.measurements ?? []);
                setAdditionalMeasurementNote((responseData as any).additionalMeasurementNote ?? "");
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoadingMeasurements(false);
        }
    };

    // Handle format measurement options
    const handleFormatMeasurementOptions = async () => {
        if (!bespokeShoesOptions) return;

        // Set measurement options
        const formattedMeasurementOptions = bespokeShoesOptions.bodyMeasurementEnums ?? [];
        setMeasurementOptions(formattedMeasurementOptions);
    };

    const handleGetMeasurementGuides = async (genders: string[]) => {
        if (!genders.length) return;
        setIsLoadingMeasurements(true);

        try {
            const results = await Promise.all(
                genders.map(async (gender) => {
                    const guides = await getBodyMeasurementGuide(gender).unwrap();
                    return [gender, guides] as const;
                })
            );

            const guidesByGender: Record<string, IBodyMeasurementGuide[]> = {};
            results.forEach(([gender, guides]) => {
                guidesByGender[gender] = guides;
            });
            setMeasurementGuides(guidesByGender);
        } catch (error) {

        } finally {
            setIsLoadingMeasurements(false);
            setHasLoadedGuides(true);
        }
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
        if (selectedGenders.length > 0 && !selectedGenders.includes(activeGender)) {
            setActiveGender(selectedGenders[0]);
        }
    }, [selectedGenders]);
    useEffect(() => {
        if (product?.productId && selectedStep === 3) {
            const genders = (product.categories?.gender ?? []).map((gender: string) => gender.toLowerCase());
            handleGetProductMeasurements();
            handleGetMeasurementGuides(genders);
        }
    }, [product, selectedStep]);


    return {
        formattedMeasurements,
        measurementOptions,
        handleSelectMeasurementField,
        handleSubmit,
        showMeasurementSkeleton: selectedGenders.length > 0 && (isLoadingMeasurements || !hasLoadedGuides),

        genderTabs: GENDER_TABS,
        selectedGenders,
        activeGender,
        setActiveGender,

        activeMeasurements,
        getGuideField,
        isFieldChecked,
        expandedFields,
        toggleField,
        titleCase,

        additionalMeasurementNote,
        setAdditionalMeasurementNote,
    };
};

export default useStepThreeHook;