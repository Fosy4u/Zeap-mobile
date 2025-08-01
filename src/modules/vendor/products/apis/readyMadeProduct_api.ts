import rootAPI from "../../../../redux/api/rootAPI.ts";
import IVendorProductDetails from "../models/vendorProductDetails_model";
import { IStepOneAddProduct, IStepThreeAddReadyMadeClothes, IStepThreeAddReadyMadeShoes, IStepTwoAddClothes, IStepTwoAddShoes } from "../validations/addProduct_validation";

type IUpdateProductPayload = IStepTwoAddClothes | IStepTwoAddShoes | IStepThreeAddReadyMadeClothes | IStepThreeAddReadyMadeShoes;

const readyMadeProductApi = rootAPI.injectEndpoints({
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

        // Update product (Step 1, 2, 3)
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
            transformResponse(response: { data: IVendorProductDetails }) {
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

        // Delete product color (Step 4)
        deleteProductColor: builder.mutation<IVendorProductDetails, { color: string, productId: string }>({
            query: (requestData) => ({
                url: "/product/update/deleteProductColor",
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
        addProductVariation: builder.mutation<IVendorProductDetails, any>({
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
        updateProductVariation: builder.mutation<IVendorProductDetails, any>({
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

        // Delete product variation (Step 5)
        deleteProductVariation: builder.mutation<any, any>({
            query: (requestData) => ({
                url: "/product/update/deleteProductVariation",
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
    }),
});

export const {
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImagesMutation,
    useUpdateProductImagesMutation,
    useSetDefaultProductImageMutation,
    useDeleteProductColorMutation,
    useDeleteProductImageMutation,
    useAddProductVariationMutation,
    useUpdateProductVariationMutation,
    useDeleteProductVariationMutation,
    useSaveAutoPricePercentageMutation,
    useSubmitProductMutation,
    useLazyGetProductByProductIDQuery,
} = readyMadeProductApi;
export default readyMadeProductApi;
