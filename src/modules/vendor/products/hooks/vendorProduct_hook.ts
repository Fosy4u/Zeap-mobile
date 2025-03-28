import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useLazyGetProductByProductIDQuery, useLazyGetProductsQuery } from "../apis/product_api";
import IVendorProductQueryParams from "../models/vendorProductFilter_model";
import { setIsLoadingProducts, setLoadingMessage, setProduct, setProducts } from "../slices/vendorProductState_slice";
import { IColor, IImage, IVariation } from "../models/vendorProductDetails_model";
import { IColorEnum } from "../../../general/models/productOptions_model";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import reviewSchema, { ILikeReview, IReviewProduct } from "../../../general/validations/review_validation";
import { useCreateReviewMutation, useDislikeReviewMutation, useLazyGetVendorProductReviewsQuery, useLikeReviewMutation } from "../../../general/apis/review_api";


const useVendorProductHook = () => {
    const { product, isLoadingProducts } = useSelector((state: RootState) => state.vendorProductState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const { productTypes, bespokeClothesOptions, bespokeShoesOptions, readyMadeClothesOptions, readyMadeShoesOptions, accessoriesOptions } = useSelector((state: RootState) => state.generalState);
    const dispatch = useDispatch();

    const [productTypeOptions, setProductTypeOptions] = useState<string[]>([]);
    const [mainCategoryOptions, setMainCategoryOptions] = useState<string[]>([]);
    const [styleOptions, setStyleOptions] = useState<string[]>([]);
    const [genderOptions, setGenderOptions] = useState<string[]>([]);
    const [ageGroupOptions, setAgeGroupOptions] = useState<string[]>([]);
    const [ageRangeOptions, setAgeRangeOptions] = useState<string[]>([]);
    const [brandOptions, setBrandOptions] = useState<string[]>([]);
    const [sizeOptions, setSizeOptions] = useState<string[]>([]);
    const [colorOptions, setColorOptions] = useState<string[]>([]);
    const [designOptions, setDesignOptions] = useState<string[]>([]);
    const [occasionOptions, setOccasionOptions] = useState<string[]>([]);
    const [sleeveLengthOptions, setSleeveLengthOptions] = useState<string[]>([]);
    const [fasteningOptions, setFasteningOptions] = useState<string[]>([]);
    const [fitOptions, setFitOptions] = useState<string[]>([]);
    const [accessoryTypeOptions, setAccessoryTypeOptions] = useState<string[]>([]);

    const [showClothingType, setShowClothingType] = useState(false);
    const [showMainCategory, setShowMainCategory] = useState(false);
    const [showStyle, setShowStyle] = useState(false);
    const [showGender, setShowGender] = useState(false);
    const [showAgeGroup, setShowAgeGroup] = useState(false);
    const [showAgeRange, setShowAgeRange] = useState(false);
    const [showBrand, setShowBrand] = useState(false);
    const [showSize, setShowSize] = useState(false);
    const [showColor, setShowColor] = useState(false);
    const [showDesign, setShowDesign] = useState(false);
    const [showOccasion, setShowOccasion] = useState(false);
    const [showSleeveLength, setShowSleeveLength] = useState(false);
    const [showFastening, setShowFastening] = useState(false);
    const [showFit, setShowFit] = useState(false);
    const [showPriceAdjustment, setShowPriceAdjustment] = useState(false);

    const [selectedProductType, setSelectedProductType] = useState<string>("");
    const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
    const [selectedStyle, setSelectedStyle] = useState<string>("");
    const [selectedGender, setSelectedGender] = useState<string>("");
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");
    const [selectedAgeRange, setSelectedAgeRange] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string[]>([]);
    const [selectedColor, setSelectedColor] = useState<string[]>([]);
    const [selectedDesign, setSelectedDesign] = useState<string>("");
    const [selectedOccasion, setSelectedOccasion] = useState<string>("");
    const [selectedSleeveLength, setSelectedSleeveLength] = useState<string>("");
    const [selectedFastening, setSelectedFastening] = useState<string>("");
    const [selectedFit, setSelectedFit] = useState<string>("");
    const [selectedPrice, setSelectedPrice] = useState<number>(0);
    const [selectedLimit, setSelectedLimit] = useState<number>(20);
    const [selectedPageNumber, setSelectedPageNumber] = useState<number>(1);
    const [requestParams, setRequestParams] = useState<IVendorProductQueryParams>({
        pageNumber: selectedPageNumber,
        limit: selectedLimit,
    });
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


    const [getProducts] = useLazyGetProductsQuery();
    const [getProductByProductID, { isLoading: isLoadingProduct }] = useLazyGetProductByProductIDQuery();
    const [getVendorProductReviews, { data: reviewData, isLoading: isLoadingReviews }] = useLazyGetVendorProductReviewsQuery();
    const [createReview, { isLoading: isLoadingAddReview }] = useCreateReviewMutation();
    const [likeReview] = useLikeReviewMutation();
    const [dislikeReview] = useDislikeReviewMutation();


    const { handleSubmit, control, formState: { errors }, reset } = useForm<IReviewProduct>({
        defaultValues: {
            title: "",
            rating: 0,
            review: "",
        },
        resolver: yupResolver(reviewSchema)
    });

    const onSubmit: SubmitHandler<IReviewProduct> =  async(data) => {

        const requestData = {
            productId: product.productId!,
            displayName: `${userData.firstName} ${userData.lastName}`,
            title: data.title,
            rating: data.rating,
            imageMatch: true,
            review: data.review,
        }
        // console.log("REQUEST DATA::: ", requestData);

        try {
            const reviewResponse = await createReview(requestData).unwrap();

            // Reset form to default values
            reset();
            console.log("RESPONSE::: ", reviewResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };



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
        dispatch(setIsLoadingProducts(true));
        dispatch(setLoadingMessage("Fetching products..."));

        try {
            console.log("REQUEST PARAMS::: ", requestParams);
            
            const products = await getProducts(requestParams).unwrap();
            // console.log("PRODUCTS::: ", products[0]);

            if (products) {
                dispatch(setProducts(products));
                dispatch(setIsLoadingProducts(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            dispatch(setIsLoadingProducts(false));
            dispatch(setLoadingMessage(""));
            console.log("ERROR: ", error);
        }
    };

    // Handle get product by product ID
    const handleGetProductByProductID = async (productID: string) => {
        dispatch(setLoadingMessage("Fetching product..."));

        try {
            const productResponse = await getProductByProductID(productID).unwrap();
            // console.log("PRODUCT RESPONSE: ", product);

            if (productResponse) {
                dispatch(setProduct(productResponse));

                // Get product reviews
                dispatch(setLoadingMessage("Fetching reviews..."));
                const reviewsResponse = await getVendorProductReviews(productID).unwrap();

                if (reviewsResponse) {
                    dispatch(setLoadingMessage(""));
                }
            }
        } catch (error) {
            dispatch(setLoadingMessage(""));
            console.log("ERROR: ", error);
        }
    };


    // Handle get product reviews
    const handleGetProductReviews = async (productID: string) => {
        dispatch(setLoadingMessage("Fetching reviews..."));

        try {
            const reviewsResponse = await getVendorProductReviews(productID).unwrap();

            if (reviewsResponse) {
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            dispatch(setLoadingMessage(""));
            console.log("ERROR: ", error);
        }
    };

    const handleReviewLike: SubmitHandler<ILikeReview> = async (data) => {
        try {
            const likeResponse = await likeReview(data).unwrap();
            console.log("RESPONSE::: ", likeResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        };
    };

    const handleReviewDislike: SubmitHandler<ILikeReview> = async (data) => {
        console.log("REQUEST DATA::: ", data);
        try {
            const dislikeResponse = await dislikeReview(data).unwrap();
            console.log("RESPONSE::: ", dislikeResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        };
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


    return {
        requestParams, setRequestParams,
        isLoadingProducts, handleFetchFilteredProducts,
        selectedPageNumber, setSelectedPageNumber,
        isLoadingProduct, handleGetProductByProductID,
        onSubmit, handleSubmit, handleReviewLike, handleReviewDislike, control, errors, isLoadingAddReview, reviewData, isLoadingReviews,
        defaultFeaturedImageAndThumbnails, handleUpdateDefaultFeaturedImageAndThumbnails,
        featuredImage, setFeaturedImage,
        featuredColors,


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

        setSelectedProductType,
        setSelectedMainCategory,
        setSelectedStyle,
        setSelectedGender,
        setSelectedAgeGroup,
        setSelectedAgeRange,
        setSelectedBrand,
        setSelectedDesign,
        setSelectedOccasion,
        setSelectedSleeveLength,
        setSelectedFastening,
        setSelectedFit,
    };
};

export default useVendorProductHook;
