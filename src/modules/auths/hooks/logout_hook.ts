import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EncryptedStorage from "react-native-encrypted-storage";
import RootNavigationStackModel from "../../../routes/model/routes_model";

const useLogoutHook = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
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

    /**
     * To clear all data
     */
    const clearStorage = async () => {
        try {
            await EncryptedStorage.clear();
            navigation.navigate("loginScreen");
        } catch (error) {
            console.log("Error clearing storage:::", error);
        }
    };

    return { removeUserData, removeToken, clearStorage };
};

export default useLogoutHook;