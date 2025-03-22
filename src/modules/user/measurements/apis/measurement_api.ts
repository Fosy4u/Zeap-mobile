import api from "../../../../redux/api/api";
import IBodyMeasurement from "../models/bodyMeasurement_model.ts";
import IBodyMeasurementEnumerations from "../models/bodyMeasurementEnumeration_model.ts";
import IRequiredMeasurementFormFields from "../models/requiredMeasurementFormField_model.ts";

const measurementAPI = api.injectEndpoints({
    endpoints: (builder) => ({
        // Add Body Measurement Template
        addBodyMeasurementTemplate: builder.mutation<any, any>({
            query: (requestData) => ({
                url: "/bodyMeasurementTemplate/add",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["BodyMeasurements", "Cart", "CartTotal"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Get All Existing Body Measurement Templates
        getAllBodyMeasurementTemplates: builder.query<IBodyMeasurement[], void>({
            query: () => ({
                url: "/bodyMeasurementTemplate/authUser",
                method: "GET",
            }),
            providesTags: ["BodyMeasurements"],
            transformResponse: (response: { data: IBodyMeasurement[] }) => {
                return response.data;
            },
        }),

        // Get Existing Body Measurement Template
        getBodyMeasurementTemplate: builder.query<IBodyMeasurement, string>({
            query: (templateID) => ({
                url: `/bodyMeasurementTemplate?template_id=${templateID}`,
                method: "GET",
            }),
            providesTags: ["BodyMeasurement"],
            transformResponse: (response: { data: IBodyMeasurement }) => {
                return response.data;
            },
        }),

        // Get Required Measurement Form Fields
        getRequiredMeasurementFormFields: builder.query<IRequiredMeasurementFormFields, string>({
            query: (productID) => ({
                url: `/bodyMeasurement/product?productId=${encodeURIComponent(productID)}`,
                method: "GET",
            }),
            providesTags: ["RequiredMeasurementFormFields"],
            transformResponse: (response: { data: IRequiredMeasurementFormFields }) => {
                return response.data;
            },
        }),

        // Get Body Measurement Enumerations
        getBodyMeasurementEnumerations: builder.query<IBodyMeasurementEnumerations, void>({
            query: () => ({
                url: `/bodyMeasurementEnums`,
                method: "GET",
            }),
            providesTags: ["BodyMeasurementEnumerations"],
            transformResponse: (response: { data: IBodyMeasurementEnumerations }) => {
                return response.data;
            },
        }),
    }),
});

export const {
    useAddBodyMeasurementTemplateMutation,
    useLazyGetAllBodyMeasurementTemplatesQuery,
    useGetBodyMeasurementTemplateQuery,
    useLazyGetRequiredMeasurementFormFieldsQuery,
    useGetBodyMeasurementEnumerationsQuery
} = measurementAPI;
export default measurementAPI;