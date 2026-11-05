import {getAuth, onAuthStateChanged} from '@react-native-firebase/auth';
import {
  captureSession,
  isCurrentSession,
  isSessionBlocked,
} from '../../../redux/services/session';
import {securityEvent} from '../../../utils/securityLogger';
import appStore from '../../../redux/store/store';
// fcm_hook.ts
import {
  deleteToken,
  AuthorizationStatus,
  getAPNSToken,
  getInitialNotification,
  getMessaging,
  getToken,
  isDeviceRegisteredForRemoteMessages,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store/store';
import {useRegisterFCMTokenMutation} from '../apis/notification_api';
import handleError from '../../general/hooks/errorHandler_hook';
import {PermissionsAndroid, Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import handleNotificationNavigation from '../utils/notificationNavigation';
import {isNotificationForUser} from '../utils/notificationRelevance';

PushNotification.configure({
  onNotification: (notification: any) => {
    if (notification?.userInteraction) {
      const data = notification?.data ?? notification?.userInfo;
      if (
        !isSessionBlocked() &&
        isNotificationForUser(data, appStore.getState().profileState.userData)
      )
        handleNotificationNavigation(data);
    }
  },
  requestPermissions: false,
});

PushNotification.createChannel(
  {
    channelId: 'default-channel-id',
    channelName: 'Default',
    channelDescription: 'Order, payment, and account notifications',
    importance: Importance.HIGH,
    vibrate: true,
  },
  () => {},
);

const useFCMNotificationHook = () => {
  const [registerFCMToken] = useRegisterFCMTokenMutation();
  const messagingInstance = getMessaging();
  const {userData} = useSelector((state: RootState) => state.profileState);

  const audienceRef = useRef(userData);
  audienceRef.current = userData;

  useEffect(() => {
    // Request user permission (STEP 1)
    const handleRequestUserPermission = async () => {
      try {
        let enabled = false;
        if (Platform.OS === 'ios') {
          const authStatus = await requestPermission(messagingInstance);
          enabled =
            authStatus === AuthorizationStatus.AUTHORIZED ||
            authStatus === AuthorizationStatus.PROVISIONAL;
        } else if (Number(Platform.Version) < 33) {
          enabled = true;
        } else {
          const check = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Enable Notification',
              message:
                'Get notified about order updates, special offers, and important account information. You can change this anytime in settings.',
              buttonPositive: 'Enable',
              buttonNegative: 'Not Now',
            },
          );

          enabled = check === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (enabled) {
          await handleGetFCMToken();
        }
      } catch (error) {
        handleError(error);
      }
    };

    const waitForAPNSToken = async (attempts = 10) => {
      for (let i = 0; i < attempts; i++) {
        if (await getAPNSToken(messagingInstance)) return true;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return false;
    };

    // Get Firebase Cloud Messaging (FCM) token (STEP 2)
    const handleGetFCMToken = async () => {
      try {
        if (
          Platform.OS === 'ios' &&
          !isDeviceRegisteredForRemoteMessages(messagingInstance)
        ) {
          await registerDeviceForRemoteMessages(messagingInstance);
        }

        if (Platform.OS === 'ios' && !(await waitForAPNSToken())) {
          return;
        }

        const fcmToken = await getToken(messagingInstance);
        // console.log("FCM TOKEN::: ", fcmToken);

        if (fcmToken) {
          await handleRegisterFCMTokenWithAPI(fcmToken);
        }
      } catch {
        securityEvent('notification_registration_failed');
      }
    };

    // Send the FCM token to the backend to save it for future notifications (STEP 3)
    const handleRegisterFCMTokenWithAPI = async (token: string) => {
      const session = captureSession();
      const user = getAuth().currentUser;
      if (!user || user.isAnonymous || !isCurrentSession(session)) return;
      const requestData = {
        pushToken: token,
      };
      // console.log("FCM TOKEN REGISTER API CALL::: ", token);

      try {
        await registerFCMToken(requestData).unwrap();
        // console.log("API TOKEN RESPONSE::: ", JSON.stringify(tokenResponse));
      } catch (error) {
        securityEvent('notification_registration_failed');
      }
    };

    const openForCurrentUser = (data: any) => {
      if (
        !isSessionBlocked() &&
        isNotificationForUser(data, audienceRef.current)
      )
        handleNotificationNavigation(data);
    };

    // request permission and handle initial open
    let active = true;
    let previousUid: string | null | undefined;
    let lifecycle = Promise.resolve();
    const unsubscribeAuth = onAuthStateChanged(getAuth(), user => {
      const uid = user?.uid ?? null;
      lifecycle = lifecycle
        .catch(() => {})
        .then(async () => {
          if (
            !active ||
            getAuth().currentUser?.uid !== user?.uid ||
            isSessionBlocked()
          )
            return;
          if (previousUid !== undefined && previousUid !== uid) {
            await deleteToken(messagingInstance);
            PushNotification.cancelAllLocalNotifications();
          }
          previousUid = uid;
          if (user && !user.isAnonymous) await handleRequestUserPermission();
        })
        .catch(() => securityEvent('notification_registration_failed'));
    });
    void getInitialNotification(messagingInstance).then(message => {
      if (active && message) openForCurrentUser(message.data);
    });
    const unsubscribeOpen = onNotificationOpenedApp(
      messagingInstance,
      message => openForCurrentUser(message.data),
    );

    // Listen for foreground messages and show local notification
    const unsubscribeOnMessage = onMessage(
      messagingInstance,
      async remoteMessage => {
        // console.log("REMOTE NOTIFICATION::: ", remoteMessage);

        if (
          isSessionBlocked() ||
          !isNotificationForUser(remoteMessage.data as any, audienceRef.current)
        ) {
          return;
        }

        // Show a local notification
        PushNotification.localNotification({
          channelId: 'default-channel-id',
          title: 'Zeaper',
          message: 'You have a new update. Open Zeaper to view it.',
          userInfo: remoteMessage.data,
        });
      },
    );

    // Listen for token refresh and update backend
    const unsubscribeTokenRefresh = onTokenRefresh(
      messagingInstance,
      async newToken => {
        await handleRegisterFCMTokenWithAPI(newToken);
      },
    );

    return () => {
      active = false;
      unsubscribeAuth();
      unsubscribeOpen();
      unsubscribeOnMessage();
      unsubscribeTokenRefresh();
    };
  }, [messagingInstance, registerFCMToken]);
};

export default useFCMNotificationHook;
