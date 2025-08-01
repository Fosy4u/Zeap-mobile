import { useLazyGetOrderHistoryQuery, useLazyGetOrdersQuery } from "../apis/order_api";
import { useDispatch, useSelector } from "react-redux";
import { setFilteredOrders, setIsLoading, setLoadingMessage, setOrderHistory, setOrders } from "../slices/order_slice";
import handleError from "../../../general/hooks/errorHandler_hook";
import { RootState } from "../../../../redux/store/store";
import IOrder from "../models/order_model";

const useOrderHook = () => {
    const { orderDetails } = useSelector((state: RootState) => state.orderState);
    const dispatch = useDispatch();

    const [getOrders] = useLazyGetOrdersQuery();
    const [getOrderHistory] = useLazyGetOrderHistoryQuery();

    // Handle get orders
    const handleGetOrders = async () => {
        dispatch(setLoadingMessage("Fetching orders..."));
        dispatch(setIsLoading(true));

        try {
            const orderResponse = await getOrders().unwrap();
            // console.log("ORDER RESPONSE::: ", orderResponse);
            
            if (orderResponse) {
                dispatch(setOrders(orderResponse));
                dispatch(setFilteredOrders(orderResponse)); // Initialize filtered orders with all orders

                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            handleError(error);
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Filter orders by status
    const filterOrdersByStatus = (status: string) => {
        if (!orders || orders.length === 0) {
            return [];
        }

        // If status is 'all', return all orders
        if (status.toLowerCase() === 'all') {
            dispatch(setFilteredOrders(orders));
            return orders;
        }
        
        const filteredOrders = orders.filter(order =>
            order.productOrders.some(productOrder => productOrder.status.name.toLowerCase() === status.toLowerCase())
        );
        if (filteredOrders.length > 0) {
            dispatch(setFilteredOrders(filteredOrders));
        } else {
            return [];
        }
    }

    // Handle get order history
    const handleGetOrderHistory = async () => {
        dispatch(setLoadingMessage("Fetching order history..."));
        dispatch(setIsLoading(true));

        const productOrder_id = orderDetails.productOrders[0]._id;

        try {
            const orderHistoryResponse = await getOrderHistory({ productOrder_id }).unwrap();
            // console.log("ORDER HISTORY RESPONSE::: ", orderHistoryResponse);
            
            if (orderHistoryResponse) {
                dispatch(setOrderHistory(orderHistoryResponse));

                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            handleError(error);
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    }

    return {
        handleGetOrders,
        filterOrdersByStatus,
        handleGetOrderHistory,
    };
}; 

export default useOrderHook;