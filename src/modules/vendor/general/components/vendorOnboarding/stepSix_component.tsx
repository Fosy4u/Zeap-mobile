import React from "react";
import { Text, TextInput, View } from "react-native";
import { Facebook, Global, Instagram } from "iconsax-react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IStepSixForm } from "../../validations/vendorOnboarding_validation";

interface IProps {
    control: Control<IStepSixForm>;
    errors: FieldErrors<IStepSixForm>;
}

interface IFieldProps {
    label: React.ReactNode;
    name: "website" | "tiktok" | "instagram" | "facebook" | "twitter" | "linkedin";
    placeholder: string;
    icon: React.ComponentType<any>;
    control: Control<IStepSixForm>;
    error?: string;
}

const Field: React.FC<IFieldProps> = ({ label, name, placeholder, icon: Icon, control, error }) => (
    <View className="mt-4">
        <Text className="font-montserratSemiBold text-[11px] uppercase tracking-wider text-gray-500">
            { label }
        </Text>
        <View className="mt-2 h-14 px-4 flex-row items-center rounded-2xl bg-gray-50 border border-gray-100">
            <Icon size={ 18 } color="#6b7280" />
            <Controller
                control={ control }
                name={ name }
                render={ ({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder={ placeholder }
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="none"
                        className="ml-3 flex-1 font-montserratMedium text-base text-black"
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value ?? "" }
                    />
                ) }
            />
        </View>
        { error && <Text className="mt-2 text-xs text-red-600">{ error }</Text> }
    </View>
);

const StepSixComponent: React.FC<IProps> = ({ control, errors }) => {
    return (
        <View>
            <View className="px-5 pt-2">
                <Text className="font-montserratBold text-[28px] text-baseGreen leading-tight">
                    Your Social Media Links
                </Text>
                <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-5">
                    Optional, but adding socials helps buyers discover and trust your brand.
                </Text>
            </View>

            <View className="px-5 mt-8">
                <Field label="Website"   name="website"   placeholder="https://your-site.com"   icon={ Global }     control={ control } error={ errors.website?.message } />
                <Field label="TikTok"    name="tiktok"    placeholder="@your-handle"             icon={ Global }     control={ control } error={ errors.tiktok?.message } />
                <Field label="Instagram" name="instagram" placeholder="@your-handle"             icon={ Instagram }  control={ control } error={ errors.instagram?.message } />
                <Field label="Facebook"  name="facebook"  placeholder="facebook.com/your-page"   icon={ Facebook }   control={ control } error={ errors.facebook?.message } />
                <Field
                    label={ <>X <Text className="font-montserratMedium text-[9px] normal-case tracking-normal text-gray-400">(Twitter)</Text></> }
                    name="twitter"
                    placeholder="@your-handle"
                    icon={ Global }
                    control={ control }
                    error={ errors.twitter?.message }
                />
                <Field label="LinkedIn"  name="linkedin"  placeholder="linkedin.com/in/your-handle" icon={ Global }   control={ control } error={ errors.linkedin?.message } />
            </View>
        </View>
    );
};

export default StepSixComponent;
