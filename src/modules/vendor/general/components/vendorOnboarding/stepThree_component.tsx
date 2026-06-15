import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ArrowDown2, Sms } from "iconsax-react-native";
import { IStepThreeForm } from "../../validations/vendorOnboarding_validation";

interface IProps {
    control: Control<IStepThreeForm>;
    errors: FieldErrors<IStepThreeForm>;
    onOpenPhoneCodePicker: () => void;
}

const StepThreeComponent: React.FC<IProps> = ({ control, errors, onOpenPhoneCodePicker }) => {
    return (
        <View>
            <View className="px-5 pt-2">
                <Text className="font-montserratBold text-[28px] text-baseGreen leading-tight">
                    How Can We Reach You?
                </Text>
                <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-5">
                    We'll use these details to send order alerts, payouts, and important account notices.
                </Text>
            </View>

            <View className="px-5 mt-10">
                {/*==== Business Email ====*/}
                <Text className="font-montserratSemiBold text-[11px] uppercase tracking-wider text-gray-500">
                    Business email
                </Text>
                <View className="mt-2 h-14 px-4 flex-row items-center rounded-2xl bg-gray-50 border border-gray-100">
                    <Sms size={ 18 } color="#6b7280" />
                    <Controller
                        control={ control }
                        name="businessEmail"
                        render={ ({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder="you@business.com"
                                placeholderTextColor="#9ca3af"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                className="ml-3 flex-1 font-montserratMedium text-base text-black"
                                onBlur={ onBlur }
                                onChangeText={ onChange }
                                value={ value }
                            />
                        ) }
                    />
                </View>
                { errors.businessEmail && (
                    <Text className="mt-2 text-xs text-red-600">{ errors.businessEmail.message }</Text>
                ) }

                {/*==== Business Phone ====*/}
                <View className="mt-6">
                    <Text className="font-montserratSemiBold text-[11px] uppercase tracking-wider text-gray-500">
                        Business phone number
                    </Text>
                    <View className="mt-2 flex-row gap-x-2">
                        <Controller
                            control={ control }
                            name="businessPhoneCode"
                            render={ ({ field: { value } }) => (
                                <TouchableOpacity
                                    onPress={ onOpenPhoneCodePicker }
                                    className="h-14 px-3 flex-row items-center rounded-2xl bg-gray-50 border border-gray-100"
                                >
                                    <Text className="font-montserratSemiBold text-base text-black">
                                        { value || "+234" }
                                    </Text>
                                    <ArrowDown2 size={ 14 } color="#6b7280" className="ml-1" />
                                </TouchableOpacity>
                            ) }
                        />

                        <Controller
                            control={ control }
                            name="businessPhone"
                            render={ ({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder="Enter phone number"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="phone-pad"
                                    className="flex-1 h-14 px-4 rounded-2xl bg-gray-50 border border-gray-100 font-montserratMedium text-base text-black"
                                    onBlur={ onBlur }
                                    onChangeText={ onChange }
                                    value={ value }
                                />
                            ) }
                        />
                    </View>
                    { errors.businessPhone && (
                        <Text className="mt-2 text-xs text-red-600">{ errors.businessPhone.message }</Text>
                    ) }
                </View>
            </View>
        </View>
    );
};

export default StepThreeComponent;
