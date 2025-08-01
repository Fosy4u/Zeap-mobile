import * as yup from "yup";
import { Alert } from "react-native";


//  Handle errors
const handleError = (error: any) => {
    let errorMessage = "";

    // Handle Yup validation errors
    if (error instanceof yup.ValidationError) {
        errorMessage = error.message;
    }
    // Handle RTK Query API errors (assuming they follow a standard structure)
    else if (error?.status) {
        errorMessage = error["data"]["error"] || error.data?.error || "An unexpected error occurred.";
    }
    // Handle other generic errors
    else {
        errorMessage = error.message || "An unexpected error occurred.";
    }

    Alert.alert("Error", errorMessage);
    console.log("Error: ", errorMessage);
};

export default handleError;
