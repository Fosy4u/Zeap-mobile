import rootAPI from "../../../../redux/api/rootAPI.ts";
import IAddress from "../models/address_model";
import { IAddressFormFieldsSchema } from "../validations/address_validation";

const addressAPI = rootAPI.injectEndpoints({
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

        updateDeliveryAddress: builder.mutation<IAddress, IAddressFormFieldsSchema & { address_id: string }>({
            query: (requestData) => ({
                url: "/deliveryAddress/update",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["DeliveryAddress", "DeliveryAddresses"],
            transformResponse: (response: { data: IAddress }) => {
                return response.data;
            },
        }),

        // Get all delivery addresses
        getDeliveryAddresses: builder.query<IAddress[], { user_id: string }>({
            query: ({ user_id }) => ({
                url: `/deliveryAddresses?user_id=${user_id}`,
                method: "GET",
                // params: { user_id },
            }),
            providesTags: ["DeliveryAddresses"],
            transformResponse: (response: { data: IAddress[] }) => {
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

        // Set as default address
        setAsDefaultAddress: builder.mutation<IAddress, { address_id: string }>({
            query: ({ address_id }) => ({
                url: "/deliveryAddress/setDefault",
                method: "PUT",
                body: { address_id },
            }), 
            invalidatesTags: ["DeliveryAddress"],
            transformResponse: (response: { data: IAddress }) => {
                return response.data;
            },
        }),

        // Delete address
        deleteAddress: builder.mutation<IAddress, { address_id: string }>({
            query: ({ address_id }) => ({
                url: "/deliveryAddress/delete",
                method: "DELETE",
                body: { address_id },
            }),
            invalidatesTags: ["DeliveryAddress"],
            transformResponse: (response: { data: IAddress }) => {
                return response.data;
            },
        }),
    }),
});

export const {
    useAddDeliveryAddressMutation,
    useUpdateDeliveryAddressMutation,
    useLazyGetDeliveryAddressesQuery,
    useLazyGetDeliveryAddressQuery,
    useSetAsDefaultAddressMutation,
    useDeleteAddressMutation,
} = addressAPI;
export default addressAPI;
