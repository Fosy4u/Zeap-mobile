import * as yup from "yup";

const addressFormFieldsSchema = yup.object().shape({
    address: yup
        .string()
        .required("Street address is required."),
    region: yup
        .string()
        .required("region is required."),
    country: yup
        .string()
        .required("Country is required."),
    postalCode: yup
        .string()
        .required("Postal code is required."),
    phoneNumber: yup
        .string()
        .required("Phone number is required."),
});

export type IAddressFormFieldsSchema = yup.InferType<typeof addressFormFieldsSchema>;
export default addressFormFieldsSchema;