import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import { IVariation } from '../../models/vendorProductDetails_model';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store/store';
import { Add, ArrowDown2, ArrowUp2 } from 'iconsax-react-native';

interface IProps {
    propsData: {
        uploadedColorOptions: IColorOption[];
        selectedColor: IColorOption;
        setSelectedColor: (value: IColorOption) => void;
        uploadedSizes: string[];
        selectedSize: string;
        setSelectedSize: (value: string) => void;
        price: string;
        setPrice: (value: string) => void;
        quantity: string;
        setQuantity: (value: string) => void;
        setSelectedVariation: (value: IVariation) => void;
        buttonActionType: string;
        setButtonActionType: (value: string) => void;
        handleAddProductVariation: () => Promise<void>;
        handleUpdateProductVariation: () => Promise<void>;
        handleDeleteProductVariation: (variation: IVariation) => Promise<void>;
    };
};
interface IColorOption {
    colorName: string;
    colorCode: string;
};

const StepFiveComponent: React.FC<IProps> = (props) => {
    const { product, productIsLoading } = useSelector((state: RootState) => state.vendorProductState);
    const {
        uploadedColorOptions, selectedColor, setSelectedColor,
        uploadedSizes, selectedSize, setSelectedSize,
        price, setPrice,
        quantity, setQuantity,
        setSelectedVariation,
        buttonActionType, setButtonActionType,
        handleAddProductVariation,
        handleUpdateProductVariation,
        handleDeleteProductVariation,
    } = props.propsData;
    const [showAddVariations, setShowAddVariations] = useState(false);
    const [showColorsDropDown, setShowColorsDropDown] = useState(false);
    const [showSizesDropDown, setShowSizesDropDown] = useState(false);
    // _id of the variation currently being deleted — drives a spinner on ONLY
    // that row's Delete button. `productIsLoading` (set by the delete) disables
    // every other action while it's in flight.
    const [deletingVariationId, setDeletingVariationId] = useState<string | null>(null);
    const isVariationFormValid = selectedColor.colorName !== "" && selectedSize !== "" && price !== "" && quantity !== "";

    // Prevent re-adding an existing colour+size combination.
    const variations = product?.variations ?? [];
    // Sizes already used for the colour currently chosen in the form.
    const takenSizesForSelectedColor = variations
        .filter((variation: IVariation) => variation.colorValue === selectedColor.colorName)
        .map((variation: IVariation) => variation.size);
    // A colour is "full" once every available size already has a variation.
    const isColorFull = (colorName: string) => {
        if (!uploadedSizes.length) return false;
        const takenSizes = variations
            .filter((variation: IVariation) => variation.colorValue === colorName)
            .map((variation: IVariation) => variation.size);
        return uploadedSizes.every((size: string) => takenSizes.includes(size));
    };

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 5: Variations</Text>
            <Text className="mt-2 font-montserratMedium">Set variations for your product item.</Text>

            <View className="h-auto w-full mt-5 px-5 py-4 rounded-xl border border-blue-800 bg-blue-50">
                <Text className="font-montserratSemiBold text-xs text-gray-700">Note:</Text>
                <Text className="font-montserratMedium text-justify text-xs text-gray-700 leading-5">You can add multiple variations to your product. For example, if you are selling a shoe,
                    you can add different sizes and colors as variations. Start by selecting one of the selected colors and then add the sizes, price and quantity.
                </Text>
            </View>

            {/* ==== Addded Variations ==== */}
            { product?.variations && product?.variations.length > 0 && (
                <>
                    <Text className="mt-6 font-montserratSemiBold text-xs text-gray-700">Added Variations</Text>
                    <View className="h-auto w-full mt-2 px-3 pt-2 rounded-lg border border-gray-200">
                        { product?.variations?.map((variation: IVariation) => (
                            <View key={variation._id} className="h-auto w-full mt-4 pb-4 border-b border-b-gray-200">
                                <View className="h-auto w-full flex-row items-start justify-between gap-x-4">
                                    <View className="flex-1">
                                        <Text className="font-montserratMedium text-xs">SKU</Text>
                                        <Text numberOfLines={2} className="font-montserratSemiBold text-sm">{ variation.sku! }</Text>
                                    </View>
                                    <View className="shrink-0 max-w-[90px] items-end">
                                        <Text className="font-montserratMedium text-xs">Size</Text>
                                        <Text numberOfLines={1} className="font-montserratSemiBold text-sm text-black">{ variation.size! }</Text>
                                    </View>
                                </View>

                                <View className="h-auto w-full mt-4 flex-row items-center justify-start gap-x-2">
                                    <View className="flex-1">
                                        <Text className="font-montserratMedium text-xs">Color</Text>
                                        <Text className="font-montserratSemiBold text-sm text-black">{ variation.colorValue! }</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-montserratMedium text-xs">Price</Text>
                                        <Text className="font-montserratSemiBold text-sm">{ variation.price! }</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-montserratMedium text-xs">Quantity</Text>
                                        <Text className="font-montserratSemiBold text-sm">{ variation.quantity! }</Text>
                                    </View>
                                </View>

                                <View className="h-auto w-full mt-4 flex-row items-center justify-end gap-x-2">
                                    <TouchableOpacity
                                        onPress={ async () => {
                                            setDeletingVariationId(variation._id ?? null);
                                            try {
                                                await handleDeleteProductVariation(variation);
                                            } finally {
                                                setDeletingVariationId(null);
                                            }
                                        } }
                                        disabled={ productIsLoading }
                                        className={`h-auto w-auto px-3 py-2 flex-row items-center justify-center rounded-lg bg-red-50 ${ productIsLoading ? "opacity-60" : "" }`}
                                    >
                                        { deletingVariationId === variation._id
                                            ? <ActivityIndicator size="small" color="#b91c1c" />
                                            : <Text className="font-montserratMedium text-xs text-red-700">Delete</Text>
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        disabled={ productIsLoading }
                                        onPress={ () => {
                                            setButtonActionType("Edit");
                                            setSelectedVariation(variation);
                                            setSelectedColor({
                                                colorName: variation?.colorValue!,
                                                colorCode: uploadedColorOptions.find((color) => color.colorName === variation?.colorValue!)?.colorCode!
                                            });
                                            setSelectedSize(variation?.size!);
                                            setPrice(variation?.price!.toString());
                                            setQuantity(variation?.quantity!.toString());
                                            setShowAddVariations(true);
                                        } }
                                        className={`h-auto w-auto px-3 py-2 flex-row items-center justify-center rounded-lg bg-blue-50 ${ productIsLoading ? "opacity-60" : "" }`}
                                    >
                                        <Text className="font-montserratMedium text-xs text-blue-700">Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </>
            ) }

            {/* ==== Add Variations ==== */}
            { showAddVariations && (
                <View className="h-auto w-full mt-5 px-4 pt-3 pb-4 rounded-xl border border-gray-200 bg-gray-50">
                    <View className="h-auto w-full flex-row items-center justify-between">
                        <Text className="font-montserratSemiBold text-base text-gray-700">Add Variations</Text>
                        <TouchableOpacity
                            onPress={ () => setShowAddVariations(false) }
                            className="p-1.5 bg-lightGray rounded-lg">
                            <Add size={ 30 } className="text-baseGreen" style={{ transform: [{ rotate: "45deg" }] }} />
                        </TouchableOpacity>
                    </View>

                    {/* ==== Color ==== */}
                    <View>
                        <Text aria-label="AgeGroup" nativeID="ageGroup" className="mt-5 ml-2 font-montserratMedium">Color</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                            { showColorsDropDown ? (
                                <>
                                    <TouchableOpacity
                                        onPress={ () => setShowColorsDropDown(!showColorsDropDown) }
                                        className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                                    >
                                        <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select a color</Text>
                                        <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                                    </TouchableOpacity>

                                    <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                                        <ScrollView
                                            nestedScrollEnabled={true}
                                            showsVerticalScrollIndicator={true}
                                            contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                                        >
                                            { uploadedColorOptions.map((color: IColorOption, index: number) => {
                                                const colorDisabled = isColorFull(color.colorName);
                                                return (
                                                    <View key={ index } className="flex-row items-center gap-x-2">
                                                        <TouchableOpacity
                                                            disabled={ colorDisabled }
                                                            onPress={ () => {
                                                                setSelectedColor(color);
                                                                setShowColorsDropDown(false);
                                                            } }
                                                            className={`h-auto w-full px-2 py-3 flex-row items-center justify-start space-x-2 ${ colorDisabled ? "opacity-40" : "" }`}
                                                        >
                                                            <View className="h-5 w-5 py-2.5 rounded-lg border border-gray-300" style={{ backgroundColor: color.colorCode }} />
                                                            <Text className="font-montserratMedium text-sm">{ color.colorName }</Text>
                                                            { colorDisabled && <Text className="font-montserratMedium text-[10px] text-gray-400">(all sizes added)</Text> }
                                                        </TouchableOpacity>
                                                    </View>
                                                );
                                            }) }
                                        </ScrollView>
                                    </View>
                                </>
                            ) : (
                                <TouchableOpacity
                                    onPress={ () => setShowColorsDropDown(!showColorsDropDown) }
                                    className="py-1.5 flex-row items-center justify-between"
                                >
                                    { selectedColor.colorName ? (
                                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                                            <View className="h-5 w-5 py-2.5 rounded-lg border border-gray-300" style={{ backgroundColor: selectedColor.colorCode }} />
                                            <Text className="h-auto flex-1 text-base text-[#9ca3af]">{ selectedColor.colorName }</Text>
                                        </View>
                                    ) : (
                                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select color</Text>
                                        </View>
                                    ) }
                                    <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                                </TouchableOpacity>
                            ) }
                        </View>
                    </View>

                    {/* ==== Sizes ==== */}
                    <View>
                        <Text aria-label="AgeGroup" nativeID="ageGroup" className="mt-5 ml-2 font-montserratMedium">Sizes</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                            { showSizesDropDown ? (
                                <>
                                    <TouchableOpacity
                                        onPress={ () => setShowSizesDropDown(!showSizesDropDown) }
                                        className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                                    >
                                        <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select a size</Text>
                                        <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                                    </TouchableOpacity>

                                    <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                                        <ScrollView
                                            nestedScrollEnabled={true}
                                            showsVerticalScrollIndicator={true}
                                            contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                                        >
                                            { uploadedSizes.map((item: string, index: number) => {
                                                const sizeDisabled = takenSizesForSelectedColor.includes(item);
                                                return (
                                                    <View key={ index } className="flex-row items-center gap-x-2">
                                                        <TouchableOpacity
                                                            disabled={ sizeDisabled }
                                                            onPress={ () => {
                                                                setSelectedSize(item);
                                                                setShowSizesDropDown(false);
                                                            } }
                                                            className={`h-auto w-full px-2 py-2 flex-row items-center justify-between ${ sizeDisabled ? "opacity-40" : "" }`}
                                                        >
                                                            <Text className="font-montserratMedium text-sm">{ item }</Text>
                                                            { sizeDisabled && <Text className="font-montserratMedium text-[10px] text-gray-400">Added</Text> }
                                                        </TouchableOpacity>
                                                    </View>
                                                );
                                            }) }
                                        </ScrollView>
                                    </View>
                                </>
                            ) : (
                                <TouchableOpacity
                                    onPress={ () => setShowSizesDropDown(!showSizesDropDown) }
                                    className="py-1.5 flex-row items-center justify-between"
                                >
                                    <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                                        <Text className="h-auto flex-1 text-base text-[#9ca3af]" >{ selectedSize ? selectedSize : "Select size" }</Text>
                                    </View>
                                    <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                                </TouchableOpacity>
                            ) }
                        </View>
                    </View>

                    {/* ==== Price ==== */}
                    <View>
                        <Text aria-label="Price" nativeID="price" className="mt-5 ml-2 font-montserratMedium">Price</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                            <TextInput
                                aria-label="Price"
                                aria-labelledby="price"
                                value={ price.toString() }
                                keyboardType="number-pad"
                                textContentType="givenName"
                                placeholder="Enter amount"
                                placeholderTextColor="#9ca3af"
                                className="h-[44px] font-montserratMedium text-base"
                                onChangeText={(value) => setPrice(value)}
                            />
                        </View>
                    </View>

                    {/* ==== Quantity ==== */}
                    <View>
                        <Text aria-label="Quantity" nativeID="quantity" className="mt-5 ml-2 font-montserratMedium">Quantity</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                            <TextInput
                                aria-label="Quantity"
                                aria-labelledby="quantity"
                                value={ quantity.toString() }
                                keyboardType="number-pad"
                                textContentType="givenName"
                                placeholder="Enter amount"
                                placeholderTextColor="#9ca3af"
                                className="h-[44px] font-montserratMedium text-base"
                                onChangeText={(value) => setQuantity(value)}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={ async () => {
                            if (buttonActionType === "Add") {
                                await handleAddProductVariation();
                            } else {
                                await handleUpdateProductVariation();
                            }
                            setShowAddVariations(false);
                        } }
                        disabled={ !isVariationFormValid || productIsLoading }
                        className={`h-[55px] w-full mt-8 flex-row items-center justify-center rounded-xl ${ isVariationFormValid ? "bg-baseGreen" : "bg-gray-200" }`}
                    >
                        { productIsLoading
                            ? <ActivityIndicator color="#FFFFFF" />
                            : <Text className="font-montserratMedium text-base text-white">{ (buttonActionType === "Add") ? "Add Variation" : "Update Variation"}</Text>
                        }
                    </TouchableOpacity>
                </View>
            ) }

            {/* ==== Add Variations Button ==== */}
            { !showAddVariations && (
                <TouchableOpacity
                    onPress={ () => {
                        setButtonActionType("Add");
                        setSelectedVariation({} as IVariation);
                        setSelectedColor({} as IColorOption);
                        setSelectedSize("");
                        setPrice("");
                        setQuantity("");
                        setShowAddVariations(!showAddVariations);
                    } }
                    disabled={ productIsLoading }
                    className={`h-[55px] w-full mt-4 flex-row items-center justify-center rounded-xl bg-blue-50 ${ productIsLoading ? "opacity-60" : "" }`}
                >
                    <Text className="font-montserratMedium text-base text-blue-700">Add Variation</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default StepFiveComponent;
