import rootAPI from "../../../../redux/api/rootAPI.ts";
import IDeliveryMethod from "../../address/models/deliveryMethod_model.ts";
import ICart from "../models/cart_model";
import IDeliveryDate from "../models/deliveryDate_model.ts";
import IOrderSummary from "../models/orderSummary_model.ts";


const cartAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({

        // Get Cart
        getCart: builder.query<ICart, void>({
            query: () => ({
                url: "/basket",
                method: "GET",
            }),
            providesTags: ["Cart"],
            transformResponse: (response: { data: ICart }) => {
                return response.data;
            },
        }),

        // Increament product count
        increamentProductQuantity: builder.mutation<any, string>({
            query: (_id) => ({
                url: "/basket/product/increase",
                method: "PUT",
                body: { _id },
            }),
            invalidatesTags: ["Cart"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Decreament product count
        decreamentProductQuantity: builder.mutation<any, string>({
            query: (_id) => ({
                url: "/basket/product/decrease",
                method: "PUT",
                body: { _id },
            }),
            invalidatesTags: ["Cart"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Remove product from cart
        removeProductFromCart: builder.mutation<any, string>({
            query: (_id) => ({
                url: "/basket/product/remove",
                method: "PUT",
                body: { _id },
            }),
            invalidatesTags: ["Cart"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Get delivery method
        getDeliveryMethod: builder.query<IDeliveryMethod, { country: string }>({
            query: ({ country }) => ({
                url: "/basket/deliveryFees",
                method: "GET",
                params: { country },
            }),
            providesTags: ["DeliveryMethod"],
            transformResponse: (response: { data: IDeliveryMethod }) => {
                return response.data;
            },
        }),

        // Get order summary
        getOrderSummary: builder.query<IOrderSummary, { country: string, method: string }>({
            query: ({ country, method }) => ({
                url: "/basket/total",
                method: "GET",
                params: { country, method }
            }),
            providesTags: ["OrderSummary"],
            transformResponse: (response: { data: IOrderSummary }) => {
                return response.data;
            },
        }),

        // Get delivery date
        getDeliveryDate: builder.query<IDeliveryDate[], { country: string, method: string }>({
            query: ({  country, method}) => ({
                url: "/basket/deliveryDates",
                method: "GET",
                params: { country, method } // Default country, can be changed based on requirements
            }),
            providesTags: ["DeliveryDate"],
            transformResponse: (response: { data: IDeliveryDate[] }) => {
                return response.data;
            }
        }),
    }),
});

export const {
    useLazyGetCartQuery,
    useIncreamentProductQuantityMutation,
    useDecreamentProductQuantityMutation,
    useRemoveProductFromCartMutation,
    useLazyGetDeliveryMethodQuery,
    useLazyGetOrderSummaryQuery,
    useLazyGetDeliveryDateQuery,
} = cartAPI;
export default cartAPI;
