import * as yup from "yup";

// Mirrors the web sign-up rules.
const registerUserSchema = yup.object().shape({
    firstName: yup
        .string()
        .trim()
        .required("First name is required."),
    lastName: yup
        .string()
        .trim()
        .required("Last name is required."),
    email: yup
        .string()
        .trim()
        .required("Email is required.")
        .email("Email must be a valid email."),
    password: yup
        .string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters long.")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, and one number."),
    confirmPassword: yup
        .string()
        .required("Confirm password is required.")
        .oneOf([yup.ref("password")], "Password and confirm password do not match."),
    phoneNumber: yup
        .string()
        .trim()
        .required("Phone number is required.")
        .matches(/^[0-9]{6,15}$/, "Enter a valid phone number (digits only)."),
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

const forgotPasswordSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is required.")
        .email("Email must be a valid email."),
});

export type IRegisterUser = yup.InferType<typeof registerUserSchema>;
export type ILoginUser = yup.InferType<typeof loginUserSchema>;
export type IForgotPassword = yup.InferType<typeof forgotPasswordSchema>;
export { registerUserSchema, loginUserSchema, forgotPasswordSchema };