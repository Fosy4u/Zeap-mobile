import { useDispatch } from "react-redux";
import { useRegisterUserMutation } from "../apis/auths_api";
import { setShowSuccessModal } from "../slices/authState_slice";
import { SubmitHandler, useForm } from "react-hook-form";
import { IRegisterUser, registerUserSchema } from "../validations/auths_validation";
import { yupResolver } from "@hookform/resolvers/yup";
import CryptoJS from "react-native-crypto-js";
import EncryptedStorage from "react-native-encrypted-storage";

const useRegisterHook = () => {
    const dispatch = useDispatch();
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const { control, handleSubmit, formState: { errors } } = useForm<IRegisterUser>({
        defaultValues: {
            email: "",
            isVendor: false,
            password: "",
            confirmPassword: "" 
        },
        resolver: yupResolver(registerUserSchema)
    });    

    const onSubmit: SubmitHandler<IRegisterUser> = async (data) => {
        try {

            /**
             * Encrypt the password
             * 
             * @param password The password to be encrypted
             * @returns an encrypted password
             */
            const encryptPassword = (password: string) => {
                const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY || "";
                const encryptedText = CryptoJS.AES.encrypt(password, encryptionKey).toString();
                return encryptedText;
            };
    
            const requestData = {
                email: data.email,
                isVendor: data.isVendor,
                password: encryptPassword(data.password),
                confirmPassword: encryptPassword(data.confirmPassword)
            }
            console.log("REQUEST DATA::: ", requestData);

            const registerUserResponse = await registerUser(requestData).unwrap();
            await EncryptedStorage.removeItem("anonymousToken");
            console.log("RESPONSE::: ", registerUserResponse);
            dispatch(setShowSuccessModal(true));
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    return { control, handleSubmit, onSubmit, errors, isLoading };
};

export default useRegisterHook;