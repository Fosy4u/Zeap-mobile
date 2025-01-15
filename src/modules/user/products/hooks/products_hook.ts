import { useDispatch, useSelector } from "react-redux";
import IProductDetails, { IColor, IImage, IVariation } from "../models/productDetails_model";
import { RootState } from "../../../../redux/store/store";
import { IColorEnum } from "../../../general/models/productOptions_model";
import { useEffect, useState } from "react";
import { useIncreamentProductQuantityMutation, useDecreamentProductQuantityMutation, useAddReadyMadeProductToCartMutation } from "../apis/product_api";
import { setFeaturedPrice, setSelectedColor, setSelectedSize } from "../slices/product_slice";
import { addReadyMadeProduct } from "../models/addProduct_model";


interface IProps {
    product: IProductDetails;
};

/**
 * The useProductsHook
 * @returns {
 * defaultFeaturedImageAndThumbnails, setDefaultFeaturedImageAndThumbnails
 * featuredImage, setFeaturedImage,
 * featuredColors, setFeaturedColors,
 * handleUpdateDefaultFeaturedImageAndThumbnails
 * }
 */
const useProductsHook = (product: IProductDetails) => {
    const { selectedColor, selectedSize, selectedQuantity } = useSelector((state: RootState) => state.productState);
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
    
    const [addReadyMadeProductToCart, {  isLoading: addProductLoading }] = useAddReadyMadeProductToCartMutation();
    const [increamentProductQuantity] = useIncreamentProductQuantityMutation();
    const [decreamentProductQuantity] = useDecreamentProductQuantityMutation();


    useEffect(() => {
        if (product) {
            handleGetDefaultFeaturedImageAndThumbnails();
            handleGetFeaturedColors();
        }
    }, [product, setFeaturedImage]);

    useEffect(() => {
        const firstAvailableVariation = product.variations?.find((variation) => product.sizes?.includes(variation.size!));
        if (firstAvailableVariation) {
            dispatch(setSelectedSize(firstAvailableVariation.size!));
            dispatch(setFeaturedPrice(firstAvailableVariation.price!));
        }
    }, [product.sizes!, product.variations!, dispatch]);
    


    const handleGetDefaultFeaturedImageAndThumbnails = () => {
        const defaultImageAndThumbnails = product.colors?.find((eachColor: IColor) => eachColor.images?.some((eachImage: IImage) => eachImage.isDefault === true));
        const activeImage = defaultImageAndThumbnails?.images?.find((eachImage: IImage) => eachImage.isDefault === true);
        
        setDefaultFeaturedImageAndThumbnails(defaultImageAndThumbnails!);
        setFeaturedImage(activeImage!);
        
        // console.log("DEFAULT IMAGE AND THUMBNAILS::: ", defaultImageAndThumbnails);      
    };

    const handleUpdateDefaultFeaturedImageAndThumbnails = (color: string) => {
        const defaultImageAndThumbnails = product.colors?.find((eachColor: IColor) => eachColor.value === color);
        const activeImage = defaultImageAndThumbnails?.images?.find((eachImage: IImage) => eachImage.isDefault === true) || defaultImageAndThumbnails!.images![0];
        
        setDefaultFeaturedImageAndThumbnails(defaultImageAndThumbnails!);
        setFeaturedImage(activeImage);
    };

    const handleGetFeaturedColors = () => {
        
        let newColorVariations: string[] = [];
        if (product.productType! === "readyMadeCloth" || product.productType! === "readyMadeShoe" || product.productType! === "accessory") {
             newColorVariations = product.variations?.map((variation: IVariation) => variation.colorValue!) || [];
        } else {
            newColorVariations = product.variations![0].bespoke?.availableColors! || [];
        }

        const availableColors = (() => {
            switch (product.productType) {
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

        const defaultColor = product.colors?.find(color => color.images?.some(image => image.isDefault));
        const defaultSelectedColor = availableColors.find(color => color.name === defaultColor?.value!);        
        
        dispatch(setSelectedColor(defaultSelectedColor!));
        setFeaturedColors(availableColors);
    };

    const handleSizeSelection = (size: string) => {
        const selectedVariation = product.variations?.find(variation => variation.size === size);
        if (selectedVariation) {
            dispatch(setSelectedSize(size));
            dispatch(setFeaturedPrice(selectedVariation.price!));
        }
    };

    const handleColorSelection = (color: IColorEnum) => {
        dispatch(setSelectedColor(color));
        const firstVariationForColor = product.variations?.find((variation) => variation.colorValue === color.name);
        if (firstVariationForColor) {
            
            dispatch(setSelectedSize(firstVariationForColor.size!));
            dispatch(setFeaturedPrice(firstVariationForColor.price!));
        }
    };

    // const handleAddProductToCart = async (productType: string) => {
    //     try {
    //         const productID = product.productId || "";
    //         const sku = product.variations?.find(variation => variation.colorValue === selectedColor.name && variation.size === selectedSize)?.sku || "";
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

    const handleIncreamentProductQuantity = async () => {
        try {
            const sku = product.variations?.find(variation => variation.colorValue === selectedColor.name && variation.size === selectedSize)?.sku || "";
            console.log("SKU::: ", sku);
            const itemQuantityResponse =  await increamentProductQuantity(sku).unwrap();
    
            // Dispatch to Redux Store
            // dispatch(setSelectedQuantity(itemQuantityResponse.data.quantity));
            console.log("ITEM QUANTITY RESPONSE::: ", itemQuantityResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };
    
    const handleDecreamentProductQuantity = async () => {
        try {
            const sku = product.variations?.find(variation => variation.colorValue === selectedColor.name && variation.size === selectedSize)?.sku || "";
            console.log("SKU::: ", sku);
            const itemQuantityResponse =  await decreamentProductQuantity(sku).unwrap();
    
            // Dispatch to Redux Store
            // dispatch(setSelectedQuantity(itemQuantityResponse.data.quantity));
            console.log("ITEM QUANTITY RESPONSE::: ", itemQuantityResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    const handleAddToCart = () => {
        console.log("ADD TO CART::: ", {
            selectedColor,
            selectedSize,
        });
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
    };
};

export default useProductsHook;