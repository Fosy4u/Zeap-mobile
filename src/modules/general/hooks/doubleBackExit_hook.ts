import { useCallback, useRef } from "react";
import { BackHandler, Platform, ToastAndroid } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const EXIT_WINDOW_MS = 2000;

const useDoubleBackExit = () => {
    const lastBackPressRef = useRef(0);

    useFocusEffect(
        useCallback(() => {
            if (Platform.OS !== "android") { return; }

            const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
                const now = Date.now();
                if (now - lastBackPressRef.current < EXIT_WINDOW_MS) {
                    BackHandler.exitApp();
                    return true;
                }
                lastBackPressRef.current = now;
                ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
                return true;
            });

            return () => {
                subscription.remove();
                lastBackPressRef.current = 0;
            };
        }, []),
    );
};

export default useDoubleBackExit;
