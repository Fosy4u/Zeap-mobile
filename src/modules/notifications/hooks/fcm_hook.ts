import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useRegisterFCMTokenMutation } from "../apis/notification_api";
import handleError from "../../general/hooks/errorHandler_hook";
const useFCMNotificationHook = () => {

    const [registerFCMToken] = useRegisterFCMTokenMutation();

    //  Request user permission (STEP 1)
    const handleRequestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled = (authStatus ===  messaging.AuthorizationStatus.AUTHORIZED) || (authStatus === messaging.AuthorizationStatus.PROVISIONAL);

        if (enabled) {
            console.log("NOTIFICATION AUTHORIZATION STATUS::: ", authStatus);
            await handleGetFCMToken();
        }
    };

    //  Get Firebase Cloud Messaging (FCM) token    (STEP 2)
    const handleGetFCMToken = async () => {
        try {
            const fcmToken = await messaging().getToken();
            console.log("FCM TOKEN::: ", fcmToken); 

            if (fcmToken) {
                await handleRegisterFCMTokenWithAPI(fcmToken);
            }
        } catch (error) {
            console.log("FCM TOKEN ERROR::: ", error);
        }
    };

    //  Handle Firebase Cloud Messaging (FCM) token refresh    (STEP 3)
    const handleRefreshFCMToken = () => {
        return messaging().onTokenRefresh(async (newToken) => {
            handleRegisterFCMTokenWithAPI(newToken)
        });
    };

    //  Send the FCM token to the backend to save it for future notifications   (STEP 4)
    const handleRegisterFCMTokenWithAPI =  async(token: string) => {
        const requestData = {
            pushToken: token
        };
        console.log("FCM TOKEN::: ", token);
        

        try {
            const tokenResponse = await registerFCMToken(requestData);
            // console.log("TOKEN REGISTER RESPONSE::: ", JSON.stringify(tokenResponse));
        } catch (error) {
            handleError(error);
        }
    };

    // Handle notifications when the app is opened from quit state or background
    const handleBackgroundNotifications = async () => {
        try {
            // Check if app was opened by a notification (from quit state)
            const initialNotification = await messaging().getInitialNotification();
            if (initialNotification) {
                console.log("INITIAL NOTIFICATION::: ", initialNotification);
                // Handle the initial notification here
                // You can navigate to specific screen or perform actions based on notification data
            }

            // Handle notifications when app is opened from background state
            const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
                console.log('Notification caused app to open from background:', remoteMessage);
                // Handle the notification here
                // You can navigate to specific screen or perform actions based on notification data
            });

            return unsubscribe;
        } catch (error) {
            handleError(error);
        }
    };
    // Handle background notifications (when app is in background but not killed)
    const handleRegisterBackgroundHandler = () => {
        // Note: setBackgroundMessageHandler should be called at the top level, not inside useEffect
        // It's better to call this in index.js before the app is registered
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log("MESSAGE HANDLED IN THE BACKGROUND::: ", JSON.stringify(remoteMessage));
            // Don't use Alert here as it won't work in background
            // Instead, handle the message silently or show a local notification
        });
    };


    //  Handle foreground notifications
    const onForegroundMessage = () => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            console.log("RECEIVED FOREGROUND MESSAGE:: ", JSON.stringify(remoteMessage));
            
            // Show custom in-app notification or alert
            Alert.alert(
                remoteMessage.notification?.title || "New Notification",
                remoteMessage.notification?.body || "You have a new message",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            // Handle notification tap if needed
                            console.log("Foreground notification acknowledged");
                        }
                    }
                ]
            );
        });
        return unsubscribe;
    };

    useEffect(() => {
        let unsubscribers: Array<() => void> = [];

        const initializeNotifications = async () => {
            // Initialize all notification handlers
            await handleRequestUserPermission();
            
            // Handle background/quit state notifications
            const backgroundUnsubscriber = await handleBackgroundNotifications();
            if (backgroundUnsubscriber) {
                unsubscribers.push(backgroundUnsubscriber);
            }

            // Handle foreground notifications
            const foregroundUnsubscriber = onForegroundMessage();
            unsubscribers.push(foregroundUnsubscriber);

            // Handle token refresh
            const tokenRefreshUnsubscriber = handleRefreshFCMToken();
            unsubscribers.push(tokenRefreshUnsubscriber);

            // Register background handler (should ideally be in index.js)
            handleRegisterBackgroundHandler();
        };

        initializeNotifications();

        // Cleanup all subscriptions on unmount
        return () => {
            unsubscribers.forEach(unsubscriber => {
                if (typeof unsubscriber === 'function') {
                    unsubscriber();
                }
            });
        };
    }, []);

    return {
        onForegroundMessage,
        handleGetFCMToken,
        handleRequestUserPermission,
    }
};

export default useFCMNotificationHook;