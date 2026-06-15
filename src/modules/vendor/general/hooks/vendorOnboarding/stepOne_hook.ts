import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { IStepOneForm, stepOneSchema } from "../../validations/vendorOnboarding_validation";
import { setOnboardingFormData, setSelectedOnboardingStep } from "../../slices/vendorOnboardingState_slice";

const useStepOneHook = () => {
    const { formData } = useSelector((state: RootState) => state.vendorOnboardingState);
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IStepOneForm>({
        defaultValues: {
            businessName: formData.businessName,
        },
        resolver: yupResolver(stepOneSchema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IStepOneForm> = (data) => {
        dispatch(setOnboardingFormData({ businessName: data.businessName.trim() }));
        dispatch(setSelectedOnboardingStep(2));
    };

    return { control, handleSubmit, errors, onSubmit, setValue };
};

export default useStepOneHook;
