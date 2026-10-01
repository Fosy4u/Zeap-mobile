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
    // Separate from isLoading so refetching history can't drop the action loader.
    historyIsLoading: boolean;
    // False until an orders fetch settles, so the empty state can't flash first.
    ordersHaveFetched: boolean;
    // Filters applied from the "Filter Order Request" sheet (also sent to the API).
    filters: IVendorOrderFilter;
    /* Free-text search from the box on the orders screen. Client-side only —
       there is no search param on the orders endpoint. */
    searchPhrase: string;
};

export default IOrderState;