import api from "../../../../redux/api/api";
import ICart from "../../cart/models/cart_model";
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

        // Search Products
        searchProduct: builder.query<IProduct[], { title: string, limit: number, pageNumber: number }>({
            query: ({  title, limit, pageNumber }) => ({
                url: "/products/live",
                method: "GET",
                params: { title, limit, pageNumber },
            }),
            providesTags: ["Products"],
            transformResponse: (response: { data: { products: IProduct[] } }, meta) => {
                // console.log("META: ", meta?.response?.status);
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

        // Add product to cart.
        addProductToCart: builder.mutation<ICart, any>({
            query: (requestData) => ({
                url: "/basket/product/add",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["ProductQuantity", "Basket"],
            transformResponse: (response: { data: ICart }) => {
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
    useLazySearchProductQuery,
    useLazyGetProductsByCategoriesQuery,
    useLazyGetPopularProductsQuery,
    useGetProductByProductIDQuery,
    useAddProductToCartMutation,
    useIncreamentProductQuantityMutation,
    useDecreamentProductQuantityMutation,
} = productAPI;
export default productAPI;