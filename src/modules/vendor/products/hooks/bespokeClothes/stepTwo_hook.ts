import { set, SubmitHandler, useForm } from "react-hook-form";
import { IStepTwoAddBespokeClothes, stepTwoAddBespokeClothesSchema } from "../../validations/addBespokeClothes_validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useUpdateWithCategoriesMutation } from "../../apis/bespokeProduct_api";


interface IOption {
    key: string;
    value: string;
};

const useStepTwoHook = () => {

    const { selectedDraftProduct } = useSelector((state: RootState) => state.vendorProductState );
    const { bespokeClothesOptions } = useSelector((state: RootState) => state.generalState);
    const [mainOptions , setMainOptions] = useState<IOption[]>([]);
    const [styleOptions, setStyleOptions] = useState<IOption[]>([]);
    const [genderOptions, setGenderOptions] = useState<IOption[]>([]);
    const [ageGroupOptions, setAgeGroupOptions] = useState<IOption[]>([]);
    const [ageRangeOptions, setAgeRangeOptions] = useState<IOption[]>([]);
    const [brandOptions, setBrandOptions] = useState<IOption[]>([]);
    const [designOptions, setDesignOptions] = useState<IOption[]>([]);
    const [occasionOptions, setOccasionOptions] = useState<IOption[]>([]);
    const [sleeveLengthOptions, setSleeveLengthOptions] = useState<IOption[]>([]);
    const [fasteningOptions, setFasteningOptions] = useState<IOption[]>([]);
    const [fitOptions, setFitOptions] = useState<IOption[]>([]);
    const [loadingMessage, setLoadingMessage] = useState("");


    const [selectedMain, setSelectedMain] = useState<string[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
    const [selectedGender, setSelectedGender] = useState<string[]>([]);
    const [selectedDesign, setSelectedDesign] = useState<string[]>([]);
    const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);
    const [selectedFastening, setSelectedFastening] = useState<string[]>([]);
    const [selectedFit, setSelectedFit] = useState<string[]>([]);
    const [selectedAge, setSelectedAge] = useState<string>("");
    

    const [updateWithCategories, { isLoading, isSuccess }] = useUpdateWithCategoriesMutation();
    
    const { control, handleSubmit, formState: { errors } } = useForm<IStepTwoAddBespokeClothes>({
        defaultValues: {
            main: [],
            style: [],
            gender: [],
            ageGroup: "",
            ageRange: "",
            brand: "",
            design: [],
            occasion: [],
            sleeveLength: "",
            fastening: [],
            fit: [],
        },
        resolver: yupResolver(stepTwoAddBespokeClothesSchema),
        mode: "onChange"
    });
    

    const onSubmit: SubmitHandler<IStepTwoAddBespokeClothes> = async (data) => {
        setLoadingMessage("Updating product categories...");
        const productId = selectedDraftProduct?.productId || "";
        // console.log("PRODUCT ID::: ", productId);
        

        try {
            const categoriesData = {
                main: data.main,
                style: data.style,
                gender: data.gender,
                age: { ageGroup: data.ageGroup, ageRange: data.ageRange },
                brand: data.brand,
                design: data.design,
                occasion: data.occasion,
                sleeveLength: data.sleeveLength,
                fastening: data.fastening,
                fit: data.fit,
            };

            const requestData = {
                categories: categoriesData,
                productId,
            }
            // console.log("REQUEST DATA::: ", requestData);

            const updateWithCategoryResponseData = await updateWithCategories(requestData).unwrap();
            // console.log("RESPONSE::: ", updateWithCategoryResponseData);

            if (updateWithCategoryResponseData) {
                setLoadingMessage("");
            }
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    const handleFormatDropDownOptions = async () => {
        if (!bespokeClothesOptions) return;
    
        // Format main categories
        const formattedMain = bespokeClothesOptions.mainEnums!.map((main: string) => ({
            key: main,
            value: main,
        }));

        // Format styles
        const formattedStyles = bespokeClothesOptions.clothStyleEnums!.map((style: string) => ({
            key: style,
            value: style,
        }));

        // Format gender
        const formattedGender = bespokeClothesOptions.genderEnums!.map((gender: string) => ({
            key: gender,
            value: gender,
        }));

        // Format age group
        const formattedAge = bespokeClothesOptions.ageGroupEnums!.map((ageGroup: string) => ({
            key: ageGroup,
            value: ageGroup,
        }));

        // Format age range
        const formattedAgeRange = bespokeClothesOptions.ageRangeEnums!.map((ageRange: string) => ({
            key: ageRange,
            value: ageRange,
        }));

        // Format brand
        const formattedBrand = bespokeClothesOptions.brandEnums!.map((brand: string) => ({
            key: brand,
            value: brand,
        }));

        // Format design
        const formattedDesign = bespokeClothesOptions.designEnums!.map((design: string) => ({
            key: design,
            value: design,
        }));

        // Format occasion
        const formattedOccasion = bespokeClothesOptions.occasionEnums!.map((occasion: string) => ({
            key: occasion,
            value: occasion,
        }));

        // Format sleeve length
        const formattedSleeveLength = bespokeClothesOptions.sleeveLengthEnums!.map((sleeveLength: string) => ({
            key: sleeveLength,
            value: sleeveLength,
        }));

        // Format fastener
        const formattedFastening = bespokeClothesOptions.fasteningEnums!.map((fastening: string) => ({
            key: fastening,
            value: fastening,
        }));

        // Format fitness
        const formattedFitn = bespokeClothesOptions.fitEnums!.map((fit: string) => ({
            key: fit,
            value: fit,
        }));
    
        setMainOptions(formattedMain);
        setStyleOptions(formattedStyles);
        setGenderOptions(formattedGender);
        setAgeGroupOptions(formattedAge);
        setAgeRangeOptions(formattedAgeRange);
        setBrandOptions(formattedBrand);
        setDesignOptions(formattedDesign);
        setOccasionOptions(formattedOccasion);
        setSleeveLengthOptions(formattedSleeveLength);
        setFasteningOptions(formattedFastening);
        setFitOptions(formattedFitn);
    };

    useEffect(() => {
        if (bespokeClothesOptions?.mainEnums) {
            handleFormatDropDownOptions();
        }
    }, [bespokeClothesOptions])


    return {
        control, handleSubmit, errors, onSubmit,
        isLoading, isSuccess, loadingMessage,
        mainOptions, styleOptions, genderOptions, ageGroupOptions, ageRangeOptions, brandOptions,
        designOptions, occasionOptions, sleeveLengthOptions, fasteningOptions, fitOptions,

        selectedMain, setSelectedMain,
        selectedStyle, setSelectedStyle,
        selectedGender, setSelectedGender,
        selectedDesign, setSelectedDesign,
        selectedOccasion, setSelectedOccasion,
        selectedFastening, setSelectedFastening,
        selectedFit, setSelectedFit,
        selectedAge, setSelectedAge,
    };
};

export default useStepTwoHook;