import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowDown2, ArrowUp2 } from "iconsax-react-native";
import { IColorOption } from "../hooks/variationManager_hook";
import useShopCurrency from "../../general/hooks/shopCurrency_hook";

interface IProps {
    colorOptions: IColorOption[];
    sizes: string[];
    selectedColor: IColorOption | null;
    setSelectedColor: (color: IColorOption) => void;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    price: string;
    setPrice: (price: string) => void;
    quantity: string;
    setQuantity: (quantity: string) => void;
    // Optionally disable a colour / size (e.g. combos already taken).
    isColorDisabled?: (colorName: string) => boolean;
    isSizeDisabled?: (size: string) => boolean;
}

const VariationFieldsComponent: React.FC<IProps> = ({
    colorOptions, sizes,
    selectedColor, setSelectedColor,
    selectedSize, setSelectedSize,
    price, setPrice,
    quantity, setQuantity,
    isColorDisabled, isSizeDisabled,
}) => {
    const { entrySymbol } = useShopCurrency();
    const [showColors, setShowColors] = useState(false);
    const [showSizes, setShowSizes] = useState(false);

    const stepQuantity = (delta: number) => {
        const next = Math.max(0, (parseInt(quantity || "0", 10) || 0) + delta);
        setQuantity(String(next));
    };

    return (
        <View>
            {/*==== Colour ====*/}
            <Text className="ml-1 font-montserratMedium text-gray-700">Colour</Text>
            <View className="mt-1.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                <TouchableOpacity onPress={ () => setShowColors(!showColors) } className="py-1.5 flex-row items-center justify-between">
                    <View className="flex-1 flex-row items-center gap-x-2">
                        { selectedColor?.colorName ? (
                            <>
                                <View className="h-5 w-5 rounded-md border border-gray-300" style={{ backgroundColor: selectedColor.colorCode }} />
                                <Text className="text-base text-gray-700">{ selectedColor.colorName }</Text>
                            </>
                        ) : (
                            <Text className="text-base text-[#9ca3af]">Select colour</Text>
                        ) }
                    </View>
                    { showColors ? <ArrowUp2 size={ 18 } color="#9ca3af" /> : <ArrowDown2 size={ 18 } color="#9ca3af" /> }
                </TouchableOpacity>
                { showColors && (
                    <View className="max-h-[200px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator contentContainerStyle={{ padding: 8 }}>
                            { colorOptions.map((color, index) => {
                                const disabled = isColorDisabled?.(color.colorName) ?? false;
                                return (
                                    <TouchableOpacity
                                        key={ `${ color.colorName }-${ index }` }
                                        disabled={ disabled }
                                        onPress={ () => { setSelectedColor(color); setShowColors(false); } }
                                        className={ `px-2 py-3 flex-row items-center gap-x-2 ${ disabled ? "opacity-40" : "" }` }
                                    >
                                        <View className="h-5 w-5 rounded-md border border-gray-300" style={{ backgroundColor: color.colorCode }} />
                                        <Text className="font-montserratMedium text-sm">{ color.colorName }</Text>
                                        { disabled && <Text className="font-montserratMedium text-[10px] text-gray-400">(all sizes added)</Text> }
                                    </TouchableOpacity>
                                );
                            }) }
                        </ScrollView>
                    </View>
                ) }
            </View>

            {/*==== Size ====*/}
            <Text className="mt-5 ml-1 font-montserratMedium text-gray-700">Size</Text>
            <View className="mt-1.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                <TouchableOpacity onPress={ () => setShowSizes(!showSizes) } className="py-1.5 flex-row items-center justify-between">
                    <Text className={ `text-base ${ selectedSize ? "text-gray-700" : "text-[#9ca3af]" }` }>{ selectedSize || "Select size" }</Text>
                    { showSizes ? <ArrowUp2 size={ 18 } color="#9ca3af" /> : <ArrowDown2 size={ 18 } color="#9ca3af" /> }
                </TouchableOpacity>
                { showSizes && (
                    <View className="max-h-[200px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator contentContainerStyle={{ padding: 8 }}>
                            { sizes.map((size, index) => {
                                const disabled = isSizeDisabled?.(size) ?? false;
                                return (
                                    <TouchableOpacity
                                        key={ `${ size }-${ index }` }
                                        disabled={ disabled }
                                        onPress={ () => { setSelectedSize(size); setShowSizes(false); } }
                                        className={ `px-2 py-2.5 flex-row items-center justify-between ${ disabled ? "opacity-40" : "" }` }
                                    >
                                        <Text className="font-montserratMedium text-sm">{ size }</Text>
                                        { disabled && <Text className="font-montserratMedium text-[10px] text-gray-400">Added</Text> }
                                    </TouchableOpacity>
                                );
                            }) }
                        </ScrollView>
                    </View>
                ) }
            </View>

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

            {/*==== Quantity (with steppers) ====*/}
            <Text className="mt-5 ml-1 font-montserratMedium text-gray-700">Quantity</Text>
            <View className="mt-1.5 flex-row items-center rounded-xl border border-gray-200 overflow-hidden">
                <TextInput
                    value={ quantity }
                    keyboardType="number-pad"
                    placeholder="Qty"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 h-[52px] px-3 font-montserratMedium text-base text-black"
                    onChangeText={ (text) => setQuantity(text.replace(/[^0-9]/g, "")) }
                />
                <View className="h-[52px] w-10 border-l border-gray-200">
                    <TouchableOpacity onPress={ () => stepQuantity(1) } className="flex-1 items-center justify-center border-b border-gray-200">
                        <ArrowUp2 size={ 14 } color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => stepQuantity(-1) } className="flex-1 items-center justify-center">
                        <ArrowDown2 size={ 14 } color="#6b7280" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default VariationFieldsComponent;
