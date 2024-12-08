import api from "../../../../redux/api/api";
import IProductDetails from "../models/productDetails_model";
import IProductQueryParams from "../models/productFilter_model";
import IProduct from "../models/product_model";

const productAPI = api.injectEndpoints({
    endpoints: (builder) => ({
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
                const productDetails = {
                    products: response.data.products,
                    totalCount: response.data.totalCount,
                }
                
                return productDetails;
            }
        }),

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
    }),
});

export const { 
    useLazyGetNewestProductsQuery,
    useLazyGetProductsByCategoriesQuery,
    useLazyGetPopularProductsQuery,
    useGetProductByProductIDQuery
} = productAPI;
export default productAPI;