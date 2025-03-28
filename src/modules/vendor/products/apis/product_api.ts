import api from "../../../../redux/api/api";
import IVendorProduct from "../models/vendorProduct_model";
import IVendorProductDetails from "../models/vendorProductDetails_model";
import IVendorProductQueryParams from "../models/vendorProductFilter_model";
import IVendorProductPreview from "../../../general/models/vendorReview_model";

const productAPI = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Get all products
        getProducts: builder.query<IVendorProduct[], IVendorProductQueryParams>({
            query: ({ shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber }) => ({
                url: "/products/live",
                method: "GET",
                params: {
                    shopId, productType, accessoryType, price, sizes, title, colors, brand, design, gender, ageGroup, ageRange, style, main, sleeveLength, fastening, fit, occasion, productId, limit, pageNumber
                }
            }),
            providesTags: ["Products"],
            transformResponse: (response: { data: {  products: IVendorProduct[] } }) => {
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
        deleteProduct: builder.mutation<IVendorProduct, string>({
            query: (productId) => ({
                url: `/products/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
    }),
});

export const {
    useLazyGetProductsQuery,
    useLazyGetProductByProductIDQuery,
    useDeleteProductMutation,
} = productAPI;