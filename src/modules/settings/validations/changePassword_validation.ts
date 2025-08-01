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
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),
    confirmNewPassword: yup
        .string()
        .required("Confirm new password is required.")
        .oneOf([yup.ref("newPassword")], "Passwords must match."),
});

export type IChangePassword = yup.InferType<typeof changePasswordSchema>;
export { changePasswordSchema }; 