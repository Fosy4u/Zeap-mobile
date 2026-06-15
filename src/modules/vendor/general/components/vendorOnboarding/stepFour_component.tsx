import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowDown2, Global, Location, Home2 } from "iconsax-react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IStepFourForm } from "../../validations/vendorOnboarding_validation";

interface IProps {
    control: Control<IStepFourForm>;
    errors: FieldErrors<IStepFourForm>;
    onOpenCountryPicker: () => void;
    onOpenRegionPicker: () => void;
    hasCountrySelected: boolean;
}

const StepFourComponent: React.FC<IProps> = ({ control, errors, onOpenCountryPicker, onOpenRegionPicker, hasCountrySelected }) => {
    return (
        <View>
            <View className="px-5 pt-2">
                <Text className="font-montserratBold text-[28px] text-baseGreen leading-tight">
                    Where is Your Business Located?
                </Text>
                <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-5">
                    We use this to arrange pickups and route deliveries. Your address is kept private. Buyers never see it.
                </Text>
            </View>

            <View className="px-5 mt-10">
                {/*==== Address ====*/}
                <Text className="font-montserratSemiBold text-[11px] uppercase tracking-wider text-gray-500">
                    Address
                </Text>
                <View className="mt-2 h-14 px-4 flex-row items-center rounded-2xl bg-gray-50 border border-gray-100">
                    <Location size={ 18 } color="#6b7280" />
                    <Controller
                        control={ control }
                        name="address"
                        render={ ({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder="Street, building, suite…"
                                placeholderTextColor="#9ca3af"
                                className="ml-3 flex-1 font-montserratMedium text-base text-black"
                                onBlur={ onBlur }
                                onChangeText={ onChange }
                                value={ value }
                            />
                        ) }
                    />
                </View>
                { errors.address && (
                    <Text className="mt-2 text-xs text-red-600">{ errors.address.message }</Text>
                ) }

                {/*==== Country ====*/}
                <View className="mt-6">
                    <Text className="font-montserratSemiBold text-[11px] uppercase tracking-wider text-gray-500">
                        Country
                    </Text>
                    <Controller
                        control={ control }
                        name="country"
                        render={ ({ field: { value } }) => (
                            <TouchableOpacity
                                onPress={ onOpenCountryPicker }
                                className="mt-2 h-14 px-4 flex-row items-center justify-between rounded-2xl bg-gray-50 border border-gray-100"
                            >
                                <View className="flex-row items-center">
                                    <Global size={ 18 } color={ value ? "#133522" : "#9ca3af" } />
                                    <Text className={ `ml-3 font-montserratMedium text-base ${ value ? "text-black" : "text-gray-400" }` }>
                                        { value || "Select country" }
                                    </Text>
                                </View>
                                <ArrowDown2 size={ 16 } color="#9ca3af" />
                            </TouchableOpacity>
                        ) }
                    />
                    { errors.country && (
                        <Text className="mt-2 text-xs text-red-600">{ errors.country.message }</Text>
                    ) }
                </View>

                {/*==== Region ====*/}
                {/* Disabled until a country is picked — the region list is
                    derived from the chosen country, so opening it without one
                    would show an empty sheet. */}
                <View className="mt-6">
                    <Text className="font-montserratSemiBold text-[11px] uppercase tracking-wider text-gray-500">
                        Region / state
                    </Text>
                    <Controller
                        control={ control }
                        name="region"
                        render={ ({ field: { value } }) => (
                            <TouchableOpacity
                                onPress={ hasCountrySelected ? onOpenRegionPicker : undefined }
                                activeOpacity={ hasCountrySelected ? 0.85 : 1 }
                                className={ `mt-2 h-14 px-4 flex-row items-center justify-between rounded-2xl border border-gray-100 ${ hasCountrySelected ? "bg-gray-50" : "bg-gray-50/50" }` }
                            >
                                <View className="flex-row items-center">
                                    <Home2 size={ 18 } color={ value ? "#133522" : "#9ca3af" } />
                                    <Text className={ `ml-3 font-montserratMedium text-base ${ value ? "text-black" : "text-gray-400" }` }>
                                        { value || (hasCountrySelected ? "Select region / state" : "Select a country first") }
                                    </Text>
                                </View>
                                <ArrowDown2 size={ 16 } color="#9ca3af" />
                            </TouchableOpacity>
                        ) }
                    />
                    { errors.region && (
                        <Text className="mt-2 text-xs text-red-600">{ errors.region.message }</Text>
                    ) }
                </View>
            </View>
        </View>
    );
};

export default StepFourComponent;
