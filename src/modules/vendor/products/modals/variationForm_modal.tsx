import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CloseCircle } from "iconsax-react-native";
import { IVariation } from "../models/vendorProductDetails_model";
import { IBespokeVariationInput, IColorOption, IVariationInput } from "../hooks/variationManager_hook";
import VariationFieldsComponent from "../components/variationFields_component";
import BespokeVariationFieldsComponent from "../components/bespokeVariationFields_component";

interface IProps {
    visible: boolean;
    onClose: () => void;
    mode: "add" | "edit";
    variation?: IVariation | null;
    colorOptions: IColorOption[];
    sizes: string[];
    isLoading: boolean;
    onSubmit: (input: IVariationInput) => Promise<boolean>;
    isBespoke?: boolean;
    bespokeColorOptions?: IColorOption[];
    onSubmitBespoke?: (input: IBespokeVariationInput) => Promise<boolean>;
}

const VariationFormModal: React.FC<IProps> = ({
    visible, onClose, mode, variation, colorOptions, sizes, isLoading, onSubmit,
    isBespoke = false, bespokeColorOptions = [], onSubmitBespoke,
}) => {
    const [selectedColor, setSelectedColor] = useState<IColorOption | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [colourType, setColourType] = useState<string>("Single");
    const [selectedColors, setSelectedColors] = useState<IColorOption[]>([]);

    useEffect(() => {
        if (!visible) return;

        if (isBespoke) {
            const bespoke = variation?.bespoke;
            const storedType = bespoke?.colorType ?? "single";
            setColourType(storedType.charAt(0).toUpperCase() + storedType.slice(1));
            setSelectedColors((bespoke?.availableColors ?? []).map((colorName) => ({
                colorName,
                colorCode: bespokeColorOptions.find((color) => color.colorName === colorName)?.colorCode ?? "#e5e7eb",
            })));
            setPrice(variation?.price != null ? String(variation.price) : "");
            return;
        }

        if (mode === "edit" && variation) {
            setSelectedColor({
                colorName: variation.colorValue ?? "",
                colorCode: colorOptions.find((color) => color.colorName === variation.colorValue)?.colorCode ?? "#e5e7eb",
            });
            setSelectedSize(variation.size ?? "");
            setPrice(variation.price != null ? String(variation.price) : "");
            setQuantity(variation.quantity != null ? String(variation.quantity) : "");
        } else {
            setSelectedColor(null);
            setSelectedSize("");
            setPrice("");
            setQuantity("");
        }
    }, [visible, mode, variation, isBespoke]);

    const toggleColor = (color: IColorOption) => {
        setSelectedColors((previous) => previous.some((item) => item.colorName === color.colorName)
            ? previous.filter((item) => item.colorName !== color.colorName)
            : [...previous, color]);
    };

    const isValid = isBespoke
        ? price !== "" && (colourType === "Multiple" || selectedColors.length > 0)
        : !!selectedColor?.colorName && !!selectedSize && price !== "" && quantity !== "";

    const handleSubmit = async () => {
        if (!isValid) return;

        if (isBespoke) {
            if (!onSubmitBespoke) return;
            const ok = await onSubmitBespoke({
                price: Number(price),
                colorType: colourType.toLowerCase(),
                availableColors: colourType === "Single" ? selectedColors.map((color) => color.colorName) : [],
            });
            if (ok) onClose();
            return;
        }

        const ok = await onSubmit({
            colorValue: selectedColor!.colorName,
            size: selectedSize,
            price: Number(price),
            quantity: Number(quantity),
            sku: mode === "edit" ? variation?.sku : undefined,
        });
        if (ok) onClose();
    };

    return (
        <Modal visible={ visible } transparent animationType="fade" onRequestClose={ onClose }>
            <View className="flex-1 items-center justify-center bg-black/50 px-5">
                <View className="w-full max-h-[85%] rounded-2xl bg-white overflow-hidden">
                    {/*==== Header ====*/}
                    <View className="px-5 pt-5 pb-3 flex-row items-start justify-between border-b border-gray-100">
                        <Text className="flex-1 mr-3 font-montserratSemiBold text-lg text-baseGreen">
                            { mode === "edit" ? `Edit Variation${ variation?.sku ? ` - ${ variation.sku }` : "" }` : "Add Variation" }
                        </Text>
                        <TouchableOpacity onPress={ onClose } disabled={ isLoading }>
                            <CloseCircle size={ 26 } color="#9ca3af" variant="Bold" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={ false } contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
                        { isBespoke ? (
                            <BespokeVariationFieldsComponent
                                colourType={ colourType }
                                setColourType={ setColourType }
                                colorOptions={ bespokeColorOptions }
                                selectedColors={ selectedColors }
                                toggleColor={ toggleColor }
                                price={ price }
                                setPrice={ setPrice }
                            />
                        ) : (
                            <VariationFieldsComponent
                                colorOptions={ colorOptions }
                                sizes={ sizes }
                                selectedColor={ selectedColor }
                                setSelectedColor={ setSelectedColor }
                                selectedSize={ selectedSize }
                                setSelectedSize={ setSelectedSize }
                                price={ price }
                                setPrice={ setPrice }
                                quantity={ quantity }
                                setQuantity={ setQuantity }
                            />
                        ) }

                        <Text className="mt-5 font-montserratMedium text-xs text-gray-500 leading-5">
                            { isBespoke
                                ? "Note: Bespoke products support a single variation. Use this form to update its price and bespoke colour setup."
                                : "Note: You can add multiple variations for the same colour and size. Each variation will have a unique SKU." }
                        </Text>

                        <TouchableOpacity
                            onPress={ handleSubmit }
                            disabled={ !isValid || isLoading }
                            className={ `h-[55px] mt-6 flex-row items-center justify-center rounded-xl bg-baseGreen ${ (!isValid || isLoading) ? "opacity-60" : "" }` }
                        >
                            { isLoading
                                ? <ActivityIndicator color="#ffffff" />
                                : <Text className="font-montserratSemiBold text-base text-white">{ mode === "edit" ? "Update Variation" : "Add Variation" }</Text>
                            }
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default VariationFormModal;
