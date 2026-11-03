import rootAPI from "../../../../redux/api/rootAPI";
import { getVendorOrderDetailsRoute, getVendorOrdersRoute, orderHistoryRoute, rejectOrderRoute, updateOrderStatusRoute } from "../../../../redux/api/api_route";
import IOrder from "../models/oder_model";
import IOrderHistory from "../models/orderHistory_model";
import IOrderUpdate from "../models/orderUpdate_model";
import IOrderReject from "../models/orderReject_model";
import IOrderDetails from "../models/orderDetails_model";
import IVendorOrderFilter from "../models/orderFilter_model";

const toTime = (value?: string | Date): number => {
    if (!value) { return 0; }
    const ms = value instanceof Date ? value.getTime() : Date.parse(value);
    return Number.isNaN(ms) ? 0 : ms;
};

const byNewestFirst = (orders: IOrder[] = []): IOrder[] =>
    [...orders].sort((a, b) => toTime(b?.createdAt) - toTime(a?.createdAt));

const orderAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        getVendorOrders: builder.query<IOrder[], IVendorOrderFilter | void>({
            query: (filter) => {
                const { status, itemName, orderId, fromDate, toDate } = filter ?? {};
                const params: Record<string, string> = {};
                if (status?.length) { params.status = status.join(","); }
                if (itemName?.trim()) { params.title = itemName.trim(); }
                if (orderId?.trim()) { params.orderId = orderId.trim(); }
                if (fromDate) { params.startDate = fromDate; }
                if (toDate) { params.endDate = toDate; }

                return {
                    url: getVendorOrdersRoute,
                    method: "GET",
                    params,
                };
            },
            providesTags: ["VendorOrders"],
            transformResponse: (response: { data: IOrder[] }) => {
                return byNewestFirst(response.data);
            }
        }),

        // Get order details
        getVendorOrderDetails: builder.query<IOrderDetails, { orderID: string }>({
            query: ({ orderID }) => ({
                url: getVendorOrderDetailsRoute,
                method: "GET",
                params: { productOrder_id: orderID }
            }),
            providesTags: ["VendorOrderDetails"],
            transformResponse: (response: { data: IOrderDetails }) => {
                return response.data;
            }
        }),

        // Update order status
        updateOrderStatus: builder.mutation<IOrderDetails, IOrderUpdate>({
            query: (order: IOrderUpdate) => ({
                url: updateOrderStatusRoute,
                method: "PUT",
                body: order,
            }),
            invalidatesTags: ["VendorOrders", "VendorOrderDetails", "VendorOrderHistory", "OrderHistory"],
            transformResponse: (response: { data: IOrderDetails }) => {
                return response.data;
            }
        }),

        // Reject order
        rejectOrder: builder.mutation<IOrderDetails, IOrderReject>({
            query: (rejection: IOrderReject) => ({
                url: rejectOrderRoute,
                method: "PUT",
                body: rejection,
            }),
            invalidatesTags: ["VendorOrders", "VendorOrderDetails", "VendorOrderHistory", "OrderHistory"],
            transformResponse: (response: { data: IOrderDetails }) => {
                return response.data;
            }
        }),

        // Get order history
        getVendorOrderHistory: builder.query<IOrderHistory, { productOrder_id: string }>({
            query: ({ productOrder_id }) => ({
                url: orderHistoryRoute,
                method: "GET",
                params: { productOrder_id }
            }),
            providesTags: ["OrderHistory", "VendorOrderHistory"],
            transformResponse: (response: { data: IOrderHistory }) => {
                return response.data;
            }
        }),
    }),
});

export const {
    useLazyGetVendorOrdersQuery,
    useLazyGetVendorOrderDetailsQuery,
    useUpdateOrderStatusMutation,
    useRejectOrderMutation,
    useLazyGetVendorOrderHistoryQuery,
} = orderAPI;