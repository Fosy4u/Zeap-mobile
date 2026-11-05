import rootAPI from "../../../../redux/api/rootAPI.ts";
import IPaymentReference from "../models/paymentReference_model.ts";
import IPaymentReferenceParams from "../models/paymentReferenceParams_model.ts";
import IVerifyPaymentResponse from "../models/verifyPaymentResponse_model.ts";



const paymentAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // Get Payment Reference.
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

        verifyPayment: builder.mutation<IVerifyPaymentResponse, { reference: string }>({
            query: ({ reference }) => ({
                url: `/payment/verify`,
                method: "POST",
                body: { reference },
            }),
            invalidatesTags: ["PaymentReference", "Cart"],
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
