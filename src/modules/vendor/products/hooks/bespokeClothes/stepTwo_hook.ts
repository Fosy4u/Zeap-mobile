import { stepTwoAddBespokeClothesSchema } from "../../validations/addProduct_validation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useUpdateProductMutation } from "../../apis/bespokeProduct_api";
import { Alert } from "react-native";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useLazyGetProductByProductIDQuery } from "../../apis/product_api";


const useStepTwoHook = () => {

    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { bespokeClothesOptions } = useSelector((state: RootState) => state.generalState);
    const dispatch = useDispatch();
    
    const [mainOptions , setMainOptions] = useState<string[]>([]);
    const [styleOptions, setStyleOptions] = useState<string[]>([]);
    const [genderOptions, setGenderOptions] = useState<string[]>([]);
    const [ageGroupOptions, setAgeGroupOptions] = useState<string[]>([]);
    const [ageRangeOptions, setAgeRangeOptions] = useState<string[]>([]);
    const [brandOptions, setBrandOptions] = useState<string[]>([]);
    const [designOptions, setDesignOptions] = useState<string[]>([]);
    const [occasionOptions, setOccasionOptions] = useState<string[]>([]);
    const [sleeveLengthOptions, setSleeveLengthOptions] = useState<string[]>([]);
    const [fasteningOptions, setFasteningOptions] = useState<string[]>([]);
    const [fitOptions, setFitOptions] = useState<string[]>([]);


    const [selectedMain, setSelectedMain] = useState<string[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
    const [selectedGender, setSelectedGender] = useState<string[]>([]);
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");
    const [selectedAgeRange, setSelectedAgeRange] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedDesign, setSelectedDesign] = useState<string[]>([]);
    const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);
    const [selectedSleeveLength, setSelectedSleeveLength] = useState<string>("");
    const [selectedFastening, setSelectedFastening] = useState<string[]>([]);
    const [selectedFit, setSelectedFit] = useState<string[]>([]);
    
    const [showMainDropDown, setShowMainDropDown] = useState(false);
    const [showStyleDropDown, setShowStyleDropDown] = useState(false);
    const [showGenderDropDown, setShowGenderDropDown] = useState(false);
    const [showAgeDropDown, setShowAgeDropDown] = useState(false);
    const [showAgeRangeDropDown, setShowAgeRangeDropDown] = useState(false);
    const [showBrandDropDown, setShowBrandDropDown] = useState(false);
    const [showDesignDropDown, setShowDesignDropDown] = useState(false);
    const [showOccasionDropDown, setShowOccasionDropDown] = useState(false);
    const [showSleeveLengthDropDown, setShowSleeveLengthDropDown] = useState(false);
    const [showFasteningDropDown, setShowFasteningDropDown] = useState(false);
    const [showFitDropDown, setShowFitDropDown] = useState(false);
    
    const [updatedProduct] = useUpdateProductMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();

    // Handle submit
    const handleSubmit = async () => {
        dispatch(setLoadingMessage("Updating product categories..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";
        
        try {
            const requestData = {
                productId,
                categories: {
                    main: selectedMain,
                    style: selectedStyle,
                    gender: selectedGender,
                    age: {
                        ageGroup: selectedAgeGroup,
                        ...(selectedAgeRange ? { ageRange: selectedAgeRange } : {}),
                    },
                    brand: selectedBrand,
                    design: selectedDesign,
                    occasion: selectedOccasion,
                    sleeveLength: selectedSleeveLength,
                    fastening: selectedFastening,
                    fit: selectedFit,
                },
            };

            // Validate against the bespoke-clothes step-2 schema (design,
            // occasion, sleeveLength, fastening, fit are optional here).
            const validatedRequestData = await stepTwoAddBespokeClothesSchema.validate(requestData);

            const updateResponseData = await updatedProduct(validatedRequestData as any).unwrap();

            if (updateResponseData) {
                dispatch(setLoadingMessage("Getting product details..."));

                // Refresh the product, then advance to step 3.
                const updatedProductData = await getProductByProductID(productId).unwrap();

                if (updatedProductData) {
                    dispatch(setProduct(updatedProductData));
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setSelectedStep(3));
                }
            }
        } catch (error: any) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            // Defensive: surface yup (error.errors[0]) or API (error.data.*)
            // messages without throwing when a shape is absent.
            const message =
                error?.errors?.[0] ||
                error?.data?.error ||
                error?.data?.message ||
                error?.message ||
                "Something went wrong saving the category. Please try again.";
            Alert.alert("Error", message);
            console.log("STEP TWO SUBMIT ERROR::: ", error);
        }
    };

    // Handle format drop-down options
    const handleFormatDropDownOptions = async () => {
        if (!bespokeClothesOptions) return;
    
        setMainOptions(bespokeClothesOptions.mainEnums!);
        setStyleOptions(bespokeClothesOptions.clothStyleEnums!);
        setGenderOptions(bespokeClothesOptions.genderEnums!);
        setAgeGroupOptions(bespokeClothesOptions.ageGroupEnums!);
        setAgeRangeOptions(bespokeClothesOptions.ageRangeEnums!);
        setAgeRangeOptions(bespokeClothesOptions.ageRangeEnums!);
        setBrandOptions(bespokeClothesOptions.brandEnums!);
        setDesignOptions(bespokeClothesOptions.designEnums!);
        setOccasionOptions(bespokeClothesOptions.occasionEnums!);
        setSleeveLengthOptions(bespokeClothesOptions.sleeveLengthEnums!);
        setFasteningOptions(bespokeClothesOptions.fasteningEnums!);
        setFitOptions(bespokeClothesOptions.fitEnums!);
    };

    // Handle update default values
    const handleUpdateDefaultValues = () => {
        if (!product || !product.categories) return;

        // Format main categories
        const mainData = product.categories?.main!;
        setSelectedMain(mainData);    // Update the selectedMain(local state) with the selected values
        
        // Format styles
        const styleData = product.categories?.style!;
        setSelectedStyle(styleData);

        // Format gender
        const genderData = product.categories?.gender!;
        setSelectedGender(genderData);

        // Format age group
        const ageGroupData = product.categories?.age?.ageGroup!;
        setSelectedAgeGroup(ageGroupData);

        // Format age range
        const ageRangeData = product.categories?.age?.ageRange!;
        setSelectedAgeRange(ageRangeData);

        // Format brand
        const brandData = product.categories?.brand!;
        setSelectedBrand(brandData);

        // Format designs
        const designData = product.categories?.design!;
        setSelectedDesign(designData);

        // Format occasions
        const occasionData = product.categories?.occasion!;
        setSelectedOccasion(occasionData);

        // Format sleeve lengths
        const sleeveLengthData = product.categories?.sleeveLength!;
        setSelectedSleeveLength(sleeveLengthData);

        // Format fastenings
        const fasteningData = product.categories?.fastening!;
        setSelectedFastening(fasteningData);

        // Format fitnesses
        const fitData = product.categories?.fit!;
        setSelectedFit(fitData);
    };

    useEffect(() => {
        if (bespokeClothesOptions?.mainEnums) {
            handleFormatDropDownOptions();
        }
    }, [bespokeClothesOptions]);

    useEffect(() => {
        handleUpdateDefaultValues();
    }, [product]);


    return {
        handleSubmit,

        manageState: {
            mainOptions, styleOptions, genderOptions, ageGroupOptions, ageRangeOptions, brandOptions,
            designOptions, occasionOptions, sleeveLengthOptions, fasteningOptions, fitOptions,

            selectedMain, setSelectedMain,
            selectedStyle, setSelectedStyle,
            selectedGender, setSelectedGender,
            selectedAgeGroup, setSelectedAgeGroup,
            selectedAgeRange, setSelectedAgeRange,
            selectedBrand, setSelectedBrand,
            selectedDesign, setSelectedDesign,
            selectedOccasion, setSelectedOccasion,
            selectedSleeveLength, setSelectedSleeveLength,
            selectedFastening, setSelectedFastening,
            selectedFit, setSelectedFit,

            showMainDropDown, setShowMainDropDown,
            showStyleDropDown, setShowStyleDropDown,
            showGenderDropDown, setShowGenderDropDown,
            showAgeDropDown, setShowAgeDropDown,
            showAgeRangeDropDown, setShowAgeRangeDropDown,
            showBrandDropDown, setShowBrandDropDown,
            showDesignDropDown, setShowDesignDropDown,
            showOccasionDropDown, setShowOccasionDropDown,
            showSleeveLengthDropDown, setShowSleeveLengthDropDown,
            showFasteningDropDown, setShowFasteningDropDown,
            showFitDropDown, setShowFitDropDown,
        },
    };
};

export default useStepTwoHook;