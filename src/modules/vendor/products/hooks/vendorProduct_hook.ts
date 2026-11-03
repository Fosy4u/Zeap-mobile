import { useEffect, useState, useMemo } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useApplyPromotionMutation, useDeleteProductMutation, useLazyGetAvailablePromosQuery, useLazyGetProductByProductIDQuery, useLazyGetProductPromotionQuery, useLazyGetProductsQuery, useTurnOffPromotionMutation } from "../apis/product_api";
import IVendorProductQueryParams from "../models/vendorProductFilter_model";
import { setProduct, setProductFilterParams, setProductPromotion, setProducts } from "../slices/vendorProductState_slice";
import { setProductID } from "../../../user/products/slices/product_slice";
import { IColor, IImage, IVariation } from "../models/vendorProductDetails_model";
import { IColorEnum } from "../../../general/models/productOptions_model";
import { SubmitHandler } from "react-hook-form";
import { ILikeReview } from "../../../general/validations/review_validation";
import { useDislikeReviewMutation, useLikeReviewMutation } from "../../../general/apis/review_api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { setIsLoading, setLoadingMessage } from "../../../general/slices/general_slice";
import IPromotion from "../models/promotion_model";
import handleError from "../../../general/hooks/errorHandler_hook";
import useReviewHook from "../../../general/hooks/review_hook";

export type FilterKey = "productType" | "main" | "style" | "gender" | "ageGroup" | "ageRange"
    | "brand" | "design" | "occasion" | "sleeveLength" | "fastening" | "fit";

const NON_FILTER_KEYS: (keyof IVendorProductQueryParams)[] = ["pageNumber", "limit", "productId", "shopId"];

const useVendorProductHook = () => {
    const { product, productIsLoading, products } = useSelector((state: RootState) => state.vendorProductState);
    const { productTypes, bespokeClothesOptions, bespokeShoesOptions, readyMadeClothesOptions, readyMadeShoesOptions, accessoriesOptions } = useSelector((state: RootState) => state.generalState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const [productTypeOptions, setProductTypeOptions] = useState<string[]>([]);
    const [mainCategoryOptions, setMainCategoryOptions] = useState<string[]>([]);
    const [styleOptions, setStyleOptions] = useState<string[]>([]);
    const [genderOptions, setGenderOptions] = useState<string[]>([]);
    const [ageGroupOptions, setAgeGroupOptions] = useState<string[]>([]);
    const [ageRangeOptions, setAgeRangeOptions] = useState<string[]>([]);
    const [brandOptions, setBrandOptions] = useState<string[]>([]);
    const [, setSizeOptions] = useState<string[]>([]);
    const [, setColorOptions] = useState<string[]>([]);
    const [designOptions, setDesignOptions] = useState<string[]>([]);
    const [occasionOptions, setOccasionOptions] = useState<string[]>([]);
    const [sleeveLengthOptions, setSleeveLengthOptions] = useState<string[]>([]);
    const [fasteningOptions, setFasteningOptions] = useState<string[]>([]);
    const [fitOptions, setFitOptions] = useState<string[]>([]);
    const [, setAccessoryTypeOptions] = useState<string[]>([]);

    const [showClothingType, setShowClothingType] = useState(false);
    const [showMainCategory, setShowMainCategory] = useState(false);
    const [showStyle, setShowStyle] = useState(false);
    const [showGender, setShowGender] = useState(false);
    const [showAgeGroup, setShowAgeGroup] = useState(false);
    const [showAgeRange, setShowAgeRange] = useState(false);
    const [showBrand, setShowBrand] = useState(false);
    // const [showSize, setShowSize] = useState(false);
    // const [showColor, setShowColor] = useState(false);
    const [showDesign, setShowDesign] = useState(false);
    const [showOccasion, setShowOccasion] = useState(false);
    const [showSleeveLength, setShowSleeveLength] = useState(false);
    const [showFastening, setShowFastening] = useState(false);
    const [showFit, setShowFit] = useState(false);
    const [showPriceAdjustment, setShowPriceAdjustment] = useState(false);

    // const [selectedSize, setSelectedSize] = useState<string[]>([]);
    // const [selectedColor, setSelectedColor] = useState<string[]>([]);
    const [selectedLimit] = useState<number>(20);

    const requestParams = useSelector((state: RootState) => state.vendorProductState.productFilterParams);
    const selectedPageNumber = requestParams.pageNumber ?? 1;
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const selectedStatus = requestParams.status ?? "live";

    const handleSearchProducts = (phrase: string) => setSearchPhrase(phrase);

    const handleSelectProductStatus = (status: string) => {
        setSearchPhrase("");
        dispatch(setProductFilterParams({ ...requestParams, status, pageNumber: 1 }));
    };

    const setRequestParams = (params: IVendorProductQueryParams) => {
        dispatch(setProductFilterParams(params));
    };

    const setSelectedPageNumber = (pageNumber: number) => {
        dispatch(setProductFilterParams({ ...requestParams, pageNumber }));
    };

    const toggleFilter = (key: FilterKey, value: string) => {
        const next: IVendorProductQueryParams = { ...requestParams, pageNumber: 1 };
        if (next[key] === value) {
            delete next[key];
        } else {
            next[key] = value;
        }
        dispatch(setProductFilterParams(next));
    };

    const setSelectedPrice = (value: number) => {
        const next: IVendorProductQueryParams = { ...requestParams, pageNumber: 1 };
        if (!value || isNaN(value)) {
            delete next.price;
        } else {
            next.price = value;
        }
        dispatch(setProductFilterParams(next));
    };

    const handleClearFilters = () => {
        dispatch(setProductFilterParams({ pageNumber: 1, limit: selectedLimit }));
    };

    const activeFilterCount = (Object.keys(requestParams) as (keyof IVendorProductQueryParams)[])
        .filter((key) => !NON_FILTER_KEYS.includes(key) && requestParams[key] !== undefined && requestParams[key] !== "")
        .length;

    const selectedProductType = requestParams.productType ?? "";
    const selectedMainCategory = requestParams.main ?? "";
    const selectedStyle = requestParams.style ?? "";
    const selectedGender = requestParams.gender ?? "";
    const selectedAgeGroup = requestParams.ageGroup ?? "";
    const selectedAgeRange = requestParams.ageRange ?? "";
    const selectedBrand = requestParams.brand ?? "";
    const selectedDesign = requestParams.design ?? "";
    const selectedOccasion = requestParams.occasion ?? "";
    const selectedSleeveLength = requestParams.sleeveLength ?? "";
    const selectedFastening = requestParams.fastening ?? "";
    const selectedFit = requestParams.fit ?? "";
    const selectedPrice = requestParams.price ?? 0;
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
    const [selectedPromo, setSelectedPromoState] = useState<IPromotion>({});
    const [discountPercentage, setDiscountPercentage] = useState<string>("");

    const isFixedPromo = (promo?: IPromotion) => promo?.discount?.type === "fixed";

    const promoRange = (promo?: IPromotion) => ({
        min: promo?.discount?.rangePercentage?.min ?? 0,
        max: promo?.discount?.rangePercentage?.max ?? 0,
    });

    // Fixed promos lock to their own percentage; range promos open at the
    // minimum the vendor is allowed to pick.
    const setSelectedPromo = (promo: IPromotion) => {
        setSelectedPromoState(promo);
        if (isFixedPromo(promo)) {
            setDiscountPercentage(String(promo?.discount?.fixedPercentage ?? 0));
        } else {
            setDiscountPercentage(String(promoRange(promo).min));
        }
    };
    const [showDeleteProductWarningModal, setShowDeleteProductWarningModal] = useState(false);

    const [getProducts, { isFetching: isLoadingProducts }] = useLazyGetProductsQuery();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();
    const [deleteProduct] = useDeleteProductMutation();
    // const [createReview, { isLoading: isLoadingAddReview }] = useCreateReviewMutation();
    const [likeReview] = useLikeReviewMutation();
    const [dislikeReview] = useDislikeReviewMutation();
    const [getAvailablePromos, { data: promotions, isFetching: isFetchingPromotions, isUninitialized: isPromotionsUninitialized }] = useLazyGetAvailablePromosQuery();
    const [getProductPromotion] = useLazyGetProductPromotionQuery();
    const [applyPromotion] = useApplyPromotionMutation();
    const [turnOffPromotion] = useTurnOffPromotionMutation();

    const { handleGetProductReviews } = useReviewHook();

    const handleGetDefaultFeaturedImageAndThumbnails = () => {
        const defaultImageAndThumbnails = product?.colors?.find((eachColor: IColor) => eachColor.images?.some((eachImage: IImage) => eachImage.isDefault === true));
        const activeImage = defaultImageAndThumbnails?.images?.find((eachImage: IImage) => eachImage.isDefault === true);

        setDefaultFeaturedImageAndThumbnails(defaultImageAndThumbnails!);
        setFeaturedImage(activeImage!);
        return activeImage;
    };

    const handleUpdateDefaultFeaturedImageAndThumbnails = (color: string) => {
        const defaultImageAndThumbnails = product?.colors?.find((eachColor) => eachColor.value?.toLowerCase() === color.toLowerCase());
        const activeImage = defaultImageAndThumbnails?.images?.find((eachImage) => eachImage.isDefault! === true) || defaultImageAndThumbnails!.images![0];

        setDefaultFeaturedImageAndThumbnails(defaultImageAndThumbnails!);
        setFeaturedImage(activeImage);
    };

    const handleGetFeaturedColors = () => {

        let newColorVariations: string[] = [];
        if (product?.productType! === "readyMadeCloth" || product?.productType! === "readyMadeShoe" || product?.productType! === "accessory") {
                newColorVariations = product?.variations?.map((variation: IVariation) => variation.colorValue!) || [];
        } else {
            newColorVariations = product?.variations?.[0]?.bespoke?.availableColors! || [];
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

        setFeaturedColors(availableColors);
    };

    // Handle format product types
    const handleFormatProductTypes = () => {
        if (!productTypes) return;

        const formattedProductTypes = productTypes.map((productType: string) => {
            return productType.replace(/([A-Z])/g, " $1")  // Add a space before capital letters
                .replace(/^./, str => str.toUpperCase())    // Make first letter uppercase
                .trim();    // Remove leading and trailing spaces
        });
        setProductTypeOptions(formattedProductTypes);
    };

    // Handle format serch options
    const handleFormatSearchOptions = () => {
        setMainCategoryOptions(bespokeClothesOptions.mainEnums!);
        setStyleOptions(bespokeClothesOptions.clothStyleEnums!);
        setGenderOptions(bespokeClothesOptions.genderEnums!);
        setAgeGroupOptions(bespokeClothesOptions.ageGroupEnums!);
        setAgeRangeOptions(bespokeClothesOptions.ageRangeEnums!);
        setBrandOptions(bespokeClothesOptions.brandEnums!);
        setSizeOptions(bespokeClothesOptions.clothSizeEnums!);
        setColorOptions(bespokeClothesOptions.colorEnums!.map(color => color.name!));
        setDesignOptions(bespokeClothesOptions.designEnums!);
        setOccasionOptions(bespokeClothesOptions.occasionEnums!);
        setSleeveLengthOptions(bespokeClothesOptions.sleeveLengthEnums!);
        setFasteningOptions(bespokeClothesOptions.fasteningEnums!);
        setFitOptions(bespokeClothesOptions.fitEnums!);
        setAccessoryTypeOptions(accessoriesOptions.accessoryTypeEnums!);
    };

    // Handle submit filter products
    const handleFetchFilteredProducts = async () => {
        dispatch(setIsLoading(true));
        dispatch(setLoadingMessage("Fetching products..."));

        try {
            const products = await getProducts(requestParams).unwrap();
            // console.log("PRODUCTS::: ", products.length);

            if (products) {
                dispatch(setProducts(products));
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };

    // Handle get product by product ID
    const handleGetShopPricedProduct = async (productID: string) => {
        try {
            const products = await getProducts({ productId: productID, pageNumber: 1, limit: 1 }).unwrap();
            return products?.[0];
        } catch {
            return undefined;
        }
    };

    const handleGetProductByProductID = async (productID: string) => {
        dispatch(setIsLoading(true));
        dispatch(setLoadingMessage("Fetching product..."));

        try {
            const productResponse = await getProductByProductID(productID).unwrap();
            // console.log("PRODUCT RESPONSE: ", productResponse);

            if (productResponse) {
                dispatch(setProduct(productResponse));

                // Get product promo and reviews
                dispatch(setLoadingMessage("Fetching product promo and reviews..."));
                const [productPromotionResponse, _] = await Promise.all([
                // await Promise.all([
                    getProductPromotion(productID!).unwrap(),
                    handleGetProductReviews(productID!),
                ]);

                if (productPromotionResponse) {
                    dispatch(setProductPromotion(productPromotionResponse));
                } else {
                    dispatch(setProductPromotion({}));
                }
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            console.log("ERROR::: ", error);
        }
    };

    // Handle delete product
    const handleDeleteProduct = async (productID: string) => {
        dispatch(setLoadingMessage("Deleting product..."));
        dispatch(setIsLoading(true));

        try {
            const requestData = {
                productIds: [productID]
            };           

            const deleteProductResponse = await deleteProduct(requestData).unwrap();
            // console.log("DELETE PRODUCT RESPONSE::: ", deleteProductResponse);

            if (deleteProductResponse) {
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
                navigation.navigate("vendorProductsScreen");
            }
        } catch (error) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };

    // Handle review like
    const handleReviewLike: SubmitHandler<ILikeReview> = async (data) => {
        try {
            const requestData = {
                _id: data._id,
            };

            const likeResponse = await likeReview(requestData).unwrap();
            console.log("RESPONSE::: ", likeResponse);
        } catch (error: any) {
            handleError(error);
        };
    };

    // Handle review dislike
    const handleReviewDislike: SubmitHandler<ILikeReview> = async (data) => {
        console.log("REQUEST DATA::: ", data);
        try {
            const dislikeResponse = await dislikeReview(data).unwrap();
            console.log("RESPONSE::: ", dislikeResponse);
        } catch (error: any) {
            handleError(error);
        };
    };

    // Handle get available promotions
    const handleGetAvailablePromos = async () => {
        dispatch(setIsLoading(true));
        dispatch(setLoadingMessage("Fetching promotions..."));

        try {
            const availablePromos = await getAvailablePromos().unwrap();
            // console.log("AVAILABLE PROMOS::: ", availablePromos);
            
            if (availablePromos) {
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error: any) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };

    // Handle get product promotion

    // Handle apply promotion
    const handleApplyPromo = async () => {
        if (!selectedPromo?.promoId) {
            Alert.alert("Error", "Please select a promo to join.");
            return;
        }

        const percentage = Number(discountPercentage);
        const { min, max } = promoRange(selectedPromo);

        if (!isFixedPromo(selectedPromo) && (isNaN(percentage) || percentage < min || percentage > max)) {
            Alert.alert("Error", `Enter a discount percentage between ${ min }% and ${ max }%.`);
            return;
        }

        dispatch(setLoadingMessage("Applying promotion..."));
        dispatch(setIsLoading(true));

        try {
            const requestData = {
                discountPercentage: Number(discountPercentage),
                productId: product?.productId!,
                promoId: selectedPromo?.promoId!,
            };
            console.log("REQUEST DATA::: ", requestData);

            const applyPromotionResponse = await applyPromotion(requestData).unwrap();
            console.log("RESPONSE::: ", applyPromotionResponse);

            if (applyPromotionResponse) {

                // Get back the product promo
                const productPromotionResponse = await getProductPromotion(product?.productId!).unwrap();
                console.log("RESPONSE::: ", productPromotionResponse);

                if (productPromotionResponse) {
                    dispatch(setProductPromotion(productPromotionResponse));
                } else {
                    dispatch(setProductPromotion({}));
                }
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));

                // Return to the product details screen
                if (product?.productId) dispatch(setProductID(product.productId));
                navigation.navigate("productDetailScreen");
            }
        } catch (error) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        };
    };

    // Handle torn-off promo
    const handleTornOffPromo = async (promoID: string) => {
        dispatch(setLoadingMessage("Turning off promotion..."));
        dispatch(setIsLoading(true));

        try {
            const requestData = {
                productId: product?.productId!,
                promoId: promoID,
            };
            console.log("REQUEST DATA::: ", requestData);

            const tornOffPromotionResponse = await turnOffPromotion(requestData).unwrap();
            console.log("RESPONSE::: ", tornOffPromotionResponse);

            if (tornOffPromotionResponse) {

                // Get back the product promo
                const productPromotionResponse = await getProductPromotion(product?.productId!).unwrap();
                console.log("RESPONSE::: ", productPromotionResponse);

                if (productPromotionResponse) {
                    dispatch(setProductPromotion(productPromotionResponse));
                } else {
                    dispatch(setProductPromotion({}));
                }
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        };
    };

    // Handle format date
    const handleFormatDate = (date: string, showTime: boolean = false, divider: string = " : ") => {
        const dateString = new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

        const timeString = new Date(date).toLocaleTimeString("en-GB", {
            hour: "2-digit", 
            minute: "2-digit",
            hour12: true
        });

        return `${dateString}${showTime ? divider + timeString : ""}`;
    };

    useEffect(() => {
        handleFormatProductTypes();
        handleFormatSearchOptions();
    }, [productTypes]);

    useEffect(() => {
        if (product) {
            handleGetDefaultFeaturedImageAndThumbnails();
            handleGetFeaturedColors();
        }
    }, [product]);

    // Pagination visibility — the products endpoint returns only the page
    // array (no total count), so paging is inferred from page-fullness:
    //   • current page is full (length === limit) → a next page likely exists
    //   • we are past page 1                       → a previous page exists
    // When neither holds (empty list, or everything fits on one page) the
    // Previous/Next controls are hidden. Kept here (controller) rather than in
    // the screen so the view stays presentation-only.
    const visibleProducts = useMemo(() => {
        const phrase = searchPhrase.trim().toLowerCase();
        if (!phrase) { return products; }

        const matches = (value: any): boolean => {
            if (value == null) { return false; }
            if (typeof value === "string") { return value.toLowerCase().includes(phrase); }
            if (typeof value === "number") { return String(value).includes(phrase); }
            if (Array.isArray(value)) { return value.some(matches); }
            if (typeof value === "object") { return Object.values(value).some(matches); }
            return false;
        };

        return products.filter(matches);
    }, [products, searchPhrase]);

    const pageSize = requestParams.limit ?? 20;
    const hasNextPage = (products?.length ?? 0) === pageSize;
    const hasPrevPage = selectedPageNumber > 1;
    const showPagination = hasNextPage || hasPrevPage;

    return {
        requestParams, setRequestParams,
        searchPhrase, handleSearchProducts, visibleProducts,
        selectedStatus, handleSelectProductStatus,
        productIsLoading, isLoadingProducts, handleFetchFilteredProducts,
        selectedPageNumber, setSelectedPageNumber,
        hasNextPage, hasPrevPage, showPagination,
        handleGetProductByProductID,
        handleGetShopPricedProduct,
        showDeleteProductWarningModal, setShowDeleteProductWarningModal,
        handleDeleteProduct,
         handleReviewLike, handleReviewDislike, handleGetProductReviews,
        defaultFeaturedImageAndThumbnails, handleUpdateDefaultFeaturedImageAndThumbnails,
        featuredImage, setFeaturedImage,
        featuredColors,
        promotions, handleGetAvailablePromos, selectedPromo, setSelectedPromo, handleApplyPromo, handleTornOffPromo,
        discountPercentage, setDiscountPercentage, isFixedPromo, promoRange,
        /* Uninitialized counts as loading: it covers the render between mount
           and the screen's useEffect firing the request. */
        isLoadingPromotions: isPromotionsUninitialized || isFetchingPromotions,

        productTypeOptions, selectedProductType,
        mainCategoryOptions, selectedMainCategory,
        styleOptions, selectedStyle,
        genderOptions, selectedGender,
        ageGroupOptions, selectedAgeGroup,
        ageRangeOptions, selectedAgeRange,
        brandOptions, selectedBrand,
        designOptions, selectedDesign,
        occasionOptions, selectedOccasion,
        sleeveLengthOptions, selectedSleeveLength,
        fasteningOptions, selectedFastening,
        fitOptions, selectedFit,
        selectedPrice, setSelectedPrice,

        showClothingType, setShowClothingType,
        showMainCategory, setShowMainCategory,
        showStyle, setShowStyle,
        showGender, setShowGender,
        showAgeGroup, setShowAgeGroup,
        showAgeRange, setShowAgeRange,
        showBrand, setShowBrand,
        showDesign, setShowDesign,
        showOccasion, setShowOccasion,
        showSleeveLength, setShowSleeveLength,
        showFastening, setShowFastening,
        showFit, setShowFit,
        showPriceAdjustment, setShowPriceAdjustment,

        toggleFilter, handleClearFilters, activeFilterCount,

        handleFormatDate,
    };
};

export default useVendorProductHook;
