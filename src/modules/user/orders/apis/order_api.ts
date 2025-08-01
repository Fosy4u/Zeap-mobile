import rootAPI from "../../../../redux/api/rootAPI";
import IOrder from "../models/order_model";
import IOrderHistory from "../models/orderHistory_model";

const orderAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<IOrder[], void>({
            query: () => ({
                url: "/orders/authUser/buyer?",
                method: "GET",
            }),
            providesTags: ["Orders"],
            transformResponse: (response: { data: IOrder[] }) => {
                return response.data;
            },
        }),

        // Get Order History
        getOrderHistory: builder.query<IOrderHistory, {  productOrder_id: string}>({
            query: ({ productOrder_id }) => ({
                url: "/orders/product-order/status/history?productOrder_id=6856af9185554525461add55",
                params: { productOrder_id },
                method: "GET",
            }),
            providesTags: ["OrderHistory"],
            transformResponse: (response: { data: IOrderHistory }) => {
                return response.data;
            },
        }),
    }),
    overrideExisting: true,
});

export const {
    useLazyGetOrdersQuery,
    useLazyGetOrderHistoryQuery,
} = orderAPI; 