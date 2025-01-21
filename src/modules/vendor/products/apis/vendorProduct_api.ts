import api from "../../../../redux/api/api";
import IVendorProductDetails from "../models/vendorProductDetails_model.ts";


const vendorProductAPI = api.injectEndpoints({
    endpoints: (builder) => ({

        // Get Product By Product ID
        getProductByProductID: builder.query<IVendorProductDetails, string>({
            query: (productID) =>({
                url: `/product?productId=${encodeURIComponent(productID)}`,
                method: "GET",
            }),
            providesTags:["Product"],
            transformResponse(response: { data: IVendorProductDetails }) {
                return response.data;
            },
        }),
    }),
});

export const {
    useGetProductByProductIDQuery
} = vendorProductAPI;
export default vendorProductAPI;