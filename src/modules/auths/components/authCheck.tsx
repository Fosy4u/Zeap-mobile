import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';

const AuthCheck = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithAuthCheck = (props: P) => {
        const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
        const [currentUser, setCurrentUser] = useState<any>(null);
        const [isLoading, setIsLoading] = useState(true);

        const refreshUserToken = async (user: any) => {
            try {
                // Force token refresh
                await user.getIdToken(true);
                setCurrentUser(user);
                return true;
            } catch (error) {
                console.error('Token refresh failed:', error);
                return false;
            }
        };

        useEffect(() => {            
            const authInstance = getAuth();
            const unsubscribe = onAuthStateChanged(authInstance, async (user: any) => {
                // console.log("CURRENT USER AUTH CHECK (onAuthStateChanged): ", user);
                
                if (!user) {
                    // If no user is found, redirect to login
                    navigation.navigate("loginInfoScreen");
                } else if (user.isAnonymous) {
                    // If user is anonymous, redirect to login
                    navigation.navigate("loginInfoScreen");
                } else {
                    // For actual logged-in users, try to refresh the token
                    const refreshSuccess = await refreshUserToken(user);
                    
                    if (!refreshSuccess) {
                        // Only redirect to login if token refresh fails
                        navigation.navigate("loginInfoScreen");
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