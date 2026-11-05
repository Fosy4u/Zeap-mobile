import { useDispatch, useSelector } from "react-redux";
import { IColor, IImage, IVariation } from "../models/productDetails_model";
import { RootState } from "../../../../redux/store/store";
import { IColorEnum } from "../../../general/models/productOptions_model";
import { useEffect, useState } from "react";
import { useLazyGetProductByProductIDQuery, useLazyGetProductPromotionQuery, useAddProductToCartMutation, useLazyGetSizeGuideQuery } from "../apis/product_api";
import { setFeaturedPrice, setIsLoading, setLoadingMessage, setProduct, setProductPromotion, setReviewAndRating, setSelectedColor, setSelectedSize, setSizeGuide } from "../slices/product_slice";
import { showAppToast } from "../../../general/slices/general_slice";
import useCartHook from "../../cart/hooks/cart_hook";
import handleError from "../../../general/hooks/errorHandler_hook";
import { useLazyGetProductReviewsQuery } from "../../../general/apis/review_api";
import { addBespokeMultipleColorProduct, addBespokeSingleColorProduct, addReadyMadeProduct } from "../models/addProduct_model";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";

const useProductsHook = () => {

    const { selectedColor, selectedSize, selectedQuantity } = useSelector((state: RootState) => state.productState);
    const { readyMadeClothesOptions, readyMadeShoesOptions, bespokeClothesOptions, bespokeShoesOptions, accessoriesOptions } = useSelector((state: RootState) => state.generalState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const { handleGetCarts } = useCartHook();

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
    
    const [getProductByProductID, { data: product }] = useLazyGetProductByProductIDQuery();
    const [getProductPromotion] = useLazyGetProductPromotionQuery();
    const [getProductReviews] = useLazyGetProductReviewsQuery();
    const [addProductToCart] = useAddProductToCartMutation();
    const [getSizeGuide] = useLazyGetSizeGuideQuery();

    // Handle get product by product ID
    const handleGetProductByProductID = async (productID: string) => {
        dispatch(setLoadingMessage("Fetching product..."));
        dispatch(setIsLoading(true));
        if (product?.productId !== productID) {
            dispatch(setReviewAndRating({ averageRating: 0, reviews: [], imageMatch: {} } as any));
        }

        try {
            const productResponse = await getProductByProductID(productID!).unwrap();
            // console.log("PRODUCT RESPONSE::: ", productResponse);

            if (productResponse) {
                dispatch(setProduct(productResponse!));
                dispatch(setIsLoading(false));

                // Get product promo and reviews
                dispatch(setLoadingMessage("Fetching product promo and reviews..."));
                const [productPromotionResponse, reviewAndRatingResponse] = await Promise.all([
                    getProductPromotion(productID!).unwrap(),
                    getProductReviews(productID!).unwrap(),
                ]);

                if (productPromotionResponse) {
                    dispatch(setProductPromotion(productPromotionResponse));
                }
                if (reviewAndRatingResponse) {
                    dispatch(setReviewAndRating(reviewAndRatingResponse));
                }
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error: any) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

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

    const pickVariationForColor = (colorName?: string): IVariation | undefined => {
        const colorVariations = product?.variations?.filter((variation) => variation.colorValue === colorName) || [];
        return colorVariations.find((variation) => (variation.quantity ?? 0) > 0) ?? colorVariations[0];
    };

    const colorHasStock = (colorName?: string) =>
        product?.variations?.some((variation) => variation.colorValue === colorName && (variation.quantity ?? 0) > 0);

    const handleGetFeaturedColors = () => {

        let newColorVariations: string[] = [];
        if (product?.productType! === "readyMadeCloth" || product?.productType! === "readyMadeShoe" || product?.productType! === "accessory") {
             newColorVariations = product?.variations?.map((variation: IVariation) => variation.colorValue!) || [];
        } else {
            newColorVariations = product?.variations?.[0].bespoke?.availableColors! || [];
        }

        const colorEnumsForType: IColorEnum[] = (() => {
            switch (product?.productType) {
                case "readyMadeCloth": return readyMadeClothesOptions.colorEnums || [];
                case "readyMadeShoe":  return readyMadeShoesOptions.colorEnums || [];
                case "bespokeCloth":   return bespokeClothesOptions.colorEnums || [];
                case "bespokeShoe":    return bespokeShoesOptions.colorEnums || [];
                case "accessory":      return accessoriesOptions.colorEnums || [];
                default:               return [];
            }
        })();

        const orderedColorNames = (
            (product?.productType === "readyMadeCloth" || product?.productType === "readyMadeShoe" || product?.productType === "accessory")
                ? (product?.colors?.map((color) => color.value) ?? [])
                : newColorVariations
        )
            .filter((name): name is string => !!name)
            .filter((name, index, all) => all.indexOf(name) === index);

        const availableColors = orderedColorNames
            .filter((name) => newColorVariations.includes(name))
            .map((name) => colorEnumsForType.find((color) => color.name === name))
            .filter((color): color is IColorEnum => !!color);

        const defaultColor = product?.colors?.find((color) => color.images?.find((image) => image.isDefault));
        let defaultSelectedColor = defaultColor?.value === "Bespoke"
            ? availableColors[0]
            : availableColors.find((color) => color.name === defaultColor?.value);
        if (!defaultSelectedColor || !colorHasStock(defaultSelectedColor.name)) {
            defaultSelectedColor = availableColors.find((color) => colorHasStock(color.name)) ?? defaultSelectedColor ?? availableColors[0];
        }

        dispatch(setSelectedColor(defaultSelectedColor!));
        const defaultVariation = pickVariationForColor(defaultSelectedColor?.name);
        if (defaultVariation) {
            dispatch(setSelectedSize(defaultVariation.size!));
            dispatch(setFeaturedPrice(defaultVariation.price!));
        }
        setFeaturedColors(availableColors);
    };

    const handleSizeSelection = (size: string) => {
        const selectedVariation = product?.variations?.find(
            (variation) => variation.colorValue === selectedColor?.name && variation.size === size
        );
        if (selectedVariation) {
            dispatch(setSelectedSize(size));
            dispatch(setFeaturedPrice(selectedVariation.price!));
        }
    };

    const handleColorSelection = (color: IColorEnum) => {
        dispatch(setSelectedColor(color));
        const variation = pickVariationForColor(color.name);
        if (variation) {
            dispatch(setSelectedSize(variation.size!));
            dispatch(setFeaturedPrice(variation.price!));
        }
    };

    // Add product to cart
    const handleAddProductToCart = async (productType: string) => {
        dispatch(setLoadingMessage("Adding product to cart..."));
        dispatch(setIsLoading(true));

        try {
            const productID = product?.productId;
            if (!productID) {
                throw new Error("Product is not loaded yet. Please wait and try again.");
            }

            const matchedVariation = product?.variations?.find((variation) =>
                variation.colorValue === selectedColor.name &&
                variation.size === selectedSize
            );
            const sizeNumber = Number(selectedSize);

            let requestData: addReadyMadeProduct | addBespokeMultipleColorProduct | addBespokeSingleColorProduct;

            if (productType === "readyMadeShoe" || productType === "readyMadeCloth") {
                const sku = matchedVariation?.sku;
                if (!sku) {
                    throw new Error("Please select a size and colour before adding to cart.");
                }
                requestData = {
                    productId: productID,
                    quantity: selectedQuantity,
                    sku,
                    size: Number.isFinite(sizeNumber) ? sizeNumber : (selectedSize as any),
                };
            } else if (productType === "accessory") {
                const sku = matchedVariation?.sku || product?.variations?.[0]?.sku;
                if (!sku) {
                    throw new Error("This accessory has no available variation.");
                }
                requestData = {
                    productId: productID,
                    quantity: selectedQuantity,
                    sku,
                    size: Number.isFinite(sizeNumber) ? sizeNumber : 0,
                };
            } else if (productType === "bespokeCloth" || productType === "bespokeShoe") {
                const isSingleColor = product?.variations?.[0]?.sku === "BESPOKE";
                if (isSingleColor) {
                    requestData = {
                        productId: productID,
                        quantity: selectedQuantity,
                        sku: "BESPOKE",
                        bespokeColor: selectedColor.name,
                        bespokeInstruction: "Please follow the instructions on the product",
                        bodyMeasurements: [],
                    };
                } else {
                    requestData = {
                        productId: productID,
                        quantity: selectedQuantity,
                        sku: "BESPOKE-MULTIPLE",
                        bespokeInstruction: "Please follow the instructions on the product",
                        bodyMeasurements: [],
                    };
                }
            } else {
                throw new Error(`Unsupported product type: ${productType}`);
            }

            console.log("REQUEST DATA::: ", requestData);

            const addProductResponse = await addProductToCart(requestData).unwrap();
            console.log("ADD PRODUCT RESPONSE::: ", addProductResponse);

            if (addProductResponse) {
                dispatch(showAppToast({ title: "Congratulations", message: `You have successfully added ${ selectedQuantity } ${ selectedQuantity === 1 ? "item" : "items" } to your cart` }));
                handleGetCarts(true);
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle get the readyMade product size guide
    const handleGetSizeGuide = async () => {
        dispatch(setLoadingMessage("Fetching size guide..."));
        dispatch(setIsLoading(true));

        try {
            const response = await getSizeGuide().unwrap();
            // console.log("SIZE GUIDE RESPONSE::: ", JSON.stringify(response));

            if (response) {
                dispatch(setSizeGuide(response));
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        };
    };

    useEffect(() => {
        if (product) {
            handleGetDefaultFeaturedImageAndThumbnails();
            handleGetFeaturedColors();
            handleGetSizeGuide();
        }
    }, [product, setFeaturedImage]);

    useEffect(() => {
        const variations = product?.variations ?? [];
        const colorName = selectedColor?.name;

        const variationsForColor = colorName
            ? variations.filter((v) => v.colorValue === colorName)
            : variations;

        const firstAvailable =
            variationsForColor.find((v) => (v.quantity ?? 0) > 0 && product?.sizes?.includes(v.size!)) ??
            variationsForColor.find((v) => product?.sizes?.includes(v.size!)) ??
            variations.find((v) => product?.sizes?.includes(v.size!));

        if (firstAvailable) {
            dispatch(setSelectedSize(firstAvailable.size!));
            dispatch(setFeaturedPrice(firstAvailable.price!));
        }
    }, [product, product?.sizes!, product?.variations!, selectedColor?.name, dispatch]);
    

    return {
        defaultFeaturedImageAndThumbnails, setDefaultFeaturedImageAndThumbnails,
        featuredImage, setFeaturedImage,
        featuredColors, setFeaturedColors,
        handleUpdateDefaultFeaturedImageAndThumbnails,
        handleSizeSelection,
        handleColorSelection,
        handleGetProductByProductID,
        handleAddProductToCart,
    };
};

export default useProductsHook;