import rootAPI from "../../../../redux/api/rootAPI.ts";
import IAnalytic from "../models/analytic_model";

const homeAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({
        // Get dashboard analytics
        getAnalytics: builder.query<IAnalytic, string>({
            query: (shopId) => ({
                url: "/analytics/shop",
                method: "GET",
                params: { shopId },
            }),
            providesTags: ["VendorAnalytics"],
            transformResponse: (response: { data: IAnalytic }) => {
                return response.data;
            }
        })
    })
});

export const { useLazyGetAnalyticsQuery } = homeAPI;
export default homeAPI;
