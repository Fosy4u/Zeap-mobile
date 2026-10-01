import * as yup from "yup";
import { Alert } from "react-native";


/* Coerce anything into a safe display string — Alert.alert crashes the native
   DialogModule when `message` isn't one. */
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

    /* "Basket not found" just means an empty basket, it leaks out of silent
       background fetches, and the cart screen has its own empty state. */
    if (errorMessage.toLowerCase().trim() === "basket not found") {
        console.log("Suppressed expected 'Basket not found' error (empty basket).");
        return;
    }

    /* Same for "shop not found" — the vendor module now explains a missing shop
       in its own modal, so an unactionable dialog on top of it is noise. */
    if (errorMessage.toLowerCase().trim() === "shop not found") {
        console.log("Suppressed expected 'Shop not found' error (no shop on this account).");
        return;
    }

    Alert.alert("Error", errorMessage);
    console.log("Error: ", errorMessage);
};

export default handleError;
