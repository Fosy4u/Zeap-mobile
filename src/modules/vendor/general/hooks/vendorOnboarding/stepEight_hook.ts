import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { IStepEightForm, stepEightSchema } from "../../validations/vendorOnboarding_validation";
import { setOnboardingFormData, setSelectedOnboardingStep } from "../../slices/vendorOnboardingState_slice";

const useStepEightHook = () => {
    const { formData } = useSelector((state: RootState) => state.vendorOnboardingState);
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IStepEightForm>({
        defaultValues: {
            referralSource: formData.referralSource,
        },
        resolver: yupResolver(stepEightSchema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IStepEightForm> = (data) => {
        dispatch(setOnboardingFormData({ referralSource: data.referralSource }));
        dispatch(setSelectedOnboardingStep(9));
    };

    return { control, handleSubmit, errors, onSubmit, setValue };
};

export default useStepEightHook;
