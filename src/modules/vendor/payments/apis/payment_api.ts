import { getVendorPaymentsRoute } from '../../../../redux/api/api_route';
import IPayment from '../models/payment_model';
import rootAPI from './../../../../redux/api/rootAPI';

const paymentAPI = rootAPI.injectEndpoints({
	overrideExisting: true,
	endpoints: (builder) => ({

		// Get list of payments for vendor (with optional query params)
		getVendorPayments: builder.query<IPayment[], {shopID: string }>({
			query: ({shopID}) => ({
				url: getVendorPaymentsRoute,
				method: 'GET',
				params: { shopId: shopID }
			}),
			providesTags: ["VendorPayments"],
			transformResponse: (response: { data: IPayment[] }) => {
                return response.data
            },
		}),

		// Get a single payment by id
		getVendorPayment: builder.query<IPayment, { paymentId: string }>({
			query: ({ paymentId }) => ({
				url: `/vendor/payments/${paymentId}`,
				method: 'GET',
			}),
			providesTags: (result, error, arg) => [{ type: 'VendorPayments' as const, id: arg.paymentId }],
			transformResponse: (response: { data: IPayment }) => {
                return response.data;
            },
		}),

		// Update payment status (e.g., mark as paid/refunded)
		updatePaymentStatus: builder.mutation<any, { paymentId: string; status: string }>({
			query: ({ paymentId, status }) => ({
				url: `/vendor/payments/${paymentId}/status`,
				method: 'PATCH',
				body: { status },
			}),
			invalidatesTags: ['VendorPayments'],
			transformResponse: (response: { data: any }) => response.data,
		}),

	}),
});

export const {
	useLazyGetVendorPaymentsQuery,
	useGetVendorPaymentQuery,
	useUpdatePaymentStatusMutation,
} = paymentAPI;

export default paymentAPI;

