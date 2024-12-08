import * as yup from "yup";

const registerUserSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is required.")
        .email("Email must be a valid email."),
    isVendor: yup
        .boolean()
        .required("Seller option is required."),
    password: yup
        .string()
        .required("Password is required."),
    confirmPassword: yup
        .string()
        .required("Confirm password is required.")
        .oneOf([yup.ref("password")], "Passwords must match."),
});


const loginUserSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is required.")
        .email("Email must be a valid email."),
    password: yup
        .string()
        .required("Password is required."),
});

export type IRegisterUser = yup.InferType<typeof registerUserSchema>;
export type ILoginUser = yup.InferType<typeof loginUserSchema>;
export { registerUserSchema, loginUserSchema };