import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AuthorizationHeader from "../services/authorizationHeader";

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://zeap-api.onrender.com",
        prepareHeaders: async (headers) => AuthorizationHeader(headers),
    }),
    tagTypes: [
        "user",
        "Product",
        "Products",
        "Reviews",
    ],
    endpoints: () => ({}),
});

export default api;