import { useDispatch } from "react-redux";
import { setShowSuccessModal } from "../slices/authState_slice";
import { SubmitHandler, useForm } from "react-hook-form";
import { IRegisterUser, registerUserSchema } from "../validations/auths_validation";
import { yupResolver } from "@hookform/resolvers/yup";
import CryptoJS from "react-native-crypto-js";
import EncryptedStorage from "react-native-encrypted-storage";
import { setIsLoading, setLoadingMessage } from "../../general/slices/general_slice";
import handleError from "../../general/hooks/errorHandler_hook";

const useRegisterHook = () => {
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { errors } } = useForm<IRegisterUser>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "" 
        },
        resolver: yupResolver(registerUserSchema)
    });    

    const onSubmit: SubmitHandler<IRegisterUser> = async (data) => {
        dispatch(setLoadingMessage("Creating account..."));
        dispatch(setIsLoading(true));

        try {

            // Encrypt the password
            const encryptPassword = (password: string) => {
                const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY || "";
                const encryptedText = CryptoJS.AES.encrypt(password, encryptionKey).toString();
                return encryptedText;
            };
    
            const requestData = {
                email: data.email,
                password: encryptPassword(data.password),
                confirmPassword: encryptPassword(data.confirmPassword)
            }
            // console.log("REQUEST DATA::: ", requestData);

            // const registerUserResponse = await registerUser(requestData).unwrap();

            // if (registerUserResponse) {
            //     await EncryptedStorage.removeItem("anonymousToken");
            //     dispatch(setShowSuccessModal(true));
            //     dispatch(setIsLoading(false));
            //     dispatch(setLoadingMessage(""));
            //     console.log("RESPONSE::: ", registerUserResponse);
            // }
        } catch (error: any) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
            console.log("ERROR::: ", error);
            
        }
    };

    return { control, handleSubmit, onSubmit, errors };
};

export default useRegisterHook;