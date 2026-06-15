import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Country, State, City } from "country-state-city";

import editAccountDetailsSchema, { IEditAccountDetailsSchema } from "../validations/editAccountDetails_validation";
import { RootState } from "../../../redux/store/store";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import {
    setIsLoading,
    setLoadingMessage,
    setSelectedCountry,
    setSelectedPhoneCode,
    setShowPhoneCodeModal,
    setUserData,
} from "../slices/profileState_slice";
import handleError from "../../general/hooks/errorHandler_hook";
import { useUpdateUserDetailsMutation } from "../apis/profile_api";
import IEmailUpdate from "../models/emailUpdate_model";
import ICurrencyUpdate from "../models/currencyUpdate_model";
import { phoneCodeForCurrency } from "../../../utils/currencyToPhoneCode";

const useEditAccountDetailsHook = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const {
        userData,
        selectedCountry,
        selectedPhoneCode,
        showPhoneCodeModal,
        acceptMarketing,
        heightUnitOptions,
        weightUnitOptions,
        complexionOptions,
        shoeSizeOptions,
        bestOutfitOptions,
        bestColorOptions,
        // Loading flags driven by saveAccountDetails / handleUpdatePreferredCurrency
        // — the screen renders the AppLoader off these so the user sees feedback
        //   while the API call is in flight.
        isLoading,
        loadingMessage,
    } = useSelector((state: RootState) => state.profileState);

    const [updateUserDetails] = useUpdateUserDetailsMutation();

    // Auth-driven flag — the seller/vendor split now reads from the live user record
    // instead of a hardcoded local toggle. When the user record changes (e.g. after
    // a successful update), this re-derives automatically.
    const isVendor = !!userData?.isVendor;

    // Default the phone picker to the country tied to the user's currency
    // (NGN → +234, USD/CAD → +1, GBP → +44). Only nudges the value when the
    // selectedPhoneCode is still the slice's hardcoded Nigeria default — if
    // the user has explicitly picked something else, we leave it alone.
    const { recommendedCurrency } = useSelector((state: RootState) => state.settingsState);
    useEffect(() => {
        const currencyCode = recommendedCurrency?.code;
        if (!currencyCode) { return; }
        const target = phoneCodeForCurrency(currencyCode);
        const isUntouched =
            selectedPhoneCode?.dial_code === "+234" && selectedPhoneCode?.code === "NG";
        if (isUntouched && target.dial_code !== selectedPhoneCode?.dial_code) {
            dispatch(setSelectedPhoneCode(target));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recommendedCurrency?.code]);

    // ---- Form ----
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IEditAccountDetailsSchema>({
        defaultValues: {
            firstName: userData?.firstName! || "",
            lastName: userData?.lastName! || "",
            phoneNumber: userData?.phoneNumber! || "",
            country: selectedCountry || "",
            email: userData?.email! || "",
        },
        resolver: yupResolver(editAccountDetailsSchema),
    });

    // ---- Local UI state (moved out of the screen) ----
    const [selected, setSelected] = useState("");
    const [selectedHeightUnit, setSelectedHeightUnit] = useState("Inches");
    const [selectedWeightUnit, setSelectedWeightUnit] = useState("Kilogram");
    const [selectedShoeSize, setSelectedShoeSize] = useState("");
    const [selectedBestOutfit, setSelectedBestOutfit] = useState("");
    const [selectedBestColor, setSelectedBestColor] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedStateIso, setSelectedStateIso] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    // ---- Country / state / city cascade ----
    // Country ISO comes from selectedPhoneCode.code, which handleCountrySelected keeps
    // in sync with selectedCountry (display name) so the rest of the app sees both.
    const countryIso = selectedPhoneCode?.code || "";
    const isCountryChosen = !!selectedCountry;

    const countryOptions = useMemo(
        () => Country.getAllCountries().map((c) => ({ key: c.isoCode, value: c.name })),
        [],
    );

    const stateOptions = useMemo(() => {
        if (!isCountryChosen || !countryIso) return [] as { key: string; value: string }[];
        return State.getStatesOfCountry(countryIso).map((s) => ({ key: s.isoCode, value: s.name }));
    }, [countryIso, isCountryChosen]);

    const cityOptions = useMemo(() => {
        if (!isCountryChosen || !countryIso || !selectedStateIso) return [] as { key: string; value: string }[];
        return City.getCitiesOfState(countryIso, selectedStateIso).map((c) => ({ key: c.name, value: c.name }));
    }, [countryIso, selectedStateIso, isCountryChosen]);

    // Reset state + city when the country changes; reset city when state changes.
    useEffect(() => {
        setSelectedStateIso("");
        setSelectedCity("");
    }, [countryIso]);
    useEffect(() => {
        setSelectedCity("");
    }, [selectedStateIso]);

    // Picking a country updates both Redux fields the rest of the app depends on:
    // selectedCountry (display name) and selectedPhoneCode (used by the phone-prefix
    // and as the ISO source for the State/City cascade).
    const handleCountrySelected = (isoCode: string) => {
        const country = Country.getCountryByCode(isoCode);
        if (!country) return;

        const dialCode = country.phonecode
            ? (country.phonecode.startsWith("+") ? country.phonecode : `+${country.phonecode}`)
            : "";

        dispatch(setSelectedCountry(country.name));
        dispatch(setSelectedPhoneCode({
            name: country.name,
            dial_code: dialCode,
            code: country.isoCode,
            emoji: country.flag || "",
        }));
        setCountryValue(country.name);
    };

    // Used by the country modal flow to push the chosen value into the form.
    const setCountryValue = (country: string) => {
        setValue("country", country, { shouldValidate: true, shouldDirty: true });
    };

    // ---- Submit ----
    // Pure save: persists the email/marketing update and returns the new user, or
    // null on failure. No navigation / no modal — those are the screen's concern.
    // Other consumers (e.g. checkout) reuse this without inheriting any post-save UX.
    const saveAccountDetails = async (data: IEditAccountDetailsSchema): Promise<any | null> => {
        dispatch(setLoadingMessage("Updating account details..."));
        dispatch(setIsLoading(true));

        const requestData: IEmailUpdate = {
            _id: userData?._id!,
            email: data.email!,
            acceptMarketing,
        };

        try {
            const updatedUserData = await updateUserDetails(requestData).unwrap();
            if (updatedUserData) {
                dispatch(setUserData(updatedUserData));
                return updatedUserData;
            }
            return null;
        } catch (error) {
            handleError(error);
            return null;
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Submit handler used by checkout and other reuse sites — pure save, no UX.
    const onSubmit: SubmitHandler<IEditAccountDetailsSchema> = async (data) => {
        await saveAccountDetails(data);
    };

    // Edit-Account-Details screen submit — save, then branch on isVendor:
    //   - Vendor     → navigate to shopSetupScreen (the next step in setup).
    //   - Non-vendor → show the success modal acknowledging the update.
    const handleProceed = handleSubmit(async (data) => {
        const updated = await saveAccountDetails(data);
        if (!updated) return;

        if (isVendor) {
            navigation.navigate("shopSetupScreen");
        } else {
            setShowSuccessModal(true);
        }
    });

    // ---- Other ----
    const handleUpdatePreferredCurrency = async (currency: string) => {
        dispatch(setLoadingMessage("Updating preferred currency..."));
        dispatch(setIsLoading(true));

        const requestData: ICurrencyUpdate = {
            _id: userData?._id!,
            prefferedCurrency: currency,
        };

        try {
            const updatedUserDataResponse = await updateUserDetails(requestData).unwrap();
            if (updatedUserDataResponse) {
                dispatch(setUserData(updatedUserDataResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Wrapper so the screen doesn't need to import the slice action directly.
    const openPhoneCodeModal = () => dispatch(setShowPhoneCodeModal(true));

    return {
        // form
        control, handleSubmit, errors,

        // redux-derived data the screen renders
        userData,
        selectedCountry,
        selectedPhoneCode,
        showPhoneCodeModal,
        heightUnitOptions,
        weightUnitOptions,
        complexionOptions,
        shoeSizeOptions,
        bestOutfitOptions,
        bestColorOptions,
        isLoading,
        loadingMessage,
        openPhoneCodeModal,

        // local UI state
        selected, setSelected,
        selectedHeightUnit, setSelectedHeightUnit,
        selectedWeightUnit, setSelectedWeightUnit,
        selectedShoeSize, setSelectedShoeSize,
        selectedBestOutfit, setSelectedBestOutfit,
        selectedBestColor, setSelectedBestColor,
        showSuccessModal, setShowSuccessModal,
        selectedStateIso, setSelectedStateIso,
        selectedCity, setSelectedCity,

        // computed / data
        isVendor,
        countryIso,
        isCountryChosen,
        countryOptions,
        stateOptions,
        cityOptions,

        // handlers
        onSubmit,
        handleProceed,
        handleCountrySelected,
        setCountryValue,
        handleUpdatePreferredCurrency,
    };
};

export default useEditAccountDetailsHook;
