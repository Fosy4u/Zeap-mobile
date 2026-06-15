import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ArrowDown2, MessageQuestion } from "iconsax-react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IStepEightForm } from "../../validations/vendorOnboarding_validation";

interface IProps {
    control: Control<IStepEightForm>;
    errors: FieldErrors<IStepEightForm>;
    onOpenReferralPicker: () => void;
}

const StepEightComponent: React.FC<IProps> = ({ control, errors, onOpenReferralPicker }) => {
    return (
        <View>
            <View className="px-5 pt-2">
                <Text className="font-montserratBold text-[28px] text-baseGreen leading-tight">
                    How Did You Hear About Us?
                </Text>
                <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-5">
                    Helps us understand where our vendors are coming from.
                </Text>
            </View>

            <View className="px-5 mt-10">
                <Text className="font-montserratSemiBold text-[11px] uppercase tracking-wider text-gray-500">
                    Referral source
                </Text>
                <Controller
                    control={ control }
                    name="referralSource"
                    render={ ({ field: { value } }) => (
                        <TouchableOpacity
                            onPress={ onOpenReferralPicker }
                            className="mt-2 h-14 px-4 flex-row items-center justify-between rounded-2xl bg-gray-50 border border-gray-100"
                        >
                            <View className="flex-row items-center">
                                <MessageQuestion size={ 18 } color={ value ? "#133522" : "#9ca3af" } />
                                <Text className={ `ml-3 font-montserratMedium text-base ${ value ? "text-black" : "text-gray-400" }` }>
                                    { value || "Select an option" }
                                </Text>
                            </View>
                            <ArrowDown2 size={ 16 } color="#9ca3af" />
                        </TouchableOpacity>
                    ) }
                />
                { errors.referralSource && (
                    <Text className="mt-2 text-xs text-red-600">{ errors.referralSource.message }</Text>
                ) }
            </View>
        </View>
    );
};

export default StepEightComponent;
