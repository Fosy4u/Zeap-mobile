import IProduct from "../../products/models/product_model";

// A single wishlist ("wish") entry as returned by GET /wish/auth/user.
// `product` is the fully-populated product; `color` is the variant the user
// saved; `_id` is the wish entry's own id.
interface IWishItem {
    _id: string;
    user: string;
    product: IProduct;
    color?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default IWishItem;
