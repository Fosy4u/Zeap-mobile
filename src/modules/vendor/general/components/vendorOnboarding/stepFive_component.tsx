import React from "react";
import { Text, TextInput, View } from "react-native";
import { Bank, InfoCircle } from "iconsax-react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IStepFiveForm } from "../../validations/vendorOnboarding_validation";

interface IProps {
    control: Control<IStepFiveForm>;
    errors: FieldErrors<IStepFiveForm>;
}

interface IFieldProps {
    label: string;
    placeholder: string;
    name: "bankName" | "accountName" | "accountNumber" | "confirmAccountNumber";
    keyboardType?: "default" | "number-pad";
    icon?: React.ComponentType<any>;
    control: Control<IStepFiveForm>;
    error?: string;
}

const Field: React.FC<IFieldProps> = ({ label, placeholder, name, keyboardType = "default", icon: Icon, control, error }) => {
    const maxLength = (name === "accountNumber" || name === "confirmAccountNumber") ? 10 : undefined;
    return (
    <View className="mt-5">
        <Text className="font-montserratSemiBold text-[11px] uppercase tracking-wider text-gray-500">
            { label }
        </Text>
        <View className="mt-2 h-14 px-4 flex-row items-center rounded-2xl bg-gray-50 border border-gray-100">
            { Icon && <Icon size={ 18 } color="#6b7280" /> }
            <Controller
                control={ control }
                name={ name }
                render={ ({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder={ placeholder }
                        placeholderTextColor="#9ca3af"
                        keyboardType={ keyboardType }
                        maxLength={ maxLength }
                        className={ `${ Icon ? "ml-3" : "" } flex-1 font-montserratMedium text-base text-black` }
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                    />
                ) }
            />
        </View>
        { error && <Text className="mt-2 text-xs text-red-600">{ error }</Text> }
    </View>
    );
};

const StepFiveComponent: React.FC<IProps> = ({ control, errors }) => {
    return (
        <View>
            <View className="px-5 pt-2">
                <Text className="font-montserratBold text-[28px] text-baseGreen leading-tight">
                    How Do You Want to Get Paid?
                </Text>
                <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-5">
                    We'll route your sales to the account you provide below.
                </Text>
            </View>

            <View className="px-5 mt-6">
                <View className="p-4 flex-row items-start rounded-2xl bg-blue-50 border-l-[3px] border-blue-500">
                    <InfoCircle size={ 18 } color="#1d4ed8" variant="Bold" />
                    <Text className="ml-2 flex-1 text-xs text-blue-900 leading-5">
                        Your <Text className="font-montserratSemiBold">account name</Text> must match the full name or business name on your profile. Otherwise, payouts won't process.
                    </Text>
                </View>

                <Field label="Bank name"             placeholder="e.g. GTBank" name="bankName" icon={ Bank } control={ control } error={ errors.bankName?.message } />
                <Field label="Account name"          placeholder="e.g. Benny Fashion World" name="accountName" control={ control } error={ errors.accountName?.message } />
                <Field label="Account number"        placeholder="0000000000" name="accountNumber" keyboardType="number-pad" control={ control } error={ errors.accountNumber?.message } />
                <Field label="Confirm account number" placeholder="Re-enter to confirm" name="confirmAccountNumber" keyboardType="number-pad" control={ control } error={ errors.confirmAccountNumber?.message } />
            </View>
        </View>
    );
};

export default StepFiveComponent;
