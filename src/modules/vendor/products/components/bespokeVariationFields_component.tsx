import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import LinearGradient from "react-native-linear-gradient";
import { IColorOption } from "../hooks/variationManager_hook";
import ColorSwatchChipComponent, { isMulticolor, MULTICOLOR_STOPS } from "./colorSwatchChip_component";
import useShopCurrency from "../../general/hooks/shopCurrency_hook";

interface IProps {
    colourType: string;
    setColourType: (colourType: string) => void;
    colorOptions: IColorOption[];
    selectedColors: IColorOption[];
    toggleColor: (color: IColorOption) => void;
    price: string;
    setPrice: (price: string) => void;
}

const BespokeVariationFieldsComponent: React.FC<IProps> = ({
    colourType, setColourType,
    colorOptions, selectedColors, toggleColor,
    price, setPrice,
}) => {
    const { entrySymbol } = useShopCurrency();
    const isSelected = (colorName: string) => selectedColors.some((color) => color.colorName === colorName);

    return (
        <View>
            {/*==== Colour Type ====*/}
            <Text className="ml-1 font-montserratSemiBold text-xs text-gray-700">Colour Type</Text>
            <Text className="ml-1 font-montserratMedium text-xs text-gray-700">Select a type of colour</Text>
            <View className="h-auto w-full mt-2 flex-row items-center justify-start gap-x-3">
                <View className="h-auto flex-row items-center justify-start">
                    <CheckBox
                        onValueChange={ () => setColourType("Single") }
                        value={ colourType === "Single" }
                        boxType="square"
                        lineWidth={ 1.5 }
                        tintColor="#151518"
                        onCheckColor="#ffffff"
                        onFillColor="#133522"
                        onTintColor="#133522"
                        animationDuration={ 0.15 }
                        style={{ height: 20, width: 20, marginRight: 8 }}
                    />
                    <Text className="font-montserratMedium text-baseGreen">Plain Single Color</Text>
                </View>
                <View className="h-auto flex-row items-center justify-start">
                    <CheckBox
                        onValueChange={ () => setColourType("Multiple") }
                        value={ colourType === "Multiple" }
                        boxType="square"
                        lineWidth={ 1.5 }
                        tintColor="#151518"
                        onCheckColor="#ffffff"
                        onFillColor="#133522"
                        onTintColor="#133522"
                        animationDuration={ 0.15 }
                        style={{ height: 20, width: 20, marginRight: 8 }}
                    />
                    <Text className="font-montserratMedium text-baseGreen">Multi-Color Design</Text>
                </View>
            </View>

            { colourType === "Single" && (
                <View className="h-auto w-full mt-5 px-5 py-4 rounded-xl border border-blue-800 bg-blue-50">
                    <Text className="font-montserratSemiBold text-xs text-gray-700">Note:</Text>
                    <Text className="font-montserratMedium text-justify text-xs text-gray-700 leading-5">Please select all colours you can source their materials on user request. This option will be available to buyers when they are making a purchase.
                        Note that this is available only for single plain colour products
                    </Text>
                </View>
            ) }

            {/*==== Colour ====*/}
            { colourType === "Single" && (
                <View>
                    <Text className="mt-6 ml-1 font-montserratSemiBold text-xs text-gray-700">Colour</Text>
                    <Text className="ml-1 font-montserratMedium text-xs text-gray-700">Select more colours</Text>
                    <ScrollView horizontal={ true } showsHorizontalScrollIndicator={ false }>
                        <View className="h-auto w-full mt-3 flex-row items-center gap-x-1">
                            { colorOptions.map((color, index) => (
                                <TouchableOpacity onPress={ () => toggleColor(color) } key={ `${ color.colorName }-${ index }` }>
                                    <ColorSwatchChipComponent
                                        colorName={ color.colorName }
                                        colorCode={ color.colorCode }
                                        className={ isSelected(color.colorName) ? "border-2 border-baseGreen" : "border border-gray-300" }
                                    />
                                </TouchableOpacity>
                            )) }
                        </View>
                    </ScrollView>

                    { selectedColors.length !== 0 && (
                        <View>
                            <Text className="mt-6 ml-1 font-montserratSemiBold text-xs text-gray-700">Selected Colors</Text>
                            <View className="h-auto w-full mt-2 flex-row items-center justify-start gap-x-2">
                                { selectedColors.map((color, index) => (
                                    isMulticolor(color.colorName, color.colorCode) ? (
                                        <LinearGradient
                                            key={ color.colorName || index }
                                            colors={ MULTICOLOR_STOPS }
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            className="h-[25px] w-[25px] border border-gray-300"
                                            style={{ borderRadius: 999 }}
                                        />
                                    ) : (
                                        <View key={ color.colorCode } className="h-[25px] w-[25px] rounded-full border border-gray-300" style={{ backgroundColor: color.colorCode }} />
                                    )
                                )) }
                            </View>
                        </View>
                    ) }
                </View>
            ) }

            {/*==== Price ====*/}
            <Text className="mt-5 ml-1 font-montserratMedium text-gray-700">Price</Text>
            <View className="mt-1.5 flex-row items-center rounded-xl border border-gray-200 overflow-hidden">
                <View className="h-[52px] w-12 items-center justify-center bg-baseGreen">
                    <Text className="font-montserratSemiBold text-gold text-base">{ entrySymbol }</Text>
                </View>
                <TextInput
                    value={ price }
                    keyboardType="number-pad"
                    placeholder="Enter price"
                    placeholderTextColor="#9ca3af"
                    className="h-[44px] flex-1 px-3 font-montserratMedium text-base text-black"
                    onChangeText={ (text) => setPrice(text.replace(/[^0-9]/g, "")) }
                />
            </View>
        </View>
    );
};

export default BespokeVariationFieldsComponent;
