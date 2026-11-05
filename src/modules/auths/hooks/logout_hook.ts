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
import { forgetSecureItem } from "../../../utils/secureStorage";

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

    const signOutUser = async () => {
        dispatch(setLoadingMessage("Signing out..."));
        dispatch(setIsLoading(true));

        await Promise.all([
            clearToken(),
            forgetSecureItem(STORAGE_KEYS.FIREBASE_USER),
            forgetSecureItem(STORAGE_KEYS.USER_ID),
            forgetSecureItem(STORAGE_KEYS.USER_DATA),
            forgetSecureItem(STORAGE_KEYS.GUEST_UID),
        ]);

        dispatch(setUserData({ isGuest: true } as any));

        dispatch(clearPendingDestination());

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "homeScreen", state: { routes: [{ name: "Home" }] } }],
            })
        );

        dispatch(setIsLoading(false));
        dispatch(setLoadingMessage(""));

        void (async () => {
            try {
                await signOut(auth);
            } catch (err) {
                console.warn("[Logout] Firebase signOut failed (likely offline); local state already cleared.", err);
            }
            await reestablishGuestSessionInBackground();
        })();
    };

    const removeUserData = async () => {
        await forgetSecureItem(STORAGE_KEYS.USER_DATA);
    };

    const removeToken = async () => {
        await clearToken();
    };

    return { signOutUser, removeUserData, removeToken };
};

export default useLogoutHook;
