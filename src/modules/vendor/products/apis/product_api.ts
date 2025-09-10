import rootAPI from "../../../../redux/api/rootAPI.ts";
import IVendorProductDetails from "../models/vendorProductDetails_model";
import IVendorProductQueryParams from "../models/vendorProductFilter_model";
import IPromotion, { IPromotionPayload } from "../models/promotion_model";

const productAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Get all products
        getProducts: builder.query<IVendorProductDetails[], IVendorProductQueryParams>({
            query: ({ shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber }) => ({
                url: "/products/auth/shop",
                method: "GET",
                params: {
                    shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber
                }
            }),
            providesTags: ["Products"],
            transformResponse: (response: { data: {  products: IVendorProductDetails[] } }) => {
                return response.data.products;
            }
        }),

        // Get product by product ID
        getProductByProductID: builder.query<IVendorProductDetails, string>({
            query: (productID) =>({
                url: `/product?productId=${encodeURIComponent(productID)}`,
                method: "GET",
            }),
            providesTags:["Product"],
            transformResponse(response: { data: IVendorProductDetails }) {
                return response.data;
            },
        }),

        // Delete a product
        deleteProduct: builder.mutation<string, { productIds: string[]; }>({
            query: (productIds) => ({
                url: "/product/delete",
                method: "PUT",
                body: productIds,
            }),
            invalidatesTags: ["Products", "Product"],
            transformResponse: (response: { message: string }) => {
                return response.message;
            }
        }),

        // Get available promotions
        getAvailablePromos: builder.query<IPromotion[], void>({
            query: () => ({
                url: "/promos/available",
                method: "GET",
            }),
            providesTags: ["Promotions"],
            transformResponse: (response: { data: IPromotion[]}) => {
                return response.data;
            }
        }),

        // Get product's promotion
        getProductPromotion: builder.query<IPromotion, string>({
            query: (productID) => ({
                url: "/product/promo",
                method: "GET",
                params: {
                    productId: productID,
                }
            }),
            providesTags: ["Promotion", "Product"],
            transformResponse: (response: { data: { promo: IPromotion }}) => {
                return response.data.promo;
            }
        }),

        // Apply promotion
        applyPromotion: builder.mutation<string, IPromotionPayload>({
            query: (requestData) => ({
                url: "/promo/join",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["Promotion", "Products", "Product"],
            transformResponse: (response: { message: string }) => {
                return response.message;
            }
        }),

        // Turn off promotion
        turnOffPromotion: builder.mutation<string, IPromotionPayload>({
            query: (requestData) => ({
                url: "/promo/leave",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["Promotion", "Products", "Product"],
            transformResponse: (response: { message: string }) => {
                return response.message;
            }
        }),
    }),
});

export const {
    useLazyGetProductsQuery,
    useLazyGetProductByProductIDQuery,
    useDeleteProductMutation,
    useLazyGetAvailablePromosQuery,
    useLazyGetProductPromotionQuery,
    useApplyPromotionMutation,
    useTurnOffPromotionMutation,
} = productAPI;
