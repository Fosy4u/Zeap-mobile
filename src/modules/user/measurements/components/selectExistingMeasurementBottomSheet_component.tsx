import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { RootState } from '../../../../redux/store/store';
import IBodyMeasurement from '../models/bodyMeasurement_model';

interface IProps {
    // Fired when the user taps Apply with a template selected. The screen
    // applies it (sets the selected template + gender, fetches guides) and the
    // inline required-measurement form re-prefills from it.
    onApply: (template: IBodyMeasurement) => void;
    onClose: () => void;
}

const titleCase = (value?: string | null) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
};

// Flatten a template's measurements (supports the legacy nested shape and the
// new flat shape) into a uniform [{ field, value }] list for the preview.
const flattenMeasurements = (template?: IBodyMeasurement): any[] => {
    const raw: any[] = (template?.measurements as any[]) ?? [];
    const isFlat = raw.length > 0 && raw[0]?.field !== undefined && raw[0]?.measurements === undefined;
    return isFlat ? raw : raw.flatMap((group: any) => group?.measurements ?? []);
};

const SelectExistingMeasurementBottomSheet: React.FC<IProps> = ({ onApply, onClose }) => {
    const { allSavedMeasurements } = useSelector((state: RootState) => state.measurementState);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const pending = allSavedMeasurements.find((t) => t._id === pendingId) ?? null;
    const isEmpty = allSavedMeasurements.length === 0;

    return (
        <View className="h-full w-full absolute inset-0 justify-end">
            <View className="h-full w-full absolute inset-0 bg-black opacity-60" />
            <View
                className="w-full px-5 pt-6 bg-white"
                style={{ maxHeight: "85%", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 24 }}
            >
                {/*==== Header ====*/}
                <View className="h-auto w-full flex-row items-center justify-between">
                    <Text className="font-montserratSemiBold text-xl text-gray-700">Select a saved measurement</Text>
                    <TouchableOpacity onPress={ onClose }>
                        <Image className="h-[28px] w-[28px]" source={ require("../../../../../assets/images/close.png") } />
                    </TouchableOpacity>
                </View>
                <Text className="mt-1 font-montserratMedium text-sm text-gray-500">
                    { isEmpty
                        ? "You have no saved measurement to select from."
                        : "Pick one and tap Apply to prefill the measurement form." }
                </Text>

                {/*==== Saved templates list ====*/}
                <ScrollView showsVerticalScrollIndicator={ false } className="mt-3" style={{ flexGrow: 0 }} contentContainerStyle={{ paddingBottom: 12 }}>
                    { isEmpty ? (
                        <View className="h-auto w-full mt-5 p-10 bg-gray-50 rounded-xl">
                            <FastImage
                                source={ require("../../../../../assets/images/empty_box.png") }
                                defaultSource={ require("../../../../../assets/images/empty_box.png") }
                                resizeMode={ FastImage.resizeMode.contain }
                                className="h-[70px] w-full"
                            />
                            <Text className="mt-4 text-center text-gray-400">
                                You haven't saved any measurement yet. Close this sheet and tap "Add New Measurement" to create one.
                            </Text>
                        </View>
                    ) : (
                        allSavedMeasurements.map((template) => {
                            const isSelected = pendingId === template._id;
                            const items = flattenMeasurements(template);
                            const preview = items.slice(0, 4);
                            const remaining = Math.max(items.length - 4, 0);
                            return (
                                <TouchableOpacity
                                    key={ template._id }
                                    activeOpacity={ 0.9 }
                                    onPress={ () => setPendingId(template._id ?? null) }
                                    className={`h-auto w-full mt-3 px-4 py-4 border rounded-xl ${ isSelected ? "border-[#D5B07B] bg-[#FFFAF2]" : "border-gray-200 bg-[#F8F9FE]" }`}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <Text className="flex-1 font-montserratSemiBold text-base text-gray-700">{ template.templateName ?? "Untitled" }</Text>
                                        {/* Radio indicator */}
                                        <View className={`h-[20px] w-[20px] rounded-full border-2 items-center justify-center ${ isSelected ? "border-[#D5B07B]" : "border-gray-300" }`}>
                                            { isSelected && <View className="h-[10px] w-[10px] rounded-full bg-[#D5B07B]" /> }
                                        </View>
                                    </View>

                                    <View className="mt-2 flex-row flex-wrap">
                                        { preview.map((item: any, idx: number) => (
                                            <View key={ item?._id ?? `mi-${idx}` } className="w-1/2 mt-2 pr-3">
                                                <Text className="font-Montserrat text-xs text-gray-500" numberOfLines={ 1 }>{ titleCase(item?.field) || "Field" }</Text>
                                                <Text className="mt-0.5 font-montserratMedium text-sm text-gray-800" numberOfLines={ 1 }>{ item?.value ?? "" }</Text>
                                            </View>
                                        )) }
                                    </View>
                                    { remaining > 0 && (
                                        <Text className="mt-2 font-montserratMedium text-xs text-gray-500">+{ remaining } more</Text>
                                    ) }
                                </TouchableOpacity>
                            );
                        })
                    ) }
                </ScrollView>

                {/*==== Apply — hidden when there's nothing to select ====*/}
                { !isEmpty && (
                    <TouchableOpacity
                        onPress={ () => pending && onApply(pending) }
                        disabled={ !pending }
                        className={`h-[55px] w-full mt-3 flex-row items-center justify-center rounded-xl bg-baseGreen ${ !pending ? "opacity-50" : "" }`}
                    >
                        <Text className="font-montserratMedium text-base text-white">Apply</Text>
                    </TouchableOpacity>
                ) }
            </View>
        </View>
    );
};

export default SelectExistingMeasurementBottomSheet;
