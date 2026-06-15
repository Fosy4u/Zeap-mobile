import React from "react";
import { Text, TextInput, View } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IStepOneForm } from "../../validations/vendorOnboarding_validation";

interface IProps {
    control: Control<IStepOneForm>;
    errors: FieldErrors<IStepOneForm>;
}

const StepOneComponent: React.FC<IProps> = ({ control, errors }) => {
    return (
        <View>
            <View className="px-5 pt-2">
                <Text className="font-montserratBold text-[28px] text-baseGreen leading-tight">
                    Lets Get Your Shop Registered
                </Text>
                <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-5">
                    Start with the name your customers will see across the marketplace.
                </Text>
            </View>

            <View className="px-5 mt-10">
                <Text className="font-montserratSemiBold text-[11px] uppercase tracking-wider text-gray-500">
                    Business name
                </Text>
                <Controller
                    control={ control }
                    name="businessName"
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="e.g. Benny Fashion World"
                            placeholderTextColor="#9ca3af"
                            className="mt-2 h-14 px-4 rounded-2xl bg-gray-50 border border-gray-100 font-montserratMedium text-base text-black"
                            onBlur={ onBlur }
                            onChangeText={ onChange }
                            value={ value }
                        />
                    ) }
                />
                { errors.businessName && (
                    <Text className="mt-2 text-xs text-red-600">{ errors.businessName.message }</Text>
                ) }
            </View>
        </View>
    );
};

export default StepOneComponent;
