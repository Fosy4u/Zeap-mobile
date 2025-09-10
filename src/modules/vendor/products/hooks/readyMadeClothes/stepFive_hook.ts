import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useLazyGetProductByProductIDQuery } from "../../apis/product_api";
import { IColor, IVariation } from "../../models/vendorProductDetails_model";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useAddProductVariationMutation, useDeleteProductVariationMutation, useUpdateProductVariationMutation } from "../../apis/readyMadeProduct_api";
import handleError from "../../../../general/hooks/errorHandler_hook";
import { stepFiveAddReadyMadeClothesSchema } from "../../validations/addProduct_validation";

interface IColorOption {
    colorName: string;
    colorCode: string;
};

const useStepFiveHook = () => {
    
    const { readyMadeClothesOptions } = useSelector((state: RootState) => state.generalState);
    const { product } = useSelector((state: RootState) => state.vendorProductState );

    // State variables
    const [uploadedColorOptions, setUploadedColorOptions] = useState<IColorOption[]>([]);
    const [selectedColor, setSelectedColor] = useState<IColorOption>({} as IColorOption);
    const [uploadedSizes, setUploadedSizes] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [buttonActionType, setButtonActionType] = useState<string>("Add");
    const [selectedVariation, setSelectedVariation] = useState<IVariation>({} as IVariation);
    const dispatch = useDispatch();

    const [addProductVariation] = useAddProductVariationMutation();
    const [updateProductVariation] = useUpdateProductVariationMutation();
    const [deleteProductVariation] = useDeleteProductVariationMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();
    

    
    // Handle get uploaded colors
    const handleGetUploadedColors = () => {
        if (!product?.colors) return;

        const formattedColours: IColorOption[] = product.colors!.map((color: IColor) => ({
            colorName: color?.value || "",
            colorCode: handleGetColorCode(color?.value!) || "",
        }));

        setUploadedColorOptions(formattedColours);
    };

    // Handle get uploaded sizes
    const handleGetUploadedSizes = () => {
        if (!product?.sizes) return;
        setUploadedSizes(product.sizes!);
    };
    
    // Handle get color code from the color enums
    const handleGetColorCode = (colorName: string) => {
        const color = readyMadeClothesOptions?.colorEnums?.find((color) => color.name === colorName);
        return color?.hex! || "";
    };


    // Handle add product variation
    const handleAddProductVariation = async () => {
        dispatch(setLoadingMessage("Adding product variation..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {

            // Add variations
            const variationsData = {
                productId,
                variation: {
                    colorValue: selectedColor.colorName,
                    size: selectedSize,
                    price: Number(price),
                    quantity: Number(quantity),
                },
                currentStep: 5,
            };

            // Validate variations data
            const requestData = await stepFiveAddReadyMadeClothesSchema.validate(variationsData);
            console.log("VARIATIONS DATA: ", requestData);
            
            const addProductVariationResponseData = await addProductVariation(requestData).unwrap();
            console.log("RESPONSE: ", addProductVariationResponseData);

            if (addProductVariationResponseData) {
                // Get the updated product data
                const updatedProduct = await getProductByProductID(productId).unwrap();
                console.log("UPDATED PRODUCT::: ", updatedProduct);

                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setSelectedStep(5));
                }
            }
        } catch (error) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };

    // Handle update product variation
    const handleUpdateProductVariation = async () => {
        dispatch(setLoadingMessage("Updating product variation..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {

            // Add variations
            const variationsData = {
                productId,
                variation: {
                    colorValue: selectedColor.colorName,
                    size: selectedSize,
                    price: Number(price),
                    quantity: Number(quantity),
                    sku: selectedVariation.sku,
                },
                currentStep: 5,
            };

            // Validate variations data
            const requestData = await stepFiveAddReadyMadeClothesSchema.validate(variationsData);
            console.log("VARIATIONS DATA: ", requestData);
            
            const addProductVariationResponseData = await updateProductVariation(requestData).unwrap();
            console.log("RESPONSE: ", addProductVariationResponseData);

            if (addProductVariationResponseData) {
                // Clear the variations form
                setSelectedColor({} as IColorOption);
                setSelectedSize("");
                setPrice("");
                setQuantity("");
                
                // Get the updated product data
                const updatedProduct = await getProductByProductID(productId).unwrap();
                console.log("UPDATED PRODUCT::: ", updatedProduct);

                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setSelectedStep(5));
                }
            }
        } catch (error) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };

    // Handle delete product variation
    const handleDeleteProductVariation = async (variation: IVariation) => {
        dispatch(setLoadingMessage("Deleting product variations..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";
        
        try {
            const requestData = {
                productId,
                sku: variation.sku,
                currentStep: 5,
            };
            console.log("REQUEST DATA: ", requestData);
            
            const deleteProductVariationResponseData = await deleteProductVariation(requestData).unwrap();
            console.log("DELETE PRODUCT VARIATION RESPONSE: ", deleteProductVariationResponseData);
            
            if (deleteProductVariationResponseData) {
                dispatch(setLoadingMessage("Getting product details..."));
                
                // Get the updated product data
                const updatedProduct = await getProductByProductID(productId).unwrap();
                console.log("UPDATED PRODUCT::: ", updatedProduct);
                
                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setSelectedStep(5));
                }
            }
        } catch (error) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };


    useEffect(() => {
        handleGetUploadedColors();
    }, [readyMadeClothesOptions, product]);
    
    useEffect(() => {
        handleGetUploadedSizes();
    }, [product]);
    

    return {
        uploadedColorOptions,
        selectedColor, setSelectedColor,
        uploadedSizes, selectedSize, setSelectedSize,
        price, setPrice,
        quantity, setQuantity,

        setSelectedVariation,
        buttonActionType, setButtonActionType,
        handleAddProductVariation, handleUpdateProductVariation, handleDeleteProductVariation,
    };
};

export default useStepFiveHook;