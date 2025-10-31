import rootAPI from "../../../../redux/api/rootAPI";
import { getVendorOrderDetailsRoute, getVendorOrdersRoute, orderHistoryRoute, updateOrderStatusRoute } from "../../../../redux/api/api_route";
import IOrder from "../models/oder_model";
import IOrderHistory from "../models/orderHistory_model";
import IOrderUpdate from "../models/orderUpdate_model";
import IOrderDetails from "../models/orderDetails_model";

const orderAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // Get all orders
        getOrders: builder.query<IOrder[], void>({
            query: () => ({
                url: getVendorOrdersRoute,
                method: "GET",
            }),
            providesTags: ["VendorOrders"],
            transformResponse: (response: { data: IOrder[] }) => {
                return response.data;
            }
        }),

        // Get order details
        getOrderDetails: builder.query<IOrderDetails, { orderID: string }>({
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
            invalidatesTags: ["VendorOrders", "VendorOrderDetails", "VendorOrderHistory"],
            transformResponse: (response: { data: IOrderDetails }) => {
                return response.data;
            }
        }),

        // Get order history
        getOrderHistory: builder.query<IOrderHistory, { productOrder_id: string }>({
            query: ({ productOrder_id }) => ({
                url: orderHistoryRoute,
                method: "GET",
                params: { productOrder_id }
            }),
            providesTags: ["OrderHistory"],
            transformResponse: (response: { data: IOrderHistory }) => {
                return response.data;
            }
        }),
    }),
});

export const {
    useLazyGetOrdersQuery,
    useLazyGetOrderDetailsQuery,
    useUpdateOrderStatusMutation,
    useLazyGetOrderHistoryQuery,
} = orderAPI;