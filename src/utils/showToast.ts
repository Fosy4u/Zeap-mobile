import { Alert, Platform, ToastAndroid } from "react-native";

const showToast = (message?: string) => {
    if (!message) { return; }

    if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.LONG);
        return;
    }
    Alert.alert("", message);
};

export default showToast;
