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


const useAddressHook = () => {
    const { selectedAddress } = useSelector((state: RootState) => state.addressState);
    const { userData } = useSelector((state: RootState) => state.profileState );
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    // console.log("USER DATA::: ", userData);

    const [addDeliveryAddress] = useAddDeliveryAddressMutation();
    const [getDeliveryAddresses] = useLazyGetDeliveryAddressesQuery();
    const [getDeliveryAddress, { data: deliveryAddress }] = useLazyGetDeliveryAddressQuery();
    const [setAsDefaultAddress] = useSetAsDefaultAddressMutation();
    const [deleteAddress] = useDeleteAddressMutation();

    const { control, handleSubmit, formState: { errors }, getValues, reset } = useForm<IAddressFormFieldsSchema>({
        defaultValues: {
            firstName: "",
            lastName: "",
            address: selectedAddress?.address! || "",
            region: selectedAddress?.region! || "",
            country: selectedAddress?.country! || "",
            phoneNumber: selectedAddress?.phoneNumber! || ""
        },
        resolver: yupResolver(addressFormFieldsSchema)
    });

    

    const onSubmit: SubmitHandler<IAddressFormFieldsSchema> = async (data) => {
        dispatch(setLoadingMessage("Saving delivery address..."));
        dispatch(setIsLoading(true));

        //  If user is not a guest, add delivery address else navigate the payment screen and pass the form data to the payment screen
        if (userData.isGuest) {
            // navigation.navigate("userPaymentScreen", { data });
        } else {
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
        }
        
    };

    // Handle update address form fiels.
    const handleUpdateAddressFormFields = () => {
        if (selectedAddress && Object.entries(selectedAddress).length > 0) {
            // Reset the address form fields with the selected address values.
            reset({
                firstName: "",
                lastName: "",
                address: selectedAddress?.address! || "",
                region: selectedAddress?.region! || "",
                country: selectedAddress?.country! || "",
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
                // Check which address that is the default and set it as the selected address else set the first address as the selected address
                const defaultAddress = deliveryAddressesResponse.find((address: IAddress) => address.isDefault);
                if (defaultAddress) {
                    dispatch(setSelectedAddress(defaultAddress));
                } else {
                    dispatch(setSelectedAddress(deliveryAddressesResponse[0]));
                }
                dispatch(setDeliveryAddresses(deliveryAddressesResponse));
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

    useEffect(() => {
        handleGetDeliveryAddresses();
    }, []);
    

    return {
        control, handleSubmit, onSubmit, errors, getValues,
        handleGetDeliveryAddresses,
        deliveryAddress, handleGetDeliveryAddress,
        handleSetAsDefaultAddress,
        handleDeleteAddress,
    };
};

export default useAddressHook;