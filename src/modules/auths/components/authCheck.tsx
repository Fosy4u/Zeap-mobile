import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { setPendingDestination } from '../slices/authState_slice';

const AuthCheck = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    LoadingComponent?: React.ComponentType,
) => {
    const WithAuthCheck = (props: P) => {
        const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
        const route = useRoute();
        const dispatch = useDispatch();
        const [isLoading, setIsLoading] = useState(true);

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
                    stashPendingDestinationAndRedirect();
                }
                setIsLoading(false);
            });

            return () => {
                unsubscribe();
            };
        }, [navigation]);

        if (isLoading) {
            return LoadingComponent ? <LoadingComponent /> : null;
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuthCheck;
};

export default AuthCheck;