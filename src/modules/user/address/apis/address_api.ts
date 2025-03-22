import api from "../../../../redux/api/api";
import IAddress from "../models/address_model";
import { IAddressFormFieldsSchema } from "../validations/address_validation";


const addressAPI = api.injectEndpoints({
    endpoints: (builder) => ({

        // Add delivery address
        addDeliveryAddress: builder.mutation<IAddress, IAddressFormFieldsSchema>({
            query: (requestData) => ({
                url: "/deliveryAddress/create",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["DeliveryAddress"],
            transformResponse: (response: { data: IAddress }) => {
                return response.data;
            },
        }),

        // Get all delivery addresses
        getAllDeliveryAddresses: builder.query<any, void>({
            query: () => ({
                url: "/deliveryAddresses",
                method: "GET",
            }),
            providesTags: ["DeliveryAddresses"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Get saved delivery address
        getDeliveryAddress: builder.query<IAddress, { address_id: string }>({
            query: ({ address_id }) => ({
                url: "/deliveryAddress",
                method: "GET",
                params: { address_id },
            }),
            providesTags: ["DeliveryAddress"],
            transformResponse: (response: { data: IAddress }) => {
                return response.data;
            },
        }),
    }),
});

export const { 
    useAddDeliveryAddressMutation,
    useLazyGetAllDeliveryAddressesQuery,
    useLazyGetDeliveryAddressQuery,
} = addressAPI;
export default addressAPI;