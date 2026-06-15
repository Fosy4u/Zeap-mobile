import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { IStepTwoForm, stepTwoSchema } from "../../validations/vendorOnboarding_validation";
import { setOnboardingFormData, setSelectedOnboardingStep } from "../../slices/vendorOnboardingState_slice";

const useStepTwoHook = () => {
    const { formData } = useSelector((state: RootState) => state.vendorOnboardingState);
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IStepTwoForm>({
        defaultValues: {
            isTailor: formData.isTailor as boolean,
            isShoeMaker: formData.isShoeMaker as boolean,
        },
        resolver: yupResolver(stepTwoSchema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IStepTwoForm> = (data) => {
        dispatch(setOnboardingFormData({
            isTailor: data.isTailor,
            isShoeMaker: data.isShoeMaker,
        }));
        dispatch(setSelectedOnboardingStep(3));
    };

    return { control, handleSubmit, errors, onSubmit, setValue };
};

export default useStepTwoHook;
