import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EncryptedStorage from "react-native-encrypted-storage";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { getAuth, signInAnonymously } from "@react-native-firebase/auth";
import { useRegisterGuestUserMutation } from "../apis/auths_api";
import { useDispatch } from "react-redux";
import { setUserData } from "../../profile/slices/profileState_slice";
import { setIsLoading, setLoadingMessage } from "../../general/slices/general_slice";

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
            await EncryptedStorage.removeItem("fbUser");
            await EncryptedStorage.removeItem("userID");
            await EncryptedStorage.removeItem("token");
            await EncryptedStorage.removeItem("guestUID");
            await EncryptedStorage.removeItem("userData");
            dispatch(setUserData({}));

            // Sign in anonymously
            const anonymousUserData = await signInAnonymously(auth);
            // console.log("LOGOUT ANONYMOUS USER DATA::: ", anonymousUserData);

            if (anonymousUserData) {
                const uid = anonymousUserData.user.uid;

                // Save guest UID to secure storage
                await EncryptedStorage.setItem("guestUID", uid);

                // Register as a guest user
                const guestUserData = await registerGuestUser({}).unwrap();
                // console.log("LOGOUT GUEST USER DATA::: ", guestUserData);
                
                if (guestUserData) {
                    // Dispatch to Redux Store
                    dispatch(setIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setUserData(guestUserData!));
                    navigation.navigate("homeScreen", { screen: "Dashboard" });
                }
            }
        } catch (error) {
            console.log("Error signing out user:::", error);
        }
    };


    /**
     * To remove user data
     */
    const removeUserData = async () => {
        try {
            await EncryptedStorage.removeItem("userData");
        } catch (error) {
            console.log("Error removing user data:::", error);
        }
    };

    /**
     * To remove user token
     */
    const removeToken = async () => {
        try {
            await EncryptedStorage.removeItem("token");
        } catch (error) {
            console.log("Error removing token:::", error);
        }
    };

    return { signOutUser, removeUserData, removeToken };
};

export default useLogoutHook;