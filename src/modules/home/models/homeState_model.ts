import { ImageSourcePropType } from "react-native";

interface IHomeState {
    selectedCategory: ICategory;
    categories: ICategory[];
    bestDeals: IBestDeal[];
};

interface ICategory {
    id: number;
    name: string;
    itenCount: number;
    color: string[];
    image: ImageSourcePropType;
};

interface IBestDeal {
    id: string;
    name: string;
    productType: string;
    price: string;
    rating: number,
    isFavorite: boolean,
    image: ImageSourcePropType
};

export type { ICategory };
export default IHomeState;