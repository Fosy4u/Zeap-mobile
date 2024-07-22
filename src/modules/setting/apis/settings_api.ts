import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICountryStateCityAccessToken } from "../models/countriesStatesCities_model";


const settingsAPI = createApi({
    reducerPath: "settingsAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: "",
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        }
    }),
    tagTypes: [],

    endpoints: (builder) => ({
        getCountryStateCityAccessToken: builder.query<ICountryStateCityAccessToken, void>({
            query: () => ({
                url: "https://www.universal-tutorial.com/api/getaccesstoken",
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "api-token": process.env.COUNTRY_CITY_API_TOKEN,
                    "user-email": "tosolife@yahoo.com"
                }
            }),
            transformResponse(response: ICountryStateCityAccessToken) {
                console.log("RESPONSE::: ", response.auth_token);
                return response;
            },
        }),
        getCountriesStatesCities: builder.query({
            query: () => ({
                url: "https://www.universal-tutorial.com/api/getaccesstoken",
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "api-token": process.env.COUNTRY_CITY_API_TOKEN,
                    "user-email": "tosolife@yahoo.com"
                }
            }),
            transformResponse(response) {
                console.log("RESPONSE::: ", response);
                return response;
            },
        }),
    }),
});

export const { useGetCountryStateCityAccessTokenQuery } = settingsAPI;
export default settingsAPI;