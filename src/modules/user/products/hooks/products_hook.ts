import { useDispatch, useSelector } from "react-redux";
import { IColor, IImage, IVariation } from "../models/productDetails_model";
import { RootState } from "../../../../redux/store/store";
import { IColorEnum } from "../../../general/models/productOptions_model";
import { useEffect, useState } from "react";
import { useLazyGetProductByProductIDQuery, useLazyGetProductPromotionQuery, useAddProductToCartMutation, useLazyGetSizeGuideQuery } from "../apis/product_api";
import { setFeaturedPrice, setIsLoading, setLoadingMessage, setProduct, setProductPromotion, setReviewAndRating, setRecentlyViewedProducts, setRecommendedProducts, setSelectedColor, setSelectedSize, setSizeGuide } from "../slices/product_slice";
import handleError from "../../../general/hooks/errorHandler_hook";
import { useLazyGetProductReviewsQuery } from "../../../general/apis/review_api";
import { addBespokeMultipleColorProduct, addBespokeSingleColorProduct, addReadyMadeProduct } from "../models/addProduct_model";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";


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

    const { selectedColor, selectedSize, selectedQuantity } = useSelector((state: RootState) => state.productState);
    const { readyMadeClothesOptions, readyMadeShoesOptions, bespokeClothesOptions, bespokeShoesOptions, accessoriesOptions } = useSelector((state: RootState) => state.generalState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
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
    
    const [getProductByProductID, { data: product }] = useLazyGetProductByProductIDQuery();
    const [getProductPromotion] = useLazyGetProductPromotionQuery();
    const [getProductReviews] = useLazyGetProductReviewsQuery();
    const [addProductToCart] = useAddProductToCartMutation();
    const [getSizeGuide] = useLazyGetSizeGuideQuery();

    // Handle get product by product ID
    const handleGetProductByProductID = async (productID: string) => {
        dispatch(setLoadingMessage("Fetching product..."));
        dispatch(setIsLoading(true));

        try {
            const productResponse = await getProductByProductID(productID!).unwrap();
            // console.log("PRODUCT RESPONSE::: ", productResponse);

            if (productResponse) {
                dispatch(setProduct(productResponse!));

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

    // Add product to cart
    const handleAddProductToCart = async (productType: string) => {
        dispatch(setLoadingMessage("Adding product to cart..."));
        dispatch(setIsLoading(true));        

        try {
            const productID = product?.productId!;
            const sku = product?.variations?.find((variation) => variation.colorValue === selectedColor.name && variation.size === selectedSize)?.sku || "";
            let requestData: addReadyMadeProduct | addBespokeMultipleColorProduct | addBespokeSingleColorProduct = {
                productId: "",
                quantity: 0,
                sku: "",
                size: 0,
            };

            if (productType === "readyMadeShoe" || productType === "readyMadeCloth") {
                requestData = {
                    productId: productID,
                    quantity: selectedQuantity,
                    sku: sku,
                    size: Number(selectedSize),
                };
            } 
            if (productType === "Bespoke Muliple Color") {
                requestData = {
                    productId: productID,
                    quantity: selectedQuantity,
                    sku: "BESPOKE-MULTIPLE",
                    bespokeInstruction: "Please follow the instructions on the product",
                    bodyMeasurements: []
                };
            }
            if (productType === "Bespoke Single Color") {
                requestData = {
                    productId: productID,
                    quantity: selectedQuantity,
                    sku: "BESPOKE",
                    bespokeColor: selectedColor.name,
                    bespokeInstruction: "Please follow the instructions on the product",
                    bodyMeasurements: []
                };
            }
            console.log("REQUEST DATA::: ", requestData);

            const addProductResponse =  await addProductToCart(requestData).unwrap();
            console.log("ADD PRODUCT RESPONSE::: ", addProductResponse);

            if (addProductResponse) {
                // Navigate to cart screen
                navigation.navigate("homeScreen", { screen: "Cart" });
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
        const firstAvailableVariation = product?.variations?.find((variation) => product?.sizes?.includes(variation.size!));
        if (firstAvailableVariation) {
            dispatch(setSelectedSize(firstAvailableVariation.size!));
            dispatch(setFeaturedPrice(firstAvailableVariation.price!));
        }
    }, [product, product?.sizes!, product?.variations!, dispatch]);
    

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