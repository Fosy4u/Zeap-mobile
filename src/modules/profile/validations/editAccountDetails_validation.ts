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
        .optional(),
    phoneNumber: yup
        .string()
        .optional(),
    country: yup
        .string()
        .optional(),
});

export type IEditAccountDetailsSchema = yup.InferType<typeof editAccountDetailsSchema>;
export default editAccountDetailsSchema;