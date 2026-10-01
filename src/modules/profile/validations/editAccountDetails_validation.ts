import * as yup from "yup";

const editAccountDetailsSchema = yup.object().shape({
    firstName: yup
        .string()
        .optional(),
    lastName: yup
        .string()
        .optional(),
    email: yup
        .string()
        .email("Enter a valid email address")
        .required("Email is required"),
    phoneNumber: yup
        .string()
        .optional(),
    country: yup
        .string()
        .optional(),
    address: yup
        .string()
        .optional(),
});

export type IEditAccountDetailsSchema = yup.InferType<typeof editAccountDetailsSchema>;
export default editAccountDetailsSchema;