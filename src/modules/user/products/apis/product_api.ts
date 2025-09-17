import { addProductToCartRoute, dynamicFiltersRoute, liveProductsRoute, newestProductsRoute, popularProductsRoute, productPromotionRoute, promoProductRoute, recentlyViewedProductsRoute, recommendedProductsRoute, searchProductsRoute, sizeGuideRoute } from "../../../../redux/api/api_route.ts";
import rootAPI from "../../../../redux/api/rootAPI.ts";
import ICart from "../../cart/models/cart_model";
import IDynamicFilter from "../models/dynamicFilter_model.ts";
import IProductDetails from "../models/productDetails_model";
import IProductFilterQueryParams from "../models/productFilterQueryParams_model.ts";
import IProduct from "../models/product_model";
import IPromoProduct from "../models/promotion_model.ts";

// Helper function to remove undefined values
const removeUndefined = (obj: Record<string, any>) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => 
            value !== undefined && 
            value !== null && 
            value !== '' &&
            !(Array.isArray(value) && value.length === 0)
        )
    );
};

const productAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // Get Filtered Products
        getFilteredProducts: builder.query<{ products: IProduct[], dynamicFilters: IDynamicFilter[] }, {queryParams: IProductFilterQueryParams, screenTitle: string}>({
            query: ({queryParams, screenTitle}) => {
                
                // Determine URL based on screenTitle
                const url = (screenTitle === "Newest Products")
                ? newestProductsRoute
                : (screenTitle === "Popular Products")
                ? popularProductsRoute
                : (screenTitle === "Recommended Products")
                ? recommendedProductsRoute
                : (screenTitle === "Search Products")
                ? searchProductsRoute
                : (screenTitle === "Recently Viewed")
                ? recentlyViewedProductsRoute
                : liveProductsRoute; // Default to all live products

                return ({
                    url,
                    method: "GET",
                    params: removeUndefined(queryParams),
                })
            },
            providesTags: ["Products"],
            transformResponse: (response: { data: { products: IProduct[], dynamicFilters: IDynamicFilter[] } }) => {
                return response.data;
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
                url: addProductToCartRoute,
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
                url: promoProductRoute,
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
                url: productPromotionRoute,
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

        // Get size guide
        getSizeGuide: builder.query<any, void>({
            query: () => ({
                url: sizeGuideRoute,
                method: "GET",
            }),
            providesTags: ["SizeGuide"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            }
        }),

        // Get Dynamic Filter Options
        getDynamicFilterOptions: builder.query<IDynamicFilter[], void>({
            query: () => ({
                url: dynamicFiltersRoute,
                method: "GET",
            }),
            providesTags: ["DynamicFilterOptions"],
            transformResponse: (response: { data: IDynamicFilter[] }) => {
                return response.data;
            },
        }),
    }),
});

export const {
    useLazyGetFilteredProductsQuery,
    useLazyGetProductByProductIDQuery,
    useAddProductToCartMutation,
    useLazyGetPromoProductsQuery,
    useLazyGetProductPromotionQuery,
    useLazyGetSizeGuideQuery,
    useLazyGetDynamicFilterOptionsQuery,
} = productAPI;
export default productAPI;
