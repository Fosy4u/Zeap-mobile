import rootAPI from "../../../../redux/api/rootAPI.ts";
import { allBodyMeasurementTemplateRoute, bodyMeasurementEnumsRoute, deleteBodyMeasurementTemplateRoute, requiredMeasurementFormFieldsRoute, singleBodyMeasurementTemplateRoute, updateBodyMeasurementTemplateRoute } from "../../../../redux/api/api_route.ts";
import IBodyMeasurement from "../models/bodyMeasurement_model.ts";
import IBodyMeasurementEnumerations from "../models/bodyMeasurementEnumeration_model.ts";
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

        // Update Body Measurement Template
        updateBodyMeasurementTemplate: builder.mutation<any, { template_id: string; templateName: string; measurements: { field: string; value: number }[] }>({
            query: (body) => ({
                url: updateBodyMeasurementTemplateRoute,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["BodyMeasurements", "BodyMeasurement"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Delete Body Measurement Template
        deleteBodyMeasurementTemplate: builder.mutation<any, { template_id: string }>({
            query: (body) => ({
                url: deleteBodyMeasurementTemplateRoute,
                method: "DELETE",
                body,
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["BodyMeasurements", "BodyMeasurement"],
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
        // NOTE: getBodyMeasurementGuide moved to the general API
        // (src/modules/general/apis/general_api.ts) as the single source of
        // truth — shared by this buyer flow and the vendor bespoke step 3.
    }),
});

export const {
    useAddBodyMeasurementTemplateMutation,
    useUpdateBodyMeasurementTemplateMutation,
    useDeleteBodyMeasurementTemplateMutation,
    useLazyGetAllSavedMeasurementsQuery,
    useGetSingleSavedMeasurementQuery,
    useLazyGetRequiredMeasurementFormFieldsQuery,
    useGetBodyMeasurementEnumerationsQuery,
} = measurementAPI;
export default measurementAPI;
