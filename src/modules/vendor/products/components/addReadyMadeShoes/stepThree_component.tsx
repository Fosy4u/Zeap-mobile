import React, { useState } from 'react';
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react-native';

interface IProps {
    shoeSizes: string[];
    selectedSizes: string[];
    setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
};

const StepThreeComponent: React.FC<IProps> = (props) => {
    const { shoeSizes, selectedSizes, setSelectedSizes } = props;
    const [showSizeDropDown, setShowSizeDropDown] = useState(false);

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 3: Foot Measurements</Text>
            <Text className="mt-2 font-montserratMedium">Provide the applicable foot measurements for this product.</Text>

            {/* ==== Sizes ==== */}
            <Text aria-label="Sizes" nativeID="style" className="mt-5 font-montserratMedium">Sizes<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showSizeDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowSizeDropDown(!showSizeDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select available sizes</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { [...shoeSizes]
                                    .sort((a, b) => parseFloat(a) - parseFloat(b))
                                    .map((item: string, index: number) => (
                                        <View key={ index } className="flex-row items-center gap-x-2">
                                            <CheckBox
                                                value={ selectedSizes.includes(item) }
                                                onValueChange={ (newValue: boolean) => {
                                                    if (newValue) {
                                                        setSelectedSizes([...selectedSizes, item]);
                                                    } else {
                                                        setSelectedSizes(selectedSizes.filter((value: string) => value !== item));
                                                    }
                                                } }
                                                tintColors={{ true: "gray", false: "gray" }}
                                                lineWidth={1}
                                                style={{
                                                    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                                                }}
                                            /> 
                                            <Text className="font-montserratMedium text-sm">{ item }</Text>
                                        </View>
                                    )) 
                                }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowSizeDropDown(!showSizeDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select available sizes</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) }
                {/* { errors.main && <Text claSelectList doesn't pre-select the savedDraftProduct ssName="text-red-600 text-xs mt-1">{errors.main.message}</Text> } */}
            </View>
        </View>
    );
};

export default StepThreeComponent;