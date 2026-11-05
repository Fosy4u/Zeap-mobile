import IOrder from "./oder_model";
import IOrderDetails from "./orderDetails_model";
import IOrderHistory from "./orderHistory_model";
import IVendorOrderFilter from "./orderFilter_model";

interface IOrderState {
    orders: IOrder[];
    order: IOrderDetails;
    orderHistory: IOrderHistory;
    showConfirmOrderModal: boolean;
    showRejectOrderModal: boolean;
    showStatusSuccessModal: boolean;
    loadingMessage: string;
    isLoading: boolean;
    historyIsLoading: boolean;
    ordersHaveFetched: boolean;
    filters: IVendorOrderFilter;
    searchPhrase: string;
};

export default IOrderState;