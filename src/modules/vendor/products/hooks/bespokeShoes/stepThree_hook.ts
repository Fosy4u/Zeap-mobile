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
    const { bespokeShoesOptions } = useSelector((state: RootState) => state.generalState);
    const [measurementOptions, setMeasurementOptions] = useState<IBodyMeasurementEnum[]>([]);
    const [formattedMeasurements, setFormattedMeasurements] = useState<any[]>([]);
    // Optional free-text instruction the vendor can add for the shoemaker.
    const [additionalMeasurementNote, setAdditionalMeasurementNote] = useState<string>("");
    // Measurement guides (with field descriptions + images) keyed by gender —
    // used purely to enrich the foot-measurement fields with a "Measurement
    // Guide" preview, exactly like the bespoke-clothes step 3.
    const [measurementGuides, setMeasurementGuides] = useState<Record<string, IBodyMeasurementGuide[]>>({});
    // Per-field expand state for the guide preview, keyed by `${name}::${field}`.
    const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});
    // True once the guide fetch has completed at least once, so the skeleton can
    // show from entry rather than flashing an empty state.
    const [hasLoadedGuides, setHasLoadedGuides] = useState(false);

    // Genders chosen in step 2 (lowercased) — drives which tabs are enabled.
    const selectedGenders = (product?.categories?.gender ?? []).map((gender: string) => gender.toLowerCase());
    // Active tab — defaults to (and stays within) the genders selected in step 2.
    const [activeGender, setActiveGender] = useState<string>(selectedGenders[0] ?? "male");
    // Local flag for the step-3 measurement fetch — drives the inline skeleton
    // without touching the shared `productIsLoading` (which is reserved for the
    // Save & Continue submit, so entering step 3 doesn't spin that button).
    const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);
    const dispatch = useDispatch();

    const [getProductBodyMeasurements] = useLazyGetProductBodyMeasurementsQuery();
    const [getBodyMeasurementGuide] = useLazyGetBodyMeasurementGuideQuery();
    const [updateWithBodyMeasurements] = useUpdateWithBodyMeasurementsMutation();

    // Foot-measurement sections for the active gender (the required list shown as
    // checkboxes). Sourced from the shoe options so only foot measurements show.
    const activeMeasurements: IValue[] = measurementOptions.find((option) => option.gender === activeGender)?.value ?? [];

    // Look up a field's guide entry (description + image) for the active gender,
    // matching by section name + field — undefined when no guide exists for it.
    const getGuideField = (sectionName: string, field: string): IField | undefined =>
        measurementGuides[activeGender]
            ?.find((guide) => guide.name?.toLowerCase() === sectionName.toLowerCase())
            ?.fields?.find((guideField) => guideField.field?.toLowerCase() === field.toLowerCase());

    // Whether a given (section, field) is currently checked.
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
        // Guard on a real productId — `product` is a truthy empty object before
        // step 1 creates it, so checking `product` alone let this fire on a
        // fresh draft and hit /bodyMeasurement with no id ("required productId").
        if (!product?.productId) return;

        setIsLoadingMeasurements(true);

        const productId = product.productId!;

        try {
            const responseData = await getProductBodyMeasurements(productId).unwrap();

            if (responseData) {
                // A draft that hasn't saved any foot measurements yet comes back
                // with no `measurements` key — fall back to [] so the state (and
                // the component's `.find`) never sees undefined.
                setFormattedMeasurements(responseData.measurements ?? []);
                // Prefill the additional instruction if one was saved earlier.
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

    // Fetch the measurement guide (descriptions + images) for each selected
    // gender and key the result by gender — same source the bespoke-clothes step
    // 3 uses. Foot fields are matched against these by name in `getGuideField`.
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
    // Lock onto the first selected gender once step 2's selection arrives (or if
    // the current tab is no longer among the selected genders).
    useEffect(() => {
        if (selectedGenders.length > 0 && !selectedGenders.includes(activeGender)) {
            setActiveGender(selectedGenders[0]);
        }
    }, [selectedGenders]);
    // Only fetch once we're actually on step 3 AND the product has been created
    // (has a productId). The screen mounts every step hook up-front, so without
    // these guards this fired on step 1 of a brand-new product and hit the
    // measurements endpoint with no id ("required productId").
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
        // True while the saved measurements / guides are being fetched (or before
        // the fetch effect fires on entry) — drives the inline skeleton on step 3.
        showMeasurementSkeleton: selectedGenders.length > 0 && (isLoadingMeasurements || !hasLoadedGuides),

        // Gender-tab state: which genders are enabled (per step 2), the list of
        // tabs to render, and the currently active tab + its setter.
        genderTabs: GENDER_TABS,
        selectedGenders,
        activeGender,
        setActiveGender,

        // Foot-measurement display (same shape as bespoke-clothes step 3): the
        // active gender's sections, a guide lookup for images/descriptions, the
        // checked-state helper, and the per-field expand state + toggler.
        activeMeasurements,
        getGuideField,
        isFieldChecked,
        expandedFields,
        toggleField,
        titleCase,

        // Optional free-text instruction card below the measurements.
        additionalMeasurementNote,
        setAdditionalMeasurementNote,
    };
};

export default useStepThreeHook;