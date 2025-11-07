import { stepTwoAddAccessoriesSchema } from "../../validations/addProduct_validation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useUpdateProductMutation, useLazyGetProductByProductIDQuery } from "../../apis/readyMadeProduct_api";
import handleError from "../../../../general/hooks/errorHandler_hook";


const useStepTwoHook = () => {

    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { accessoriesOptions } = useSelector((state: RootState) => state.generalState);
    const dispatch = useDispatch();
    
    const [styleOptions, setStyleOptions] = useState<string[]>([]);
    const [genderOptions, setGenderOptions] = useState<string[]>([]);
    const [ageGroupOptions, setAgeGroupOptions] = useState<string[]>([]);
    const [ageRangeOptions, setAgeRangeOptions] = useState<string[]>([]);
    const [typeOptions , setTypeOptions] = useState<string[]>([]);
    const [brandOptions, setBrandOptions] = useState<string[]>([]);
    const [designOptions, setDesignOptions] = useState<string[]>([]);
    const [occasionOptions, setOccasionOptions] = useState<string[]>([]);
    const [fasteningOptions, setFasteningOptions] = useState<string[]>([]);


    const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
    const [selectedGender, setSelectedGender] = useState<string[]>([]);
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");
    const [selectedAgeRange, setSelectedAgeRange] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedDesign, setSelectedDesign] = useState<string[]>([]);
    const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);
    const [selectedFastening, setSelectedFastening] = useState<string[]>([]);
    
    const [showStyleDropDown, setShowStyleDropDown] = useState(false);
    const [showGenderDropDown, setShowGenderDropDown] = useState(false);
    const [showAgeDropDown, setShowAgeDropDown] = useState(false);
    const [showAgeRangeDropDown, setShowAgeRangeDropDown] = useState(false);
    const [showTypeDropDown, setShowTypeDropDown] = useState(false);
    const [showBrandDropDown, setShowBrandDropDown] = useState(false);
    const [showDesignDropDown, setShowDesignDropDown] = useState(false);
    const [showOccasionDropDown, setShowOccasionDropDown] = useState(false);
    const [showFasteningDropDown, setShowFasteningDropDown] = useState(false);
    
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
                accessoryType: selectedType,
                brand: selectedBrand,
                design: selectedDesign,
                occasion: selectedOccasion,
                fastening: selectedFastening,
            };

            const requestData = {
                productId,
                categories: categoriesData,
                currentStep: 2,
            };

            // Validate categoriesData
            const validatedCategoriesData = await stepTwoAddAccessoriesSchema.validate(requestData);
            console.log("REQUEST DATA::: ", validatedCategoriesData);

            const updateResponseData = await updatedProduct(validatedCategoriesData).unwrap();
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
        if (!accessoriesOptions) return;
    
        setStyleOptions(accessoriesOptions.accessoryStyleEnums!);
        setGenderOptions(accessoriesOptions.genderEnums!);
        setAgeGroupOptions(accessoriesOptions.ageGroupEnums!);
        setAgeRangeOptions(accessoriesOptions.ageRangeEnums!);
        setTypeOptions(accessoriesOptions.accessoryTypeEnums!);
        setBrandOptions(accessoriesOptions.brandEnums!);
        setDesignOptions(accessoriesOptions.designEnums!);
        setOccasionOptions(accessoriesOptions.occasionEnums!);
        setFasteningOptions(accessoriesOptions.fasteningEnums!);
    };

    // Handle update default values
    const handleUpdateDefaultValues = () => {
        if (!product || !product.categories) return; // Update the selectedMain(local state) with the selected values
        
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

        // Format type
        const typeData = product.categories?.type!;
        setSelectedType(typeData);

        // Format brand
        const brandData = product.categories?.brand!;
        setSelectedBrand(brandData);

        // Format designs
        const designData = product.categories?.design!;
        setSelectedDesign(designData);

        // Format occasions
        const occasionData = product.categories?.occasion!;
        setSelectedOccasion(occasionData);

        // Format fastenings
        const fasteningData = product.categories?.fastening!;
        setSelectedFastening(fasteningData);
    };

    useEffect(() => {
        if (accessoriesOptions?.accessoryStyleEnums) {
            handleFormatDropDownOptions();
        }
    }, [accessoriesOptions]);

    useEffect(() => {
        handleUpdateDefaultValues();
    }, [product]);


    return {
        handleSubmit,

        manageState: {
            styleOptions, genderOptions, ageGroupOptions, ageRangeOptions, typeOptions, brandOptions,
            designOptions, occasionOptions, fasteningOptions,

            selectedStyle, setSelectedStyle,
            selectedGender, setSelectedGender,
            selectedAgeGroup, setSelectedAgeGroup,
            selectedAgeRange, setSelectedAgeRange,
            selectedType, setSelectedType,
            selectedBrand, setSelectedBrand,
            selectedDesign, setSelectedDesign,
            selectedOccasion, setSelectedOccasion,
            selectedFastening, setSelectedFastening,

            showStyleDropDown, setShowStyleDropDown,
            showGenderDropDown, setShowGenderDropDown,
            showAgeDropDown, setShowAgeDropDown,
            showAgeRangeDropDown, setShowAgeRangeDropDown,
            showTypeDropDown, setShowTypeDropDown,
            showBrandDropDown, setShowBrandDropDown,
            showDesignDropDown, setShowDesignDropDown,
            showOccasionDropDown, setShowOccasionDropDown,
            showFasteningDropDown, setShowFasteningDropDown,
        },
    };
};

export default useStepTwoHook;