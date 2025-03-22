import { ImageSourcePropType } from "react-native";
import IProduct from "./product_model";
import { IColorEnum } from "../../../general/models/productOptions_model";
import IProductDetails from "./productDetails_model";
import IPromoProduct from "./promoProduct_model";

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
    newestArrivals: IProduct[];
    selectedCategory: ICategory;
    promoProducts: IPromoProduct[];
    product: IProductDetails;
    allProducts: IProduct[];
    categories: ICategory[];

    featuredPrice: number;
    selectedColor: IColorEnum;
    selectedSize: string;
    selectedQuantity: number;
    searchPhrases: string[];
    filteredSearchPhrases: string[];
    searchWord: string;
    showSizedGuideBottomSheet: boolean;
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