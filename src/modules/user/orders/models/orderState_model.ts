import IOrder from "./order_model";
import IOrderDetails, { IStatus } from "./orderDetails_model";
import IOrderHistory from "./orderHistory_model";

interface IOrderState {
    orderID: string;
    orderDetails: IOrderDetails;
    orders: IOrder[];
    filteredOrders: IOrder[];
    orderHistory: IOrderHistory;
    selectedOrderStatus: IStatus
    isLoading: boolean;
    loadingMessage: string;
}

export default IOrderState;