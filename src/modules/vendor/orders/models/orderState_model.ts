import IOrder from "./oder_model";
import IOrderDetails from "./orderDetails_model";
import IOrderHistory from "./orderHistory_model";

interface IOrderState {
    orders: IOrder[];
    order: IOrderDetails;
    orderHistory: IOrderHistory;
    showUpdateOrderBottomSheet: boolean;
    loadingMessage: string;
    isLoading: boolean;
};

export default IOrderState;