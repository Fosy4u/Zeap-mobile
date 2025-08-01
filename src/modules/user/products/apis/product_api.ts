import rootAPI from "../../../../redux/api/rootAPI.ts";
import ICart from "../../cart/models/cart_model";
import IProductDetails from "../models/productDetails_model";
import IProductQueryParams from "../models/productFilter_model";
import IProduct from "../models/product_model";
import IPromoProduct from "../models/promotion_model.ts";

const productAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
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
            query: (productId) =>({
                url: `/product?productId=${encodeURIComponent(productId)}`,
                method: "GET",
                // params: { productId },
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
            invalidatesTags: ["Cart"],
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

        // Get product's promotion
        getProductPromotion: builder.query<IPromoProduct, string>({
            query: (productID) => ({
                url: "/product/promo",
                method: "GET",
                params: {
                    productId: productID,
                }
            }),
            providesTags: ["Promotion", "Product"],
            transformResponse: (response: { data: { promo: IPromoProduct }}) => {
                return response.data.promo;
            }
        }),

        // Get Recently Viewed Products
        getRecentlyViewedProducts: builder.query<IProduct[], void>({
            query: () => ({
                url: "/products/recentViews",
                method: "GET",
            }),
            providesTags: ["Products"],
            transformResponse: (response: { data: IProduct[] }) => {
                return response.data;
            }
        }),

        // Get Recommeded Products
        getRecommendedProducts: builder.query<IProduct[], void>({
            query: () => ({
                url: "/products/live/recommended",
                method: "GET",
            }),
            providesTags: ["Products"],
            transformResponse: (response: { data: IProduct[] }) => {
                return response.data;
            }
        }),

        // Get size guide
        getSizeGuide: builder.query<any, void>({
            query: () => ({
                url: "/bodyMeasurementGuide/readyMade",
                method: "GET",
            }),
            providesTags: ["SizeGuide"],
            transformResponse: (response: { data: any }) => {
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
    useLazyGetProductByProductIDQuery,
    useAddProductToCartMutation,
    useLazyGetPromoProductsQuery,
    useLazyGetProductPromotionQuery,
    useLazyGetRecentlyViewedProductsQuery,
    useLazyGetRecommendedProductsQuery,
    useLazyGetSizeGuideQuery
} = productAPI;
export default productAPI;
