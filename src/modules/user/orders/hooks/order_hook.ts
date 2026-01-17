import { useLazyGetOrderDetailsQuery, useLazyGetOrderHistoryQuery, useLazyGetOrdersQuery } from "../apis/order_api";
import { useDispatch, useSelector } from "react-redux";
import { setFilteredOrders, setIsLoading, setLoadingMessage, setOrderDetails, setOrderHistory, setOrders } from "../slices/order_slice";
import handleError from "../../../general/hooks/errorHandler_hook";
import { RootState } from "../../../../redux/store/store";
import { useState } from "react";

const useOrderHook = () => {
    const { orders } = useSelector((state: RootState) => state.orderState);
    const dispatch = useDispatch();
    const [historyIsLoading, setHistoryIsLoading] = useState(false);

    const [getOrders] = useLazyGetOrdersQuery();
    const [getOrderDetails] = useLazyGetOrderDetailsQuery();
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

    // Handle get order details (accept optional orderId to allow calling before Redux orderID updates)
    const handleGetOrderDetails = async (orderID: string) => {
        dispatch(setLoadingMessage("Fetching order details..."));
        dispatch(setIsLoading(true));

        try {
            const orderDetails = await getOrderDetails({ orderId: orderID }).unwrap();
            // console.log("ORDER DETAILS RESPONSE::: ", order);
            
            if (orderDetails) {
                dispatch(setOrderDetails(orderDetails));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle get order history
    const handleGetOrderHistory = async (productOrderID: string) => {
        setHistoryIsLoading(true);
    
        try {
            const orderHistoryResponse = await getOrderHistory({ productOrder_id: productOrderID }).unwrap();
            // console.log("ORDER HISTORY RESPONSE::: ", orderHistoryResponse);
            
            if (orderHistoryResponse) {
                dispatch(setOrderHistory(orderHistoryResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            setHistoryIsLoading(false);
        }
    }

    return {
        handleGetOrders,
        filterOrdersByStatus,
        handleGetOrderDetails,
        handleGetOrderHistory, historyIsLoading,
    };
}; 

export default useOrderHook;