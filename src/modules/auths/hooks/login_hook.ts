import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ILoginUser, loginUserSchema } from "../validations/auths_validation";
import { getAuth, getIdToken, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { setUserData } from "../../profile/slices/profileState_slice";
import EncryptedStorage from "react-native-encrypted-storage";
import { useLazyGetUserByIdQuery } from "../apis/auths_api";
import { getSavedAnonymousToken } from "../../../redux/services/authorizationHeader";

/**
 * The useLoginHook 
 * @returns control
 */
const useLoginHook = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [getUserById] = useLazyGetUserByIdQuery();

    /**
     * Get the Firebase Auth instance.
     * @returns The Auth instance
     */
    const auth = getAuth();

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
            const responseData = await signInWithEmailAndPassword(auth, data.email, data.password);
            const authUser = responseData.user;
            const token = await getIdToken(authUser);
            console.log("AUTH USER::: ", authUser.uid);
            // console.log("AUTH TOKEN::: ", token);
            

            if (authUser.uid) {
                const userData = await getUserById(authUser.uid).unwrap();

                // Save userData and token to secure storage
                await EncryptedStorage.setItem("userData", JSON.stringify(userData));
                await EncryptedStorage.setItem("token", JSON.stringify(token));

                // Dispatch to Redux Store
                dispatch(setUserData(userData));

                const isVendor = userData.isVendor
                if (isVendor) {
                    navigation.navigate("vendorHomeScreen");
                } else {
                    navigation.navigate("homeScreen");
                }
                // console.log("AUTH USER DATA::: ", userData);
                // console.log("TOKEN DATA::: ", token);
            }
        } catch (error) {
            console.log("ERROR::: ", error);
        } finally {
            setIsLoading(false);
        }
    };


    /**
     * To retrieve user data.
     * @returns The user data
     */
    const getUserData = async () => {
        try {
            const encodedUserData = await EncryptedStorage.getItem("userData");
            if (encodedUserData !== null) {
                const decodedUser = JSON.parse(encodedUserData);
                dispatch(setUserData(decodedUser));
                return decodedUser;
            }
        } catch (error) {
            console.log("Error retrieving user data::: ", error);
        };
    };

    return { control, handleSubmit, onSubmit, getUserData, errors, isLoading };
};

export default useLoginHook;