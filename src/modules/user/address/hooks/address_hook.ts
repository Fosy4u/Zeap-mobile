import { yupResolver } from "@hookform/resolvers/yup";
import { useAddDeliveryAddressMutation, useLazyGetAllDeliveryAddressesQuery, useLazyGetDeliveryAddressQuery } from "../apis/address_api";
import { SubmitHandler, useForm } from "react-hook-form";
import addressFormFieldsSchema, { IAddressFormFieldsSchema } from "../validations/address_validation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { setAllSavedAddresses, setSelectedAddress, setSelectedDeliveryAddressID } from "../slices/address_slice";


const useAddressHook = () => {
    const { selectedAddress } = useSelector((state: RootState) => state.addressState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    // console.log("SELECTED ADDRESS::: ", selectedAddress);

    const [addDeliveryAddress, { isLoading }] = useAddDeliveryAddressMutation();
    const [getAllDeliveryAddresses, { data: allDeliveryAddresses, isLoading: isLoadingAllDeliveryAddresses }] = useLazyGetAllDeliveryAddressesQuery();
    const [getDeliveryAddress, { data: deliveryAddress }] = useLazyGetDeliveryAddressQuery();

    const { control, handleSubmit, formState: { errors }, getValues } = useForm<IAddressFormFieldsSchema>({
        defaultValues: {
            address: selectedAddress.address! || "",
            region: selectedAddress.region! || "",
            country: selectedAddress.country! || "",
            postalCode: "",
            phoneNumber: selectedAddress.phoneNumber! || ""
        },
        resolver: yupResolver(addressFormFieldsSchema)
    });

    const onSubmit: SubmitHandler<IAddressFormFieldsSchema> = async (data) => {
        console.log("DATA::: ", data);

        try {
            const addDeliveryAddressResponse = await addDeliveryAddress(data).unwrap();
            dispatch(setSelectedDeliveryAddressID(addDeliveryAddressResponse._id!));
            // console.log("RESPONSE DATA::: ", addDeliveryAddressResponse);

            navigation.navigate("userPaymentScreen");
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    // Get all delivery addresses
    const handleGetAllDeliveryAddresses = async () => {
        try {
            const allDeliveryAddressesResponse = await getAllDeliveryAddresses().unwrap();
            dispatch(setAllSavedAddresses(allDeliveryAddressesResponse));
            dispatch(setSelectedAddress(allDeliveryAddressesResponse[0]));
            // console.log("RESPONSE DATA::: ", getAllDeliveryAddressesResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    // Get delivery address
    const handleGetDeliveryAddress = async (address_id: string) => {
        try {
            const getDeliveryAddressResponse = await getDeliveryAddress({ address_id }).unwrap();
            dispatch(setSelectedAddress(getDeliveryAddressResponse));
            // console.log("RESPONSE DATA::: ", getDeliveryAddressResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };
    
    return {
        control, handleSubmit, onSubmit, errors, getValues, isLoading,
        allDeliveryAddresses, handleGetAllDeliveryAddresses, isLoadingAllDeliveryAddresses,
        deliveryAddress, handleGetDeliveryAddress,
    };
};

export default useAddressHook;