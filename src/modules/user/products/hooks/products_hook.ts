import { useDispatch, useSelector } from "react-redux";
import { IColor, IImage, IVariation } from "../models/productDetails_model";
import { RootState } from "../../../../redux/store/store";
import { IColorEnum } from "../../../general/models/productOptions_model";
import { useEffect, useState } from "react";
import { useIncreamentProductQuantityMutation, useDecreamentProductQuantityMutation, useRemoveProductFromCartMutation } from "../apis/product_api";
import { setFeaturedPrice, setSelectedColor, setSelectedSize } from "../slices/product_slice";
import { SubmitHandler } from "react-hook-form";
import { ILikeReview } from "../../../general/validations/review_validation";


/**
 * The useProductsHook
 * @returns {
 * defaultFeaturedImageAndThumbnails, setDefaultFeaturedImageAndThumbnails
 * featuredImage, setFeaturedImage,    const [searchProduct, { data: searchProductData, isLoading: searchProductLoading }] = useLazySearchProductQuery();

 * featuredColors, setFeaturedColors,
 * handleUpdateDefaultFeaturedImageAndThumbnails
 * }
 */
const useProductsHook = () => {
    const { product } = useSelector((state: RootState) => state.productState);
    const { readyMadeClothesOptions, readyMadeShoesOptions, bespokeClothesOptions, bespokeShoesOptions, accessoriesOptions } = useSelector((state: RootState) => state.generalState);
    const dispatch = useDispatch();

    const [featuredImage, setFeaturedImage] = useState<IImage>({
        link: "",
        name: "",
        isDefault: true,
        _id: "",
    });

    const [defaultFeaturedImageAndThumbnails, setDefaultFeaturedImageAndThumbnails] = useState<IColor>({
        value: "",
        images: [],
        _id: "",
    });
    const [featuredColors, setFeaturedColors] = useState<IColorEnum[]>([]);
    
    const [increamentProductQuantity, { isLoading: increamentProductQuantityLoading }] = useIncreamentProductQuantityMutation();
    const [decreamentProductQuantity, { isLoading: decreamentProductQuantityLoading }] = useDecreamentProductQuantityMutation();
    const [removeProductFromCart, { isLoading: removeProductFromCartLoading }] = useRemoveProductFromCartMutation();

    useEffect(() => {
        if (product) {
            handleGetDefaultFeaturedImageAndThumbnails();
            handleGetFeaturedColors();
        }
    }, [product, setFeaturedImage]);

    useEffect(() => {
        const firstAvailableVariation = product?.variations?.find((variation) => product?.sizes?.includes(variation.size!));
        if (firstAvailableVariation) {
            dispatch(setSelectedSize(firstAvailableVariation.size!));
            dispatch(setFeaturedPrice(firstAvailableVariation.price!));
        }
    }, [product, product?.sizes!, product?.variations!, dispatch]);


    const handleGetDefaultFeaturedImageAndThumbnails = () => {
        const defaultImageAndThumbnails = product?.colors?.find((eachColor: IColor) => eachColor.images?.some((eachImage: IImage) => eachImage.isDefault === true));
        const activeImage = defaultImageAndThumbnails?.images?.find((eachImage: IImage) => eachImage.isDefault === true);
        
        setDefaultFeaturedImageAndThumbnails(defaultImageAndThumbnails!);
        setFeaturedImage(activeImage!);
        
        // console.log("DEFAULT IMAGE AND THUMBNAILS::: ", defaultImageAndThumbnails);      
    };

    const handleUpdateDefaultFeaturedImageAndThumbnails = (color: string) => {
        const defaultImageAndThumbnails = product?.colors?.find((eachColor: IColor) => eachColor.value === color);
        const activeImage = defaultImageAndThumbnails?.images?.find((eachImage: IImage) => eachImage.isDefault === true) || defaultImageAndThumbnails!.images![0];
        
        setDefaultFeaturedImageAndThumbnails(defaultImageAndThumbnails!);
        setFeaturedImage(activeImage);
    };

    const handleGetFeaturedColors = () => {
        
        let newColorVariations: string[] = [];
        if (product?.productType! === "readyMadeCloth" || product?.productType! === "readyMadeShoe" || product?.productType! === "accessory") {
             newColorVariations = product?.variations?.map((variation: IVariation) => variation.colorValue!) || [];
        } else {
            newColorVariations = product?.variations?.[0].bespoke?.availableColors! || [];
        }

        const availableColors = (() => {
            switch (product?.productType) {
                case "readyMadeCloth":
                    return readyMadeClothesOptions.colorEnums?.filter((color: IColorEnum) => newColorVariations.includes(color.name!)) || [];
                case "readyMadeShoe":
                    return readyMadeShoesOptions.colorEnums?.filter((color: IColorEnum) => newColorVariations.includes(color.name!)) || [];
                case "bespokeCloth":
                    return bespokeClothesOptions.colorEnums?.filter((color: IColorEnum) => newColorVariations.includes(color.name!)) || [];
                case "bespokeShoe":
                    return bespokeShoesOptions.colorEnums?.filter((color: IColorEnum) => newColorVariations.includes(color.name!)) || [];
                case "accessory":
                    return accessoriesOptions.colorEnums?.filter((color: IColorEnum) => newColorVariations.includes(color.name!)) || [];
                default:
                    return [];
            }
        })();        

        const defaultColor = product?.colors?.find(color => color.images?.find(image => image.isDefault));
        const defaultSelectedColor = availableColors.find(color => {
            if (defaultColor?.value === "Bespoke") {
                return availableColors[0];
            } else {
                return color.name === defaultColor?.value!
            }
        }); 
        
        dispatch(setSelectedColor(defaultSelectedColor!));
        setFeaturedColors(availableColors);
        // console.log("NEW COLORS VARIATIONS::: ", newColorVariations);
        // console.log("AVAILABLE COLORS::: ", availableColors);
        // console.log("DEFAULT COLOR::: ", defaultColor);
        // console.log("DEFAULT SELECTED COLOR::: ", defaultSelectedColor);
    };

    const handleSizeSelection = (size: string) => {
        const selectedVariation = product?.variations?.find(variation => variation.size === size);
        if (selectedVariation) {
            dispatch(setSelectedSize(size));
            dispatch(setFeaturedPrice(selectedVariation.price!));
        }
    };

    const handleColorSelection = (color: IColorEnum) => {
        dispatch(setSelectedColor(color));
        const firstVariationForColor = product?.variations?.find((variation) => variation.colorValue === color.name);
        if (firstVariationForColor) {
            
            dispatch(setSelectedSize(firstVariationForColor.size!));
            dispatch(setFeaturedPrice(firstVariationForColor.price!));
        }
    };

    // const handleAddProductToCart = async (productType: string) => {
    //     try {
    //         const productID = product?.productId || "";
    //         const sku = product?.variations?.find(variation => variation.colorValue === selectedColor.name && variation.size === selectedSize)?.sku || "";
    //         let requestData: addReadyMadeProduct || addBespokeMultipleColorProduct || addBespokeSingleColorProduct = {};

    //         if (productType === "ReadyMade") {
    //             requestData = {
    //                 productId: productID,
    //                 quantity: selectedQuantity,
    //                 sku: sku
    //             };
    //         } 
    //         if (productType === "Bespoke Muliple Color") {
    //             requestData = {
    //                 productId: productID,
    //                 quantity: selectedQuantity,
    //                 sku: "BESPOKE-MULTIPLE",
    //                 bespokeInstruction: "Please follow the instructions on the product",
    //                 bodyMeasurements: []
    //             };
    //         }
    //         if (productType === "Bespoke Single Color") {
    //             requestData = {
    //                 productId: productID,
    //                 quantity: selectedQuantity,
    //                 sku: "BESPOKE",
    //                 bespokeColor: selectedColor.name,
    //                 bespokeInstruction: "Please follow the instructions on the product",
    //                 bodyMeasurements: []
    //             };
    //         }
            
    //         console.log("REQUEST DATA::: ", requestData);
    //         const addProductResponse =  await addReadyMadeProductToCart(requestData).unwrap();
    //         console.log("ADD PRODUCT RESPONSE::: ", addProductResponse);
    //     } catch (error) {
    //         console.log("ERROR::: ", error);
    //     }
    // };

    const handleIncreamentProductQuantity = async (sku: string) => {
        try {
            const itemQuantityResponse =  await increamentProductQuantity(sku).unwrap();
            // console.log("ITEM QUANTITY RESPONSE::: ", itemQuantityResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };
    
    const handleDecreamentProductQuantity = async (sku: string) => {
        try {
            const itemQuantityResponse =  await decreamentProductQuantity(sku).unwrap();
            // console.log("ITEM QUANTITY RESPONSE::: ", itemQuantityResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    const handleRemoveProductFromCart = async (sku: string) => {
        try {
            const itemQuantityResponse =  await removeProductFromCart(sku).unwrap();
            // console.log("ITEM QUANTITY RESPONSE::: ", itemQuantityResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };
    

    return {
        defaultFeaturedImageAndThumbnails, setDefaultFeaturedImageAndThumbnails,
        featuredImage, setFeaturedImage,
        featuredColors, setFeaturedColors,
        handleUpdateDefaultFeaturedImageAndThumbnails,
        handleSizeSelection,
        handleColorSelection,
        // handleAddProductToCart,
        handleIncreamentProductQuantity,
        handleDecreamentProductQuantity,
        handleRemoveProductFromCart,
        increamentProductQuantityLoading,
        decreamentProductQuantityLoading,
        removeProductFromCartLoading,
    };
};

export default useProductsHook;