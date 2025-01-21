import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import AuthorizationHeader from "../services/authorizationHeader";

const api = createApi({
    reducerPath: "api",
    baseQuery: retry(
        fetchBaseQuery({
            baseUrl: "https://zeap-api.onrender.com",
            prepareHeaders: async (headers) => AuthorizationHeader(headers),
        }),
        {
            maxRetries: 3,
        }
    ),
    tagTypes: [
        "user",
        "Product",
        "Products",
        "ProductOptions",
        "Reviews",
        "Shop",
        "ProductQuantity",
        "BodyMeasurement",
        "BodyMeasurements",
        "ProductMeasurementFields",
        "RequiredMeasurementFormFields",
        "BodyMeasurementEnumerations",
        "Basket",
    ],
    endpoints: () => ({}),
});

export default api;