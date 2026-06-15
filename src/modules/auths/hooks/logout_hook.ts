import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EncryptedStorage from "react-native-encrypted-storage";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { getAuth, signInAnonymously, signOut } from "@react-native-firebase/auth";
import { useRegisterGuestUserMutation } from "../apis/auths_api";
import { useDispatch } from "react-redux";
import { setUserData } from "../../profile/slices/profileState_slice";
import { setIsLoading, setLoadingMessage } from "../../general/slices/general_slice";
import { clearPendingDestination } from "../slices/authState_slice";
import { clearToken } from "../../../redux/services/authorizationHeader";

const STORAGE_KEYS = {
    FIREBASE_USER: 'fb_user',
    USER_ID: 'user_id',
    USER_DATA: 'user_data',
    GUEST_UID: 'guest_uid'
} as const;

const useLogoutHook = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const [registerGuestUser] = useRegisterGuestUserMutation();
    const auth = getAuth();

    /**
     * Re-establish an anonymous Firebase session + backend guest record.
     * Runs in the background after logout so the app has a working token if
     * the user backs out of the login screen and resumes browsing.
     */
    const reestablishGuestSessionInBackground = async () => {
        try {
            const anonymousUserData = await signInAnonymously(auth);
            if (!anonymousUserData) return;

            const uid = anonymousUserData.user.uid;
            await EncryptedStorage.setItem(STORAGE_KEYS.GUEST_UID, JSON.stringify(uid));

            const guestUserData = await registerGuestUser({}).unwrap();
            if (guestUserData) {
                await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUserData));
                dispatch(setUserData(guestUserData));
            }
        } catch (err) {
            console.warn("[Logout] Background guest re-init failed; splash will retry on next app launch.", err);
        }
    };

    /**
     * Sign out user — fast path: clear local state and reset the navigation
     * stack to the home screen as a guest. Firebase signOut and the guest
     * re-init both run in the background and never block the UI.
     *
     * Network resilience: a `auth/network-request-failed` from Firebase must
     * not strand the user on the profile screen. We always tear down local
     * state and navigate, even if Firebase is unreachable — Firebase persists
     * the signed-out state to disk on next reachability.
     */
    const signOutUser = async () => {
        dispatch(setLoadingMessage("Signing out..."));
        dispatch(setIsLoading(true));

        try {
            // Clear all locally-stored auth data first — this is the critical
            // user-visible part of "logout" and must succeed even if the
            // network is down.
            await Promise.all([
                clearToken(),
                EncryptedStorage.removeItem(STORAGE_KEYS.FIREBASE_USER),
                EncryptedStorage.removeItem(STORAGE_KEYS.USER_ID),
                EncryptedStorage.removeItem(STORAGE_KEYS.USER_DATA),
                EncryptedStorage.removeItem(STORAGE_KEYS.GUEST_UID),
            ]);

            // Seed Redux with a minimal guest placeholder so the dashboard
            // immediately renders the "Guest" header + "Login" button instead
            // of a blank state while the background guest re-init runs. The
            // background flow will replace this with the full backend record.
            dispatch(setUserData({ isGuest: true } as any));

            // Wipe any pending post-login destination from a previous session
            // — the next login should start with no carryover from whatever
            // protected screen got the previous user bounced here.
            dispatch(clearPendingDestination());

            // Reset the navigation stack to homeScreen → Home tab. Using
            // `reset` (not `navigate`) so the user can't swipe back into the
            // authenticated profile/settings screens, and so the splash screen
            // sitting in the back stack can't re-fire its counter animation
            // effect that navigates to onboarding.
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "homeScreen", state: { routes: [{ name: "Home" }] } }],
                })
            );
        } catch (error) {
            console.error("[Logout] local cleanup failed:", error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }

        // Fire-and-forget — Firebase signOut may need the network to revoke
        // tokens server-side; if it fails, the local state is already cleared
        // so the user is logged out from the app's perspective.
        void (async () => {
            try {
                await signOut(auth);
            } catch (err) {
                console.warn("[Logout] Firebase signOut failed (likely offline); local state already cleared.", err);
            }
            await reestablishGuestSessionInBackground();
        })();
    };


    /**
     * To remove user data
     */
    const removeUserData = async () => {
        try {
            await EncryptedStorage.removeItem(STORAGE_KEYS.USER_DATA);
        } catch (error) {
            console.log("Error removing user data:::", error);
        }
    };

    /**
     * To remove user token
     */
    const removeToken = async () => {
        try {
            await clearToken();
        } catch (error) {
            console.log("Error removing token:::", error);
        }
    };

    return { signOutUser, removeUserData, removeToken };
};

export default useLogoutHook;
