import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuth, createUserWithEmailAndPassword, getIdToken, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import EncryptedStorage from "react-native-encrypted-storage";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { IRegisterUser, registerUserSchema } from "../validations/auths_validation";
import { clearPendingDestination, setShowSuccessModal } from "../slices/authState_slice";
import { setIsLoading, setLoadingMessage } from "../../general/slices/general_slice";
import { setUserData } from "../../profile/slices/profileState_slice";
import { useLazyGetUserByIdQuery, useMergeUserDataMutation, useRegisterGuestUserMutation } from "../apis/auths_api";
import { storeToken } from "../../../redux/services/authorizationHeader";
import handleError from "../../general/hooks/errorHandler_hook";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { RootState } from "../../../redux/store/store";

const STORAGE_KEYS = {
    FIREBASE_USER: 'fb_user',
    USER_ID: 'user_id',
    USER_DATA: 'user_data',
    GUEST_UID: 'guest_uid'
} as const;

const useRegisterHook = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const pendingDestination = useSelector((state: RootState) => state.authState.pendingDestination);
    const [registerGuestUser] = useRegisterGuestUserMutation();
    const [getUserById] = useLazyGetUserByIdQuery();
    const [mergeUserData] = useMergeUserDataMutation();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const authInstance = getAuth();

    // Return the user to wherever they were headed when the auth gate
    // bounced them to sign-up — falling back to the User Home Screen if
    // there's no stored destination.
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

    // The backend `/user/guest/create` endpoint always stores `isGuest: true` AND seeds
    // firstName/lastName as "Customer"/"Guest" placeholders, even when called for a
    // non-anonymous (Google) Firebase user. So we must prefer the Google profile over
    // the backend record for name fields, and stamp `isGuest: false` locally.
    //
    // Name resolution rules (in priority order):
    //   1. authUser.displayName  (strip bracketed content, split on whitespace)
    //   2. email local-part      (e.g. "tman44wiz@gmail.com" → "tman44wiz")
    //   3. literal "Customer" / "Guest" as last-resort fallback
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
            console.warn("[GoogleSignUp] clearGoogleSessionIfNeeded failed:", error);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        dispatch(setLoadingMessage("Signing up with Google..."));
        dispatch(setIsLoading(true));

        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Only clear the cached Google session when there is an active signed-in account.
            await clearGoogleSessionIfNeeded();

            // v13 returns { type: 'success' | 'cancelled', data }; it no longer throws on cancel.
            const signInResponse: any = await GoogleSignin.signIn();
            if (signInResponse?.type === "cancelled") return;

            const { idToken, accessToken } = await getGoogleTokens(signInResponse);
            if (!idToken) throw new Error("Failed to retrieve Google ID token.");

            const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
            const { user: authUser } = await signInWithCredential(authInstance, googleCredential);

            const uid = authUser.uid;
            const token = await getIdToken(authUser, true);

            const firebaseUserData = {
                uid: authUser.uid,
                email: authUser.email,
                displayName: authUser.displayName,
                photoURL: authUser.photoURL
            };
            await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(firebaseUserData));
            await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));
            await storeToken(token);

            // Non-anonymous Firebase users resolve via /userByUid. If the user is brand new
            // and not yet on the backend, create the record first, then re-fetch so we get
            // the fully-populated profile.
            let userData;
            try {
                userData = await getUserById(uid).unwrap();
            } catch (getUserError: any) {
                try {
                    await registerGuestUser({}).unwrap();
                } catch (createErr: any) {
                    console.warn("[GoogleSignUp] registerGuestUser failed, attempting refetch:", createErr?.status, createErr?.data);
                }
                userData = await getUserById(uid).unwrap();
            }

            if (!userData) throw new Error("Failed to load user profile.");

            // Merge any pre-existing guest session into the authenticated account
            const guestUID = await EncryptedStorage.getItem(STORAGE_KEYS.GUEST_UID);
            const parsedGuestUID = guestUID ? JSON.parse(guestUID) : null;

            if (parsedGuestUID && parsedGuestUID !== uid) {
                try {
                    const mergedUserData = await mergeUserData({ guestUid: parsedGuestUID }).unwrap();
                    if (mergedUserData) userData = mergedUserData;
                } catch {
                    // Merge failure shouldn't block sign-up — proceed with the fetched profile.
                }
                await EncryptedStorage.removeItem(STORAGE_KEYS.GUEST_UID);
            }

            // Always normalize after fetch + merge — the backend writes `isGuest: true`
            // for records created via /user/guest/create regardless of Firebase auth state.
            userData = normalizeGoogleUserData(userData, authUser);

            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
            console.log("[GoogleSignUp] USER DATA:", JSON.stringify(userData, null, 2));
            dispatch(setUserData(userData));

            // Either return to the user's intended destination, or fall
            // back to the User Home Screen.
            redirectAfterAuth();
        } catch (error: any) {
            const code = error?.code;
            if (code === statusCodes.SIGN_IN_CANCELLED || code === statusCodes.IN_PROGRESS) {
                return;
            }
            console.error("[GoogleSignUp] register failed:", code, error?.message, error);
            handleError(error);
        } finally {
            setIsGoogleLoading(false);
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    return { control, handleSubmit, onSubmit, handleGoogleSignUp, isGoogleLoading, errors };
};

export default useRegisterHook;
