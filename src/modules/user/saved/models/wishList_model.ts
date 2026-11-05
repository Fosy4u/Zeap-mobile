import IProduct from "../../products/models/product_model";

interface IWishItem {
    _id: string;
    user: string;
    product: IProduct;
    color?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default IWishItem;
