import {clearSensitiveFiles} from '../../../utils/sensitiveFiles';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useStore} from 'react-redux';
import {Alert} from 'react-native';
import {getAuth, signInAnonymously, signOut} from '@react-native-firebase/auth';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import {waitForAuthRestore} from '../../../redux/services/authorizationHeader';
import {
  captureSession,
  isCurrentSession,
} from '../../../redux/services/session';
import {
  readSecureJSON,
  writeSecureItem,
  forgetSecureItem,
} from '../../../utils/secureStorage';
import {
  useLazyGetUserByIdQuery,
  useRegisterGuestUserMutation,
} from '../../auths/apis/auths_api';
import {setUserData} from '../../profile/slices/profileState_slice';
import {clearPendingDestination} from '../../auths/slices/authState_slice';
import type {RootState} from '../../../redux/store/store';

const useSplashHook = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const [getUser] = useLazyGetUserByIdQuery();
  const [registerGuest] = useRegisterGuestUserMutation();
  useEffect(() => {
    let active = true;
    const pendingDestination = store.getState().authState.pendingDestination;
    if (pendingDestination) dispatch(clearPendingDestination());
    const loadSignedInProfile = async (uid: string) => {
      try {
        return await getUser(uid, false).unwrap();
      } catch (error: any) {
        if (error?.status === 401 || error?.status === 403) throw error;
        await new Promise(resolve => setTimeout(resolve, 1500));
        return await getUser(uid, false).unwrap();
      }
    };
    const bootstrap = async () => {
      try {
        await clearSensitiveFiles();
        let user = await waitForAuthRestore();
        if (!active) return;
        if (!user) user = (await signInAnonymously(getAuth())).user;
        const session = captureSession();
        if (user.isAnonymous)
          await writeSecureItem('guest_uid', JSON.stringify(user.uid));
        const cached = await readSecureJSON<any>('user_data');
        if (!active || !isCurrentSession(session)) return;
        const hasCachedProfile = cached?.uid === user.uid;
        if (hasCachedProfile) dispatch(setUserData(cached));
        else await forgetSecureItem('user_data');
        try {
          const profile = user.isAnonymous
            ? await registerGuest({}).unwrap()
            : await loadSignedInProfile(user.uid);
          if (!active || !isCurrentSession(session)) return;
          if (!profile || (profile.uid && profile.uid !== user.uid))
            throw new Error('Profile identity mismatch');
          const data = {...profile, uid: user.uid, isGuest: user.isAnonymous};
          await writeSecureItem('user_data', JSON.stringify(data));
          if (active && isCurrentSession(session)) dispatch(setUserData(data));
        } catch (error: any) {
          if (!isCurrentSession(session)) return;
          if (
            error?.status === 401 ||
            error?.status === 403 ||
            [
              'auth/user-disabled',
              'auth/user-token-expired',
              'auth/invalid-user-token',
              'auth/user-not-found',
            ].includes(error?.code)
          ) {
            dispatch({type: 'session/reset'});
            await forgetSecureItem('user_data');
            await signOut(getAuth());
            if (active) navigation.replace('loginInfoScreen');
            return;
          }
          if (user.isAnonymous && !hasCachedProfile) {
            dispatch(setUserData({uid: user.uid, isGuest: true} as any));
          } else if (!user.isAnonymous && !hasCachedProfile) {
            Alert.alert(
              "Couldn't finish signing in",
              'We couldn\'t load your account. Please check your connection and log in again.',
            );
            await signOut(getAuth());
            return;
          }
        }
        if (!active || !isCurrentSession(session)) return;
        const launched = await readSecureJSON<boolean>('has_launched');
        await writeSecureItem('has_launched', 'true');
        if (active && isCurrentSession(session) && pendingDestination && !user.isAnonymous) {
          navigation.reset({
            index: 1,
            routes: [
              {name: 'homeScreen', params: {screen: 'Home'}},
              {name: pendingDestination.name, params: pendingDestination.params} as any,
            ],
          });
          return;
        }
        if (active && isCurrentSession(session)) {
          navigation.replace(
            launched ? 'homeScreen' : 'onboardingOneScreen',
            launched ? {screen: 'Home'} : undefined,
          );
        }
      } catch {
        if (active) navigation.replace('loginInfoScreen');
      }
    };
    void bootstrap();
    return () => {
      active = false;
    };
  }, [dispatch, getUser, navigation, registerGuest, store]);
  return {};
};
export default useSplashHook;
