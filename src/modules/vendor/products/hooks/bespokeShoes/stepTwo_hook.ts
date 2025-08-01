import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { stepTwoAddShoesSchema } from "../../validations/addProduct_validation";
import { useUpdateProductMutation } from "../../apis/bespokeProduct_api";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { Alert } from "react-native";
import { useLazyGetProductByProductIDQuery } from "../../apis/product_api";
import handleError from "../../../../general/hooks/errorHandler_hook";

const useStepTwoHook = () => {
    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { bespokeShoesOptions } = useSelector((state: RootState) => state.generalState);
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
                    ageRange: selectedAgeRange,
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
        if (!bespokeShoesOptions) return;
    
        setStyleOptions(bespokeShoesOptions.shoeStyleEnums!);
        setGenderOptions(bespokeShoesOptions.genderEnums!);
        setAgeGroupOptions(bespokeShoesOptions.ageGroupEnums!);
        setAgeRangeOptions(bespokeShoesOptions.ageRangeEnums!);
        setAgeRangeOptions(bespokeShoesOptions.ageRangeEnums!);
        setBrandOptions(bespokeShoesOptions.brandEnums!);
        setDesignOptions(bespokeShoesOptions.designEnums!);
        setOccasionOptions(bespokeShoesOptions.occasionEnums!);
        setHeelHeightOptions(bespokeShoesOptions.heelHeightEnums!);
        setHeelTypeOptions(bespokeShoesOptions.heelTypeEnums!);
        setFasteningOptions(bespokeShoesOptions.fasteningEnums!);
        setShoeSizeOptions(bespokeShoesOptions.shoeSizeEnums!);
    };


    // Handle update default values
    const handleDefaultValues = () => {
        if (!product) return;

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

        // Format design
        const designData = product.categories?.design!;
        setSelectedDesign(designData);

        // Format occasion
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
        if (bespokeShoesOptions?.shoeStyleEnums) {
            handleFormatDropDownOptions();
        }
    }, [bespokeShoesOptions]);

    useEffect(() => {
        handleDefaultValues();
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