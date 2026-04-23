import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuth, createUserWithEmailAndPassword, getIdToken, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import EncryptedStorage from "react-native-encrypted-storage";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { IRegisterUser, registerUserSchema } from "../validations/auths_validation";
import { setShowSuccessModal } from "../slices/authState_slice";
import { setIsLoading, setLoadingMessage } from "../../general/slices/general_slice";
import { setUserData } from "../../profile/slices/profileState_slice";
import { useRegisterGuestUserMutation } from "../apis/auths_api";
import { storeToken } from "../../../redux/services/authorizationHeader";
import handleError from "../../general/hooks/errorHandler_hook";
import RootNavigationStackModel from "../../../routes/model/routes_model";

const STORAGE_KEYS = {
    FIREBASE_USER: 'fb_user',
    USER_ID: 'user_id',
    USER_DATA: 'user_data',
    GUEST_UID: 'guest_uid'
} as const;

const useRegisterHook = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const [registerGuestUser] = useRegisterGuestUserMutation();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const authInstance = getAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<IRegisterUser>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        resolver: yupResolver(registerUserSchema)
    });

    // Shared: store Firebase auth data and create backend profile
    const handleStoreAuthData = async (user: any) => {
        const uid = user.uid;
        const token = await getIdToken(user, true);

        const firebaseUserData = { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
        await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(firebaseUserData));
        await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));
        await storeToken(token);

        const userData = await registerGuestUser({}).unwrap();
        return userData;
    };

    const onSubmit: SubmitHandler<IRegisterUser> = async (data) => {
        dispatch(setLoadingMessage("Creating account..."));
        dispatch(setIsLoading(true));

        try {
            const { user } = await createUserWithEmailAndPassword(authInstance, data.email, data.password);
            await handleStoreAuthData(user);

            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            dispatch(setShowSuccessModal(true));
        } catch (error: any) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        dispatch(setLoadingMessage("Signing up with Google..."));
        dispatch(setIsLoading(true));

        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn();
            const { idToken } = await GoogleSignin.getTokens();

            if (!idToken) throw new Error("Failed to retrieve Google ID token.");

            const googleCredential = GoogleAuthProvider.credential(idToken);
            const { user } = await signInWithCredential(authInstance, googleCredential);

            const userData = await handleStoreAuthData(user);

            if (userData) {
                await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
                dispatch(setUserData(userData));
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));

                const isVendor = userData.isVendor;
                if (isVendor) {
                    navigation.navigate("vendorHomeScreen", { screen: "Dashboard" });
                } else {
                    navigation.navigate("homeScreen", { screen: "Dashboard" });
                }
            }
        } catch (error: any) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            if (error.code !== statusCodes.SIGN_IN_CANCELLED && error.code !== statusCodes.IN_PROGRESS) {
                handleError(error);
            }
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return { control, handleSubmit, onSubmit, handleGoogleSignUp, isGoogleLoading, errors };
};

export default useRegisterHook;
