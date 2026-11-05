import {clearSensitiveFiles} from '../../../utils/sensitiveFiles';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Alert} from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import {getAuth, signOut} from '@react-native-firebase/auth';
import {deleteToken, getMessaging} from '@react-native-firebase/messaging';
import {clearToken} from '../../../redux/services/authorizationHeader';
import {forgetSecureItem} from '../../../utils/secureStorage';
import {
  beginSessionEnd,
  finishSessionEnd,
} from '../../../redux/services/session';
import {securityEvent} from '../../../utils/securityLogger';
import PushNotification from 'react-native-push-notification';

const useLogoutHook = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const signOutUser = async () => {
    beginSessionEnd();
    try {
      await Promise.race([
        deleteToken(getMessaging()),
        new Promise(resolve => setTimeout(resolve, 5000)),
      ]).catch(() => securityEvent('notification_registration_failed'));
      PushNotification.cancelAllLocalNotifications();
      await signOut(getAuth());
      await clearSensitiveFiles();
      await Promise.all(
        ['fb_user', 'user_id', 'user_data', 'guest_uid'].map(forgetSecureItem),
      );
      await clearToken();
      finishSessionEnd();
      navigation.dispatch(
        CommonActions.reset({index: 0, routes: [{name: 'splashScreen'}]}),
      );
    } catch {
      securityEvent('logout_failed');
      Alert.alert(
        'Sign out incomplete',
        'Your session is locked. Please retry to finish signing out.',
        [
          {
            text: 'Retry',
            onPress: () => {
              void signOutUser();
            },
          },
        ],
        {cancelable: false},
      );
    }
  };
  return {
    signOutUser,
    removeUserData: () => forgetSecureItem('user_data'),
    removeToken: clearToken,
  };
};
export default useLogoutHook;
