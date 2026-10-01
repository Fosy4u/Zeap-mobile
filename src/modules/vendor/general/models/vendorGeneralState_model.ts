import IShop from "./shop_model";

interface IVendorGeneralState {
    /* null until /shop/auth answers, and again whenever the backend says the
       account has no shop on record. */
    shop: IShop | null;
};

export default IVendorGeneralState;
