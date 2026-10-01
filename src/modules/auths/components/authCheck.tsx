import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { setPendingDestination } from '../slices/authState_slice';

// `LoadingComponent` is shown for the brief moment while we resolve the auth
// state. Without it the HOC rendered `null` — a blank white screen. Screens
// that want branded loading (e.g. a content-shaped skeleton) pass one; others
// fall back to null as before.
const AuthCheck = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    LoadingComponent?: React.ComponentType,
) => {
    const WithAuthCheck = (props: P) => {
        const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
        const route = useRoute();
        const dispatch = useDispatch();
        const [isLoading, setIsLoading] = useState(true);

        // Stash the route the user was actually trying to reach so the
        // login/sign-up hook can navigate them back here after success.
        // Without this, every protected-screen visit would dead-end on
        // homeScreen and force the user to navigate by hand.
        const stashPendingDestinationAndRedirect = () => {
            dispatch(setPendingDestination({
                name: route.name,
                params: (route.params as Record<string, any> | undefined) ?? undefined,
            }));
            navigation.navigate("loginInfoScreen");
        };

        useEffect(() => {
            const authInstance = getAuth();
            const unsubscribe = onAuthStateChanged(authInstance, (user: any) => {
                if (!user || user.isAnonymous) {
                    // No Firebase user, or an anonymous (guest) session — bounce
                    // to login, remembering where they were headed.
                    stashPendingDestinationAndRedirect();
                }
                // Authenticated, non-anonymous user → allow through immediately.
                // We deliberately do NOT force-refresh the ID token here: that
                // round-trip (getIdToken(user, true)) blocked rendering for 2-3s
                // before the screen/skeleton even appeared. The per-request
                // AuthorizationHeader already mints a fresh token for every API
                // call, so this gate doesn't need to.
                setIsLoading(false);
            });

            return () => {
                unsubscribe();
            };
        }, [navigation]);

        if (isLoading) {
            // Render the screen's loading fallback (e.g. a content skeleton)
            // instead of a blank white screen during the token-refresh check.
            return LoadingComponent ? <LoadingComponent /> : null;
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuthCheck;
};

export default AuthCheck;