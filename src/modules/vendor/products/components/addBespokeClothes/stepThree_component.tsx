import React, { useState } from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import { IBodyMeasurementEnum, IValue } from '../../../../general/models/productOptions_model';
import CheckBox from '@react-native-community/checkbox';

interface IProps {
    formattedMeasurements: any[];
    bodyMeasurementOptions: IBodyMeasurementEnum[];
    handleSelectMeasurementField: (
        selectedValue: boolean,
        measurementName: string,
        fieldName: string
    ) => void;
};

const StepThreeComponent: React.FC<IProps> = ({ formattedMeasurements, bodyMeasurementOptions, handleSelectMeasurementField }) => {

    const [selectedTab, setSelectedTab] = useState<string>("Male Measurement");
    const maleBodyMeasurementOptions = bodyMeasurementOptions?.find((bodyMeasurement: IBodyMeasurementEnum) => bodyMeasurement.gender === "male")?.value || [];
    const femaleBodyMeasurementOptions = bodyMeasurementOptions?.find((bodyMeasurement: IBodyMeasurementEnum) => bodyMeasurement.gender === "female")?.value || [];
    // console.log("BODY MEASUREMENT OPTIONS", JSON.stringify(maleBodyMeasurementOptions[5]));
    

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 3: Body Measurements</Text>
            <Text className="mt-2 font-montserratMedium">Provide the applicable body measurements for this product.</Text>

            {/* ==== Gender Tab ==== */}
            <View className="h-auto w-full mt-5 flex-row">
                { ["Male Measurement", "Female Measurement"].map((measurement: string, index: number) => (
                    <TouchableOpacity key={ index } onPress={ () => setSelectedTab(measurement) }
                        className={`w-auto h-auto px-3 py-5 flex-1 font-montserratMedium rounded-md border border-gray-100 bg-gray-50 
                            ${ (selectedTab === measurement)
                                ? "bg-baseGreen py-3 rounded-tl-xl rounded-tr-[40px]"
                                : "bg-lightGray py-3 rounded-tl-xl rounded-tr-[40px]"
                            }
                        `}
                    >
                        <Text className={selectedTab === measurement ? "text-white" : "text-[#133522]"}>{ measurement }</Text>
                     </TouchableOpacity>
                )) }
            </View>
            
            { selectedTab === "Male Measurement" && bodyMeasurementOptions?.length !== 0 ? (
                <View>
                    { maleBodyMeasurementOptions?.map((measurement: IValue, index: number) => (
                        <View key={ index } className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                            <Text className="font-montserratSemiBold text-base text-baseGreen">
                                { measurement.name!
                                    .split(" ")
                                    .map((word: string) => word[0].toUpperCase() + word.slice(1)) // Capitalize each word
                                    .join(" ")
                                }
                            </Text>
                            <View className="h-[1px] w-full mt-2 bg-gray-200" />

                            { measurement.fields?.map((field: string, index: number) => (
                                 <View key={ index } className="h-auto w-full mt-4 px-1 flex-row items-center justify-start">
                                    <CheckBox
                                        onValueChange={ (selectedValue) => handleSelectMeasurementField(selectedValue, measurement.name!, field) }
                                        value={!!formattedMeasurements.find(fm => fm.name === measurement.name)?.fields.includes(field)}
                                        // value={formattedMeasurements.find(fm => fm.name === measurement.name)?.fields.includes(field) || false}
                                    />
                                    <Text className="font-montserratMedium text-base text-baseGreen">{ field }</Text>
                                </View>
                            )) }
                        </View>
                    )) }
                </View>
            ) : (
                <View>
                    { femaleBodyMeasurementOptions?.map((measurement: IValue, index: number) => (
                        <View key={ index } className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                            <Text className="font-montserratSemiBold text-base text-baseGreen">
                                { measurement.name!
                                    .split(" ")
                                    .map((word: string) => word[0].toUpperCase() + word.slice(1))
                                    .join(" ")
                                }
                            </Text>
                            <View className="h-[1px] w-full mt-2 bg-gray-200" />

                            { measurement.fields?.map((field: string, index: number) => (
                                 <View key={ index } className="h-auto w-full mt-4 px-1 flex-row items-center justify-start">
                                    <CheckBox
                                        onValueChange={ (selectedValue) => handleSelectMeasurementField(selectedValue, measurement.name!, field) }
                                        value={formattedMeasurements.find(fm => fm.name === measurement.name)?.fields.includes(field) || false}
                                        className="h-auto w-full mt-1 px-3 py-2 border rounded-xl border-gray-200 bg-gray-50 z-50"
                                    />
                                    <Text className="font-montserratMedium text-base text-baseGreen">{ field }</Text>
                                </View>
                            )) }
                        </View>
                    )) }
                </View>
            ) }
        </View>
    );
};

export default StepThreeComponent;
