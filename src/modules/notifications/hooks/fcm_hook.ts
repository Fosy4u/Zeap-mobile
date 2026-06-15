// fcm_hook.ts
import { AuthorizationStatus, getInitialNotification, getMessaging, getToken, onMessage, onNotificationOpenedApp, onTokenRefresh, requestPermission } from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { useRegisterFCMTokenMutation } from "../apis/notification_api";
import handleError from "../../general/hooks/errorHandler_hook";
import { PermissionsAndroid, Platform } from "react-native";
import PushNotification, { Importance } from "react-native-push-notification";
import handleNotificationNavigation from "../utils/notificationNavigation";

// One-time library setup. Must run before any localNotification() call:
//  • configure() registers the tap handler — without it, taps on local
//    notifications never reach our navigator.
//  • createChannel() registers the Android 8+ channel — Android silently
//    drops notifications whose channelId hasn't been created, which is why
//    foreground order notifications weren't appearing.
PushNotification.configure({
    onNotification: (notification: any) => {
        // Only handle user taps, not the silent delivery callback fired
        // when the notification is first shown.
        if (notification?.userInteraction) {
            handleNotificationNavigation(notification?.data ?? notification?.userInfo);
        }
    },
    requestPermissions: false,
});

PushNotification.createChannel(
    {
        channelId: "default-channel-id",
        channelName: "Default",
        channelDescription: "Order, payment, and account notifications",
        importance: Importance.HIGH,
        vibrate: true,
    },
    () => {},
);

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
            // console.log("FCM TOKEN::: ", fcmToken);

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
        const initialNotification = await getInitialNotification(messagingInstance);
        if (initialNotification) {
            handleNotificationNavigation(initialNotification.data);
        }

        // Handle notification open when app is in background
        onNotificationOpenedApp(messagingInstance, remoteMessage => {
            if (remoteMessage) {
                handleNotificationNavigation(remoteMessage.data as any);
            }
        });
    };

    useEffect(() => {
        // request permission and handle initial open
        handleRequestUserPermission();
        handleNotificationOpen();

        // Listen for foreground messages and show local notification
        const unsubscribeOnMessage = onMessage(messagingInstance, async remoteMessage => {
            // console.log("REMOTE NOTIFICATION::: ", remoteMessage);

            // Try to get image URL from notification payload
            const imageUrl =
                ((remoteMessage.notification as any)?.android?.imageUrl as string | undefined) ||
                ((remoteMessage.notification as any)?.imageUrl as string | undefined) ||
                (remoteMessage.data?.image as string | undefined);
            
            // Show a local notification
            PushNotification.localNotification({
                channelId: "default-channel-id",
                title: remoteMessage.notification?.title || "New Notification",
                message: remoteMessage.notification?.body || "You have a new message.",
                bigPictureUrl: imageUrl, // Android: show image in notification drawer
                largeIconUrl: imageUrl,
                userInfo: remoteMessage.data
            })
        })

        // Listen for token refresh and update backend
        const unsubscribeTokenRefresh = onTokenRefresh(messagingInstance, async (newToken) => {
            await handleRegisterFCMTokenWithAPI(newToken);
        });

        return () => {
            unsubscribeOnMessage();
            unsubscribeTokenRefresh();
        };
    }, []);
};

export default useFCMNotificationHook;
