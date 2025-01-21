import { ImageSourcePropType } from "react-native";
import IProduct from "./product_model";
import { IColorEnum } from "../../../general/models/productOptions_model";
import IProductDetails from "./productDetails_model";

interface IProductState {
    productID: string;
    tabs: string[];
    selectedTab: string;
    timelines: string[];
    savedAddresses: ISavedAddress[];
    newestProducts: INewestProduct[];
    femaleClothing: IProduct[];
    maleClothing: IProduct[];
    shoes: IProduct[];
    accessories: IProduct[];
    bags: IProduct[];
    popularProducts: IProduct[];
    selectedCategory: ICategory;
    product: IProductDetails;
    products: IProduct[];
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

interface INewestProduct {
    id: string;
    discount: number;
    message: string;
    imageLink: string
};

interface ISavedAddress {
    id: string;
    title: string;
    phone: string;
    email: string;
    streetAddress: string;
}

interface ICategory {
    id: number;
    name: string;
    totalCount: number;
    color: string[];
    image: ImageSourcePropType;
};

export type { INewestProduct, ISavedAddress, ICategory };
export default IProductState;