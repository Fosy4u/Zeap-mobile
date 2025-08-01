import IDeliveryMethod, { DeliveryFee } from "../../address/models/deliveryMethod_model";
import ICart from "./cart_model";
import IDeliveryDate from "./deliveryDate_model";
import IOrderSummary from "./orderSummary_model";

interface ICartState {
    cart:           ICart;
    cartTotal:      number;
    deliveryMethod: IDeliveryMethod;
    selectedDeliveryFee: DeliveryFee;
    orderSummary:   IOrderSummary; // Assuming order summary is an object, you can define a more specific type if needed
    deliveryDates: IDeliveryDate[];
    isLoading:      boolean;
    loadingMessage: string;
};

export default ICartState;