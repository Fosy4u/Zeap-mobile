import rootAPI from "../../../redux/api/rootAPI";


const settingsAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({

        // Get Country's Currency or Code
        getCountryCurrency: builder.query<any, { url: string }>({
            query: (requestData) => ({
                url: requestData.url,
                method: "GET",
            }),
            providesTags: [],
            transformResponse: (response: any) => {
                return response;
            },
        }),
    }),
});

export const {
    useLazyGetCountryCurrencyQuery
} = settingsAPI;
export default settingsAPI;