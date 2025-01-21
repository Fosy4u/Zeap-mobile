import api from "../../../redux/api/api";
import IProductOptions from "../models/productOptions_model";

const generalAPI = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get Products Options
        getProductOptions: builder.query<IProductOptions, void>({
            query: () => ({
                url: "/products/options",
                method: "GET",
            }),
            providesTags: ["ProductOptions"],
            transformResponse(response: { data: IProductOptions }) {
                return response.data;
            }
        })
    }),
});

export const {
    useLazyGetProductOptionsQuery,
} = generalAPI;
export default generalAPI;