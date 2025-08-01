import IOrder from "./order_model";
import IOrderHistory from "./orderHistory_model";

interface IOrderState {
    orderDetails: IOrder;
    orders: IOrder[];
    filteredOrders: IOrder[];
    orderHistory: IOrderHistory;
    showStatusHistory: boolean;
    isLoading: boolean;
    loadingMessage: string;
}

export default IOrderState;