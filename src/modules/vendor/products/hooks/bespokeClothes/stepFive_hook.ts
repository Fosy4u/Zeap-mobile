import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { IColorEnum } from "../../../../general/models/productOptions_model";
import { Alert } from "react-native";
import { useAddProductVariationMutation, useUpdateProductVariationMutation } from "../../apis/bespokeProduct_api";
import { useLazyGetProductByProductIDQuery } from "../../apis/product_api";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";

interface IColorOption {
    colorName: string;
    colorCode: string;
};

const useStepFiveHook = () => {

    const { bespokeClothesOptions } = useSelector((state: RootState) => state.generalState);
    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const [colourType, setColourType] = useState<string>("Single");
    const [colorOptions, setColorOptions] = useState<IColorOption[]>([]);
    const [selectedColor, setSelectedColor] = useState<IColorOption[]>([]);
    const [price, setPrice] = useState<string>("");
    const dispatch = useDispatch();

    const [addProductVariation] = useAddProductVariationMutation();
    const [updateProductVariation] = useUpdateProductVariationMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();
    

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
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            // Check if there are selected colours
            if (selectedColor.length === 0) {
                Alert.alert("Error", "Please select at least one colour.");
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
                return;
            }

            // Add variations
            const variationsData = {
                productId,
                variation: {
                    colorType: colourType.toLocaleLowerCase(),
                    availableColors: selectedColor.map((color) => color.colorName),
                    price: Number(price),
                },
                currentStep: 5,
            };
            console.log("VARIATIONS DATA: ", variationsData);
            console.log("PRODUCT VARIATIONS: ", product.variations);
            

            let addProductVariationResponseData: any
            if (product.variations && product.variations.length === 0) {
                dispatch(setLoadingMessage("Adding product variations..."));
                addProductVariationResponseData = await addProductVariation(variationsData).unwrap();
            } else {
                dispatch(setLoadingMessage("Updating product variations..."));
                addProductVariationResponseData = await updateProductVariation({
                    ...variationsData,
                    variation: {
                        ...variationsData.variation,
                        sku: "BESPOKE",
                    },
                }).unwrap();
                console.log("VARIATIONS DATA: ", {
                    ...variationsData,
                    variation: {
                        ...variationsData.variation,
                        sku: "BESPOKE",
                    },
                });
            }
            console.log("RESPONSE: ", addProductVariationResponseData);

            if (addProductVariationResponseData) {
                // Get the updated product data
                const updatedProduct = await getProductByProductID(productId).unwrap();
                console.log("UPDATED PRODUCT::: ", updatedProduct);

                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setSelectedStep(6));
                }
            }
        } catch (error) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            console.log("ERROR: ", error);
        }
    };

    // Handle set product variations from the draft product
    const handleSetProductVariations = () => {
        if (!product) return;

        const variations = product.variations!;
        if (variations && variations.length > 0) {
            const validation = variations[0];
            setPrice(validation.price!.toString());
            setColourType(validation.bespoke!.colorType!.charAt(0).toUpperCase() + validation.bespoke!.colorType!.slice(1));

            const formattedColors: IColorOption[] = validation.bespoke!.availableColors!.map((color: string) => ({
                colorName: color,
                colorCode: handleGetColorCode(color),
            }));
            setSelectedColor(formattedColors);
        }
    };

    // Handle get color code from the color enums
    const handleGetColorCode = (colorName: string) => {
        const color = bespokeClothesOptions?.colorEnums?.find((color) => color.name === colorName);
        return color?.hex! || "";
    };

    useEffect(() => {
        if (bespokeClothesOptions?.colorEnums) {
            handleFormatProductColours();
        }
    }, [bespokeClothesOptions]);
    
    useEffect(() => {
        handleSetProductVariations();
    }, [product]);
    

    return {
        colourType, handleSelectColourType,
        colorOptions, handleSelectColour, selectedColor, getTextColor,
        handleAddVariations,
        price, handleChangePrice
    };
};

export default useStepFiveHook;