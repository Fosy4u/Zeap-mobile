import * as yup from "yup";

const requiredMeasurementFormFieldsSchema = yup.object().shape({
    templateName: yup.string().required("Template name is required"),
    measurements: yup.array().of(
      yup.object().shape({
        name: yup.string().required("Measurement name is required"),
        fields: yup.array().of(yup.string().required("Field is required")).required("Fields are required")
      })
    ),
    instructions: yup.string().optional()
  });

// const measurementSchema = yup.object().shape({
//     templateName: yup
//         .string()
//         .required("Template name is required."),
//     measurements: yup
//         .array()
//         .of(
//             yup.object().shape({
//                 name: yup
//                     .string()
//                     .required("Name is required."),
//                 measurements: yup
//                     .array()
//                     .of(
//                         yup.object().shape({
//                             field: yup
//                                 .string()
//                                 .required("Field is required."),
//                             value: yup
//                                 .number()
//                                 .required("Value is required."),
//                             unit: yup
//                                 .string()
//                                 .required("Unit is required."),
//                         })
//                     )
//             })
//         )
// });

// const productMeasurementFieldsSchema = yup.object().shape({
//     templateName: yup
//         .string()
//         .required("Template name is required."),
//     measurements: yup
//         .array()
//         .of(
//             yup.object().shape({
//                 name: yup
//                     .string()
//                     .required("Name is required."),
//                 measurements: yup
//                     .array()
//                     .of(
//                         yup.object().shape({
//                             field: yup
//                                 .string()
//                                 .required("Field is required."),
//                             value: yup
//                                 .string()
//                                 .required("Value is required."),
//                             unit: yup
//                                 .string()
//                                 .required("Unit is required."),
//                         })
//                     ),
//             }),
//         ),
// });

export type IRequiredMeasurementFormFieldsSchema = yup.InferType<typeof requiredMeasurementFormFieldsSchema>;
export { requiredMeasurementFormFieldsSchema };

// export type IRequiredMeasurementFormFieldsSchema = yup.InferType<typeof requiredMeasurementFormFieldsSchema>;
// export { requiredMeasurementFormFieldsSchema };