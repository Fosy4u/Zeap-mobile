import rootAPI from "../../../../redux/api/rootAPI";
import { wishAddRoute, wishListRoute, wishRemoveRoute } from "../../../../redux/api/api_route";
import IWishItem from "../models/wishList_model";

// Wishlist ("Saved") endpoints.
//   • addToWishlist     — CONFIRMED: POST   /wish/add { productId, color }
//   • getWishlist       — CONFIRMED: GET    /wish/auth/user → { data: IWishItem[] }
//   • removeFromWishlist— CONFIRMED: DELETE /wish/remove { productId }
// The hook keeps an optimistic local copy of saved productIds, so the heart
// toggles instantly even before these settle.
const savedAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({

        // Add a product to the wishlist.
        addToWishlist: builder.mutation<any, { productId: string; color: string }>({
            query: (body) => ({
                url: wishAddRoute,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Wishlist"],
            transformResponse: (response: { data: any }) => response?.data,
        }),

        removeFromWishlist: builder.mutation<any, { wish_id: string }>({
            query: (body) => ({
                url: wishRemoveRoute,
                method: "DELETE",
                body,
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["Wishlist"],
            transformResponse: (response: { data: any }) => response?.data,
        }),

        // Get the current user's wishlist. Returns the wish entries (each with a
        // fully-populated `product`); keeps only entries whose product resolved.
        getWishlist: builder.query<IWishItem[], void>({
            query: () => ({
                url: wishListRoute,
                method: "GET",
            }),
            providesTags: ["Wishlist"],
            transformResponse: (response: { data: IWishItem[] }): IWishItem[] => {
                const items = Array.isArray(response?.data) ? response.data : [];
                return items.filter((item) => item?.product && typeof item.product === "object" && !!item.product.productId);
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useGetWishlistQuery,
    useLazyGetWishlistQuery,
} = savedAPI;

export default savedAPI;
