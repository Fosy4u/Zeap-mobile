import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import editAccountDetailsSchema, { IEditAccountDetailsSchema } from "../validations/editAccountDetails_validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { RootState } from "../../../redux/store/store";


const useEditAccountDetailsHook = () => {
    const { userData, selectedCountry } = useSelector((state: RootState) => state.profileState );

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<IEditAccountDetailsSchema>({
        defaultValues: {
            firstName: userData.firstName!,
            lastName: userData.lastName!,
            phoneNumber: userData.phoneNumber!,
            country: selectedCountry || "",
        },
        resolver: yupResolver(editAccountDetailsSchema)
    });

    // Method to directly set country value
    const setCountryValue = (country: string) => {
        setValue('country', country, { 
            shouldValidate: true, 
            shouldDirty: true 
        });
    };

    return { control, handleSubmit, errors, setCountryValue };
};

export default useEditAccountDetailsHook;