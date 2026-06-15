import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { InfoCircle, TickCircle } from "iconsax-react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { IStepTwoForm } from "../../validations/vendorOnboarding_validation";

interface IProps {
    control: Control<IStepTwoForm>;
    errors: FieldErrors<IStepTwoForm>;
}

interface IChoiceTileProps {
    selected: boolean;
    label: string;
    onPress: () => void;
    addRightMargin?: boolean;
}

// Tiles use an explicit `mr-3` on the first one because NativeWind 2 does not
// honor `gap-x-*` reliably — sticking to margin keeps the visible gap consistent.
const ChoiceTile: React.FC<IChoiceTileProps> = ({ selected, label, onPress, addRightMargin }) => (
    <TouchableOpacity
        onPress={ onPress }
        activeOpacity={ 0.85 }
        className={ `flex-1 ${ addRightMargin ? "mr-3" : "" } h-14 px-4 flex-row items-center justify-between rounded-2xl border ${ selected ? "border-baseGreen bg-baseGreen/[0.05]" : "border-gray-100 bg-gray-50" }` }
    >
        <Text className={ `font-montserratSemiBold text-base ${ selected ? "text-baseGreen" : "text-gray-700" }` }>
            { label }
        </Text>
        { selected && <TickCircle size={ 20 } color="#133522" variant="Bold" /> }
    </TouchableOpacity>
);

interface IQuestionProps {
    heading: React.ReactNode;
    caption: string;
    value: boolean | null | undefined;
    onChange: (next: boolean) => void;
    error?: string;
}

const Question: React.FC<IQuestionProps> = ({ heading, caption, value, onChange, error }) => (
    <View className="mt-6">
        <Text className="font-montserratSemiBold text-base text-black leading-5">
            { heading }
        </Text>
        <Text className="mt-1 text-xs text-gray-500 leading-4">{ caption }</Text>

        <View className="mt-4 flex-row">
            <ChoiceTile selected={ value === true }  label="Yes" onPress={ () => onChange(true) }  addRightMargin />
            <ChoiceTile selected={ value === false } label="No"  onPress={ () => onChange(false) } />
        </View>
        { error && <Text className="mt-2 text-xs text-red-600">{ error }</Text> }
    </View>
);

const StepTwoComponent: React.FC<IProps> = ({ control, errors }) => {
    return (
        <View className="px-5">
            <View className="pt-2">
                <Text className="font-montserratBold text-[28px] text-baseGreen leading-tight">
                    Lets Get To Know Your Business
                </Text>
                <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-5">
                    Your answers help us verify the services your shop is allowed to offer.
                </Text>
            </View>

            <View className="mt-8">
                {/*==== Default-sell info banner ====*/}
                <View className="p-4 flex-row items-start rounded-2xl bg-blue-50 border-l-[3px] border-blue-500">
                    <InfoCircle size={ 18 } color="#1d4ed8" variant="Bold" />
                    <Text className="ml-2 flex-1 text-xs text-blue-900 leading-5">
                        Regardless of your answers below, you can sell <Text className="font-montserratSemiBold">Ready-to-wear</Text> items and <Text className="font-montserratSemiBold">Accessories</Text> by default.
                    </Text>
                </View>

                <Controller
                    control={ control }
                    name="isTailor"
                    render={ ({ field: { value, onChange } }) => (
                        <Question
                            heading={ <>Do you offer <Text className="font-montserratBold">bespoke</Text> tailoring?</> }
                            caption="No means you won't be verified for tailoring services."
                            value={ value }
                            onChange={ onChange }
                            error={ errors.isTailor?.message }
                        />
                    ) }
                />

                <Controller
                    control={ control }
                    name="isShoeMaker"
                    render={ ({ field: { value, onChange } }) => (
                        <Question
                            heading={ <>Do you offer <Text className="font-montserratBold">bespoke</Text> shoe making?</> }
                            caption="No means you won't be verified for shoe making services."
                            value={ value }
                            onChange={ onChange }
                            error={ errors.isShoeMaker?.message }
                        />
                    ) }
                />
            </View>
        </View>
    );
};

export default StepTwoComponent;
