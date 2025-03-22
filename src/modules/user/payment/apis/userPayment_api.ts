import api from "../../../../redux/api/api";
import IPaymentReference from "../models/paymentReference_model";


const paymentAPI = api.injectEndpoints({
    endpoints: (builder) => ({

        // Get Payment Reference.
        getPaymentReference: builder.query<IPaymentReference, { deliveryAddress_id: string }>({
            query: ({ deliveryAddress_id }) => ({
                url: `/payment/reference`,
                method: "GET",
                params: { deliveryAddress_id }
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
            invalidatesTags: ["PaymentReference", "Cart", "CartTotal"],

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