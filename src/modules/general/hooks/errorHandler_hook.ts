import * as yup from "yup";
import { Alert } from "react-native";


// Coerce anything (string, object, Error, unknown) into a safe display string.
// Alert.alert requires a string for `message` — passing an object crashes the
// native DialogModule with "Value for message cannot be cast from ReadableNativeMap to String".
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

//  Handle errors
const handleError = (error: any) => {
    let rawMessage: any = "";

    // Handle Yup validation errors
    if (error instanceof yup.ValidationError) {
        rawMessage = error.message;
    }
    // Handle RTK Query API errors (assuming they follow a standard structure)
    else if (error?.status) {
        rawMessage = error?.data?.error ?? error?.data?.message ?? "An unexpected error occurred.";
    }
    // Handle other generic errors
    else {
        rawMessage = error?.message ?? "An unexpected error occurred.";
    }

    const errorMessage = toMessageString(rawMessage) || "An unexpected error occurred.";

    // "Basket not found" is the backend's way of telling us the user has no
    // active basket (fresh account, basket cleared after a successful order,
    // etc.). It can leak through from several silent background fetches
    // (delivery method/date/summary, RTK auto-refetches when the Cart tag is
    // invalidated) and isn't actionable for the user. The cart screen already
    // renders its own empty-state design, so swallow this one globally
    // instead of surfacing an Alert.
    if (errorMessage.toLowerCase().trim() === "basket not found") {
        console.log("Suppressed expected 'Basket not found' error (empty basket).");
        return;
    }

    Alert.alert("Error", errorMessage);
    console.log("Error: ", errorMessage);
};

export default handleError;
