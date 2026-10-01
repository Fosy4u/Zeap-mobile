import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { sendPasswordResetCode } from "../apis/passwordReset_api";
import { forgotPasswordSchema, IForgotPassword } from "../validations/auths_validation";
import { setShowSuccessModal } from "../slices/authState_slice";
import { RootState } from "../../../redux/store/store";
import handleError from "../../general/hooks/errorHandler_hook";

const useForgotPasswordHook = () => {
    const dispatch = useDispatch();
    const { showSuccessModal } = useSelector((state: RootState) => state.authState);
    const [isLoading, setIsLoading] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    useEffect(() => {
        dispatch(setShowSuccessModal(false));
    }, [dispatch]);

    const { control, handleSubmit, formState: { errors } } = useForm<IForgotPassword>({
        defaultValues: { email: "" },
        resolver: yupResolver(forgotPasswordSchema),
    });

    const onSubmit: SubmitHandler<IForgotPassword> = async (data) => {
        setIsLoading(true);
        const email = data.email.trim().toLowerCase();

        try {
            await sendPasswordResetCode(email);

            setSubmittedEmail(email);
            dispatch(setShowSuccessModal(true));
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { control, handleSubmit, onSubmit, errors, isLoading, showSuccessModal, submittedEmail };
};

export default useForgotPasswordHook;
