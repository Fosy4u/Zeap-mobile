import api from "../../../../redux/api/api";
import { addReadyMadeProduct } from "../models/addProduct_model";
import IProductDetails from "../models/productDetails_model";
import IProductQueryParams from "../models/productFilter_model";
import IProduct from "../models/product_model";

const productAPI = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get Newest Products
        getNewestProducts: builder.query<IProduct[], IProductQueryParams>({
            query: ({ shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber }) => ({
                url: "/products/live",
                method: "GET",
                params: {
                    shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber
                },
            }),
            providesTags: ["Products"],
            transformResponse: (response: { data: { products: IProduct[] } }) => {
                return response.data.products;
            }
        }),

        // Get Products By Categories
        getProductsByCategories: builder.query<{ products: IProduct[], totalCount: number }, IProductQueryParams>({
            query: ({ shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber }) => ({
                url: "/products/live",
                method: "GET",
                params: {
                    shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber
                },
            }),
            providesTags: ["Products"],
            transformResponse: (response: { data: { products: IProduct[], totalCount: number } }) => {
                return {
                    products: response.data.products,
                    totalCount: response.data.totalCount,
                };
            }
        }),

        // Get Popular Products
        getPopularProducts: builder.query<IProduct[], IProductQueryParams>({
            query: ({ limit, pageNumber }) => ({
                url: "/products/live/mostPopular",
                method: "GET",
                params: { limit, pageNumber }
            }),
            providesTags: ["Products"],
            transformResponse: (response: { data: { products: IProduct[] } }) => {
                return response.data.products;
            }
        }),

        // Get Product By Product ID
        getProductByProductID: builder.query<IProductDetails, string>({
            query: (productID) =>({
                url: `/product?productId=${encodeURIComponent(productID)}`,
                method: "GET",
            }),
            providesTags:["Product"],
            transformResponse(response: { data: IProductDetails }) {
                return response.data;
            },
        }),

        // Add ready made product to cart.
        addReadyMadeProductToCart: builder.mutation<any, addReadyMadeProduct>({
            query: (requestData) => ({
                url: "/basket/product/add",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["ProductQuantity"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),
        

        // Increament product count
        increamentProductQuantity: builder.mutation<any, string>({
            query: (sku) => ({
                url: "/basket/product/increase",
                method: "PUT",
                body: { sku },
            }),
            invalidatesTags: ["ProductQuantity"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Decreament product count
        decreamentProductQuantity: builder.mutation<any, string>({
            query: (sku) => ({
                url: "/basket/product/increase",
                method: "PUT",
                body: { sku },
            }),
            invalidatesTags: ["ProductQuantity"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),
    }),
});

export const { 
    useLazyGetNewestProductsQuery,
    useLazyGetProductsByCategoriesQuery,
    useLazyGetPopularProductsQuery,
    useGetProductByProductIDQuery,
    useAddReadyMadeProductToCartMutation,
    useIncreamentProductQuantityMutation,
    useDecreamentProductQuantityMutation
} = productAPI;
export default productAPI;