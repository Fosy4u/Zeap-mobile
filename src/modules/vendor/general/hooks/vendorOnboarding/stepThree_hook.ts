import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { IStepThreeForm, stepThreeSchema } from "../../validations/vendorOnboarding_validation";
import { setOnboardingFormData, setSelectedOnboardingStep } from "../../slices/vendorOnboardingState_slice";
import { dialCodeForCurrency } from "../../../../../utils/currencyToPhoneCode";

const useStepThreeHook = () => {
    const { formData } = useSelector((state: RootState) => state.vendorOnboardingState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const { recommendedCurrency } = useSelector((state: RootState) => state.settingsState);
    const dispatch = useDispatch();

    // Default dial code tracks the user's currency setting (NGN → +234,
    // USD/CAD → +1, GBP → +44). Falls back to Nigeria if currency is unset.
    const currencyDialCode = dialCodeForCurrency(recommendedCurrency?.code);

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IStepThreeForm>({
        defaultValues: {
            // Prefill with the auth user's email — they can edit if their
            // business email differs. Falls back to whatever's already in the
            // onboarding draft (so reopening the step after Back keeps edits).
            businessEmail: formData.businessEmail || userData?.email || "",
            businessPhoneCode: formData.businessPhoneCode || currencyDialCode,
            businessPhone: formData.businessPhone,
        },
        resolver: yupResolver(stepThreeSchema),
        mode: "onChange",
    });

    // Sync the slice with the currency-derived default the first time we
    // render — otherwise the orchestrator's picker (which reads slice state)
    // would still show the stale "+234" until the user explicitly picks one.
    useEffect(() => {
        if (!formData.businessPhoneCode && currencyDialCode) {
            dispatch(setOnboardingFormData({ businessPhoneCode: currencyDialCode }));
            setValue("businessPhoneCode", currencyDialCode, { shouldValidate: false });
        }
    }, [currencyDialCode]);

    const onSubmit: SubmitHandler<IStepThreeForm> = (data) => {
        dispatch(setOnboardingFormData({
            businessEmail: data.businessEmail.trim(),
            businessPhoneCode: data.businessPhoneCode,
            businessPhone: data.businessPhone.trim(),
        }));
        dispatch(setSelectedOnboardingStep(4));
    };

    return { control, handleSubmit, errors, onSubmit, setValue };
};

export default useStepThreeHook;
