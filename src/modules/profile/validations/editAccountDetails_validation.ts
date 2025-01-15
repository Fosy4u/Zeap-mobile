import * as yup from "yup";

const editAccountDetailsSchema = yup.object().shape({
    firstName: yup
        .string()
        .required("First name is required."),
    lastName: yup
        .string()
        .required("Last name is required."),
    phoneNumber: yup
        .string()
        .required("Phone number is required."),
    country: yup
        .string()
        .required("Country is required"),
});


export type IEditAccountDetailsSchema = yup.InferType<typeof editAccountDetailsSchema>;
export default editAccountDetailsSchema;