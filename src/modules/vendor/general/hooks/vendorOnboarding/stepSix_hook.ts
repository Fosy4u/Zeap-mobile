import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { IStepSixForm, stepSixSchema } from "../../validations/vendorOnboarding_validation";
import { setOnboardingFormData, setSelectedOnboardingStep } from "../../slices/vendorOnboardingState_slice";

const useStepSixHook = () => {
    const { formData } = useSelector((state: RootState) => state.vendorOnboardingState);
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IStepSixForm>({
        defaultValues: {
            website: formData.website,
            tiktok: formData.tiktok,
            instagram: formData.instagram,
            facebook: formData.facebook,
            twitter: formData.twitter,
            linkedin: formData.linkedin,
        },
        resolver: yupResolver(stepSixSchema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IStepSixForm> = (data) => {
        dispatch(setOnboardingFormData({
            website: (data.website ?? "").trim(),
            tiktok: (data.tiktok ?? "").trim(),
            instagram: (data.instagram ?? "").trim(),
            facebook: (data.facebook ?? "").trim(),
            twitter: (data.twitter ?? "").trim(),
            linkedin: (data.linkedin ?? "").trim(),
        }));
        dispatch(setSelectedOnboardingStep(7));
    };

    return { control, handleSubmit, errors, onSubmit, setValue };
};

export default useStepSixHook;
