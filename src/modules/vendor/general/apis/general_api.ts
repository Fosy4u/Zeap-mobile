import rootAPI from "../../../../redux/api/rootAPI.ts";
import IShop from "../../general/models/shop_model";

const generalAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({
        // Get the shop setup
        getShop: builder.query<IShop, string>({
            query: (shopId) => ({
                url: "/shop",
                method: "GET",
                params: { shopId },
            }),
            providesTags: ["Shop"],
            transformResponse: (response: { data: IShop }) => {
                return response.data;
            },
        }),
    }),
});

export const { useLazyGetShopQuery } = generalAPI;
export default generalAPI;
