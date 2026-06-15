import { yupResolver } from "@hookform/resolvers/yup";
import { useAddDeliveryAddressMutation, useLazyGetDeliveryAddressesQuery, useLazyGetDeliveryAddressQuery, useDeleteAddressMutation, useSetAsDefaultAddressMutation } from "../apis/address_api";
import { SubmitHandler, useForm } from "react-hook-form";
import addressFormFieldsSchema, { IAddressFormFieldsSchema } from "../validations/address_validation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { setDeliveryAddresses, setIsLoading, setLoadingMessage, setSelectedAddress, setShowNewDeliveryAddressForm } from "../slices/address_slice";
import handleError from "../../../general/hooks/errorHandler_hook";
import IAddress from "../models/address_model";
import { useEffect } from "react";


// Map the user's preferred currency to a delivery-country key.
// Matches the keys in src/utils/deliveryCountries.json.
const getDefaultCountryForCurrency = (currency?: string): string => {
    switch (currency) {
        case "USD": return "USA";
        case "GBP": return "UK";
        case "CAD": return "Canada";
        case "NGN":
        default:    return "Nigeria";
    }
};

const useAddressHook = () => {
    const { selectedAddress } = useSelector((state: RootState) => state.addressState);
    const { userData } = useSelector((state: RootState) => state.profileState );
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const [addDeliveryAddress] = useAddDeliveryAddressMutation();
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
            phoneNumber: selectedAddress?.phoneNumber! || ""
        },
        resolver: yupResolver(addressFormFieldsSchema)
    });

    // Apply the currency-derived country default once userData hydrates after first render.
    // Skip if the user already has a selected address (their stored country wins) or has
    // typed something in the field manually.
    useEffect(() => {
        if (selectedAddress?.country) return;
        const current = getValues("country");
        if (current) return;
        if (userData?.prefferedCurrency) {
            setValue("country", getDefaultCountryForCurrency(userData.prefferedCurrency));
        }
    }, [userData?.prefferedCurrency]);

    

    const onSubmit: SubmitHandler<IAddressFormFieldsSchema> = async (data) => {
        dispatch(setLoadingMessage("Saving delivery address..."));
        dispatch(setIsLoading(true));
        // console.log("FORM DATA::: ", data);
        
        try {
            const addDeliveryAddressResponse = await addDeliveryAddress(data).unwrap();
            console.log("RESPONSE DATA::: ", addDeliveryAddressResponse);

            if (addDeliveryAddressResponse) {
                dispatch(setSelectedAddress(addDeliveryAddressResponse));
                dispatch(setShowNewDeliveryAddressForm(false));

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

    // Handle update address form fiels.
    const handleUpdateAddressFormFields = () => {
        if (selectedAddress && Object.entries(selectedAddress).length > 0) {
            // Reset the address form fields with the selected address values.
            reset({
                firstName: selectedAddress?.firstName || "",
                lastName: selectedAddress?.lastName || "",
                address: selectedAddress?.address! || "",
                region: selectedAddress?.region! || "",
                country: selectedAddress?.country || getDefaultCountryForCurrency(userData?.prefferedCurrency),
                postCode: selectedAddress?.postCode || "",
                phoneNumber: selectedAddress?.phoneNumber! || ""
            });
        }
    };

    // Get all delivery addresses
    const handleGetDeliveryAddresses = async () => {
        dispatch(setLoadingMessage("Fetching delivery addresses..."));
        dispatch(setIsLoading(true));

        const user_id = userData._id!
        try {
            const deliveryAddressesResponse = await getDeliveryAddresses({ user_id }).unwrap();

            if (deliveryAddressesResponse) {
                dispatch(setDeliveryAddresses(deliveryAddressesResponse));

                // Only set a selected address if the response actually contains one.
                // Previously `deliveryAddressesResponse[0]` returned undefined for users
                // with no saved addresses, which then crashed the checkout screen at
                // `Object.entries(selectedAddress)`.
                if (deliveryAddressesResponse.length > 0) {
                    const defaultAddress = deliveryAddressesResponse.find((address: IAddress) => address.isDefault);
                    dispatch(setSelectedAddress(defaultAddress ?? deliveryAddressesResponse[0]));
                } else {
                    // Reset to the empty-object shape from the slice's initial state so
                    // downstream `Object.keys(selectedAddress).length > 0` checks behave.
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
            const setAsDefaultAddressResponse = await setAsDefaultAddress({ address_id }).unwrap();

            if (setAsDefaultAddressResponse) {
                await handleGetDeliveryAddresses();
            }
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
            const deleteAddressResponse = await deleteAddress({ address_id }).unwrap();

            if (deleteAddressResponse) {
                await handleGetDeliveryAddresses();
            }
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
        control, handleSubmit, onSubmit, errors, getValues, setValue,
        handleGetDeliveryAddresses,
        deliveryAddress, handleGetDeliveryAddress,
        handleSetAsDefaultAddress,
        handleDeleteAddress,
    };
};

export default useAddressHook;