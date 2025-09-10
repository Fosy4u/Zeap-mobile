import IOrder from "./oder_model";
import IOrderHistory from "./orderHistory_model";

interface IOrderState {
    orders: IOrder[];
    order: IOrder;
    orderHistory: IOrderHistory;
    showUpdateOrderBottomSheet: boolean;
    loadingMessage: string;
    isLoading: boolean;
};

export default IOrderState;