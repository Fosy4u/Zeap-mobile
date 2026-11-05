import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ILoginUser, loginUserSchema } from "../validations/auths_validation";
import { getAuth, signInWithEmailAndPassword, signInWithCredential, getIdToken, GoogleAuthProvider, signOut } from "@react-native-firebase/auth";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { RootState } from "../../../redux/store/store";
import { setUserData } from "../../profile/slices/profileState_slice";
import { setIsLoading as setGlobalIsLoading, setLoadingMessage } from "../../general/slices/general_slice";
import { clearPendingDestination } from "../slices/authState_slice";
import { useLazyGetUserByIdQuery, useMergeUserDataMutation, useRegisterGuestUserMutation } from "../apis/auths_api";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import handleError from "../../general/hooks/errorHandler_hook";
import EncryptedStorage from '../../../utils/sessionStorage';
import { storeToken } from "../../../redux/services/authorizationHeader";
import { forgetSecureItem } from "../../../utils/secureStorage";

const STORAGE_KEYS = {
    FIREBASE_USER: 'fb_user',
    USER_ID: 'user_id',
    USER_DATA: 'user_data',
    GUEST_UID: 'guest_uid'
} as const;

const useLoginHook = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const pendingDestination = useSelector((state: RootState) => state.authState.pendingDestination);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [getUserById] = useLazyGetUserByIdQuery();
    const [mergeUserData] = useMergeUserDataMutation();
    const [registerGuestUser] = useRegisterGuestUserMutation();

    const redirectAfterAuth = () => {
        if (pendingDestination) {
            navigation.reset({
                index: 0,
                routes: [{ name: pendingDestination.name as keyof RootNavigationStackModel, params: pendingDestination.params } as any],
            });
            dispatch(clearPendingDestination());
            return;
        }
        navigation.navigate("homeScreen", { screen: "Home" });
    };

    const authInstance = getAuth(); // ✅ Modular API

    const { control, handleSubmit, formState: { errors } } = useForm<ILoginUser>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: yupResolver(loginUserSchema)
    });

    const onSubmit: SubmitHandler<ILoginUser> = async (data) => {
        setIsLoading(true);

        const guestUID = await EncryptedStorage.getItem(STORAGE_KEYS.GUEST_UID).catch(() => null);
        let parsedGuestUID: string | null = null;
        try {
            parsedGuestUID = guestUID ? JSON.parse(guestUID) : null;
        } catch {
            parsedGuestUID = null;
        }

        let authUser;
        try {
            authUser = (await signInWithEmailAndPassword(authInstance, data.email, data.password)).user;
        } catch (error) {
            handleError(error);
            setIsLoading(false);
            return;
        }

        const uid = authUser.uid;

        try {
            const firebaseUserData = { uid, email: authUser.email, displayName: authUser.displayName, photoURL: authUser.photoURL };
            await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(firebaseUserData));
            await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));

            let userData = await getUserById(uid).unwrap();
            if (!userData || (userData.uid && userData.uid !== uid)) throw new Error("Failed to load user profile.");

            // Check if there's a guest account to merge
            if (parsedGuestUID && parsedGuestUID !== uid) {
                try {
                    const mergedUserData = await mergeUserData({ guestUid: parsedGuestUID }).unwrap();
                    if (mergedUserData && (!mergedUserData.uid || mergedUserData.uid === uid)) userData = mergedUserData;
                } catch (mergeError) {
                }
            }
            await forgetSecureItem(STORAGE_KEYS.GUEST_UID);

            userData = { ...userData, uid };
            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
            dispatch(setUserData(userData));

            redirectAfterAuth();
        } catch (error) {
            await signOut(authInstance).catch(() => {});
            handleError(new Error("We couldn't load your account. Please try logging in again."));
            navigation.reset({ index: 0, routes: [{ name: "splashScreen" }] });
        } finally {
            setIsLoading(false);
        }
    };

    const getGoogleTokens = async (signInResponse: any) => {
        let idToken: string | undefined =
            signInResponse?.data?.idToken ?? signInResponse?.idToken ?? signInResponse?.user?.idToken;
        let accessToken: string | undefined =
            signInResponse?.data?.accessToken ?? signInResponse?.accessToken ?? signInResponse?.user?.accessToken;

        if (!idToken || !accessToken) {
            const tokens = await GoogleSignin.getTokens();
            idToken = idToken ?? tokens?.idToken;
            accessToken = accessToken ?? tokens?.accessToken;
        }

        return { idToken, accessToken };
    };

    const parseGoogleName = (authUser: any): { firstName: string; lastName: string } => {
        const rawDisplayName: string = authUser?.displayName ?? "";
        const cleanedDisplayName = rawDisplayName.replace(/\s*\([^)]*\)\s*/g, " ").trim();

        if (cleanedDisplayName) {
            const parts = cleanedDisplayName.split(/\s+/).filter(Boolean);
            return {
                firstName: parts[0] || "Customer",
                lastName: parts.slice(1).join(" ") || "Guest",
            };
        }

        const email: string = authUser?.email ?? "";
        const localPart = email.split("@")[0]?.trim();
        if (localPart) {
            return { firstName: localPart, lastName: "" };
        }

        return { firstName: "Customer", lastName: "Guest" };
    };

    const normalizeGoogleUserData = (userData: any, authUser: any) => {
        if (!userData || !authUser) return userData;

        const displayName = authUser.displayName ?? userData.displayName ?? "";
        const { firstName, lastName } = parseGoogleName(authUser);

        return {
            ...userData,
            uid: authUser.uid,
            email: userData.email || authUser.email || "",
            displayName,
            firstName,
            lastName,
            photoURL: userData.photoURL || authUser.photoURL || "",
            isGuest: false,
        };
    };

    const clearGoogleSessionIfNeeded = async () => {
        try {
            const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
            if (hasPreviousSignIn) {
                await GoogleSignin.signOut();
            }
        } catch (error) {

        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        dispatch(setLoadingMessage("Signing in with Google..."));
        dispatch(setGlobalIsLoading(true));

        try {

            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            await clearGoogleSessionIfNeeded();

            const signInResponse: any = await GoogleSignin.signIn();

            if (signInResponse?.type === "cancelled") {

                return;
            }

            const { idToken, accessToken } = await getGoogleTokens(signInResponse);

            if (!idToken) throw new Error("Failed to retrieve Google ID token.");

            const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
            const { user: authUser } = await signInWithCredential(authInstance, googleCredential);

            const uid = authUser.uid;
            const token = await getIdToken(authUser, true);

            const firebaseUserData = { uid: authUser.uid, email: authUser.email, displayName: authUser.displayName, photoURL: authUser.photoURL };
            await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(firebaseUserData));
            await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));
            await storeToken(token);

            let userData;

            try {
                userData = await getUserById(uid).unwrap();

            } catch (getUserError: any) {

                try {
                    await registerGuestUser({}).unwrap();
                } catch (createErr: any) {

                }
                userData = await getUserById(uid).unwrap();

            }
            if (!userData) throw new Error("Failed to load user profile.");

            const guestUID = await EncryptedStorage.getItem(STORAGE_KEYS.GUEST_UID);
            const parsedGuestUID = guestUID ? JSON.parse(guestUID) : null;

            if (parsedGuestUID && parsedGuestUID !== uid) {

                try {
                    const mergedUserData = await mergeUserData({ guestUid: parsedGuestUID }).unwrap();
                    if (mergedUserData) userData = mergedUserData;
                } catch (mergeErr: any) {

                }
                await forgetSecureItem(STORAGE_KEYS.GUEST_UID);
            }

            userData = normalizeGoogleUserData(userData, authUser);

            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));


            dispatch(setUserData(userData));

            redirectAfterAuth();

        } catch (error: any) {
            const code = error?.code;
            if (code === statusCodes.SIGN_IN_CANCELLED || code === statusCodes.IN_PROGRESS) {

                return;
            }

            handleError(error);
        } finally {
            setIsGoogleLoading(false);
            dispatch(setGlobalIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    return {
        control, handleSubmit, onSubmit, handleGoogleSignIn, errors, isLoading, isGoogleLoading
    };
};

export default useLoginHook;