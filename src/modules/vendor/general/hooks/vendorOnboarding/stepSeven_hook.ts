import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { IStepSevenForm, stepSevenSchema } from "../../validations/vendorOnboarding_validation";
import { setOnboardingFormData, setSelectedOnboardingStep, setSellerPolicies } from "../../slices/vendorOnboardingState_slice";
import { useGetSellerPoliciesQuery } from "../../apis/general_api";

const useStepSevenHook = () => {
    const { formData, sellerPolicies } = useSelector((state: RootState) => state.vendorOnboardingState);
    const dispatch = useDispatch();

    // Fetched once when the step mounts. The slice mirror lets us re-render
    // from cache if the user navigates back and forth without re-hitting the
    // network on every Back/Next.
    const { data, isFetching } = useGetSellerPoliciesQuery();
    useEffect(() => {
        if (data) {
            dispatch(setSellerPolicies(data));
        }
    }, [data, dispatch]);

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IStepSevenForm>({
        defaultValues: {
            agreedToTerms: formData.agreedToTerms,
        },
        resolver: yupResolver(stepSevenSchema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IStepSevenForm> = (formValues) => {
        dispatch(setOnboardingFormData({ agreedToTerms: formValues.agreedToTerms }));
        dispatch(setSelectedOnboardingStep(8));
    };

    return {
        control,
        handleSubmit,
        errors,
        onSubmit,
        setValue,
        policies: sellerPolicies,
        isLoadingPolicies: isFetching && sellerPolicies.length === 0,
    };
};

export default useStepSevenHook;
