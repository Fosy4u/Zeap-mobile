import * as yup from "yup";
import { Alert } from "react-native";
import { isSessionSettling } from "../../../redux/services/session";


const toMessageString = (value: any): string => {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (value instanceof Error) return value.message || "An unexpected error occurred.";
    if (typeof value === "object") {
        return (
            value.message ||
            value.error ||
            value.detail ||
            value.description ||
            (() => {
                try { return JSON.stringify(value); } catch { return "An unexpected error occurred."; }
            })()
        );
    }
    return String(value);
};

const FIREBASE_AUTH_MESSAGES: Record<string, string> = {
    "auth/user-not-found": "Password is incorrect. Please try again.",
    "auth/invalid-email": "Password is incorrect. Please try again.",
    "auth/wrong-password": "Password is incorrect. Please try again.",
    "auth/invalid-credential": "Password is incorrect. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/network-request-failed": "Network error. Please check your connection and try again.",
};

const isStaleSessionError = (error: any): boolean => {
    if (error?.name === "AbortError" || error?.error === "Session changed or unavailable") { return true; }
    return error instanceof TypeError && isSessionSettling();
};

//  Handle errors
const handleError = (error: any) => {
    if (isStaleSessionError(error)) { return; }

    let rawMessage: any = "";

    // Handle Yup validation errors
    if (error instanceof yup.ValidationError) {
        rawMessage = error.message;
    }
    else if (error?.status === "TIMEOUT_ERROR") {
        rawMessage = "This is taking too long. Please check your connection and try again.";
    }
    else if (error?.status) {
        rawMessage = error?.data?.error ?? error?.data?.message ?? "An unexpected error occurred.";
    }
    else if (FIREBASE_AUTH_MESSAGES[error?.code]) {
        rawMessage = FIREBASE_AUTH_MESSAGES[error.code];
    }
    // Handle other generic errors
    else {
        rawMessage = error?.message ?? "An unexpected error occurred.";
    }

    const errorMessage = toMessageString(rawMessage) || "An unexpected error occurred.";

    if (errorMessage.toLowerCase().trim() === "basket not found") {

        return;
    }

    if (errorMessage.toLowerCase().trim() === "shop not found") {

        return;
    }

    Alert.alert("Error", errorMessage);

};

export default handleError;
