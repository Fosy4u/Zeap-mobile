import rootAPI from "../../../../redux/api/rootAPI";
import { convertPointsRoute, getActiveVouchersRoute, getInactiveVouchersRoute, getPointsRoute } from "../../../../routes/api/api_route";
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
    useConvertPointsMutation,
} = pointAndVoucherAPI;

export default pointAndVoucherAPI;