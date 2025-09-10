import rootAPI from "../../../../redux/api/rootAPI";
import { getVendorOrdersRoute, orderHistoryRoute, updateOrderStatusRoute } from "../../../../redux/api/api_route";
import IOrder from "../models/oder_model";
import IOrderHistory from "../models/orderHistory_model";
import IOrderUpdate from "../models/orderUpdate_model";

const orderAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // Get all orders
        getOrders: builder.query<IOrder[], void>({
            query: () => ({
                url: getVendorOrdersRoute,
                method: "GET",
            }),
            providesTags: ["Orders"],
            transformResponse: (response: { data: IOrder[] }) => {
                return response.data;
            }
        }),

        // Update order status
        updateOrderStatus: builder.mutation<IOrder, IOrderUpdate>({
            query: (order: IOrderUpdate) => ({
                url: updateOrderStatusRoute,
                method: "PUT",
                body: order,
            }),
            invalidatesTags: ["Orders", "Order", "OrderHistory"],
            transformResponse: (response: { data: IOrder }) => {
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
    useUpdateOrderStatusMutation,
    useLazyGetOrderHistoryQuery,
} = orderAPI;