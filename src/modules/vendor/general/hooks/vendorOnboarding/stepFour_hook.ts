import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Country, State } from "country-state-city";
import { RootState } from "../../../../../redux/store/store";
import { IStepFourForm, stepFourSchema } from "../../validations/vendorOnboarding_validation";
import { setOnboardingFormData, setSelectedOnboardingStep } from "../../slices/vendorOnboardingState_slice";
import { IPickerOption } from "../../components/vendorOnboarding/onboardingPicker_modal";

const useStepFourHook = () => {
    const { formData } = useSelector((state: RootState) => state.vendorOnboardingState);
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<IStepFourForm>({
        defaultValues: {
            address: formData.address,
            country: formData.country,
            region: formData.region,
        },
        resolver: yupResolver(stepFourSchema),
        mode: "onChange",
    });

    // Mirrors the country-state-city pattern from editAccountDetails_hook —
    // countries are pulled from the static package, then the region list is
    // derived from the ISO code of whichever country the user picks.
    const countryOptions = useMemo<IPickerOption[]>(
        () => Country.getAllCountries().map((c) => ({
            label: `${ c.flag ?? "🏳" }  ${ c.name }`,
            value: c.name,
        })),
        [],
    );

    const selectedCountry = watch("country");

    const regionOptions = useMemo<IPickerOption[]>(() => {
        if (!selectedCountry) { return []; }
        const iso = Country.getAllCountries().find((c) => c.name === selectedCountry)?.isoCode;
        if (!iso) { return []; }
        return State.getStatesOfCountry(iso).map((s) => ({
            label: s.name,
            value: s.name,
        }));
    }, [selectedCountry]);

    const onSubmit: SubmitHandler<IStepFourForm> = (data) => {
        dispatch(setOnboardingFormData({
            address: data.address.trim(),
            country: data.country,
            region: data.region.trim(),
        }));
        dispatch(setSelectedOnboardingStep(5));
    };

    return {
        control,
        handleSubmit,
        errors,
        onSubmit,
        setValue,
        countryOptions,
        regionOptions,
        selectedCountry,
    };
};

export default useStepFourHook;
