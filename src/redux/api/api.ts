import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import AuthorizationHeader from "../services/authorizationHeader";

const api = createApi({
    reducerPath: "api",
    baseQuery: retry(
        fetchBaseQuery({
            baseUrl: "https://zeap-api.onrender.com",
            prepareHeaders: async (headers) => AuthorizationHeader(headers),
            credentials: "include",
            timeout: 30000, // 30 seconds
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
        "BodyMeasurement",
        "BodyMeasurements",
        "ProductMeasurementFields",
        "RequiredMeasurementFormFields",
        "BodyMeasurementEnumerations",
        "Cart",
        "CartTotal",
        "DeliveryAddress",
        "DeliveryAddresses",
        "PaymentReference",
        "PromoProduct",

        // Vebdor
        "VendorAnalytics",
        "DraftProduct"
    ],
    endpoints: () => ({}),
});

export default api;