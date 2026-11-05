import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '../../../redux/store/store';
import {isSessionBlocked} from '../../../redux/services/session';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import {getAuth, onAuthStateChanged} from '@react-native-firebase/auth';
import {setPendingDestination} from '../slices/authState_slice';
import VendorAccessRequiredComponent, {
  AccessLoadingComponent,
} from './vendorAccessRequired_component';

const AuthCheck = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  LoadingComponent?: React.ComponentType,
  requiredRole?: 'vendor',
) => {
  const WithAuthCheck = (props: P) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const route = useRoute();
    const dispatch = useDispatch();
    const profile = useSelector(
      (state: RootState) => state.profileState.userData,
    );
    const isProfileLoaded =
      !!profile?.uid && profile.uid === getAuth().currentUser?.uid;
    const [status, setStatus] = useState<
      'checking' | 'authorized' | 'unauthorized'
    >('checking');

    const stashPendingDestinationAndRedirect = useCallback(() => {
      dispatch(
        setPendingDestination({
          name: route.name,
          params:
            (route.params as Record<string, any> | undefined) ?? undefined,
        }),
      );
      navigation.navigate('loginInfoScreen');
    }, [dispatch, navigation, route.name, route.params]);

    useEffect(() => {
      const authInstance = getAuth();
      const unsubscribe = onAuthStateChanged(authInstance, (user: any) => {
        const authorized = !!user && !user.isAnonymous;
        setStatus(authorized ? 'authorized' : 'unauthorized');
        if (!authorized) stashPendingDestinationAndRedirect();
      });

      return () => {
        unsubscribe();
      };
    }, [stashPendingDestinationAndRedirect]);

    const loadingView = LoadingComponent ? (
      <LoadingComponent />
    ) : requiredRole ? (
      <AccessLoadingComponent />
    ) : null;

    if (
      isSessionBlocked() ||
      status !== 'authorized' ||
      !getAuth().currentUser ||
      getAuth().currentUser?.isAnonymous
    ) {
      return loadingView;
    }

    if (requiredRole === 'vendor') {
      if (!isProfileLoaded) return loadingView;
      if (profile.isVendor !== true) return <VendorAccessRequiredComponent />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthCheck;
};

export default AuthCheck;
