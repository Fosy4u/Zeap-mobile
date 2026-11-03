import { cancelOrderRoute, getOrderDetailsRoute, getOrderHistoryRoute, getOrdersRoute, getProductOrderRoute } from "../../../../redux/api/api_route";
import IProductOrderDetails from "../models/productOrderDetails_model";
import rootAPI from "../../../../redux/api/rootAPI";
import IOrder from "../models/order_model";
import IOrderDetails from "../models/orderDetails_model";
import IOrderHistory from "../models/orderHistory_model";
import IOrderCancel from "../models/orderCancel_model";

const byNewestFirst = (orders: IOrder[] = []): IOrder[] =>
    [...orders].sort((a, b) => Date.parse(b?.createdAt ?? "") - Date.parse(a?.createdAt ?? ""));

const orderAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<IOrder[], void>({
            query: () => ({
                url: getOrdersRoute,
                method: "GET",
            }),
            providesTags: ["Orders"],
            transformResponse: (response: { data: IOrder[] }) => {
                return byNewestFirst(response.data);
            },
        }),

        getProductOrder: builder.query<IProductOrderDetails, { productOrderId: string }>({
            query: ({ productOrderId }) => ({
                url: getProductOrderRoute,
                method: "GET",
                params: { productOrder_id: productOrderId },
            }),
            providesTags: ["OrderDetails"],
            transformResponse: (response: { data: IProductOrderDetails }) => response.data,
        }),

        // Get Order Details
        getOrderDetails: builder.query<IOrderDetails, { orderId: string }>({
            query: ({ orderId }) => ({
                url: getOrderDetailsRoute,
                params: { orderId },
                method: "GET",
            }),
            providesTags: ["OrderDetails"],
            transformResponse: (response: { data: IOrderDetails }) => {
                return response.data;
            },
        }),

        // Get Order History
        getOrderHistory: builder.query<IOrderHistory, {  productOrder_id: string}>({
            query: ({ productOrder_id }) => ({
                url: getOrderHistoryRoute,
                params: { productOrder_id },
                method: "GET",
            }),
            providesTags: ["OrderHistory"],
            transformResponse: (response: { data: IOrderHistory }) => {
                return response.data;
            },
        }),

        /* Buyer-side cancellation of a single product order. Invalidates the
           vendor tags too, so a vendor session sees the withdrawal immediately. */
        cancelOrder: builder.mutation<IOrderDetails, IOrderCancel>({
            query: (cancellation) => ({
                url: cancelOrderRoute,
                method: "PUT",
                body: cancellation,
            }),
            invalidatesTags: [
                "Orders", "Order", "OrderDetails", "OrderHistory",
                "VendorOrders", "VendorOrderDetails", "VendorOrderHistory",
            ],
            transformResponse: (response: { data: IOrderDetails }) => {
                return response.data;
            },
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetProductOrderQuery,
    useLazyGetProductOrderQuery,
    useLazyGetOrdersQuery,
    useLazyGetOrderDetailsQuery,
    useLazyGetOrderHistoryQuery,
    useCancelOrderMutation,
} = orderAPI; 