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

    const currencyDialCode = dialCodeForCurrency(recommendedCurrency?.code);

    const { control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<IStepThreeForm>({
        defaultValues: {
            businessEmail: formData.businessEmail || userData?.email || "",
            businessPhoneCode: formData.businessPhoneCode || currencyDialCode,
            businessPhone: formData.businessPhone,
        },
        resolver: yupResolver(stepThreeSchema),
        mode: "onChange",
    });

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

    return { control, handleSubmit, errors, isValid, onSubmit, setValue };
};

export default useStepThreeHook;
