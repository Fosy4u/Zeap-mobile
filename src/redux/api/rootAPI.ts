import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import AuthorizationHeader from "../services/authorizationHeader";
import baseURL from "./api_route";

const DEFAULT_MAX_RETRIES = 3;

const rootAPI = createApi({
    reducerPath: "rootAPI",
    baseQuery: retry(
        fetchBaseQuery({
            baseUrl: baseURL,
            prepareHeaders: async (headers) => AuthorizationHeader(headers),
            credentials: "include",
        }),
        {
            retryCondition: (error, _args, { attempt, extraOptions }) => {
                const maxRetries = (extraOptions as { maxRetries?: number } | undefined)?.maxRetries
                    ?? DEFAULT_MAX_RETRIES;
                if (attempt > maxRetries) { return false; }

                const status = (error as { status?: number | string } | undefined)?.status;
                return !(typeof status === "number" && status >= 400 && status < 500);
            },
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
        "DynamicFilterOptions",
        "Orders",
        "Order",
        "OrderDetails",
        "OrderSummary",
        "OrderHistory",
        "DeliveryMethod",
        "DeliveryDate",
        "Points",
        "Vouchers",
        "Wishlist",

        // Vebdor
        "VendorAnalytics",
        "DraftProducts",
        "VendorProductPreview",
        "VendorProductDetails",
        "Promotions",
        "Promotion",
        "VendorProductBodyMeasurement",
        "VendorOrders",
        "VendorOrderDetails",
        "VendorOrderHistory",
        "VendorPayments",
        "OnboardingDocuments",

        "notifications",
    ],
    endpoints: () => ({}),
});

export default rootAPI;
