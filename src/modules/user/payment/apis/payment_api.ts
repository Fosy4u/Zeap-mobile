import rootAPI from "../../../../redux/api/rootAPI.ts";
import IPaymentReference from "../models/paymentReference_model.ts";
import IPaymentReferenceParams from "../models/paymentReferenceParams_model.ts";
import IVerifyPaymentResponse from "../models/verifyPaymentResponse_model.ts";



const paymentAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // Get Payment Reference.
        // Retries are explicitly disabled — this endpoint creates a Paystack
        // reference server-side, and rootAPI's default 3 retries would (a)
        // create orphan references each retry, and (b) on a cold Render
        // server cause a 3+ minute silent wait that looks like a hang.
        getPaymentReference: builder.query<IPaymentReference, IPaymentReferenceParams>({
            query: (params) => ({
                url: `/payment/reference`,
                method: "GET",
                params,
            }),
            extraOptions: { maxRetries: 0 },
            providesTags: ["PaymentReference"],
            transformResponse: (response: { data: IPaymentReference }) => {
                return response.data;
            },
        }),

        // Verify and fulfil a completed payment for either supported gateway.
        verifyPayment: builder.mutation<IVerifyPaymentResponse, { reference: string }>({
            query: ({ reference }) => ({
                url: `/payment/verify`,
                method: "POST",
                body: { reference },
            }),
            invalidatesTags: ["PaymentReference", "Cart"],
            // Stripe verification is retried deliberately in the payment hook
            // while its webhook catches up. Avoid stacking RTK's hidden retries.
            extraOptions: { maxRetries: 0 },

            transformResponse: (response: { data: IVerifyPaymentResponse }) => {
                return response.data;
            },
        }),
    }),
});

export const {
    useLazyGetPaymentReferenceQuery,
    useVerifyPaymentMutation
} = paymentAPI;
export default paymentAPI;
