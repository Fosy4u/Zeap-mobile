import { ImageSourcePropType } from "react-native";
import IProduct from "./product_model";

interface IProductState {
    tabs: string[];
    selectedTab: string;
    timelines: string[];
    savedMeasurements: ISavedMeasurement[];
    savedAddresses: ISavedAddress[];
    newestProducts: INewestProduct[];
    femaleClothings: IProduct[];
    maleClothings: IProduct[];
    shoes: IProduct[];
    accessories: IProduct[];
    bags: IProduct[];
    popularProducts: IProduct[];
    selectedCategory: ICategory;
    categories: ICategory[];
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