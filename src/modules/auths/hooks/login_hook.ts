import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ILoginUser, loginUserSchema } from "../validations/auths_validation";
import { getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { setUserData } from "../../profile/slices/profileState_slice";
import { useLazyGetUserByIdQuery, useMergeUserDataMutation } from "../apis/auths_api";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import handleError from "../../general/hooks/errorHandler_hook";
import EncryptedStorage from 'react-native-encrypted-storage';
import { storeToken, clearToken } from "../../../redux/services/authorizationHeader";

const STORAGE_KEYS = {
    FIREBASE_USER: 'fb_user',
    USER_ID: 'user_id',
    USER_DATA: 'user_data',
    GUEST_UID: 'guest_uid'
} as const;

/**
 * The useLoginHook 
 * @returns control
 */
const useLoginHook = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [getUserById] = useLazyGetUserByIdQuery();
    const [mergeUserData] = useMergeUserDataMutation();

    /**
     * Get the Firebase Auth instance.
     * @returns The Auth instance
     */
    const authInstance = getAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<ILoginUser>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: yupResolver(loginUserSchema)
    });

    const onSubmit: SubmitHandler<ILoginUser> = async (data) => {
        setIsLoading(true);

        try {
            const responseData = await signInWithEmailAndPassword(authInstance, data.email, data.password);
            const authUser = responseData.user;
            
            
            const uid = authUser.uid;
            const token = await authUser.getIdToken();

            if (uid) {
                // Save user data to secure storage
                await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(authUser));
                await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));
                await storeToken(token);

                const userData = await getUserById(authUser.uid).unwrap();
                console.log("USER DATA::: ", userData);
                
                if (userData) {
                    // Save userData to secure storage
                    await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

                    // Check if there's a guest account to merge
                    const guestUID = await EncryptedStorage.getItem(STORAGE_KEYS.GUEST_UID);
                    const parsedGuestUID = guestUID ? JSON.parse(guestUID) : null;
                    
                    if (parsedGuestUID) {
                        // Merge the guest and the logged-in user
                        const mergedUserData = await mergeUserData({ guestUid: parsedGuestUID }).unwrap();

                        if (mergedUserData) {
                            // Update storage with merged user data
                            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mergedUserData));
                            
                            // Clear all stored data
                            await Promise.all([
                                clearToken(),
                                EncryptedStorage.removeItem(STORAGE_KEYS.FIREBASE_USER),
                                EncryptedStorage.removeItem(STORAGE_KEYS.USER_ID),
                                EncryptedStorage.removeItem(STORAGE_KEYS.GUEST_UID)
                            ]);
                            
                            // Dispatch merged user data to Redux Store
                            dispatch(setUserData(mergedUserData));

                            const isVendor = mergedUserData.isVendor;
                            if (isVendor) {
                                navigation.navigate("vendorHomeScreen", { screen: "Dashboard" });
                            } else {
                                navigation.navigate("homeScreen", { screen: "Dashboard" });
                            }
                        }
                    } else {
                        // No guest account to merge, proceed with normal login
                        dispatch(setUserData(userData));

                        const isVendor = userData.isVendor;
                        if (isVendor) {
                            navigation.navigate("vendorHomeScreen", { screen: "Dashboard" });
                        } else {
                            navigation.navigate("homeScreen", { screen: "Dashboard" });
                        }
                    }
                }
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle Google Sign-In
     * @returns The authenticated user data
     */
    const handleGoogleSignIn = async () => {
        setIsLoading(true);

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const token = await GoogleSignin.getTokens();
            
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // Handle sign in cancelled silently
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // Handle sign in in progress silently
            } else {
                // Handle other errors silently
            }
            throw error;
        }
    };

    return {
        control, handleSubmit, onSubmit, handleGoogleSignIn, errors, isLoading
    };
};

export default useLoginHook;