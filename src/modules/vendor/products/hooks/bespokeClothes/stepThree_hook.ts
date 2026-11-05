import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { RootState } from "../../../../../redux/store/store";
import IBodyMeasurementGuide from "../../../../general/models/bodyMeasurementGuide_model";
import { stepThreeAddBespokeClothesSchema } from "../../validations/addProduct_validation";
import { useLazyGetProductBodyMeasurementsQuery, useUpdateWithBodyMeasurementsMutation } from "../../apis/bespokeProduct_api";
import { useLazyGetBodyMeasurementGuideQuery } from "../../../../general/apis/general_api";
import { Alert } from "react-native";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useLazyGetProductByProductIDQuery } from "../../apis/product_api";

const GENDER_TABS = [
    { gender: "male", label: "Male Measurement" },
    { gender: "female", label: "Female Measurement" },
];

const titleCase = (text: string) =>
    text.split(" ").map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word)).join(" ");


const useStepThreeHook = () => {

    const { product, selectedStep } = useSelector((state: RootState) => state.vendorProductState );
    const [formattedMeasurements, setFormattedMeasurements] = useState<any[]>([]);
    const [additionalMeasurementNote, setAdditionalMeasurementNote] = useState<string>("");
    const [measurementGuides, setMeasurementGuides] = useState<Record<string, IBodyMeasurementGuide[]>>({});
    const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);
    const [hasLoadedGuides, setHasLoadedGuides] = useState(false);
    const dispatch = useDispatch();

    const [getProductBodyMeasurements] = useLazyGetProductBodyMeasurementsQuery();
    const [getBodyMeasurementGuide] = useLazyGetBodyMeasurementGuideQuery();
    const [updateWithBodyMeasurements] = useUpdateWithBodyMeasurementsMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();

    const selectedGenders = (product?.categories?.gender ?? []).map((gender: string) => gender.toLowerCase());

    const [activeGender, setActiveGender] = useState<string>(selectedGenders[0] ?? "male");
    const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (selectedGenders.length > 0 && !selectedGenders.includes(activeGender)) {
            setActiveGender(selectedGenders[0]);
        }
    }, [selectedGenders]);

    const activeGuides = measurementGuides[activeGender] ?? [];

    const showMeasurementSkeleton = selectedGenders.length > 0 && (isLoadingMeasurements || !hasLoadedGuides);

    const toggleField = (key: string) => setExpandedFields((prev) => ({ ...prev, [key]: !prev[key] }));

    const [collapsedGuides, setCollapsedGuides] = useState<Record<string, boolean>>({});
    const toggleGuide = (guideName: string) => setCollapsedGuides((prev) => ({ ...prev, [guideName]: !prev[guideName] }));

    const isFieldChecked = (guideName: string, field: string) =>
        !!formattedMeasurements?.find((fm) => fm.name === guideName)?.fields.includes(field);

    const handleSelectAllFields = (guide: IBodyMeasurementGuide) => {
        const allFields = (guide.fields ?? []).map((field) => field.field);
        if (allFields.length === 0) return;
        setFormattedMeasurements((prev) => {
            const others = prev.filter((measurement: any) => measurement.name !== guide.name);
            return [...others, { name: guide.name, fields: allFields }];
        });
    };

    const handleClearAllFields = (guideName: string) => {
        setFormattedMeasurements((prev) => prev.filter((measurement: any) => measurement.name !== guideName));
    };

    const isGuideFullyChecked = (guide: IBodyMeasurementGuide) => {
        const allFields = (guide.fields ?? []).map((field) => field.field);
        if (allFields.length === 0) return false;
        const section = formattedMeasurements.find((measurement: any) => measurement.name === guide.name);
        return !!section && allFields.every((field) => section.fields.includes(field));
    };


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
            const validatedRequestData = await stepThreeAddBespokeClothesSchema.validate(requestData);

            const updateWithBodyMeasurementsResponseData = await updateWithBodyMeasurements(validatedRequestData).unwrap();

            if (updateWithBodyMeasurementsResponseData) {

                dispatch(setLoadingMessage("Getting product details..."));

                // Get the updated product data
                const updatedProduct = await getProductByProductID(productId).unwrap();

                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setSelectedStep(4));
                }
            }
        } catch (error: any) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
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
            console.log("Error: ", errorMessage);
        };
    };

    const handleGetProductBodyMeasurements = async () => {
        if (!product) return;

        const productId = product.productId!;
        try {
            const responseData = await getProductBodyMeasurements(productId).unwrap();
            if (responseData) {
                setFormattedMeasurements(responseData.measurements ?? []);
                setAdditionalMeasurementNote((responseData as any).additionalMeasurementNote ?? "");
            }
        } catch (error) {
            console.log("BODY MEASUREMENTS ERROR::: ", error);
        }
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
            console.log("MEASUREMENT GUIDE ERROR::: ", error);
        } finally {
            setIsLoadingMeasurements(false);
            setHasLoadedGuides(true);
        }
    };

    // handleSelectMeasurementField: format the measurements and append to the formattedMeasurements array.
    const handleSelectMeasurementField = (
        selectedValue: boolean,
        measurementName: string,
        fieldName: string
    ) => {
        const measurements = (prevMeasurements: any) => {
            // Create a deep clone of the current measurements
            let updatedMeasurements = JSON.parse(JSON.stringify(prevMeasurements));

            const sectionIndex = updatedMeasurements.findIndex((m: any) => m.name === measurementName);

            if (selectedValue) {
                // When checkbox is checked
                if (sectionIndex === -1) {
                    updatedMeasurements.push({
                        name: measurementName,
                        fields: [fieldName]
                    });
                } else {
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
                    }
                }
            }

            return updatedMeasurements;
        };

        setFormattedMeasurements(measurements);
    };


    useEffect(() => {
        if (product && selectedStep === 3) {
            const genders = (product.categories?.gender ?? []).map((gender: string) => gender.toLowerCase());
            handleGetProductBodyMeasurements();
            handleGetMeasurementGuides(genders);
        }
    }, [product, selectedStep]);


    return {
        handleSubmit,
        measurementGuides,
        selectedGenders,
        formattedMeasurements,
        handleSelectMeasurementField,
        isLoadingMeasurements,
        showMeasurementSkeleton,

        genderTabs: GENDER_TABS,
        titleCase,
        activeGender,
        setActiveGender,
        expandedFields,
        toggleField,
        isFieldChecked,
        activeGuides,

        collapsedGuides,
        toggleGuide,
        handleSelectAllFields,
        handleClearAllFields,
        isGuideFullyChecked,

        additionalMeasurementNote,
        setAdditionalMeasurementNote,
    };
};

export default useStepThreeHook;
