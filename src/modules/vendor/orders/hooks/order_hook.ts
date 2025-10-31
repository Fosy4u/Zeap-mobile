import { useDispatch, useSelector } from "react-redux";
import { useLazyGetOrderDetailsQuery, useLazyGetOrderHistoryQuery, useLazyGetOrdersQuery, useUpdateOrderStatusMutation } from "../apis/order_api";
import { setIsLoading, setLoadingMessage, setOrder, setOrderHistory, setOrders, setShowUpdateOrderBottomSheet } from "../slices/orderState_slice";
import handleError from "../../../general/hooks/errorHandler_hook";
import { setIsLoading as generalSetIsLoading, setLoadingMessage as generalSetLoadingMessage } from "../../../general/slices/general_slice";
import { ArrowRotateRight, TickSquare, Truck, TruckFast } from "iconsax-react-native";
import { useEffect, useRef, useState } from "react";
import { RootState } from "../../../../redux/store/store";
import IOrderUpdate from "../models/orderUpdate_model";
import { Dimensions } from "react-native";
import * as Animatable from 'react-native-animatable';
import { INextStatus } from "../models/orderHistory_model";
import { getVendorOrderDetailsRoute } from "../../../../redux/api/api_route";

interface IStatus {
    [key: string]: {
    bgColor: string;
    borderColor: string;
    textColor: string;
    icon: React.ElementType;
    };
};
interface IStatusUpdate {
    id: string;
    label: string;
};

const useOrderHook = () => {
    const { order } = useSelector((state: RootState) => state.vendorOrderState);
    const dispatch = useDispatch();
    const screenHeight = Dimensions.get('window').height;
    const modalHeight = screenHeight / 1.4;
    const slideAnimation = useRef<Animatable.View>(null);

    const [selectedStatus, setSelectedStatus] = useState<INextStatus>({} as INextStatus);

    const status: IStatus = {
        Placed: {
            bgColor: "bg-slate-100",
            borderColor: "border-slate-300",
            textColor: "text-slate-700",
            icon: TickSquare,
        },
        Confirmed: {
            bgColor: "bg-blue-50",
            borderColor: "border-blue-300",
            textColor: "text-blue-700",
            icon: TickSquare,
        },
        Processing: {
            bgColor: "bg-amber-50",
            borderColor: "border-amber-300",
            textColor: "text-amber-700",
            icon: ArrowRotateRight,
        },
        Ready: {
            bgColor: "bg-purple-50",
            borderColor: "border-purple-300",
            textColor: "text-purple-700",
            icon: Truck,
        },
        Dispatched: {
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-400",
            textColor: "text-emerald-700",
            icon: TruckFast,
        },
    };

    const [getOrders] = useLazyGetOrdersQuery();
    const [getOrderDetails] = useLazyGetOrderDetailsQuery();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [getOrderHistory] = useLazyGetOrderHistoryQuery();

    const handleCloseUpdateOrderBottomSheet = () => {
        if (slideAnimation.current) {
        slideAnimation.current
            .animate(
            {
                0: {translateY: 0, opacity: 1},
                1: {translateY: modalHeight, opacity: 0},
            },
            500,
            )
            .then(() => {
            dispatch(setShowUpdateOrderBottomSheet(false));
            });
        } else {
        dispatch(setShowUpdateOrderBottomSheet(false));
        }
    };

    // Handle get all orders
    const handleGetOrders = async () => {
        dispatch(generalSetLoadingMessage("Fetching orders..."));
        dispatch(generalSetIsLoading(true));

        try {
            const orderResponse = await getOrders().unwrap();
            // console.log("RESPONSE::: ", orderResponse);

            (orderResponse.length > 0)
                ? dispatch(setOrders(orderResponse))
                : dispatch(setOrders([]));
            
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(generalSetIsLoading(false));
            dispatch(generalSetLoadingMessage(""));
        };
    };

    // Handle get order details
    const handleGetOrderDetails = async (orderID: string) => {
        dispatch(setLoadingMessage("Fetching order details..."));
        dispatch(setIsLoading(true));

        try {
            const orderDetailsResponse = await getOrderDetails({orderID}).unwrap();
            // console.log("RESPONSE::: ", orderDetailsResponse);

            if (orderDetailsResponse) {
                dispatch(setOrder(orderDetailsResponse));
            }

        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        };
    };

    // Handle get order history
    const handleGetOrderHistory = async (productOrder_id: string) => {
        dispatch(setLoadingMessage("Fetching order history..."));
        dispatch(setIsLoading(true));

        const queryParams = {
            productOrder_id,
        };
        console.log("QUERY PARAMS::: ", queryParams);

        try {
            const orderHistoryResponse = await getOrderHistory(queryParams).unwrap();
            console.log("RESPONSE::: ", orderHistoryResponse);

            (orderHistoryResponse) && dispatch(setOrderHistory(orderHistoryResponse));
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        };
    };

    // Handle update order status
    const handleUpdateOrderStatus = async (status: string) => {
        dispatch(setLoadingMessage("Updating order status..."));
        dispatch(setIsLoading(true));

        const requestPayload: IOrderUpdate = {
            status: status,
            productOrder_id: order._id!,
        };
        // console.log("REQUEST PAYLOAD::: ", requestPayload);

        try {
            const orderResponse = await updateOrderStatus(requestPayload).unwrap();
            // console.log("RESPONSE::: ", orderResponse);

            (orderResponse) && (
                dispatch(setOrder(orderResponse)),
                handleGetOrders(),
                handleGetOrderHistory(order._id!)
            );
            
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleCloseUpdateOrderBottomSheet();
        };
    };

    
    return {
        status,
        handleGetOrders,
        handleGetOrderDetails,
        handleGetOrderHistory,
        selectedStatus, setSelectedStatus, handleUpdateOrderStatus,
        modalHeight, slideAnimation, handleCloseUpdateOrderBottomSheet,
    };
};

export type { IStatus };
export default useOrderHook;