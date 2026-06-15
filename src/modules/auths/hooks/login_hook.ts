import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ILoginUser, loginUserSchema } from "../validations/auths_validation";
import { getAuth, signInWithEmailAndPassword, signInWithCredential, getIdToken, GoogleAuthProvider } from "@react-native-firebase/auth";
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
    const pendingDestination = useSelector((state: RootState) => state.authState.pendingDestination);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [getUserById] = useLazyGetUserByIdQuery();
    const [mergeUserData] = useMergeUserDataMutation();
    const [registerGuestUser] = useRegisterGuestUserMutation();

    // Send the freshly-authenticated user back to whatever screen the auth
    // gate intercepted, or fall back to the User Home Screen when there's
    // no recorded destination (explicit login from the header button, etc.).
    // `reset` so the back stack can't lead them into the login screen again.
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

    /**
     * Get the Firebase Auth instance.
     * @returns The Auth instance
     */
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

        try {
            const responseData = await signInWithEmailAndPassword(authInstance, data.email, data.password);
            const authUser = responseData.user;
            
            
            const uid = authUser.uid;
            const token = await getIdToken(authUser, true); // ✅ Modular getIdToken

            if (uid) {
                const firebaseUserData = { uid: authUser.uid, email: authUser.email, displayName: authUser.displayName, photoURL: authUser.photoURL };
                await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(firebaseUserData));
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

                            // Either return to the screen the user was trying
                            // to reach when the auth gate caught them, or fall
                            // back to the User Home Screen.
                            redirectAfterAuth();
                        }
                    } else {
                        // No guest account to merge, proceed with normal login
                        dispatch(setUserData(userData));

                        // Either return to the user's intended destination, or
                        // fall back to the User Home Screen.
                        redirectAfterAuth();
                    }
                }
            }
        } catch (error) {
            handleError(error);
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
            console.warn("[GoogleSignIn] clearGoogleSessionIfNeeded failed:", error);
        }
    };

    /**
     * Handle Google Sign-In
     */
    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        dispatch(setLoadingMessage("Signing in with Google..."));
        dispatch(setGlobalIsLoading(true));

        try {
            console.log("[GoogleSignIn] Starting Google Sign-In flow...");

            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            console.log("[GoogleSignIn] Play services available");

            // Only clear the cached Google session when there is an active signed-in account.
            await clearGoogleSessionIfNeeded();
            console.log("[GoogleSignIn] Cleared cached Google session if needed");

            // v13 returns { type: 'success' | 'cancelled', data }; it no longer throws on cancel.
            const signInResponse: any = await GoogleSignin.signIn();
            console.log("[GoogleSignIn] SignIn response:", JSON.stringify(signInResponse));

            if (signInResponse?.type === "cancelled") {
                console.log("[GoogleSignIn] User cancelled sign-in");
                return;
            }

            const { idToken, accessToken } = await getGoogleTokens(signInResponse);
            console.log("[GoogleSignIn] Got tokens, idToken exists:", !!idToken);
            if (!idToken) throw new Error("Failed to retrieve Google ID token.");

            console.log("[GoogleSignIn] Creating Firebase credential...");
            const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
            const { user: authUser } = await signInWithCredential(authInstance, googleCredential);
            console.log("[GoogleSignIn] Firebase auth successful, uid:", authUser.uid);

            const uid = authUser.uid;
            const token = await getIdToken(authUser, true);
            console.log("[GoogleSignIn] Got Firebase ID token");

            const firebaseUserData = { uid: authUser.uid, email: authUser.email, displayName: authUser.displayName, photoURL: authUser.photoURL };
            await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(firebaseUserData));
            await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));
            await storeToken(token);
            console.log("[GoogleSignIn] Stored Firebase auth data");

            // Fetch existing profile; if backend has no record yet (first Google sign-in),
            // create one then re-fetch.
            let userData;
            console.log("[GoogleSignIn] Fetching user profile from backend, uid:", uid);
            try {
                userData = await getUserById(uid).unwrap();
                console.log("[GoogleSignIn] Got user data from API");
            } catch (getUserError: any) {
                console.log("[GoogleSignIn] getUserById failed, creating user record...", getUserError?.status);
                try {
                    await registerGuestUser({}).unwrap();
                } catch (createErr: any) {
                    // Backend may return 409 (already exists) on a transient state — treat as recoverable.
                    console.warn("[GoogleSignIn] registerGuestUser failed, attempting refetch anyway:", createErr?.status, createErr?.data);
                }
                userData = await getUserById(uid).unwrap();
                console.log("[GoogleSignIn] Got user data after creation");
            }
            if (!userData) throw new Error("Failed to load user profile.");

            // Merge any pre-existing guest session into the authenticated account
            const guestUID = await EncryptedStorage.getItem(STORAGE_KEYS.GUEST_UID);
            const parsedGuestUID = guestUID ? JSON.parse(guestUID) : null;
            console.log("[GoogleSignIn] Guest UID from storage:", parsedGuestUID);

            if (parsedGuestUID && parsedGuestUID !== uid) {
                console.log("[GoogleSignIn] Merging guest data...");
                try {
                    const mergedUserData = await mergeUserData({ guestUid: parsedGuestUID }).unwrap();
                    if (mergedUserData) userData = mergedUserData;
                } catch (mergeErr: any) {
                    console.warn("[GoogleSignIn] Guest merge failed; continuing with fetched profile.", mergeErr);
                }
                await EncryptedStorage.removeItem(STORAGE_KEYS.GUEST_UID);
            }

            // ALWAYS normalize after fetch + merge — backend writes `isGuest: true` for
            // records created via /user/guest/create, even for authenticated users.
            // Firebase auth state is the source of truth here.
            userData = normalizeGoogleUserData(userData, authUser);

            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
            console.log("[GoogleSignIn] Stored user data in encrypted storage");

            console.log("[GoogleSignIn] USER DATA:", JSON.stringify(userData, null, 2));
            console.log("[GoogleSignIn] Dispatching user data to Redux, isGuest:", userData.isGuest);
            dispatch(setUserData(userData));

            console.log("[GoogleSignIn] Routing to pending destination or User Home Screen");
            redirectAfterAuth();
            console.log("[GoogleSignIn] Login flow completed successfully!");
        } catch (error: any) {
            const code = error?.code;
            if (code === statusCodes.SIGN_IN_CANCELLED || code === statusCodes.IN_PROGRESS) {
                console.log("[GoogleSignIn] Sign-in cancelled or in progress");
                return;
            }
            console.error("[GoogleSignIn] login failed:", code, error?.message, error);
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