import React, { useState } from 'react';
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowDown2, ArrowRight2 } from "iconsax-react-native";
import CheckBox from '@react-native-community/checkbox';
import { IValue } from '../../../../general/models/productOptions_model';
import { IField } from '../../../../general/models/bodyMeasurementGuide_model';
import SkeletonBlock from '../../../../general/components/skeletonBlock_component';

// Placeholder shown while the gender's measurement guide is being fetched — a
// couple of section cards each with a header and a few field rows, matching the
// real layout so the screen doesn't sit empty/idle on entry.
const MeasurementSkeleton: React.FC = () => {
    const contentWidth = Dimensions.get('window').width - 70; // px-5 screen + px-3 card

    return (
        <View>
            { [0, 1].map((section) => (
                <View key={ section } className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50">
                    <SkeletonBlock width={ 160 } height={ 18 } radius={ 6 } />
                    <View className="h-[1px] w-full mt-3 bg-gray-200" />
                    { [0, 1, 2].map((row) => (
                        <View key={ row } className="mt-4" style={{ gap: 8 }}>
                            <SkeletonBlock width={ contentWidth } height={ 16 } radius={ 6 } />
                            <SkeletonBlock width={ 120 } height={ 12 } radius={ 6 } />
                        </View>
                    )) }
                </View>
            )) }
        </View>
    );
};

interface IGenderTab {
    gender: string;
    label: string;
};

// Renders a measurement-guide image sized to its OWN aspect ratio. A fixed
// height + resizeMode="contain" letterboxed images whose shape didn't match the
// box, leaving a large empty gap below the description. Measuring the natural
// dimensions on load and applying them as an aspectRatio makes the box hug the
// image — no dead space, no cropping. Capped so a tall image can't dominate.
const GuideImage: React.FC<{ uri: string }> = ({ uri }) => {
    const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
    return (
        <Image
            source={{ uri }}
            onLoad={ (event) => {
                const { width, height } = event.nativeEvent.source;
                if (width && height) { setAspectRatio(width / height); }
            } }
            className="mt-2 w-full rounded-lg bg-gray-100"
            style={{ aspectRatio, maxHeight: 220 }}
            resizeMode="contain"
        />
    );
};

interface IProps {
    handleSelectMeasurementField: (
        selectedValue: boolean,
        measurementName: string,
        fieldName: string
    ) => void;
    showMeasurementSkeleton: boolean;
    genderTabs: IGenderTab[];
    selectedGenders: string[];
    activeGender: string;
    setActiveGender: (gender: string) => void;
    activeMeasurements: IValue[];
    getGuideField: (sectionName: string, field: string) => IField | undefined;
    isFieldChecked: (sectionName: string, field: string) => boolean;
    expandedFields: Record<string, boolean>;
    toggleField: (key: string) => void;
    titleCase: (text: string) => string;
    additionalMeasurementNote: string;
    setAdditionalMeasurementNote: (note: string) => void;
};

const StepThreeComponent: React.FC<IProps> = ({
    handleSelectMeasurementField,
    showMeasurementSkeleton,
    genderTabs,
    selectedGenders,
    activeGender,
    setActiveGender,
    activeMeasurements,
    getGuideField,
    isFieldChecked,
    expandedFields,
    toggleField,
    titleCase,
    additionalMeasurementNote,
    setAdditionalMeasurementNote,
}) => {

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 3: Foot Measurements</Text>
            <Text className="mt-2 font-montserratMedium">Provide the applicable foot measurements for this product.</Text>

            {/* ==== Gender Tabs (enabled per step-2 selection) ==== */}
            <View className="h-auto w-full mt-5 flex-row">
                { genderTabs.map((tab: IGenderTab) => {
                    const isEnabled = selectedGenders.includes(tab.gender);
                    const isActive = activeGender === tab.gender;
                    return (
                        <TouchableOpacity
                            key={ tab.gender }
                            disabled={ !isEnabled }
                            onPress={ () => setActiveGender(tab.gender) }
                            className={`w-auto h-auto px-3 py-3 flex-1 font-montserratMedium rounded-tl-xl rounded-tr-[40px] border border-gray-100
                                ${ isActive ? "bg-baseGreen" : "bg-lightGray" }
                                ${ !isEnabled ? "opacity-40" : "" }
                            `}
                        >
                            <Text className={ isActive ? "text-white" : "text-[#133522]" }>{ tab.label }</Text>
                        </TouchableOpacity>
                    );
                }) }
            </View>

            {/* ==== Measurement sections for the active gender ==== */}
            { showMeasurementSkeleton ? (
                <MeasurementSkeleton />
            ) : activeMeasurements.length === 0 ? (
                <View className="mt-6 items-center">
                    <Text className="font-montserratMedium text-sm text-gray-500">No measurement guide available.</Text>
                </View>
            ) : (
                activeMeasurements.map((section: IValue, sectionIndex: number) => (
                    <View key={ sectionIndex } className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50">
                        <Text className="font-montserratSemiBold text-base text-baseGreen">{ titleCase(section.name!) }</Text>
                        <View className="h-[1px] w-full mt-2 bg-gray-200" />

                        { section.fields?.map((field: string, fieldIndex: number) => {
                            const key = `${section.name}::${field}`;
                            const isExpanded = !!expandedFields[key];
                            const guideField = getGuideField(section.name!, field);
                            return (
                                <View key={ fieldIndex } className="mt-4">
                                    <View className="flex-row items-start">
                                        <CheckBox
                                            value={ isFieldChecked(section.name!, field) }
                                            onValueChange={ (selectedValue) => handleSelectMeasurementField(selectedValue, section.name!, field) }
                                            tintColors={{ true: "gray", false: "gray" }}
                                            boxType="square"
                                            lineWidth={ 1.5 }
                                            tintColor="#151518"
                                            onCheckColor="#ffffff"
                                            onFillColor="#133522"
                                            onTintColor="#133522"
                                            animationDuration={ 0.15 }
                                            style={{ height: 20, width: 20, transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                                        />
                                        <Text className="ml-2.5 flex-1 font-montserratMedium text-sm leading-5 text-baseGreen">{ titleCase(field) }</Text>
                                    </View>

                                    {/* Measurement Guide toggle — reveals the description + image. */}
                                    { (guideField?.description || guideField?.imageUrl?.link) && (
                                        <>
                                            <TouchableOpacity
                                                onPress={ () => toggleField(key) }
                                                className="mt-1.5 ml-1 flex-row items-center self-start"
                                            >
                                                <Text className="mr-1 font-montserratMedium text-xs text-blue-600">Measurement Guide</Text>
                                                { isExpanded
                                                    ? <ArrowDown2 size={ 14 } color="#2563eb" />
                                                    : <ArrowRight2 size={ 14 } color="#2563eb" />
                                                }
                                            </TouchableOpacity>

                                            { isExpanded && (
                                                <View className="mt-2 ml-1 p-3 rounded-lg bg-white border border-gray-100">
                                                    { !!guideField?.description && (
                                                        <Text className="font-montserratMedium text-xs text-gray-600 leading-5">{ guideField.description }</Text>
                                                    ) }
                                                    { !!guideField?.imageUrl?.link && (
                                                        <GuideImage uri={ guideField.imageUrl.link } />
                                                    ) }
                                                </View>
                                            ) }
                                        </>
                                    ) }
                                </View>
                            );
                        }) }
                    </View>
                ))
            ) }

            {/* ==== Additional Instructions (optional) ==== */}
            <View className="h-auto w-full mt-4 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50">
                <Text className="font-montserratSemiBold text-base text-baseGreen">Additional Instructions</Text>
                <Text className="mt-1 font-montserratMedium text-xs text-gray-500">Add any extra instruction for this product, if needed.</Text>
                <View className="h-auto w-full mt-3 px-3 py-1 border rounded-xl border-gray-200 bg-white">
                    <TextInput
                        multiline
                        textAlignVertical="top"
                        keyboardType="default"
                        placeholder="Enter additional instructions"
                        placeholderTextColor="#9ca3af"
                        className="min-h-[90px] font-montserratMedium text-base text-baseGreen"
                        onChangeText={ setAdditionalMeasurementNote }
                        value={ additionalMeasurementNote }
                    />
                </View>
            </View>
        </View>
    );
};

export default StepThreeComponent;
