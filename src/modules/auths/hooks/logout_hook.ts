import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EncryptedStorage from "react-native-encrypted-storage";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { getAuth, signInAnonymously } from "@react-native-firebase/auth";
import { useRegisterGuestUserMutation } from "../apis/auths_api";
import { useDispatch } from "react-redux";
import { setUserData } from "../../profile/slices/profileState_slice";
import { setIsLoading, setLoadingMessage } from "../../general/slices/general_slice";
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
     * Sign out user
     */
    const signOutUser = async () => {
        dispatch(setLoadingMessage("Signing out..."));
        dispatch(setIsLoading(true));

        try {
            await auth.signOut();

            // Clear all stored auth data using the correct keys
            await Promise.all([
                clearToken(),
                EncryptedStorage.removeItem(STORAGE_KEYS.FIREBASE_USER),
                EncryptedStorage.removeItem(STORAGE_KEYS.USER_ID),
                EncryptedStorage.removeItem(STORAGE_KEYS.USER_DATA),
                EncryptedStorage.removeItem(STORAGE_KEYS.GUEST_UID),
            ]);

            dispatch(setUserData({}));

            // Sign in anonymously to restore guest session
            const anonymousUserData = await signInAnonymously(auth);

            if (anonymousUserData) {
                const uid = anonymousUserData.user.uid;

                await EncryptedStorage.setItem(STORAGE_KEYS.GUEST_UID, JSON.stringify(uid));

                const guestUserData = await registerGuestUser({}).unwrap();

                if (guestUserData) {
                    await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUserData));

                    dispatch(setIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setUserData(guestUserData));
                    navigation.navigate("homeScreen", { screen: "Dashboard" });
                }
            }
        } catch (error) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            console.log("Error signing out user:::", error);
        }
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
