import rootAPI from "../../../../redux/api/rootAPI.ts";
import IShop from "../../general/models/shop_model";
import { ISellerPolicy } from "../models/vendorOnboardingState_model";
import {
    registerVendorRoute,
    getSellerPoliciesRoute,
    getAuthShopRoute,
    getOnboardingDocumentsRoute,
    uploadOnboardingDocumentRoute,
} from "../../../../redux/api/api_route";

export interface IOnboardingDocumentRequirement {
    slug: string;
    label: string;
    link: string | null;
    filetype: string | null;
}

interface IRegisterVendorPayload {
    shopName: string;
    email: string;
    phoneNumber: string;
    address: string;
    region: string;
    country: string;
    social: {
        website: string;
        facebook: string;
        instagram: string;
        twitter: string;
        linkedin: string;
        tikTok: string;
    };
    isTailor: boolean;
    isShoeMaker: boolean;
    bankDetails: {
        accountNumber: string;
        bankName: string;
        accountName: string;
    };
    source: string;
}

const generalAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({
        // Get the shop setup
        getShop: builder.query<IShop, string>({
            query: (shopId) => ({
                url: "/shop",
                method: "GET",
                params: { shopId },
            }),
            providesTags: ["Shop"],
            transformResponse: (response: { data: IShop }) => {
                return response.data;
            },
        }),

        // Fetch the seller policy/contract links shown on onboarding step 7.
        getSellerPolicies: builder.query<ISellerPolicy[], void>({
            query: () => ({
                url: getSellerPoliciesRoute,
                method: "GET",
            }),
            transformResponse: (response: { data: ISellerPolicy[] }) => response.data,
        }),

        // First-create endpoint — disable retries so a failed submission surfaces
        // immediately instead of stalling the Join button.
        registerVendor: builder.mutation<IShop, IRegisterVendorPayload>({
            query: (body) => ({
                url: registerVendorRoute,
                method: "POST",
                body,
            }),
            extraOptions: { maxRetries: 0 },
            invalidatesTags: ["Shop", "user"],
            transformResponse: (response: { data: IShop }) => response.data,
        }),

        // Returns the currently-authenticated user's shop with the `status`
        // field — driven by the post-create welcome screen flow.
        getAuthShop: builder.query<IShop, void>({
            query: () => ({
                url: getAuthShopRoute,
                method: "GET",
            }),
            providesTags: ["Shop"],
            transformResponse: (response: { data: IShop }) => response.data,
        }),

        // Required onboarding documents (per shop). The backend may return
        // `link` for already-uploaded docs and null for outstanding ones.
        getOnboardingDocuments: builder.query<IOnboardingDocumentRequirement[], string>({
            query: (shopId) => ({
                url: getOnboardingDocumentsRoute,
                method: "GET",
                params: { shopId },
            }),
            providesTags: ["OnboardingDocuments"],
            transformResponse: (response: { data: IOnboardingDocumentRequirement[] }) => response.data,
        }),

        // Multipart upload of one document at a time. The FormData body must
        // include `file`, `shopId`, and `slug` — built in the upload hook.
        // First-create style endpoint, so we kill retries.
        uploadOnboardingDocument: builder.mutation<IOnboardingDocumentRequirement, FormData>({
            query: (body) => ({
                url: uploadOnboardingDocumentRoute,
                method: "POST",
                body,
            }),
            extraOptions: { maxRetries: 0 },
            invalidatesTags: ["OnboardingDocuments"],
            transformResponse: (response: { data: IOnboardingDocumentRequirement }) => response.data,
        }),
    }),
});

export type { IRegisterVendorPayload };
export const {
    useLazyGetShopQuery,
    useGetSellerPoliciesQuery,
    useRegisterVendorMutation,
    useLazyGetAuthShopQuery,
    useGetOnboardingDocumentsQuery,
    useUploadOnboardingDocumentMutation,
} = generalAPI;
export default generalAPI;
