import rootAPI from "../../../../redux/api/rootAPI.ts";
import { allBodyMeasurementTemplateRoute, bodyMeasurementEnumsRoute, bodyMeasurementGuideRoute, requiredMeasurementFormFieldsRoute, singleBodyMeasurementTemplateRoute } from "../../../../redux/api/api_route.ts";
import IBodyMeasurement from "../models/bodyMeasurement_model.ts";
import IBodyMeasurementEnumerations from "../models/bodyMeasurementEnumeration_model.ts";
import IBodyMeasurementGuide from "../models/bodyMeasurementGuide_model.ts";
import IRequiredMeasurementFormFields from "../models/requiredMeasurementFormField_model.ts";

const measurementAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({
        // Add Body Measurement Template
        addBodyMeasurementTemplate: builder.mutation<any, any>({
            query: (requestData) => ({
                url: "/bodyMeasurementTemplate/add",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["BodyMeasurements", "Cart"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Get All Saved Body Measurements
        getAllSavedMeasurements: builder.query<IBodyMeasurement[], void>({
            query: () => ({
                url: allBodyMeasurementTemplateRoute,
                method: "GET",
            }),
            providesTags: ["BodyMeasurements"],
            transformResponse: (response: { data: IBodyMeasurement[] }) => {
                return response.data;
            },
        }),

        // Get Single Body Measurement
        getSingleSavedMeasurement: builder.query<IBodyMeasurement, string>({
            query: (templateID) => ({
                url: singleBodyMeasurementTemplateRoute,
                method: "GET",
                params: {
                    template_id: templateID
                }
            }),
            providesTags: ["BodyMeasurement"],
            transformResponse: (response: { data: IBodyMeasurement }) => {
                return response.data;
            },
        }),

        // Get Required Measurement Form Fields
        getRequiredMeasurementFormFields: builder.query<IRequiredMeasurementFormFields, string>({
            query: (productID) => ({
                url: requiredMeasurementFormFieldsRoute,
                method: "GET",
                params: {
                    productId: productID
                }, // Use params here
            }),
            providesTags: ["RequiredMeasurementFormFields"],
            transformResponse: (response: { data: IRequiredMeasurementFormFields }) => {
                return response.data;
            },
        }),

        // Get Body Measurement Enumerations
        getBodyMeasurementEnumerations: builder.query<IBodyMeasurementEnumerations, void>({
            query: () => ({
                url: bodyMeasurementEnumsRoute,
                method: "GET",
            }),
            providesTags: ["BodyMeasurementEnumerations"],
            transformResponse: (response: { data: IBodyMeasurementEnumerations }) => {
                return response.data;
            },
        }),

        // Get Body Measurement Guide
        getBodyMeasurementGuide: builder.query<IBodyMeasurementGuide[], string>({
            query: (gender: string) => ({
                url: bodyMeasurementGuideRoute,
                method: "GET",
                params: { gender },
            }),
            providesTags: ["BodyMeasurementGuide"],
            transformResponse: (response: { data: IBodyMeasurementGuide[] }) => {
                return response.data;
            },
        })
    }),
});

export const {
    useAddBodyMeasurementTemplateMutation,
    useLazyGetAllSavedMeasurementsQuery,
    useGetSingleSavedMeasurementQuery,
    useLazyGetRequiredMeasurementFormFieldsQuery,
    useGetBodyMeasurementEnumerationsQuery,
    useLazyGetBodyMeasurementGuideQuery
} = measurementAPI;
export default measurementAPI;
