import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { getAuth, getIdToken, onAuthStateChanged } from '@react-native-firebase/auth';
import { setPendingDestination } from '../slices/authState_slice';

const AuthCheck = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithAuthCheck = (props: P) => {
        const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
        const route = useRoute();
        const dispatch = useDispatch();
        const [, setCurrentUser] = useState<any>(null);
        const [isLoading, setIsLoading] = useState(true);

        const refreshUserToken = async (user: any) => {
            try {
                // Force token refresh
                await getIdToken(user, true);
                setCurrentUser(user);
                return true;
            } catch (error) {
                console.error('Token refresh failed:', error);
                return false;
            }
        };

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
            const unsubscribe = onAuthStateChanged(authInstance, async (user: any) => {
                if (!user) {
                    // No Firebase user — guest hasn't even bootstrapped yet.
                    stashPendingDestinationAndRedirect();
                } else if (user.isAnonymous) {
                    // Anonymous (guest) user — bounce to login, but remember
                    // where they wanted to go.
                    stashPendingDestinationAndRedirect();
                } else {
                    // For actual logged-in users, try to refresh the token
                    const refreshSuccess = await refreshUserToken(user);

                    if (!refreshSuccess) {
                        // Only redirect to login if token refresh fails.
                        stashPendingDestinationAndRedirect();
                    }
                }
                setIsLoading(false);
            });

            return () => {
                unsubscribe();
            };
        }, [navigation]);

        if (isLoading) {
            return null; // or a loading spinner
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuthCheck;
};

export default AuthCheck;