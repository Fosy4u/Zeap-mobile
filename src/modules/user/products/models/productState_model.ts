import { ImageSourcePropType } from "react-native";
import IProduct from "./product_model";
import { IColorEnum } from "../../../general/models/productOptions_model";
import IProductDetails from "./productDetails_model";
import IPromoProduct from "./promotion_model";
import IReview from "../../../general/models/review_model";
import IReviewAndRating from "../../../general/models/review_model";
import IDynamicFilter from "./dynamicFilter_model";

interface IProductState {
    productID: string;
    tabs: string[];
    selectedTab: string;
    timelines: string[];
    femaleClothing: IProduct[];
    maleClothing: IProduct[];
    shoes: IProduct[];
    accessories: IProduct[];
    bags: IProduct[];
    popularProducts: IProduct[];
    newestPrpducts: IProduct[];
    currentPage: number;
    selectedCategory: ICategory;
    promoProducts: IPromoProduct[];
    productPromotion: IPromoProduct;
    product: IProductDetails;
    allProducts: IProduct[];
    recentlyViewedProducts: IProduct[];
    recommendedProducts: IProduct[];
    wishListProducts: IProduct[];
    categories: ICategory[];

    featuredPrice: number;
    selectedColor: IColorEnum;
    selectedSize: string;
    selectedQuantity: number;
    searchPhrases: string[];
    filteredSearchPhrases: string[];
    searchPhrase: string;
    showSizedGuideBottomSheet: boolean;

    reviewAndRating: IReviewAndRating;
    sizeGuide: any;
    dynamicFilterOptions: IDynamicFilter[];

    isLoading: boolean;
    promoProductsIsLoading: boolean;
    popularProductsIsLoading: boolean;
    newestProductsIsLoading: boolean;
    recentlyViewedProductsIsLoading: boolean;
    recommendedProductsIsLoading: boolean;
    wishListProductsIsLoading: boolean;
    loadingMessage: string;
};

// interface INewestProduct {
//     id: string;
//     discount: number;
//     message: string;
//     imageLink: string
// };

interface ICategory {
    id: number;
    name: string;
    totalCount: number;
    color: string[];
    image: ImageSourcePropType;
};

export type { ICategory };
export default IProductState;