import api from "../../../../redux/api/api.ts";
import { getSavedAnonymousToken } from "../../../../redux/services/authorizationHeader.ts";
import IAddBodyMeasurement from "../models/vendorAddBodyMeasurement_model.ts";
import IDraftProduct from "../models/vendorDraftProducts_model.ts";
import IVendorProductDetails from "../models/vendorProductDetails_model.ts";
import { IStepOneAddBespokeClothes } from "../validations/addBespokeClothes_validation.ts";


const bespokeProductAPI = api.injectEndpoints({
    endpoints: (builder) => ({

        // Add bespoke clothes (Step 1)
        addBespokeClothes: builder.mutation<IDraftProduct, IStepOneAddBespokeClothes>({
            query: (requestData) => ({
                url: "/product/create",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["DraftProduct", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            },
        }),

        // Update with categories (Step 2)
        updateWithCategories: builder.mutation<IDraftProduct, any>({
            query: (requestData) => ({
                url: "/product/update",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["DraftProduct", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            },
        }),

        // Update with body measurements (Step 3)
        updateWithBodyMeasurements: builder.mutation<IDraftProduct, IAddBodyMeasurement>({
            query: (requestData) => ({
                url: "/product/bodyMeasurement/add",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["BodyMeasurement", "DraftProduct", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            },
        }),

        // Upload product images
        uploadProductImages: builder.mutation<IDraftProduct, FormData>({
            query: (requestData) => ({
                url: "/product/update/addColorAndImages",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["DraftProduct", "Products"],
            transformResponse(response: { data: any }) {
                // console.log("RESPONSE: ", response);
                return response.data;
            },
        }),

        // Add product variation
        addProductVariation: builder.mutation<IDraftProduct, any>({
            query: (requestData) => ({
                url: "/product/update/addProductVariation",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["DraftProduct", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            },
        }),

        // Save auto price percentage
        saveAutoPricePercentage: builder.mutation<IDraftProduct, any>({
            query: (requestData) => ({
                url: "/product/update/autoPriceAdjustment",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["DraftProduct", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            },
        }),

        // Submit product
        submitProduct: builder.mutation<IDraftProduct, any>({
            query: (requestData) => ({
                url: "/product/update/submitProduct",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["DraftProduct", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            },
        }),

        // Get draft product
        getDraftProducts: builder.query<IDraftProduct[], any>({
            query: ({ shopId }) => ({
                url: "/products/shop/draft",
                method: "GET",
                params: { shopId }
            }),
            providesTags: ["DraftProduct"],
            transformResponse(response: { data: IDraftProduct[] }) {
                return response.data;
            },
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
    }),
});

export const {
    useAddBespokeClothesMutation,
    useUpdateWithCategoriesMutation,
    useUpdateWithBodyMeasurementsMutation,
    useUploadProductImagesMutation,
    useAddProductVariationMutation,
    useSaveAutoPricePercentageMutation,
    useSubmitProductMutation,
    useLazyGetDraftProductsQuery,
    useGetProductByProductIDQuery
} = bespokeProductAPI;
export default bespokeProductAPI;