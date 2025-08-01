import { useDispatch, useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import editAccountDetailsSchema, { IEditAccountDetailsSchema } from "../validations/editAccountDetails_validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { RootState } from "../../../redux/store/store";
import { setIsLoading, setLoadingMessage, setUserData } from "../slices/profileState_slice";
import handleError from "../../general/hooks/errorHandler_hook";
import { useUpdateUserDetailsMutation } from "../apis/profile_api";
import IEmailUpdate from "../models/emailUpdate_model";
import ICurrencyUpdate from "../models/currencyUpdate_model";

const useEditAccountDetailsHook = () => {
    const { userData, selectedCountry, acceptMarketing } = useSelector((state: RootState) => state.profileState );
    const dispatch = useDispatch();

    const [updateUserDetails] = useUpdateUserDetailsMutation();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IEditAccountDetailsSchema>({
        defaultValues: {
            firstName: userData?.firstName! || "",
            lastName: userData?.lastName! || "",
            phoneNumber: userData?.phoneNumber! || "",
            country: selectedCountry || "",
            email: userData?.email! || "",
        },
        resolver: yupResolver(editAccountDetailsSchema)
    });

    const onSubmit: SubmitHandler<IEditAccountDetailsSchema> = async (data) => {
        dispatch(setLoadingMessage("Updating account details..."));
        dispatch(setIsLoading(true));

        const requestData: IEmailUpdate = {
            _id: userData?._id!,
            email: data.email!,
            acceptMarketing: acceptMarketing,
        }
        // console.log("REQUEST DATA::: ", requestData);

        try {
            const updatedUserData = await updateUserDetails(requestData).unwrap();
            // console.log("UPDATED USER DATA::: ", updatedUserData);

            if (updatedUserData) {
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
                dispatch(setUserData(updatedUserData));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    }

    // Method to directly set country value
    const setCountryValue = (country: string) => {
        setValue('country', country, { 
            shouldValidate: true, 
            shouldDirty: true 
        });
    };

    // Handle update of preferred currency
    const handleUpdatePreferredCurrency = async(currency: string) => {
        dispatch(setLoadingMessage("Updating preferred currency..."));
        dispatch(setIsLoading(true));

        const requestData: ICurrencyUpdate = {
            _id: userData?._id!,
            prefferedCurrency: currency,
        }
        // console.log("REQUEST DATA::: ", requestData);

        try {
            const updatedUserDataResponse = await updateUserDetails(requestData).unwrap();
            // console.log("UPDATED USER DATA RESPONSE::: ", updatedUserDataResponse);
            
            if (updatedUserDataResponse) {
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
                dispatch(setUserData(updatedUserDataResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    }

    return {
        control, handleSubmit, onSubmit, errors,
        setCountryValue,
        handleUpdatePreferredCurrency,
    };
};

export default useEditAccountDetailsHook;