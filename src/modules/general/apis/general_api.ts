import rootAPI from "../../../redux/api/rootAPI.ts";
import IProductOptions from "../models/productOptions_model";

const generalAPI = rootAPI.injectEndpoints({
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
