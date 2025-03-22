import ICart from "./cart_model";

interface ICartState {
    cart:           ICart;
    cartTotal:      number;
    cartLoading:    boolean;
    cartError:      boolean;
};

export default ICartState;