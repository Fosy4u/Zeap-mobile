import rootAPI from "../../../redux/api/rootAPI.ts";
import IProductOptions from "../models/productOptions_model";
import IBodyMeasurementGuide from "../models/bodyMeasurementGuide_model";
import { bodyMeasurementGuideRoute } from "../../../redux/api/api_route.ts";

const generalAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
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
        }),

        getBodyMeasurementGuide: builder.query<IBodyMeasurementGuide[], string>({
            query: (gender: string) => ({
                url: bodyMeasurementGuideRoute,
                method: "GET",
                params: { gender },
            }),
            providesTags: ["BodyMeasurementGuide"],
            transformResponse: (response: { data: IBodyMeasurementGuide[] }) => response.data,
        }),
    }),
});

export const {
    useLazyGetProductOptionsQuery,
    useGetBodyMeasurementGuideQuery,
    useLazyGetBodyMeasurementGuideQuery,
} = generalAPI;
export default generalAPI;
