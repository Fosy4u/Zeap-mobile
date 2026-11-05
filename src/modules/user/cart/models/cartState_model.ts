import IDeliveryMethod, { DeliveryFee } from "../../address/models/deliveryMethod_model";
import ICart from "./cart_model";
import IDeliveryDate from "./deliveryDate_model";
import IOrderSummary from "./orderSummary_model";

interface ICartState {
    cart:           ICart;
    cartTotal:      number;
    deliveryMethod: IDeliveryMethod;
    selectedDeliveryFee: DeliveryFee;
    orderSummary:   IOrderSummary;
    deliveryDates: IDeliveryDate[];
    isLoading:      boolean;
    isCartItemsLoading: boolean;
    loadingMessage: string;
};

export default ICartState;