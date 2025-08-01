import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import AuthorizationHeader from "../services/authorizationHeader";
import baseURL from "../../routes/api/api_route";

const rootAPI = createApi({
    reducerPath: "rootAPI",
    baseQuery: retry(
        fetchBaseQuery({
            baseUrl: baseURL,
            prepareHeaders: async (headers) => AuthorizationHeader(headers),
            credentials: "include",
            timeout: 20000, // 30 seconds
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
        "BodyMeasurementGuide",
        "ProductMeasurementFields",
        "RequiredMeasurementFormFields",
        "BodyMeasurementEnumerations",
        "SizeGuide",
        "Cart",
        "DeliveryAddress",
        "DeliveryAddresses",
        "PaymentReference",
        "PromoProduct",
        "Orders",
        "OrderSummary",
        "OrderHistory",
        "DeliveryMethod",
        "DeliveryDate",
        "Points",
        "Vouchers",

        // Vebdor
        "VendorAnalytics",
        "DraftProducts",
        "VendorProductPreview",
        "VendorProductDetails",
        "Promotions",
        "Promotion",
        "VendorProductBodyMeasurement",

        "notifications",
    ],
    endpoints: () => ({}),
});

export default rootAPI;
