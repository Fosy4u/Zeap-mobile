import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Country, State, City } from "country-state-city";

import editAccountDetailsSchema, { IEditAccountDetailsSchema } from "../validations/editAccountDetails_validation";
import { RootState } from "../../../redux/store/store";
import {
    setIsLoading,
    setLoadingMessage,
    setSelectedCountry,
    setSelectedPhoneCode,
    setShowPhoneCodeModal,
    setUserData,
    bumpCurrencyRefreshToken,
} from "../slices/profileState_slice";
import handleError from "../../general/hooks/errorHandler_hook";
import { showAppToast } from "../../general/slices/general_slice";
import { useUpdateUserDetailsMutation } from "../apis/profile_api";
import ICurrencyUpdate from "../models/currencyUpdate_model";
import IProfileUpdate from "../models/profileUpdate_model";
import { phoneCodeForCurrency } from "../../../utils/currencyToPhoneCode";
import rootAPI from "../../../redux/api/rootAPI";
import baseURL from "../../../redux/api/api_route";
import { getAuth } from "@react-native-firebase/auth";
import { useLazyGetUserByIdQuery } from "../../auths/apis/auths_api";

const PRICED_CACHE_TAGS = [
    "Product", "Products", "PromoProduct", "DraftProducts", "Wishlist",
    "Cart", "OrderSummary", "DeliveryMethod",
    "Orders", "Order", "OrderDetails",
    "Points", "Vouchers",
    "VendorProductPreview", "VendorProductDetails", "Promotions", "Promotion",
    "VendorOrders", "VendorOrderDetails", "VendorPayments", "VendorAnalytics",
] as const;

const useEditAccountDetailsHook = () => {
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
        isLoading,
        loadingMessage,
    } = useSelector((state: RootState) => state.profileState);

    const [updateUserDetails] = useUpdateUserDetailsMutation();
    const [getUserById] = useLazyGetUserByIdQuery();

    const resolveUserId = async (refreshFromCurrentSession = false): Promise<string | undefined> => {
        const currentUid = getAuth().currentUser?.uid;
        const cachedProfileMatchesSession = !currentUid || !userData?.uid || userData.uid === currentUid;

        if (!refreshFromCurrentSession && userData?._id && cachedProfileMatchesSession) {
            return userData._id;
        }

        const uid = currentUid || userData?.uid;
        if (!uid) { return undefined; }

        try {
            const freshUser = await getUserById(uid).unwrap();
            if (freshUser?._id) {
                dispatch(setUserData({ ...userData, ...freshUser }));
                return freshUser._id;
            }
        } catch {
        }
        return undefined;
    };

    const isVendor = !!userData?.isVendor;

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

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IEditAccountDetailsSchema>({
        defaultValues: {
            firstName: userData?.firstName! || "",
            lastName: userData?.lastName! || "",
            phoneNumber: userData?.phoneNumber! || "",
            country: selectedCountry || "",
            email: userData?.email! || "",
            address: userData?.address || "",
        },
        resolver: yupResolver(editAccountDetailsSchema),
    });

    const [selected, setSelected] = useState("");
    const [selectedHeightUnit, setSelectedHeightUnit] = useState("Inches");
    const [selectedWeightUnit, setSelectedWeightUnit] = useState("Kilogram");
    const [selectedShoeSize, setSelectedShoeSize] = useState("");
    const [selectedBestOutfit, setSelectedBestOutfit] = useState("");
    const [selectedBestColor, setSelectedBestColor] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedStateIso, setSelectedStateIso] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

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

    useEffect(() => {
        setSelectedStateIso("");
        setSelectedCity("");
    }, [countryIso]);
    useEffect(() => {
        setSelectedCity("");
    }, [selectedStateIso]);

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

    const setCountryValue = (country: string) => {
        setValue("country", country, { shouldValidate: true, shouldDirty: true });
    };

    const saveAccountDetails = async (data: IEditAccountDetailsSchema): Promise<any | null> => {
        dispatch(setLoadingMessage("Updating account details..."));
        dispatch(setIsLoading(true));

        const stateName = stateOptions.find((option) => option.key === selectedStateIso)?.value;
        const region = selectedCity || stateName;

        const profileUserId = await resolveUserId();
        if (!profileUserId) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(new Error("We couldn't identify your account. Please restart the app and try again."));
            return null;
        }

        const requestData: IProfileUpdate = {
            _id: profileUserId,
            email: data.email!,
            acceptMarketing,
            ...(data.firstName?.trim() ? { firstName: data.firstName.trim() } : {}),
            ...(data.lastName?.trim() ? { lastName: data.lastName.trim() } : {}),
            ...(data.phoneNumber?.trim() ? { phoneNumber: data.phoneNumber.trim() } : {}),
            ...(data.address?.trim() ? { address: data.address.trim() } : {}),
            ...(selectedCountry ? { country: selectedCountry } : {}),
            ...(region ? { region } : {}),
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

    const onSubmit: SubmitHandler<IEditAccountDetailsSchema> = async (data) => {
        const updated = await saveAccountDetails(data);
        if (updated) dispatch(showAppToast({ title: "Success", message: "User successfully updated." }));
    };

    const handleProceed = handleSubmit(async (data) => {
        const updated = await saveAccountDetails(data);
        if (!updated) return;

        setShowSuccessModal(true);
    });

    const handleUpdatePreferredCurrency = async (currency: string) => {
        dispatch(setLoadingMessage("Updating preferred currency..."));
        dispatch(setIsLoading(true));

        const userId = await resolveUserId(!!userData?.isGuest);
        if (!userId) {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(new Error("We couldn't identify your account. Please restart the app and try again."));
            return;
        }

        const requestData: ICurrencyUpdate = {
            _id: userId,
            prefferedCurrency: currency,
        };

        const requestUrl = `${ baseURL }/user/update?_id=${ userId }`;
        console.log("CURRENCY UPDATE REQUEST:::", JSON.stringify({
            url: requestUrl,
            method: "PUT",
            payload: requestData,
            isGuest: userData?.isGuest ?? null,
            uid: userData?.uid ?? null,
        }, null, 2));

        try {
            const updatedUserDataResponse = await updateUserDetails(requestData).unwrap();
            if (updatedUserDataResponse) {
                dispatch(setUserData(updatedUserDataResponse));
                dispatch(rootAPI.util.invalidateTags([...PRICED_CACHE_TAGS]));
                dispatch(bumpCurrencyRefreshToken());
            }
        } catch (error: any) {
            console.log("CURRENCY UPDATE FAILED:::", JSON.stringify({
                url: requestUrl,
                method: "PUT",
                payload: requestData,
                status: error?.status ?? null,
                response: error?.data ?? null,
            }, null, 2));
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    const openPhoneCodeModal = () => dispatch(setShowPhoneCodeModal(true));

    return {
        control, handleSubmit, errors,

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

        selected, setSelected,
        selectedHeightUnit, setSelectedHeightUnit,
        selectedWeightUnit, setSelectedWeightUnit,
        selectedShoeSize, setSelectedShoeSize,
        selectedBestOutfit, setSelectedBestOutfit,
        selectedBestColor, setSelectedBestColor,
        showSuccessModal, setShowSuccessModal,
        selectedStateIso, setSelectedStateIso,
        selectedCity, setSelectedCity,

        isVendor,
        countryIso,
        isCountryChosen,
        countryOptions,
        stateOptions,
        cityOptions,

        onSubmit,
        handleProceed,
        handleCountrySelected,
        setCountryValue,
        handleUpdatePreferredCurrency,
    };
};

export default useEditAccountDetailsHook;
