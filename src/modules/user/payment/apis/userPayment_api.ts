import rootAPI from "../../../../redux/api/rootAPI.ts";
import IPaymentReference from "../models/paymentReference_model";
import IPaymentReferenceParams from "../models/paymentReferenceParams_model.ts";



const paymentAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // Get Payment Reference.
        getPaymentReference: builder.query<IPaymentReference, IPaymentReferenceParams>({
            query: (params) => ({
                url: `/payment/reference`,
                method: "GET",
                params
            }),
            providesTags: ["PaymentReference"],
            transformResponse: (response: { data: IPaymentReference }) => {
                return response.data;
            },
        }),

        // Verify Payment with Paystack.
        verifyPayment: builder.mutation<any, { reference: string }>({
            query: ({ reference }) => ({
                url: `/payment/verify`,
                method: "POST",
                body: { reference },
            }),
            invalidatesTags: ["PaymentReference", "Cart"],

            transformResponse: (response: { data: any }) => {
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
