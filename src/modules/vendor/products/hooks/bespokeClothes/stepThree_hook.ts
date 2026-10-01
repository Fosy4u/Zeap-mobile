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

// Both tabs are always rendered by the component; only the genders chosen in
// step 2 are enabled.
const GENDER_TABS = [
    { gender: "male", label: "Male Measurement" },
    { gender: "female", label: "Female Measurement" },
];

// Title-cases a space-separated label for display.
const titleCase = (text: string) =>
    text.split(" ").map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word)).join(" ");


const useStepThreeHook = () => {

    const { product, selectedStep } = useSelector((state: RootState) => state.vendorProductState );
    const [formattedMeasurements, setFormattedMeasurements] = useState<any[]>([]);
    // Optional free-text instruction the vendor can add for the tailor.
    const [additionalMeasurementNote, setAdditionalMeasurementNote] = useState<string>("");
    const [measurementGuides, setMeasurementGuides] = useState<Record<string, IBodyMeasurementGuide[]>>({});
    const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);
    // Becomes true once the guide fetch has completed at least once, so step 3
    // can show a skeleton from the moment it opens (before the fetch effect
    // fires) rather than briefly flashing an empty state.
    const [hasLoadedGuides, setHasLoadedGuides] = useState(false);
    const dispatch = useDispatch();

    const [getProductBodyMeasurements] = useLazyGetProductBodyMeasurementsQuery();
    const [getBodyMeasurementGuide] = useLazyGetBodyMeasurementGuideQuery();
    const [updateWithBodyMeasurements] = useUpdateWithBodyMeasurementsMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();

    // Genders chosen in step 2 (lowercased) — drives which tabs are enabled and which guides to fetch.
    const selectedGenders = (product?.categories?.gender ?? []).map((gender: string) => gender.toLowerCase());

    // Active tab — defaults to (and stays within) the genders selected in step 2.
    const [activeGender, setActiveGender] = useState<string>(selectedGenders[0] ?? "male");
    // Per-field expand state for the "Measurement Guide" preview, keyed by `${guideName}::${field}`.
    const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Lock onto the first selected gender once step 2's selection arrives (or if the current tab is no longer among the selected genders).
        if (selectedGenders.length > 0 && !selectedGenders.includes(activeGender)) {
            setActiveGender(selectedGenders[0]);
        }
    }, [selectedGenders]);

    // Guides for the currently active gender tab.
    const activeGuides = measurementGuides[activeGender] ?? [];

    // Show the step-3 skeleton while guides are in flight (or before the fetch
    // effect has fired on entry). Only relevant once a gender exists from step 2.
    const showMeasurementSkeleton = selectedGenders.length > 0 && (isLoadingMeasurements || !hasLoadedGuides);

    const toggleField = (key: string) => setExpandedFields((prev) => ({ ...prev, [key]: !prev[key] }));

    // Per-section (guide) collapse state, keyed by guide name. Lets the vendor
    // fold a whole measurement group (e.g. "Jacket") to shorten the long list.
    const [collapsedGuides, setCollapsedGuides] = useState<Record<string, boolean>>({});
    const toggleGuide = (guideName: string) => setCollapsedGuides((prev) => ({ ...prev, [guideName]: !prev[guideName] }));

    const isFieldChecked = (guideName: string, field: string) =>
        !!formattedMeasurements?.find((fm) => fm.name === guideName)?.fields.includes(field);

    // Select every field in a section at once (mirrors the web "Select All").
    const handleSelectAllFields = (guide: IBodyMeasurementGuide) => {
        const allFields = (guide.fields ?? []).map((field) => field.field);
        if (allFields.length === 0) return;
        setFormattedMeasurements((prev) => {
            const others = prev.filter((measurement: any) => measurement.name !== guide.name);
            return [...others, { name: guide.name, fields: allFields }];
        });
    };

    // Clear every field in a section at once (mirrors the web "Clear All").
    const handleClearAllFields = (guideName: string) => {
        setFormattedMeasurements((prev) => prev.filter((measurement: any) => measurement.name !== guideName));
    };

    // Whether all of a section's fields are currently checked — drives the
    // header's select-all/clear-all button states.
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

    // Pre-check any measurements already saved on the product.
    const handleGetProductBodyMeasurements = async () => {
        if (!product) return;

        const productId = product.productId!;
        try {
            const responseData = await getProductBodyMeasurements(productId).unwrap();
            if (responseData) {
                setFormattedMeasurements(responseData.measurements ?? []);
                // Prefill the additional instruction if one was saved earlier.
                setAdditionalMeasurementNote((responseData as any).additionalMeasurementNote ?? "");
            }
        } catch (error) {
            console.log("BODY MEASUREMENTS ERROR::: ", error);
        }
    };

    // Fetch the body-measurement guide (with images/descriptions) for each selected gender and key the result by gender.
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

        // Per-section collapse + bulk select/clear.
        collapsedGuides,
        toggleGuide,
        handleSelectAllFields,
        handleClearAllFields,
        isGuideFullyChecked,

        // Optional free-text instruction card below the measurements.
        additionalMeasurementNote,
        setAdditionalMeasurementNote,
    };
};

export default useStepThreeHook;
