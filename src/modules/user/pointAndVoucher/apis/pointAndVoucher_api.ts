import rootAPI from "../../../../redux/api/rootAPI";
import { applyVoucherRoute, convertPointsRoute, getActiveVouchersRoute, getInactiveVouchersRoute, getPointsRoute, getVoucherByCodeRoute, removeVoucherRoute } from "../../../../redux/api/api_route";
import IPoint from "../models/point_model";
import IVoucher from "../models/voucher_model";


const pointAndVoucherAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({

        // Get points
        getPoints: builder.query<IPoint, void>({
            query: () => ({
                url: getPointsRoute,
                method: "GET",
            }),
            providesTags: ["Points"],
            transformResponse: (response: { data: IPoint }) => {
                return response.data;
            },
        }),

        // Get active vouchers
        getActiveVouchers: builder.query<IVoucher[], void>({
            query: () => ({
                url: getActiveVouchersRoute,
                method: "GET",
            }),
            providesTags: ["Vouchers"],
            transformResponse: (response: { data: IVoucher[] }) => {
                return response.data;
            },
        }),

        // Get inactive vouchers
        getInactiveVouchers: builder.query<IVoucher[], void>({
            query: () => ({
                url: getInactiveVouchersRoute,
                method: "GET",
            }),
            providesTags: ["Vouchers"],
            transformResponse: (response: { data: IVoucher[] }) => {
                return response.data;
            },
        }),

        // Get Voucher by code
        getVoucherByCode: builder.query<IVoucher, { code: string }>({
            query: ({ code }) => ({
                url: getVoucherByCodeRoute,
                method: "GET",
                params: { code },
            }),
            providesTags: ["Vouchers"],
            transformResponse: (response: { data: IVoucher }) => {
                return response.data;
            },
        }),

        // Apply a voucher to the basket
        applyVoucher: builder.mutation<unknown, { code: string }>({
            query: ({ code }) => ({
                url: applyVoucherRoute,
                method: "PUT",
                body: { code },
            }),
            invalidatesTags: ["Cart", "OrderSummary", "Vouchers", "Points"],
        }),

        // Remove the applied voucher from the basket
        removeVoucher: builder.mutation<unknown, void>({
            query: () => ({
                url: removeVoucherRoute,
                method: "PUT",
                body: {},
            }),
            invalidatesTags: ["Cart", "OrderSummary", "Vouchers", "Points"],
        }),

        // Convert points to vouchers
        convertPoints: builder.mutation<IVoucher, { points: number }>({
            query: ({ points }) => ({
                url: convertPointsRoute,
                method: "POST",
                body: { pointToConvert: points },
            }),
            invalidatesTags: ["Points", "Vouchers"],
            transformResponse: (response: { data: IVoucher }) => {
                return response.data;
            }
        }),

    })
});

export const {
    useLazyGetPointsQuery,
    useLazyGetActiveVouchersQuery,
    useLazyGetInactiveVouchersQuery,
    useLazyGetVoucherByCodeQuery,
    useConvertPointsMutation,
    useApplyVoucherMutation,
    useRemoveVoucherMutation,
} = pointAndVoucherAPI;

export default pointAndVoucherAPI;