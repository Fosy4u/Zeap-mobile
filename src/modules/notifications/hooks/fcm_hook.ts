// fcm_hook.ts
import messaging, { AuthorizationStatus, getMessaging, getToken, onMessage, onTokenRefresh, requestPermission } from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { useRegisterFCMTokenMutation } from "../apis/notification_api";
import handleError from "../../general/hooks/errorHandler_hook";
import { PermissionsAndroid, Platform } from "react-native";
import PushNotification from "react-native-push-notification";
import navigate from "../../../routes/pushNavigation";

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

    const handleNotificationNavigation = (data: any) => {
        console.log("NAVIGATION DATA::: ", data);
        
        if (data?.notificationType === "order" && data?.orderId) {
            console.log("NAVIGATION DATA::: ", data);
            const userRole = data.roleType;
            console.log("USER ROLE::: ", userRole);

            if (userRole === "buyer") {
                navigate("orderDetailsScreen", {
                    from: "Notification Screen",
                    orderId: data.orderId,
                    itemNumber: data.itemNo ? parseInt(data.itemNo, 10) : undefined,
                });
            } else if (userRole === "vendor") {
                navigate("vendorOrderDetailsScreen", {
                    screen: "Orders",
                    from: "Notification Screen",
                    orderId: data.productOrder_id,
                    itemNumber: data.itemNo ? parseInt(data.itemNo, 10) : undefined,
                });
            }
            // navigate("ordersScreen");
        } else if (data?.notificationType === "voucher" && data?.code) {
            navigate("pointAndVoucherScreen", {
                from: "Notification Screen",
                code: data.code,
            });
        } else if (data?.notificationType === "shop" && data?.shopId) {
            navigate("vendorHomeScreen", {
                screen: "Dashboard",
                shopId: data.shopId,
            });
        } else if (data?.notificationType === "payments" && data?.reference) {
            navigate("paymentScreen");
        }
    };

    const handleNotificationOpen = async () => {
        // Case 1: When app is opened from a notification
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
            handleNotificationNavigation(initialNotification.data);
        }

        // Case 2: Handle notification when app is in background
        messaging().onNotificationOpenedApp(remoteMessage => {
            if (remoteMessage) {
                handleNotificationNavigation(remoteMessage.data);
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
