import api from "../../../../redux/api/api";
import ICart from "../models/cart_model";
import ICartTotal from "../models/cartTotal_model";


const cartAPI = api.injectEndpoints({
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

        // Get Cart Total
        getCartTotal: builder.query<ICartTotal, void>({
            query: () => ({
                url: "/basket/total",
                method: "GET",
            }),
            providesTags: ["Cart", "CartTotal"],
            transformResponse: (response: { data: ICartTotal }) => {
                return response.data;
            },
        }),
    }),
});

export const { 
    useLazyGetCartQuery,
    useLazyGetCartTotalQuery,
} = cartAPI;
export default cartAPI;