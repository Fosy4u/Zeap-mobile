import * as yup from "yup";
import { isValidPhoneForCountry, phoneErrorForCountry } from "../../../../utils/phoneNumberRules";

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
    postCode: yup
        .string()
        .optional(),
    /* Validated against the selected country's format so e.g. a Nigerian
       number can't be saved with more or fewer than 11 digits. */
    phoneNumber: yup
        .string()
        .required("Phone number is required.")
        .test("country-phone-format", "Enter a valid phone number.", function (value) {
            if (!value) { return true; }
            if (isValidPhoneForCountry(value, this.parent?.country)) { return true; }
            return this.createError({ message: phoneErrorForCountry(this.parent?.country) });
        }),
});

export type IAddressFormFieldsSchema = yup.InferType<typeof addressFormFieldsSchema>;
export default addressFormFieldsSchema;