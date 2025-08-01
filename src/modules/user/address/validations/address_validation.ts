import * as yup from "yup";

const addressFormFieldsSchema = yup.object().shape({
    firstName: yup
        .string()
        .required("First name is required."),
    lastName: yup
        .string()
        .required("Last name is required."),
    address: yup
        .string()
        .required("Street address is required."),
    region: yup
        .string()
        .required("region is required."),
    country: yup
        .string()
        .required("Country is required."),
    phoneNumber: yup
        .string()
        .required("Phone number is required."),
});

export type IAddressFormFieldsSchema = yup.InferType<typeof addressFormFieldsSchema>;
export default addressFormFieldsSchema;