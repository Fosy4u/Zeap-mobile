import React from "react";
import { ActivityIndicator, Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import { ArrowRight, DocumentText, TickCircle } from "iconsax-react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IStepSevenForm } from "../../validations/vendorOnboarding_validation";
import { ISellerPolicy } from "../../models/vendorOnboardingState_model";

interface IProps {
    control: Control<IStepSevenForm>;
    errors: FieldErrors<IStepSevenForm>;
    policies: ISellerPolicy[];
    isLoadingPolicies: boolean;
}

const StepSevenComponent: React.FC<IProps> = ({ control, errors, policies, isLoadingPolicies }) => {
    const handleOpenPolicy = (link: string) => {
        Linking.openURL(link).catch(() => {
            Alert.alert("Couldn't open link", "Please try again or contact support.");
        });
    };

    return (
        <View>
            <View className="px-5 pt-2">
                <Text className="font-montserratBold text-[28px] text-baseGreen leading-tight">
                    Vendor Policy &amp; Terms
                </Text>
                <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-5">
                    Have a quick read before we set up your shop. You must agree to continue.
                </Text>
            </View>

            <View className="px-5 mt-8">
                { isLoadingPolicies ? (
                    <View className="p-6 items-center rounded-2xl bg-gray-50">
                        <ActivityIndicator color="#133522" />
                    </View>
                ) : policies.length === 0 ? (
                    <View className="p-5 rounded-2xl bg-gray-50">
                        <Text className="text-sm text-gray-500">Policy links unavailable right now. Try again from the previous step.</Text>
                    </View>
                ) : (
                    policies.map((policy, idx) => (
                        <TouchableOpacity
                            key={ policy.link }
                            onPress={ () => handleOpenPolicy(policy.link) }
                            activeOpacity={ 0.85 }
                            className={ `${ idx === 0 ? "" : "mt-3" } p-4 flex-row items-center rounded-2xl bg-white border border-gray-100` }
                        >
                            <View className="h-10 w-10 mr-3 items-center justify-center rounded-xl bg-gold/15">
                                <DocumentText size={ 18 } color="#D5B07B" variant="Bold" />
                            </View>
                            <Text className="flex-1 font-montserratSemiBold text-sm text-black">
                                { policy.name }
                            </Text>
                            <ArrowRight size={ 16 } color="#6b7280" />
                        </TouchableOpacity>
                    ))
                ) }

                <Controller
                    control={ control }
                    name="agreedToTerms"
                    render={ ({ field: { value, onChange } }) => (
                        <TouchableOpacity
                            onPress={ () => onChange(!value) }
                            activeOpacity={ 0.85 }
                            className={ `mt-6 p-4 flex-row items-start rounded-2xl border ${ value ? "border-baseGreen bg-baseGreen/[0.05]" : "border-gray-100 bg-gray-50" }` }
                        >
                            <View className={ `h-6 w-6 mt-0.5 items-center justify-center rounded-md ${ value ? "bg-baseGreen" : "bg-white border border-gray-300" }` }>
                                { value && <TickCircle size={ 14 } color="#ffffff" variant="Bold" /> }
                            </View>
                            <Text className="ml-3 flex-1 font-montserratMedium text-sm text-black leading-5">
                                I have read and agree to the Vendor Contract, Policy &amp; Terms.
                            </Text>
                        </TouchableOpacity>
                    ) }
                />
                { errors.agreedToTerms && (
                    <Text className="mt-2 text-xs text-red-600">{ errors.agreedToTerms.message }</Text>
                ) }
            </View>
        </View>
    );
};

export default StepSevenComponent;
