import rootAPI from "../../../../redux/api/rootAPI.ts";
import IVendorProductBodyMeasurement from "../models/vendorProductBodyMeasurement_model.ts";
import IVendorProductDetails from "../models/vendorProductDetails_model.ts";
import { IStepOneAddProduct, IStepThreeAddBespokeClothes, IStepThreeAddBespokeShoes, IStepTwoAddClothes, IStepTwoAddShoes } from "../validations/addProduct_validation.ts";

type IUpdateProductPayload = IStepTwoAddClothes | IStepTwoAddShoes | IStepThreeAddBespokeClothes | IStepThreeAddBespokeShoes;

const accessoryProductAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // Create product (Step 1)
        createProduct: builder.mutation<IVendorProductDetails, IStepOneAddProduct>({
            query: (requestData) => ({
                url: "/product/create",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["DraftProducts", "Products"],
            transformResponse(response: { data: IVendorProductDetails }) {
                return response.data;
            },
        }),

        // Update product (Step 1, 2)
        updateProduct: builder.mutation<IVendorProductDetails, IUpdateProductPayload>({
            query: (requestData) => ({
                url: "/product/update",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["DraftProducts", "Products"],
            transformResponse(response: { data: IVendorProductDetails }) {
                return response.data;
            },
        }),

        // Update with body measurements (Step 3)
        updateWithBodyMeasurements: builder.mutation<IVendorProductDetails, IStepThreeAddBespokeClothes>({
            query: (requestData) => ({
                url: "/product/bodyMeasurement/add",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["BodyMeasurement", "DraftProducts", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            }
        }),

        // Upload product images (Step 4)
        uploadProductImages: builder.mutation<IVendorProductDetails, FormData>({
            query: (requestData) => ({
                url: "/product/update/addColorAndImages",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["VendorProductDetails", "DraftProducts", "Products"],
            transformResponse(response: { data: any }) {
                // console.log("RESPONSE: ", response);
                return response.data;
            },
        }),

        // Update product images (Step 4)
        updateProductImages: builder.mutation<IVendorProductDetails, FormData>({
            query: (requestData) => ({
                url: "/product/update/addImagesToProductColor",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["VendorProductDetails", "DraftProducts", "Products"],
            transformResponse(response: { data: any }) {
                // console.log("RESPONSE: ", response);
                return response.data;
            },
        }),

        // Set default product image (Step 4)
        setDefaultProductImage: builder.mutation<IVendorProductDetails, any>({
            query: (requestData) => ({
                url: "/product/update/setProductImageAsDefault",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["VendorProductDetails", "DraftProducts", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            },
        }),

        // Delete product image (Step 4)
        deleteProductImage: builder.mutation<IVendorProductDetails, any>({
            query: (requestData) => ({
                url: "/product/update/deleteProductImage",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["VendorProductDetails", "DraftProducts", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            },
        }),

        // Add product variation (Step 5)
        addProductVariation: builder.mutation<any, any>({
            query: (requestData) => ({
                url: "/product/update/addProductVariation",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["VendorProductDetails", "DraftProducts", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            },
        }),

        // Update product variation (Step 5)
        updateProductVariation: builder.mutation<any, any>({
            query: (requestData) => ({
                url: "/product/update/editProductVariation",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["VendorProductDetails", "DraftProducts", "Products"],
            transformResponse(response: { data: any }) {
                return response.data;
            },
        }),

        // Save auto price percentage (Step 6)
        saveAutoPricePercentage: builder.mutation<IVendorProductDetails, any>({
            query: (requestData) => ({
                url: "/product/update/autoPriceAdjustment",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["VendorProductDetails", "DraftProducts", "Products"],
            transformResponse(response: { data: IVendorProductDetails }) {
                return response.data;
            },
        }),

        // Submit product
        submitProduct: builder.mutation<IVendorProductDetails, any>({
            query: (requestData) => ({
                url: "/product/update/submitProduct",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["VendorProductDetails", "DraftProducts", "Products"],
            transformResponse(response: { data: IVendorProductDetails }) {
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

        // Get draft product
        getDraftProducts: builder.query<IVendorProductDetails[], any>({
            query: ({ shopId }) => ({
                url: "/products/shop/draft",
                method: "GET",
                params: { shopId }
            }),
            providesTags: ["DraftProducts"],
            transformResponse(response: { data: IVendorProductDetails[] }) {
                return response.data;
            },
        }),

        // Get product body measurements
        getProductBodyMeasurements: builder.query<IVendorProductBodyMeasurement, string>({
            query: (productId) => ({
                url: "/bodyMeasurement/product",
                method: "GET",
                params: { productId }
            }),
            providesTags: ["VendorProductBodyMeasurement"],
            transformResponse(response: { data: IVendorProductBodyMeasurement }) {
                return response.data;
            },
        }),
    }),
});

export const {
    useCreateProductMutation,
    useUpdateProductMutation,
    useUpdateWithBodyMeasurementsMutation,
    useUploadProductImagesMutation,
    useUpdateProductImagesMutation,
    useSetDefaultProductImageMutation,
    useDeleteProductImageMutation,
    useAddProductVariationMutation,
    useUpdateProductVariationMutation,
    useSaveAutoPricePercentageMutation,
    useSubmitProductMutation,
    useLazyGetProductByProductIDQuery,
    useLazyGetDraftProductsQuery,
    useLazyGetProductBodyMeasurementsQuery,
} = accessoryProductAPI;
export default accessoryProductAPI;
