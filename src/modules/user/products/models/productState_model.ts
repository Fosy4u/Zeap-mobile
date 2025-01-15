import { ImageSourcePropType } from "react-native";
import IProduct from "./product_model";
import { IColorEnum } from "../../../general/models/productOptions_model";

interface IProductState {
    tabs: string[];
    selectedTab: string;
    timelines: string[];
    savedMeasurements: ISavedMeasurement[];
    savedAddresses: ISavedAddress[];
    newestProducts: INewestProduct[];
    femaleClothing: IProduct[];
    maleClothing: IProduct[];
    shoes: IProduct[];
    accessories: IProduct[];
    bags: IProduct[];
    popularProducts: IProduct[];
    selectedCategory: ICategory;
    categories: ICategory[];

    featuredPrice: number;
    selectedColor: IColorEnum;
    selectedSize: string;
    selectedQuantity: number;
};

interface INewestProduct {
    id: string;
    discount: number;
    message: string;
    imageLink: string
};

interface ISavedMeasurement {
    id: string;
    title: string;
    items: string[];
}

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

export type { INewestProduct, ISavedMeasurement, ISavedAddress, ICategory };
export default IProductState;