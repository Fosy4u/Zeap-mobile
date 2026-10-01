import { useDispatch, useSelector } from "react-redux";
import { useLazyGetVendorOrderDetailsQuery, useLazyGetVendorOrderHistoryQuery, useLazyGetVendorOrdersQuery, useRejectOrderMutation, useUpdateOrderStatusMutation } from "../apis/order_api";
import { setHistoryIsLoading, setIsLoading, setLoadingMessage, setOrder, setOrderFilters, setOrderHistory, setOrderSearchPhrase, setOrders, setOrdersHaveFetched, setShowConfirmOrderModal, setShowRejectOrderModal, setShowStatusSuccessModal } from "../slices/orderState_slice";
import handleError from "../../../general/hooks/errorHandler_hook";
import { setIsLoading as generalSetIsLoading, setLoadingMessage as generalSetLoadingMessage } from "../../../general/slices/general_slice";
import { useMemo, useState } from "react";
import { RootState } from "../../../../redux/store/store";
import IOrderUpdate from "../models/orderUpdate_model";
import IOrderReject from "../models/orderReject_model";
import IOrder from "../models/oder_model";
import IVendorOrderFilter, { buildStatusOptions, canRejectOrderStatus, EMPTY_ORDER_FILTER, statusMatches } from "../models/orderFilter_model";
import { setShowOrderFilterBottomSheet } from "../../home/slices/vendorHome_slice";

const includesText = (haystack?: string, needle?: string): boolean =>
    !needle?.trim() || !!haystack?.toLowerCase().includes(needle.trim().toLowerCase());

const applyOrderFilters = (
    orders: IOrder[],
    filters: IVendorOrderFilter,
    searchPhrase: string,
): IOrder[] => {
    const statuses = filters.status ?? [];
    const phrase = searchPhrase.trim().toLowerCase();
    const from = filters.fromDate ? new Date(`${filters.fromDate}T00:00:00`).getTime() : null;
    const to = filters.toDate ? new Date(`${filters.toDate}T23:59:59`).getTime() : null;

    return (orders ?? []).filter((order) => {
        if (statuses.length && !statuses.some((wanted) => statusMatches(order, wanted))) {
            return false;
        }

        if (!includesText(order.product?.title, filters.itemName)) { return false; }
        if (!includesText(order.orderId, filters.orderId)) { return false; }

        if (from || to) {
            const placedAt = order.createdAt ? new Date(order.createdAt).getTime() : NaN;
            if (isNaN(placedAt)) { return false; }
            if (from && placedAt < from) { return false; }
            if (to && placedAt > to) { return false; }
        }

        // The search box matches either the product name or the order number.
        if (phrase) {
            const matchesPhrase =
                !!order.product?.title?.toLowerCase().includes(phrase) ||
                !!order.orderId?.toLowerCase().includes(phrase);
            if (!matchesPhrase) { return false; }
        }

        return true;
    });
};

const useOrderHook = () => {
    const { order, orders, filters, searchPhrase } = useSelector((state: RootState) => state.vendorOrderState);
    const dispatch = useDispatch();

    const [rejectionReason, setRejectionReason] = useState<string>("");

    // Chips for the filter sheet: the known lifecycle plus any status the
    // fetched orders actually carry.
    const statusOptions = useMemo(() => buildStatusOptions(orders), [orders]);

    const [getOrders] = useLazyGetVendorOrdersQuery();
    const [getOrderDetails] = useLazyGetVendorOrderDetailsQuery();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [rejectOrder] = useRejectOrderMutation();
    const [getOrderHistory] = useLazyGetVendorOrderHistoryQuery();

    /* The rows on screen: the fetched orders narrowed by the applied filters and
       the search box. Search never refetches — it types straight into this. */
    const visibleOrders = useMemo(
        () => applyOrderFilters(orders ?? [], filters, searchPhrase),
        [orders, filters, searchPhrase],
    );

    // Handle get all orders. Pass filters to fetch a filtered page.
    const handleGetOrders = async (filterOverride?: IVendorOrderFilter) => {
        const activeFilters = filterOverride ?? filters;

        dispatch(generalSetLoadingMessage("Fetching orders..."));
        dispatch(generalSetIsLoading(true));
        dispatch(setIsLoading(true));

        try {
            const orderResponse = await getOrders(activeFilters).unwrap();
            // console.log("RESPONSE::: ", orderResponse);

            dispatch(setOrders(orderResponse ?? []));

        } catch (error) {
            dispatch(setOrders([]));
            handleError(error);
        } finally {
            dispatch(setOrdersHaveFetched(true));
            dispatch(setIsLoading(false));
            dispatch(generalSetIsLoading(false));
            dispatch(generalSetLoadingMessage(""));
        };
    };

    // "Filter Result" in the sheet — store the choice, refetch with it, close.
    const handleApplyOrderFilters = async (newFilters: IVendorOrderFilter) => {
        dispatch(setOrderFilters(newFilters));
        dispatch(setShowOrderFilterBottomSheet(false));
        await handleGetOrders(newFilters);
    };

    const handleClearOrderFilters = async () => {
        dispatch(setOrderFilters(EMPTY_ORDER_FILTER));
        await handleGetOrders(EMPTY_ORDER_FILTER);
    };

    const handleSearchOrders = (phrase: string) => {
        dispatch(setOrderSearchPhrase(phrase));
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
        dispatch(setHistoryIsLoading(true));

        const queryParams = {
            productOrder_id,
        };
        // console.log("QUERY PARAMS::: ", queryParams);

        try {
            const orderHistoryResponse = await getOrderHistory(queryParams).unwrap();
            // console.log("RESPONSE::: ", orderHistoryResponse);

            (orderHistoryResponse) && dispatch(setOrderHistory(orderHistoryResponse));
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setHistoryIsLoading(false));
        };
    };

    // Confirm/advance the order status. `statusValue` is the history endpoint's
    // nextStatus.value (e.g. "order confirmed").
    const handleConfirmOrderStatus = async (statusValue: string) => {
        if (!statusValue || !order?._id) return;

        dispatch(setLoadingMessage("Updating order status..."));
        dispatch(setIsLoading(true));

        const requestPayload: IOrderUpdate = {
            status: statusValue,
            productOrder_id: order._id,
        };
        // console.log("REQUEST PAYLOAD::: ", requestPayload);

        try {
            const orderResponse = await updateOrderStatus(requestPayload).unwrap();
            // console.log("RESPONSE::: ", orderResponse);

            if (orderResponse?._id) {
                dispatch(setOrder(orderResponse));
            } else {
                await handleGetOrderDetails(order._id);
            }

            await handleGetOrderHistory(order._id);
            handleGetOrders();

            dispatch(setShowConfirmOrderModal(false));
            dispatch(setShowStatusSuccessModal(true));

        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        };
    };

    // Reject the order. Irreversible, and the API requires a reason.
    const handleRejectOrder = async () => {
        const reason = rejectionReason.trim();
        if (!reason || !order?._id) return;

        /* Backstop for a stale screen: the button is hidden past quality check,
           but never send a rejection the lifecycle no longer allows. */
        if (!canRejectOrderStatus(order?.status)) {
            dispatch(setShowRejectOrderModal(false));
            return;
        }

        dispatch(setLoadingMessage("Rejecting order..."));
        dispatch(setIsLoading(true));

        const requestPayload: IOrderReject = {
            productOrder_id: order._id,
            reason,
        };
        // console.log("REQUEST PAYLOAD::: ", requestPayload);

        try {
            const rejectResponse = await rejectOrder(requestPayload).unwrap();
            // console.log("RESPONSE::: ", rejectResponse);

            if (rejectResponse?._id) {
                dispatch(setOrder(rejectResponse));
            } else {
                await handleGetOrderDetails(order._id);
            }

            await handleGetOrderHistory(order._id);
            handleGetOrders();

            setRejectionReason("");
            dispatch(setShowRejectOrderModal(false));

        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        };
    };

    return {
        statusOptions,
        visibleOrders,
        filters,
        searchPhrase,
        handleSearchOrders,
        handleApplyOrderFilters,
        handleClearOrderFilters,
        handleGetOrders,
        handleGetOrderDetails,
        handleGetOrderHistory,
        handleConfirmOrderStatus,
        rejectionReason, setRejectionReason, handleRejectOrder,
    };
};

export default useOrderHook;