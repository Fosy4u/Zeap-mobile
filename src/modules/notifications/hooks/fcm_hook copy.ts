// // fcm_hook.ts
// import messaging from "@react-native-firebase/messaging";
// import { useEffect } from "react";
// import { Alert } from "react-native";
// import { useRegisterFCMTokenMutation } from "../apis/notification_api";
// import handleError from "../../general/hooks/errorHandler_hook";
// import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
// import { NavigationContainerRefWithCurrent } from "@react-navigation/native";

// // 👇 Pass a navigation ref from your AppRoutes
// let navigationRef: NavigationContainerRefWithCurrent<any> | null = null;
// export const setNavigationRef = (ref: NavigationContainerRefWithCurrent<any>) => {
//   navigationRef = ref;
// };

// const useFCMNotificationHook = () => {
//   const [registerFCMToken] = useRegisterFCMTokenMutation();


//   // Create default Android notification channel (STEP 1)
//   const createDefaultChannel = async () => {
//     await notifee.createChannel({
//       id: "default",
//       name: "Default Channel",
//       importance: AndroidImportance.HIGH,
//     });
//   };

//   // Request user permission (STEP 2)
//   const handleRequestUserPermission = async () => {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log("NOTIFICATION AUTHORIZATION STATUS::: ", authStatus);
//       await handleGetFCMToken();
//     }
//   };

//   // Get Firebase Cloud Messaging (FCM) token (STEP 3)
//   const handleGetFCMToken = async () => {
//     try {
//       const fcmToken = await messaging().getToken();
//       console.log("FCM TOKEN::: ", fcmToken);

//       if (fcmToken) {
//         await handleRegisterFCMTokenWithAPI(fcmToken);
//       }
//     } catch (error) {
//       console.log("FCM TOKEN ERROR::: ", error);
//     }
//   };

//   // Handle Firebase Cloud Messaging (FCM) token refresh (STEP 3b)
//   const handleRefreshFCMToken = () => {
//     return messaging().onTokenRefresh(async (newToken) => {
//       handleRegisterFCMTokenWithAPI(newToken);
//     });
//   };

//   // Send the FCM token to the backend to save it for future notifications (STEP 4)
//   const handleRegisterFCMTokenWithAPI = async (token: string) => {
//     const requestData = {
//       pushToken: token,
//     };
//     // console.log("FCM TOKEN REGISTER API CALL::: ", token);

//     try {
//       await registerFCMToken(requestData);
//     } catch (error) {
//       handleError(error);
//     }
//   };

//   // Handle notifications when the app is opened from quit state or background (STEP 5a)
// //   const handleBackgroundNotifications = async () => {
// //     try {
// //       const initialNotification = await messaging().getInitialNotification();
// //       if (initialNotification) {
// //         console.log("INITIAL NOTIFICATION::: ", initialNotification);
// //         handleNotificationNavigation(initialNotification.data);
// //       }

// //       const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
// //         console.log("Notification caused app to open from background:", remoteMessage);
// //         handleNotificationNavigation(remoteMessage.data);
// //       });

// //       return unsubscribe;
// //     } catch (error) {
// //       handleError(error);
// //     }
// //   };

//   // Handle foreground notifications (STEP 5b)
// //   const onForegroundMessage = () => {
// //     const unsubscribe = messaging().onMessage(async (remoteMessage) => {
// //         console.log("RECEIVED FOREGROUND MESSAGE:: ", JSON.stringify(remoteMessage));

// //         await notifee.displayNotification({
// //             title: remoteMessage.notification?.title || "New Notification",
// //             body: remoteMessage.notification?.body || "You have a new message",
// //             android: {
// //                 channelId: "default",
// //                 importance: AndroidImportance.HIGH,
// //                 pressAction: { id: "default" },
// //             },
// //             data: remoteMessage.data, // 👈 keep payload for navigation
// //         });
// //     });
// //     return unsubscribe;
// //   };

//   // Handle Notifee tap events (works for foreground/background/quit)
// //   const handleNotifeeEvents = () => {
// //     return notifee.onForegroundEvent(({ type, detail }) => {
// //       if (type === EventType.PRESS) {
// //         console.log("User tapped notification:", detail.notification);
// //         handleNotificationNavigation(detail.notification?.data);
// //       }
// //     });
// //   };

//   // Navigate based on notification payload
// //   const handleNotificationNavigation = (data: any) => {
// //     if (!data || !navigationRef) return;

// //     // Example: assume payload has { screen: "Orders", orderId: "123" }
// //     const screen = data.screen;
// //     if (screen) {
// //       navigationRef.navigate(screen, data);
// //     }
// //   };

// //   useEffect(() => {
// //     let unsubscribers: Array<() => void> = [];

// //     const initializeNotifications = async () => {
// //       await createDefaultChannel();
// //       await handleRequestUserPermission();

// //       const backgroundUnsubscriber = await handleBackgroundNotifications();
// //       if (backgroundUnsubscriber) unsubscribers.push(backgroundUnsubscriber);

// //       unsubscribers.push(onForegroundMessage());
// //       unsubscribers.push(handleRefreshFCMToken());
// //       unsubscribers.push(handleNotifeeEvents());

// //       // Register background handler
// //       messaging().setBackgroundMessageHandler(async (remoteMessage) => {
// //         console.log("MESSAGE HANDLED IN THE BACKGROUND::: ", JSON.stringify(remoteMessage));
// //         await notifee.displayNotification({
// //           title: remoteMessage.notification?.title,
// //           body: remoteMessage.notification?.body,
// //           android: { channelId: "default", importance: AndroidImportance.HIGH },
// //           data: remoteMessage.data,
// //         });
// //       });
// //     };

// //     initializeNotifications();

// //     return () => {
// //       unsubscribers.forEach((unsub) => {
// //         if (typeof unsub === "function") unsub();
// //       });
// //     };
// //   }, []);

// useEffect(() => {
//     ;(() => {
//         handleRequestUserPermission();
//         handleGetFCMToken();
//     })()
//   }, []);
// };

// export default useFCMNotificationHook;
