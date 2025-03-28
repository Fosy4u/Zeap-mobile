import { set, SubmitHandler, useForm } from "react-hook-form";
import { IStepTwoAddBespokeClothes, stepTwoAddBespokeClothesSchema } from "../../validations/addBespokeClothes_validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useUpdateWithCategoriesMutation } from "../../apis/bespokeProduct_api";
import { Alert } from "react-native";


interface IOption {
    key: string;
    value: string;
};

const useStepTwoHook = () => {

    const { selectedDraftProduct } = useSelector((state: RootState) => state.vendorProductState );
    const { bespokeClothesOptions } = useSelector((state: RootState) => state.generalState);
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
    const [loadingMessage, setLoadingMessage] = useState("");


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
    
    
    

    const [updateWithCategories, { isLoading, isSuccess }] = useUpdateWithCategoriesMutation();   

    const handleSubmit = async () => {
        setLoadingMessage("Updating product categories...");
        const productId = selectedDraftProduct?.productId || "";
        // console.log("PRODUCT ID::: ", productId);
        
        try {
            const categoriesData = {
                main: selectedMain,
                style: selectedStyle,
                gender: selectedGender,
                age: { ageGroup: selectedAgeGroup, ageRange: selectedAgeRange },
                brand: selectedBrand,
                design: selectedDesign,
                occasion: selectedOccasion,
                sleeveLength: selectedSleeveLength,
                fastening: selectedFastening,
                fit: selectedFit,
            };

            // Validate categories data
            const validatedCategoriesData = await stepTwoAddBespokeClothesSchema.validate(categoriesData);

            const requestData = {
                productId,
                categories: validatedCategoriesData,
            }
            console.log("REQUEST DATA::: ", requestData);

            const updateWithCategoryResponseData = await updateWithCategories(requestData).unwrap();
            // console.log("RESPONSE::: ", updateWithCategoryResponseData);

            if (updateWithCategoryResponseData) {
                setLoadingMessage("");
            }
        } catch (error: any) {
            console.log("ERROR::: ", error);
            Alert.alert("Error", error.errors[0]);
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
        if (!selectedDraftProduct.categories) return;

        // Format main categories
        const mainData = selectedDraftProduct.categories!.main!;
        setSelectedMain(mainData);    // Update the selectedMain(local state) with the selected values
        
        // Format styles
        const styleData = selectedDraftProduct.categories!.style!;
        setSelectedStyle(styleData);

        // Format gender
        const genderData = selectedDraftProduct.categories!.gender!;
        setSelectedGender(genderData);

        // Format age group
        const ageGroupData = selectedDraftProduct.categories!.age!.ageGroup!;
        setSelectedAgeGroup(ageGroupData);

        // Format age range
        const ageRangeData = selectedDraftProduct.categories!.age!.ageRange!;
        setSelectedAgeRange(ageRangeData);

        // Format brand
        const brandData = selectedDraftProduct.categories!.brand!;
        setSelectedBrand(brandData);

        // Format designs
        const designData = selectedDraftProduct.categories!.design!;
        setSelectedDesign(designData);

        // Format occasions
        const occasionData = selectedDraftProduct.categories!.occasion!;
        setSelectedOccasion(occasionData);

        // Format sleeve lengths
        const sleeveLengthData = selectedDraftProduct.categories!.sleeveLength!;
        setSelectedSleeveLength(sleeveLengthData);

        // Format fastenings
        const fasteningData = selectedDraftProduct.categories!.fastening!;
        setSelectedFastening(fasteningData);

        // Format fitnesses
        const fitData = selectedDraftProduct.categories!.fit!;
        setSelectedFit(fitData);
    };

    useEffect(() => {
        if (bespokeClothesOptions?.mainEnums) {
            handleFormatDropDownOptions();
        }
    }, [bespokeClothesOptions]);

    useEffect(() => {
        handleUpdateDefaultValues();
    }, [selectedDraftProduct]);


    return {
        handleSubmit,
        isLoading, isSuccess, loadingMessage,

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