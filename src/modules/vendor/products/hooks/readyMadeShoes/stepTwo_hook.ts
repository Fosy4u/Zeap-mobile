import { stepTwoAddClothesSchema, stepTwoAddShoesSchema } from "../../validations/addProduct_validation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { Alert } from "react-native";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useUpdateProductMutation, useLazyGetProductByProductIDQuery } from "../../apis/readyMadeProduct_api";
import handleError from "../../../../general/hooks/errorHandler_hook";


const useStepTwoHook = () => {

    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { readyMadeShoesOptions } = useSelector((state: RootState) => state.generalState);
    const dispatch = useDispatch();
    
    const [styleOptions, setStyleOptions] = useState<string[]>([]);
    const [genderOptions, setGenderOptions] = useState<string[]>([]);
    const [ageGroupOptions, setAgeGroupOptions] = useState<string[]>([]);
    const [ageRangeOptions, setAgeRangeOptions] = useState<string[]>([]);
    const [brandOptions, setBrandOptions] = useState<string[]>([]);
    const [designOptions, setDesignOptions] = useState<string[]>([]);
    const [occasionOptions, setOccasionOptions] = useState<string[]>([]);
    const [heelHeightOptions, setHeelHeightOptions] = useState<string[]>([]);
    const [heelTypeOptions, setHeelTypeOptions] = useState<string[]>([]);
    const [fasteningOptions, setFasteningOptions] = useState<string[]>([]);
    const [shoeSizeOptions, setShoeSizeOptions] = useState<string[]>([]);


    const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
    const [selectedGender, setSelectedGender] = useState<string[]>([]);
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");
    const [selectedAgeRange, setSelectedAgeRange] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedDesign, setSelectedDesign] = useState<string[]>([]);
    const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);
    const [selectedHeelHeight, setSelectedHeelHeight] = useState<string>("");
    const [selectedHeelType, setSelectedHeelType] = useState<string>("");
    const [selectedFastening, setSelectedFastening] = useState<string[]>([]);
    const [selectedShoeSize, setSelectedShoeSize] = useState<string[]>([]);

    const [showStyleDropDown, setShowStyleDropDown] = useState(false);
    const [showGenderDropDown, setShowGenderDropDown] = useState(false);
    const [showAgeDropDown, setShowAgeDropDown] = useState(false);
    const [showAgeRangeDropDown, setShowAgeRangeDropDown] = useState(false);
    const [showBrandDropDown, setShowBrandDropDown] = useState(false);
    const [showDesignDropDown, setShowDesignDropDown] = useState(false);
    const [showOccasionDropDown, setShowOccasionDropDown] = useState(false);
    const [showHeelHeightDropDown, setShowHeelHeightDropDown] = useState(false);
    const [showHeelTypeDropDown, setShowHeelTypeDropDown] = useState(false);
    const [showFasteningDropDown, setShowFasteningDropDown] = useState(false);
    const [showShoeSizeDropDown, setShowShoeSizeDropDown] = useState(false);
    
    const [updatedProduct] = useUpdateProductMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();  

    // Handle submit
    const handleSubmit = async () => {
        dispatch(setLoadingMessage("Updating product categories..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";
        
        try {
            const categoriesData = {
                style: selectedStyle,
                gender: selectedGender,
                age: {
                    ageGroup: selectedAgeGroup,
                    ageRange: selectedAgeRange
                },
                brand: selectedBrand,
                design: selectedDesign,
                occasion: selectedOccasion,
                heelHeight: selectedHeelHeight,
                heelType: selectedHeelType,
                fastening: selectedFastening,
            };

            const validatedCategoriesData = {
                productId,
                categories: categoriesData,
                currentStep: 2,
            };
            
            // Validate categoriesData
            const requestData = await stepTwoAddShoesSchema.validate(validatedCategoriesData);
            console.log("REQUEST DATA::: ", requestData);

            const updateResponseData = await updatedProduct(requestData).unwrap();
            console.log("RESPONSE::: ", updateResponseData);

            if (updateResponseData) {
                dispatch(setLoadingMessage("Getting product details..."));

                // Get the updated product data
                const updatedProduct = await getProductByProductID(productId).unwrap();
                console.log("UPDATED PRODUCT::: ", updatedProduct);

                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setSelectedStep(3));
                }
            }
        } catch (error: any) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };

    // Handle format drop-down options
    const handleFormatDropDownOptions = async () => {
        if (!readyMadeShoesOptions) return;
    
        setStyleOptions(readyMadeShoesOptions.shoeStyleEnums!);
        setGenderOptions(readyMadeShoesOptions.genderEnums!);
        setAgeGroupOptions(readyMadeShoesOptions.ageGroupEnums!);
        setAgeRangeOptions(readyMadeShoesOptions.ageRangeEnums!);
        setAgeRangeOptions(readyMadeShoesOptions.ageRangeEnums!);
        setBrandOptions(readyMadeShoesOptions.brandEnums!);
        setDesignOptions(readyMadeShoesOptions.designEnums!);
        setOccasionOptions(readyMadeShoesOptions.occasionEnums!);
        setHeelHeightOptions(readyMadeShoesOptions.heelHeightEnums!);
        setHeelTypeOptions(readyMadeShoesOptions.heelTypeEnums!);
        setFasteningOptions(readyMadeShoesOptions.fasteningEnums!);
        setShoeSizeOptions(readyMadeShoesOptions.shoeSizeEnums!);
    };

    // Handle update default values
    const handleUpdateDefaultValues = () => {
        if (!product.categories) return;

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

        // Format heel height
        const heelHeightData = product.categories?.heelHeight!;
        setSelectedHeelHeight(heelHeightData);

        // Format heel type
        const heelTypeData = product.categories?.heelType!;
        setSelectedHeelType(heelTypeData);

        // Format fastening
        const fasteningData = product.categories?.fastening!;
        setSelectedFastening(fasteningData);
    };

    useEffect(() => {
        if (readyMadeShoesOptions?.shoeStyleEnums) {
            handleFormatDropDownOptions();
        }
    }, [readyMadeShoesOptions]);

    useEffect(() => {
        handleUpdateDefaultValues();
    }, [product]);


    return {
        handleSubmit,

        manageState: {
            styleOptions, genderOptions, ageGroupOptions, ageRangeOptions, brandOptions,
            designOptions, occasionOptions, heelHeightOptions, heelTypeOptions, fasteningOptions, shoeSizeOptions,

            selectedStyle, setSelectedStyle,
            selectedGender, setSelectedGender,
            selectedAgeGroup, setSelectedAgeGroup,
            selectedAgeRange, setSelectedAgeRange,
            selectedBrand, setSelectedBrand,
            selectedDesign, setSelectedDesign,
            selectedOccasion, setSelectedOccasion,
            selectedHeelHeight, setSelectedHeelHeight,
            selectedHeelType, setSelectedHeelType,
            selectedFastening, setSelectedFastening,
            selectedShoeSize, setSelectedShoeSize,

            showStyleDropDown, setShowStyleDropDown,
            showGenderDropDown, setShowGenderDropDown,
            showAgeDropDown, setShowAgeDropDown,
            showAgeRangeDropDown, setShowAgeRangeDropDown,
            showBrandDropDown, setShowBrandDropDown,
            showDesignDropDown, setShowDesignDropDown,
            showOccasionDropDown, setShowOccasionDropDown,
            showHeelHeightDropDown, setShowHeelHeightDropDown,
            showHeelTypeDropDown, setShowHeelTypeDropDown,
            showFasteningDropDown, setShowFasteningDropDown,
            showShoeSizeDropDown, setShowShoeSizeDropDown,
        },
    };
};

export default useStepTwoHook;