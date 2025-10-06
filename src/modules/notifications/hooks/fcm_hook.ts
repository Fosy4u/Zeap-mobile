// fcm_hook.ts
import { AuthorizationStatus, getMessaging, getToken, onTokenRefresh, requestPermission } from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { useRegisterFCMTokenMutation } from "../apis/notification_api";
import handleError from "../../general/hooks/errorHandler_hook";
import { PermissionsAndroid, Platform } from "react-native";

const useFCMNotificationHook = () => {
    const [registerFCMToken] = useRegisterFCMTokenMutation();
    const messagingInstance = getMessaging();

    // Request user permission (STEP 1)
    const handleRequestUserPermission = async () => {
        try {
            let enabled = false
            if (Platform.OS === 'ios') {
                const authStatus = await requestPermission(messagingInstance);
                enabled =
                    authStatus === AuthorizationStatus.AUTHORIZED ||
                    authStatus === AuthorizationStatus.PROVISIONAL
            } else {
                const check = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: "Enable Notification",
                        message: "Get notified about order updates, special offers, and important account information. You can change this anytime in settings.",
                        buttonPositive: "Enable",
                        buttonNegative: "Not Now",
                    },
                )

                enabled = check !== PermissionsAndroid.RESULTS.DENIED
            }

            if (enabled) {
                await handleGetFCMToken();
            }
            
        } catch (error) {
            handleError(error);
        }
    };

    // Get Firebase Cloud Messaging (FCM) token (STEP 2)
    const handleGetFCMToken = async () => {
        try {
            const fcmToken = await getToken(messagingInstance);
            console.log("FCM TOKEN::: ", fcmToken);

            if (fcmToken) {
                await handleRegisterFCMTokenWithAPI(fcmToken);
            }
        } catch (error) {
            console.log("ERROR GETTING FCM TOKEN::: ", error);
        }
    };

    // Send the FCM token to the backend to save it for future notifications (STEP 3)
    const handleRegisterFCMTokenWithAPI = async (token: string) => {
        const requestData = {
            pushToken: token,
        };
        // console.log("FCM TOKEN REGISTER API CALL::: ", token);

        try {
            const tokenResponse = await registerFCMToken(requestData);
            // console.log("API TOKEN RESPONSE::: ", JSON.stringify(tokenResponse));
            
        } catch (error) {
            handleError(error);
        }
    };

    const handleNotificationOpen = async () => {
        // Check if app was opened from a notification
        const initialNotification = await messagingInstance.getInitialNotification();
        if (initialNotification) {
            // handleNavigation(initialNotification.data);
            console.log("INITIAL NOTIFICATION DATA::: ", initialNotification);
            
        }

        // Handle notification open when app is in background
        messagingInstance.onNotificationOpenedApp(remoteMessage => {
            if (remoteMessage) {
                // handleNavigation(remoteMessage.data);
                console.log("REMOTE MESSAGE DTA::: ", remoteMessage);
                
            }
        });
    };


    // Listen for token refresh and update backend
    const unsubscribe = onTokenRefresh(messagingInstance, async (newToken) => {
        console.log("FCM TOKEN REFRESH::: ", newToken);
        await handleRegisterFCMTokenWithAPI(newToken);
    });

    useEffect(() => {
        handleRequestUserPermission();
        handleNotificationOpen();
        // unsubscribe();
        // return unsubscribe; 
    }, []);
};

export default useFCMNotificationHook;
