import * as yup from "yup";

const changePasswordSchema = yup.object().shape({
    currentPassword: yup
        .string()
        .required("Current password is required.")
        .min(6, "Current password must be at least 6 characters."),
    newPassword: yup
        .string()
        .required("New password is required.")
        .min(8, "New password must be at least 8 characters.")
        .matches(/[A-Z]/, "New password must contain at least one uppercase letter.")
        .matches(/[a-z]/, "New password must contain at least one lowercase letter.")
        .matches(/\d/, "New password must contain at least one number.")
        .matches(/[^A-Za-z\d]/, "New password must contain at least one special character."),
    confirmNewPassword: yup
        .string()
        .required("Confirm new password is required.")
        .oneOf([yup.ref("newPassword")], "Passwords must match."),
});

export type IChangePassword = yup.InferType<typeof changePasswordSchema>;
export { changePasswordSchema }; 