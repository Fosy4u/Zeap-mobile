import { yupResolver } from "@hookform/resolvers/yup";
import { useAddDeliveryAddressMutation, useUpdateDeliveryAddressMutation, useLazyGetDeliveryAddressesQuery, useLazyGetDeliveryAddressQuery, useDeleteAddressMutation, useSetAsDefaultAddressMutation } from "../apis/address_api";
import { SubmitErrorHandler, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Alert } from "react-native";
import addressFormFieldsSchema, { IAddressFormFieldsSchema } from "../validations/address_validation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { setDeliveryAddresses, setEditingAddressId, setIsLoading, setLoadingMessage, setSelectedAddress, setShowNewDeliveryAddressForm } from "../slices/address_slice";
import handleError from "../../../general/hooks/errorHandler_hook";
import IAddress from "../models/address_model";
import { useEffect } from "react";
import {
    maxPhoneLengthForCountry, phoneErrorForCountry, phoneHintForCountry,
    phonePlaceholderForCountry, sanitizePhoneInput,
} from "../../../../utils/phoneNumberRules";

const getDefaultCountryForCurrency = (currency?: string): string => {
    switch (currency) {
        case "USD": return "USA";
        case "GBP": return "UK";
        case "NGN":
        default:    return "Nigeria";
    }
};

const useAddressHook = () => {
    const { selectedAddress, editingAddressId, showNewDeliveryAddressForm, deliveryAddresses } = useSelector((state: RootState) => state.addressState);
    const { userData } = useSelector((state: RootState) => state.profileState );
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const [addDeliveryAddress] = useAddDeliveryAddressMutation();
    const [updateDeliveryAddress] = useUpdateDeliveryAddressMutation();
    const [getDeliveryAddresses] = useLazyGetDeliveryAddressesQuery();
    const [getDeliveryAddress, { data: deliveryAddress }] = useLazyGetDeliveryAddressQuery();
    const [setAsDefaultAddress] = useSetAsDefaultAddressMutation();
    const [deleteAddress] = useDeleteAddressMutation();

    const { control, handleSubmit, formState: { errors }, getValues, reset, setValue } = useForm<IAddressFormFieldsSchema>({
        defaultValues: {
            firstName: selectedAddress?.firstName || "",
            lastName: selectedAddress?.lastName || "",
            address: selectedAddress?.address! || "",
            region: selectedAddress?.region! || "",
            country: selectedAddress?.country || getDefaultCountryForCurrency(userData?.prefferedCurrency),
            postCode: selectedAddress?.postCode || "",
            deliveryNote: selectedAddress?.deliveryNote || "",
            phoneNumber: selectedAddress?.phoneNumber! || ""
        },
        resolver: yupResolver(addressFormFieldsSchema)
    });

    useEffect(() => {
        if (selectedAddress?.country) return;
        const current = getValues("country");
        if (current) return;
        if (userData?.prefferedCurrency) {
            setValue("country", getDefaultCountryForCurrency(userData.prefferedCurrency));
        }
    }, [userData?.prefferedCurrency]);

    const phoneCountry = useWatch({ control, name: "country" }) as string | undefined;

    useEffect(() => {
        const current = getValues("phoneNumber");
        if (!current) { return; }
        const sanitized = sanitizePhoneInput(current, phoneCountry);
        setValue("phoneNumber", sanitized, { shouldValidate: true });
    }, [phoneCountry]);

    const phoneRules = {
        country: phoneCountry,
        hint: phoneHintForCountry(phoneCountry),
        placeholder: phonePlaceholderForCountry(phoneCountry),
        maxLength: maxPhoneLengthForCountry(phoneCountry),
        errorMessage: phoneErrorForCountry(phoneCountry),
        sanitize: (text: string) => sanitizePhoneInput(text, phoneCountry),
    };

    const onSubmit: SubmitHandler<IAddressFormFieldsSchema> = async (data) => {
        const isEditing = !!editingAddressId;
        dispatch(setLoadingMessage(isEditing ? "Updating delivery address..." : "Saving delivery address..."));
        dispatch(setIsLoading(true));
        // console.log("FORM DATA::: ", data);

        try {
            const savedAddress = isEditing
                ? await updateDeliveryAddress({ ...data, address_id: editingAddressId }).unwrap()
                : await addDeliveryAddress(data).unwrap();

            if (savedAddress) {
                dispatch(setSelectedAddress(savedAddress));
                dispatch(setShowNewDeliveryAddressForm(false));
                dispatch(setEditingAddressId(""));

                // Get back the delivery addresses
                await handleGetDeliveryAddresses();
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    const onInvalid: SubmitErrorHandler<IAddressFormFieldsSchema> = (formErrors) => {
        const firstError = Object.values(formErrors).find((fieldError) => fieldError?.message);
        Alert.alert("Check your address", String(firstError?.message ?? "Please fill in all required fields."));
    };

    const handleStartNewAddress = () => {
        dispatch(setEditingAddressId(""));
        dispatch(setSelectedAddress({} as IAddress));
        reset({
            firstName: "",
            lastName: "",
            address: "",
            region: "",
            country: getDefaultCountryForCurrency(userData?.prefferedCurrency),
            postCode: "",
            deliveryNote: "",
            phoneNumber: "",
        });
        dispatch(setShowNewDeliveryAddressForm(true));
    };

    const handleStartEditAddress = (address: IAddress) => {
        dispatch(setEditingAddressId(address._id ?? ""));
        dispatch(setSelectedAddress(address));
        dispatch(setShowNewDeliveryAddressForm(true));
    };

    const handleCancelAddressForm = () => {
        dispatch(setShowNewDeliveryAddressForm(false));
        dispatch(setEditingAddressId(""));
    };

    const handleViewAddresses = () => {
        dispatch(setShowNewDeliveryAddressForm(false));
        dispatch(setEditingAddressId(""));
    };

    // Handle update address form fiels.
    const handleUpdateAddressFormFields = () => {
        if (showNewDeliveryAddressForm && !editingAddressId) { return; }

        if (selectedAddress && Object.entries(selectedAddress).length > 0) {
            // Reset the address form fields with the selected address values.
            reset({
                firstName: selectedAddress?.firstName || "",
                lastName: selectedAddress?.lastName || "",
                address: selectedAddress?.address! || "",
                region: selectedAddress?.region! || "",
                country: selectedAddress?.country || getDefaultCountryForCurrency(userData?.prefferedCurrency),
                postCode: selectedAddress?.postCode || "",
            deliveryNote: selectedAddress?.deliveryNote || "",
                phoneNumber: selectedAddress?.phoneNumber! || ""
            });
        }
    };

    // Get all delivery addresses
    const handleGetDeliveryAddresses = async () => {
        const user_id = userData?._id;
        if (userData?.isGuest || !user_id) {
            dispatch(setDeliveryAddresses([]));
            dispatch(setSelectedAddress({} as IAddress));
            return;
        }

        dispatch(setLoadingMessage("Fetching delivery addresses..."));
        dispatch(setIsLoading(true));

        try {
            const deliveryAddressesResponse = await getDeliveryAddresses({ user_id }).unwrap();

            if (deliveryAddressesResponse) {
                dispatch(setDeliveryAddresses(deliveryAddressesResponse));

                if (deliveryAddressesResponse.length > 0) {
                    const defaultAddress = deliveryAddressesResponse.find((address: IAddress) => address.isDefault);
                    dispatch(setSelectedAddress(defaultAddress ?? deliveryAddressesResponse[0]));
                } else {
                    dispatch(setSelectedAddress({} as IAddress));
                }
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Get delivery address
    const handleGetDeliveryAddress = async (address_id: string) => {
        dispatch(setLoadingMessage("Fetching delivery address..."));
        dispatch(setIsLoading(true));

        try {
            const getDeliveryAddressResponse = await getDeliveryAddress({ address_id }).unwrap();

            if (getDeliveryAddressResponse) {                
                dispatch(setSelectedAddress(getDeliveryAddressResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle set as default address
    const handleSetAsDefaultAddress = async (address_id: string) => {
        dispatch(setLoadingMessage("Setting default address..."));
        dispatch(setIsLoading(true));
        
        try {
            await setAsDefaultAddress({ address_id }).unwrap();
            await handleGetDeliveryAddresses();
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle delete address
    const handleDeleteAddress = async (address_id: string) => {
        dispatch(setLoadingMessage("Deleting address..."));
        dispatch(setIsLoading(true));

        try {
            await deleteAddress({ address_id }).unwrap();
            dispatch(setDeliveryAddresses(deliveryAddresses.filter((address: IAddress) => address._id !== address_id)));
            await handleGetDeliveryAddresses();
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    useEffect(() => {
      handleUpdateAddressFormFields();
    }, [selectedAddress, reset]);

    return {
        control, handleSubmit, onSubmit, onInvalid, errors, getValues, setValue, phoneRules,
        handleGetDeliveryAddresses,
        deliveryAddress, handleGetDeliveryAddress,
        handleSetAsDefaultAddress,
        handleDeleteAddress,
        editingAddressId,
        handleStartNewAddress,
        handleStartEditAddress,
        handleCancelAddressForm,
        handleViewAddresses,
    };
};

export default useAddressHook;