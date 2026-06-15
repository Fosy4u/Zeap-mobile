import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { IStepFiveForm, stepFiveSchema } from "../../validations/vendorOnboarding_validation";
import { setOnboardingFormData, setSelectedOnboardingStep } from "../../slices/vendorOnboardingState_slice";

const useStepFiveHook = () => {
    const { formData } = useSelector((state: RootState) => state.vendorOnboardingState);
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IStepFiveForm>({
        defaultValues: {
            bankName: formData.bankName,
            accountName: formData.accountName,
            accountNumber: formData.accountNumber,
            confirmAccountNumber: formData.accountNumber,
        },
        resolver: yupResolver(stepFiveSchema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IStepFiveForm> = (data) => {
        dispatch(setOnboardingFormData({
            bankName: data.bankName.trim(),
            accountName: data.accountName.trim(),
            accountNumber: data.accountNumber.trim(),
        }));
        dispatch(setSelectedOnboardingStep(6));
    };

    return { control, handleSubmit, errors, onSubmit, setValue };
};

export default useStepFiveHook;
