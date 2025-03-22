import api from "../../../../redux/api/api";
import ICart from "../../cart/models/cart_model";
import IProductDetails from "../models/productDetails_model";
import IProductQueryParams from "../models/productFilter_model";
import IProduct from "../models/product_model";
import IPromoProduct from "../models/promoProduct_model";

const productAPI = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get All Live Products
        getAllLiveProducts: builder.query<IProduct[], IProductQueryParams>({
            query: ({ shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber }) => ({
                url: "/products/live",
                method: "GET",
                params: {
                    shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber
                },
            }),
            providesTags: ["Products"],
            transformResponse: (response: { data: {  products: IProduct[] } }) => {
                return response.data.products;
            },
        }),

        // Get Newest Arrivals
        getNewestArrivals: builder.query<IProduct[], IProductQueryParams>({
            query: ({ shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber }) => ({
                url: "/products/live/newest",
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
            query: (cartRequestData) => ({
                url: "/basket/product/add",
                method: "POST",
                body: cartRequestData,
            }),
            invalidatesTags: ["Cart", "CartTotal"],
            transformResponse: (response: { data: any }) => {
                console.log("CART RESPONSE::: ", response);
                
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
            invalidatesTags: ["Cart", "CartTotal"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Decreament product count
        decreamentProductQuantity: builder.mutation<any, string>({
            query: (sku) => ({
                url: "/basket/product/decrease",
                method: "PUT",
                body: { sku },
            }),
            invalidatesTags: ["Cart", "CartTotal"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Remove product from cart
        removeProductFromCart: builder.mutation<any, string>({
            query: (sku) => ({
                url: "/basket/product/remove",
                method: "PUT",
                body: { sku },
            }),
            invalidatesTags: ["Cart", "CartTotal"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Get promo products
        getPromoProducts: builder.query<IPromoProduct[], void>({
            query: () => ({
                url: "/promos/live",
                method: "GET",
            }),
            providesTags: ["PromoProduct"],
            transformResponse: (response: { data: IPromoProduct[] }) => {
                return response.data;
            }
        }),
    }),
});

export const {
    useLazyGetAllLiveProductsQuery,
    useLazyGetNewestArrivalsQuery,
    useLazySearchProductQuery,
    useLazyGetProductsByCategoriesQuery,
    useLazyGetPopularProductsQuery,
    useGetProductByProductIDQuery,
    useAddProductToCartMutation,
    useLazyGetPromoProductsQuery,

    useIncreamentProductQuantityMutation,
    useDecreamentProductQuantityMutation,
    useRemoveProductFromCartMutation,
} = productAPI;
export default productAPI;