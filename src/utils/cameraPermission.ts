import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { ErrorCode } from "react-native-image-picker";

const requestCameraPermission = async (reason: string): Promise<boolean> => {
    if (Platform.OS !== "android") { return true; }
    try {
        const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
        if (await PermissionsAndroid.check(permission)) { return true; }

        const result = await PermissionsAndroid.request(permission, {
            title: "Camera Permission",
            message: reason,
            buttonNegative: "Cancel",
            buttonPositive: "OK",
        });
        if (result === PermissionsAndroid.RESULTS.GRANTED) { return true; }

        Alert.alert(
            "Camera access needed",
            result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
                ? "Camera access is turned off for Zeaper. Enable it in Settings to take a photo."
                : reason,
            result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
                ? [{ text: "Cancel", style: "cancel" }, { text: "Open Settings", onPress: () => Linking.openSettings() }]
                : [{ text: "OK" }],
        );
        return false;
    } catch {
        return false;
    }
};

export const alertImagePickerError = (errorCode: ErrorCode, errorMessage?: string) => {
    if (errorCode === "camera_unavailable") {
        Alert.alert("Camera unavailable", "This device has no camera available. Please choose a photo from your gallery instead.");
        return;
    }
    if (errorCode === "permission") {
        Alert.alert("Permission needed", "Zeaper doesn't have access to your camera or photos. Enable it in Settings and try again.", [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]);
        return;
    }
    Alert.alert("Unable to open", errorMessage || "Something went wrong. Please try again.");
};

export default requestCameraPermission;
