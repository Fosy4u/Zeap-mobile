import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CloseCircle } from "iconsax-react-native";
import { IColorOption, IVariationCombo, IVariationInput } from "../hooks/variationManager_hook";
import VariationFieldsComponent from "../components/variationFields_component";
import useShopCurrency from "../../general/hooks/shopCurrency_hook";

interface IProps {
    visible: boolean;
    onClose: () => void;
    availableCombos: IVariationCombo[];
    colorOptions: IColorOption[];
    sizes: string[];
    previewSku: (size: string, colorName: string) => string;
    isLoading: boolean;
    onSubmit: (inputs: IVariationInput[]) => Promise<boolean>;
}

interface ISelection {
    selected: boolean;
    price: string;
    quantity: string;
}

const comboKey = (combo: IVariationCombo) => `${ combo.colorName }|${ combo.size }`;

const AddVariationModal: React.FC<IProps> = ({ visible, onClose, availableCombos, colorOptions, sizes, previewSku, isLoading, onSubmit }) => {
    const { entrySymbol } = useShopCurrency();
    // ON = auto-generate remaining combos (new quick pattern); OFF = original
    // manual single-variation flow.
    const [quickPicker, setQuickPicker] = useState(true);

    // Quick-picker state
    const [useDefaultPrice, setUseDefaultPrice] = useState(false);
    const [defaultPrice, setDefaultPrice] = useState("");
    const [selections, setSelections] = useState<Record<string, ISelection>>({});

    // Manual state
    const [manualColor, setManualColor] = useState<IColorOption | null>(null);
    const [manualSize, setManualSize] = useState("");
    const [manualPrice, setManualPrice] = useState("");
    const [manualQuantity, setManualQuantity] = useState("");

    // Reset everything whenever the modal re-opens.
    useEffect(() => {
        if (!visible) return;
        setQuickPicker(true);
        setUseDefaultPrice(false);
        setDefaultPrice("");
        setSelections({});
        setManualColor(null);
        setManualSize("");
        setManualPrice("");
        setManualQuantity("");
    }, [visible]);

    const setSelection = (key: string, patch: Partial<ISelection>) =>
        setSelections((prev) => {
            const base: ISelection = prev[key] ?? { selected: false, price: "", quantity: "" };
            return { ...prev, [key]: { ...base, ...patch } };
        });

    const toggleSelect = (key: string) =>
        setSelections((prev) => {
            const current = prev[key] ?? { selected: false, price: "", quantity: "" };
            return { ...prev, [key]: { ...current, selected: !current.selected } };
        });

    const selectAll = () => {
        const next: Record<string, ISelection> = {};
        availableCombos.forEach((combo) => {
            const key = comboKey(combo);
            next[key] = { selected: true, price: selections[key]?.price ?? "", quantity: selections[key]?.quantity ?? "" };
        });
        setSelections(next);
    };
    const clearAll = () => setSelections({});

    const selectedCount = availableCombos.filter((combo) => selections[comboKey(combo)]?.selected).length;

    // Quick-picker rows that have everything they need to be saved.
    const readyInputs: IVariationInput[] = useMemo(() => {
        return availableCombos
            .filter((combo) => selections[comboKey(combo)]?.selected)
            .map((combo) => {
                const selection = selections[comboKey(combo)];
                const price = useDefaultPrice ? defaultPrice : selection.price;
                return { combo, price, quantity: selection.quantity };
            })
            .filter((row) => row.price !== "" && row.quantity !== "")
            .map((row) => ({ colorValue: row.combo.colorName, size: row.combo.size, price: Number(row.price), quantity: Number(row.quantity) }));
    }, [availableCombos, selections, useDefaultPrice, defaultPrice]);

    const manualValid = !!manualColor?.colorName && !!manualSize && manualPrice !== "" && manualQuantity !== "";

    const handleAdd = async () => {
        let inputs: IVariationInput[] = [];
        if (quickPicker) {
            if (readyInputs.length === 0) return;
            inputs = readyInputs;
        } else {
            if (!manualValid) return;
            inputs = [{ colorValue: manualColor!.colorName, size: manualSize, price: Number(manualPrice), quantity: Number(manualQuantity) }];
        }
        const ok = await onSubmit(inputs);
        if (ok) onClose();
    };

    const footerCount = quickPicker ? readyInputs.length : (manualValid ? 1 : 0);
    const footerDisabled = footerCount === 0 || isLoading;

    return (
        <Modal visible={ visible } transparent animationType="fade" onRequestClose={ onClose }>
            <View className="flex-1 items-center justify-center bg-black/50 px-5">
                <View className="w-full max-h-[88%] rounded-2xl bg-white overflow-hidden">
                    {/*==== Header ====*/}
                    <View className="px-5 pt-5 pb-3 flex-row items-center justify-between border-b border-gray-100">
                        <Text className="font-montserratSemiBold text-lg text-baseGreen">Add Variation</Text>
                        <TouchableOpacity onPress={ onClose } disabled={ isLoading }>
                            <CloseCircle size={ 26 } color="#9ca3af" variant="Bold" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={ false } contentContainerStyle={{ padding: 20, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
                        {/*==== Quick variation picker toggle ====*/}
                        <View className="px-4 py-3 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-gray-50">
                            <View className="flex-1 mr-3">
                                <Text className="font-montserratSemiBold text-sm text-gray-700">Quick variation picker</Text>
                                <Text className="mt-0.5 font-montserratMedium text-xs text-gray-500">Toggle to auto-generate remaining SKUs instead of selecting colour & size manually</Text>
                            </View>
                            <Switch value={ quickPicker } onValueChange={ setQuickPicker } trackColor={{ false: "#d1d5db", true: "#16a34a" }} thumbColor="#ffffff" />
                        </View>

                        { quickPicker ? (
                            <>
                                {/*==== Default price ====*/}
                                <View className="mt-3 px-4 py-3 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-gray-50">
                                    <View className="flex-1 mr-3">
                                        <Text className="font-montserratSemiBold text-sm text-gray-700">Default price</Text>
                                        <Text className="mt-0.5 font-montserratMedium text-xs text-gray-500">Optionally set one price for every selected variation</Text>
                                    </View>
                                    <Switch value={ useDefaultPrice } onValueChange={ setUseDefaultPrice } trackColor={{ false: "#d1d5db", true: "#16a34a" }} thumbColor="#ffffff" />
                                </View>

                                { useDefaultPrice && (
                                    <View className="mt-3 flex-row items-center rounded-xl border border-gray-200 overflow-hidden">
                                        <View className="h-[52px] w-12 items-center justify-center bg-baseGreen">
                                            <Text className="font-montserratSemiBold text-gold text-base">{ entrySymbol }</Text>
                                        </View>
                                        <TextInput
                                            value={ defaultPrice }
                                            keyboardType="number-pad"
                                            placeholder="Default price"
                                            placeholderTextColor="#9ca3af"
                                            className="h-[44px] flex-1 px-3 font-montserratMedium text-base text-black"
                                            onChangeText={ (text) => setDefaultPrice(text.replace(/[^0-9]/g, "")) }
                                        />
                                    </View>
                                ) }

                                {/*==== Count row ====*/}
                                <View className="mt-5 flex-row items-center justify-between">
                                    <View className="flex-row items-center gap-x-2">
                                        <Text className="px-3 py-1 rounded-full bg-gray-100 font-montserratMedium text-xs text-gray-700">{ availableCombos.length } available</Text>
                                        <Text className="px-3 py-1 rounded-full bg-gray-100 font-montserratMedium text-xs text-gray-700">{ selectedCount } selected</Text>
                                    </View>
                                    { availableCombos.length > 0 && (
                                        <View className="flex-row items-center gap-x-3">
                                            <TouchableOpacity onPress={ selectAll }>
                                                <Text className="font-montserratSemiBold text-xs text-baseGreen">Select all</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={ clearAll }>
                                                <Text className="font-montserratSemiBold text-xs text-gray-400">Clear</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) }
                                </View>

                                {/*==== Combos ====*/}
                                { availableCombos.length === 0 ? (
                                    <View className="mt-4 px-4 py-5 rounded-xl bg-lightOrange">
                                        <Text className="font-montserratMedium text-sm text-amber-700">
                                            No remaining variations found. Make sure the product has sizes and colors, and existing combinations are not exhausted.
                                        </Text>
                                    </View>
                                ) : (
                                    <View className="mt-3 gap-y-3">
                                        { availableCombos.map((combo) => {
                                            const key = comboKey(combo);
                                            const selection = selections[key] ?? { selected: false, price: "", quantity: "" };
                                            return (
                                                <View key={ key } className="p-4 rounded-2xl border border-gray-200 bg-gray-50">
                                                    <Text className="font-montserratMedium text-[11px] uppercase tracking-wider text-gray-400">SKU preview</Text>
                                                    <Text className="mt-1 font-montserratSemiBold text-sm text-gray-800">{ previewSku(combo.size, combo.colorName) }</Text>

                                                    <View className="mt-2 flex-row items-center">
                                                        <View className="px-3 py-1.5 flex-row items-center gap-x-1.5 rounded-lg bg-pink-100">
                                                            <View className="h-3 w-3 rounded-full border border-gray-300" style={{ backgroundColor: combo.colorCode }} />
                                                            <Text className="font-montserratSemiBold text-xs text-gray-800">{ combo.size } • { combo.colorName }</Text>
                                                        </View>
                                                    </View>

                                                    <View className="mt-3 flex-row items-center gap-x-2">
                                                        <Switch value={ selection.selected } onValueChange={ () => toggleSelect(key) } trackColor={{ false: "#d1d5db", true: "#16a34a" }} thumbColor="#ffffff" />
                                                        <Text className="font-montserratMedium text-sm text-gray-700">{ selection.selected ? "Selected" : "Select" }</Text>
                                                    </View>

                                                    { selection.selected && (
                                                        <View className="mt-3">
                                                            { !useDefaultPrice && (
                                                                <>
                                                                    <Text className="font-montserratMedium text-gray-700">Price</Text>
                                                                    <View className="mt-1.5 flex-row items-center rounded-xl border border-gray-200 overflow-hidden">
                                                                        <View className="h-[48px] w-11 items-center justify-center bg-baseGreen">
                                                                            <Text className="font-montserratSemiBold text-gold">{ entrySymbol }</Text>
                                                                        </View>
                                                                        <TextInput
                                                                            value={ selection.price }
                                                                            keyboardType="number-pad"
                                                                            placeholder="Enter price"
                                                                            placeholderTextColor="#9ca3af"
                                                                            className="h-[44px] flex-1 px-3 font-montserratMedium text-base text-black"
                                                                            onChangeText={ (text) => setSelection(key, { price: text.replace(/[^0-9]/g, "") }) }
                                                                        />
                                                                    </View>
                                                                </>
                                                            ) }

                                                            <Text className="mt-3 font-montserratMedium text-gray-700">Qty</Text>
                                                            <View className="mt-1.5 px-3 rounded-xl border border-gray-200">
                                                                <TextInput
                                                                    value={ selection.quantity }
                                                                    keyboardType="number-pad"
                                                                    placeholder="Qty"
                                                                    placeholderTextColor="#9ca3af"
                                                                    className="h-[48px] font-montserratMedium text-base text-black"
                                                                    onChangeText={ (text) => setSelection(key, { quantity: text.replace(/[^0-9]/g, "") }) }
                                                                />
                                                            </View>
                                                        </View>
                                                    ) }
                                                </View>
                                            );
                                        }) }
                                    </View>
                                ) }

                                <Text className="mt-4 font-montserratMedium text-xs text-gray-500 leading-5">
                                    Toggle combinations to add them quickly. SKU is previewed immediately before saving.
                                </Text>
                            </>
                        ) : (
                            /*==== Manual single-variation flow ====*/
                            <View className="mt-4">
                                <VariationFieldsComponent
                                    colorOptions={ colorOptions }
                                    sizes={ sizes }
                                    selectedColor={ manualColor }
                                    setSelectedColor={ setManualColor }
                                    selectedSize={ manualSize }
                                    setSelectedSize={ setManualSize }
                                    price={ manualPrice }
                                    setPrice={ setManualPrice }
                                    quantity={ manualQuantity }
                                    setQuantity={ setManualQuantity }
                                />
                            </View>
                        ) }
                    </ScrollView>

                    {/*==== Footer ====*/}
                    <View className="px-5 py-4 flex-row items-center justify-between border-t border-gray-100">
                        <Text className="flex-1 mr-3 font-montserratMedium text-sm text-gray-500">
                            { footerCount } variation{ footerCount === 1 ? "" : "s" } ready to add
                        </Text>
                        <TouchableOpacity
                            onPress={ handleAdd }
                            disabled={ footerDisabled }
                            className={ `px-6 h-[52px] flex-row items-center justify-center rounded-xl bg-baseGreen ${ footerDisabled ? "opacity-60" : "" }` }
                        >
                            { isLoading
                                ? <ActivityIndicator color="#ffffff" />
                                : <Text className="font-montserratSemiBold text-sm text-white">Add { footerCount > 0 ? footerCount : "" } Variation{ footerCount === 1 ? "" : "s" }</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddVariationModal;
