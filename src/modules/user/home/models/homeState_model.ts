import { ImageSourcePropType } from "react-native";

interface IHomeState {
    bestDeals: IBestDeal[];
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

export type { IBestDeal };
export default IHomeState;