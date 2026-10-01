import { Alert, Platform, ToastAndroid } from "react-native";

/* Brief, non-blocking message. ToastAndroid exists only on Android, so iOS
   falls back to an alert — without it the message silently never appears there. */
const showToast = (message?: string) => {
    if (!message) { return; }

    if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.LONG);
        return;
    }
    Alert.alert("", message);
};

export default showToast;
