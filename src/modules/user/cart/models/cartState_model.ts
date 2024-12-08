import { ImageSourcePropType } from "react-native";

interface ICartState {
    carts: ICartItem[];
};

interface ICartItem {
    id: string;
    productId: string;
    title: string;
    color: string;
    price: number;
    count: number;
    image: ImageSourcePropType;
};

export default ICartState;