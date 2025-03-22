import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { IColorEnum } from "../../../../general/models/productOptions_model";
import { Alert } from "react-native";
import { useAddProductVariationMutation } from "../../apis/bespokeProduct_api";

interface IColorOption {
    colorName: string;
    colorCode: string;
};

const useStepFiveHook = () => {

    const { bespokeClothesOptions } = useSelector((state: RootState) => state.generalState);
    const { selectedDraftProduct } = useSelector((state: RootState) => state.vendorProductState );
    const [colourType, setColourType] = useState<string>("Single");
    const [colorOptions, setColorOptions] = useState<IColorOption[]>([]);
    const [selectedColor, setSelectedColor] = useState<IColorOption[]>([]);
    const [price, setPrice] = useState<string>("");
    const [loadingMessage, setLoadingMessage] = useState("");

    const [addProductVariation, { isLoading, isSuccess }] = useAddProductVariationMutation();
    

    // Handle selecting colour type
    const handleSelectColourType = (colourType: string) => {
        // Reset selected colours
        setSelectedColor([]);
        setColourType(colourType);
    };
    
    // Handle format product colours
    const handleFormatProductColours = () => {
        if (!bespokeClothesOptions) return;

        const formattedColours: IColorOption[] = bespokeClothesOptions.colorEnums!.map((colour: IColorEnum) => ({
            colorName: colour.name || "",
            colorCode: colour.hex || "",
        }));
        setColorOptions(formattedColours);
        // console.log("FORMATTED COLOURS: ", formattedColours);
        
    };

    // Handle selecting colour
    const handleSelectColour = (colour: IColorOption) => {
        if (selectedColor.find((color) => color.colorCode === colour.colorCode)) {
            setSelectedColor(prevState => prevState.filter((color) => color.colorCode !== colour.colorCode));
        } else {
            setSelectedColor(prevState => [...prevState, colour]);
        };
    };

    const getTextColor = (hex: string) =>
        (
            parseInt(hex.slice(1, 3), 16) * 0.299 +
            parseInt(hex.slice(3, 5), 16) * 0.587 +
            parseInt(hex.slice(5, 7), 16) * 0.114
        ) > 200 ? "text-black" : "text-white";

    // Handle changing price
    const handleChangePrice = (value: string) => {
        setPrice(value);
    };

    // Handle adding variations
    const handleAddVariations = async () => {
        setLoadingMessage("Adding variations...");
        const productId = selectedDraftProduct?.productId || "";

        try {
            // Check if there are selected colours
            if (selectedColor.length === 0) {
                Alert.alert("Error", "Please select at least one colour.");
                setLoadingMessage("");
                return;
            }

            // Add variations
            const variationsData = {
                productId,
                variation: {
                    colorType: colourType.toLocaleLowerCase(),
                    availableColors: selectedColor.map((color) => color.colorName),
                    price: Number(price),
                }
            };
            console.log("VARIATIONS DATA: ", variationsData);

            const addProductVariationResponseData = await addProductVariation(variationsData).unwrap();
            console.log("RESPONSE: ", addProductVariationResponseData);

            if (addProductVariationResponseData) {
                setLoadingMessage("");
            }
        } catch (error) {
            console.log("ERROR: ", error);
            setLoadingMessage("");
            return;
        }
    };

    useEffect(() => {
        if (bespokeClothesOptions?.colorEnums) {
            handleFormatProductColours();
        }
    }, [bespokeClothesOptions])
    

    return {
        isLoading, isSuccess, loadingMessage,
        colourType, handleSelectColourType,
        colorOptions, handleSelectColour, selectedColor, getTextColor,
        handleAddVariations,
        price, handleChangePrice
    };
};

export default useStepFiveHook;