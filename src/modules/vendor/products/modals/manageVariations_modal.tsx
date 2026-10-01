import React, { useState } from "react";
import { Alert, Image, Modal, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { Add, CloseCircle, Edit2, InfoCircle, Trash } from "iconsax-react-native";
import { RootState } from "../../../../redux/store/store";
import { IVariation } from "../models/vendorProductDetails_model";
import useVariationManagerHook from "../hooks/variationManager_hook";
import VariationFormModal from "./variationForm_modal";
import AddVariationModal from "./addVariation_modal";
import useDisplayCurrency from "../../../general/hooks/displayCurrency_hook";

interface IProps {
    visible: boolean;
    onClose: () => void;
}

const Row: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <View className="mt-1 flex-row items-center">
        <Text className="font-montserratSemiBold text-sm text-gray-700">{ label }: </Text>
        <Text className="font-montserratMedium text-sm text-gray-500">{ value ?? "-" }</Text>
    </View>
);

const ManageVariationsModal: React.FC<IProps> = ({ visible, onClose }) => {
    const { product } = useSelector((state: RootState) => state.vendorProductState);
    const { formatPrice } = useDisplayCurrency();
    const {
        productIsLoading, colorOptions, sizes, availableCombos, previewSku,
        handleAddVariations, handleUpdateVariation, handleDeleteVariation,
    } = useVariationManagerHook();

    const variations: IVariation[] = product?.variations ?? [];

    const [showInfo, setShowInfo] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingVariation, setEditingVariation] = useState<IVariation | null>(null);

    const confirmDelete = (variation: IVariation) => {
        Alert.alert(
            "Delete variation",
            `Remove ${ variation.sku ?? "this variation" }? This can't be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => { void handleDeleteVariation(variation.sku); } },
            ],
        );
    };

    return (
        <Modal visible={ visible } animationType="slide" onRequestClose={ onClose }>
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

                {/*==== Header ====*/}
                <View className="px-5 pt-3">
                    <View className="h-auto w-full flex-row items-start justify-between">
                        <Text className="font-montserratMedium text-2xl text-gray-700">Manage Variations</Text>

                        <TouchableOpacity onPress={ onClose }>
                            <Image
                                className="h-[30px] w-[30px]"
                                source={ require("../../../../../assets/images/close.png") }
                            />
                        </TouchableOpacity>
                    </View>

                    <LinearGradient
                        colors={[
                            "rgba(229, 231, 235, 0)",
                            "#e5e7eb",
                            "#9ca3af",
                            "#e5e7eb",
                            "rgba(229, 231, 235, 0)"
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-[1px] w-full mt-3 rounded"
                    />
                </View>

                <ScrollView showsVerticalScrollIndicator={ false } contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
                    {/*==== Info alert ====*/}
                    { showInfo && (
                        <View className="p-4 flex-row rounded-2xl bg-blue-50">
                            <InfoCircle size={ 22 } color="#2563eb" variant="Bold" />
                            <View className="flex-1 ml-3">
                                <Text className="font-montserratSemiBold text-sm text-blue-700">Info alert!</Text>
                                <Text className="mt-1 font-montserratMedium text-xs text-gray-600 leading-5">
                                    You can add multiple variations to your product. For example, if you are selling a T-shirt,
                                    you can add different sizes and colours as variations. Start by selecting one of the selected
                                    colours and then add the sizes, price and quantity.
                                </Text>
                            </View>
                            <TouchableOpacity onPress={ () => setShowInfo(false) } className="ml-2">
                                <CloseCircle size={ 20 } color="#2563eb" />
                            </TouchableOpacity>
                        </View>
                    ) }

                    {/*==== Added variations ====*/}
                    <Text className="mt-6 font-montserratSemiBold text-[15px] text-gray-700">Added Variations</Text>

                    { variations.length === 0 ? (
                        <View className="mt-3 py-10 items-center">
                            <Text className="font-montserratMedium text-sm text-gray-400 text-center">No variations yet. Tap "Add Variation" to create one.</Text>
                        </View>
                    ) : (
                        <View className="mt-2 gap-y-3">
                            { variations.map((variation, index) => (
                                <View key={ variation._id ?? variation.sku ?? index } className="p-4 rounded-2xl border border-gray-200 bg-lightGray">
                                    <Row label="SKU" value={ variation.sku } />
                                    <Row label="Colour" value={ variation.colorValue } />
                                    <Row label="Size" value={ variation.size } />
                                    <Row label="Price" value={ variation.price != null ? formatPrice(variation.price, variation.currency) : undefined } />
                                    <Row label="Quantity" value={ variation.quantity != null ? String(variation.quantity) : undefined } />

                                    <View className="mt-3 flex-row items-center justify-end gap-x-2">
                                        <TouchableOpacity
                                            onPress={ () => confirmDelete(variation) }
                                            disabled={ productIsLoading }
                                            className={ `px-4 py-2 flex-row items-center gap-x-1 rounded-lg bg-red-50 ${ productIsLoading ? "opacity-60" : "" }` }
                                        >
                                            <Trash size={ 15 } color="#b91c1c" variant="Bold" />
                                            <Text className="font-montserratMedium text-xs text-red-700">Delete</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={ () => setEditingVariation(variation) }
                                            disabled={ productIsLoading }
                                            className={ `px-5 py-2 flex-row items-center gap-x-1 rounded-lg bg-baseGreen ${ productIsLoading ? "opacity-60" : "" }` }
                                        >
                                            <Edit2 size={ 15 } color="#ffffff" variant="Bold" />
                                            <Text className="font-montserratMedium text-xs text-white">Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )) }
                        </View>
                    ) }

                    {/*==== Add variation ====*/}
                    <TouchableOpacity
                        onPress={ () => setShowAddModal(true) }
                        disabled={ productIsLoading }
                        className={ `h-[55px] mt-6 flex-row items-center justify-center gap-x-2 rounded-xl bg-baseGreen ${ productIsLoading ? "opacity-60" : "" }` }
                    >
                        <Add size={ 20 } color="#ffffff" />
                        <Text className="font-montserratSemiBold text-base text-white">Add Variation</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/*==== Edit (reusable form) ====*/}
                <VariationFormModal
                    visible={ !!editingVariation }
                    onClose={ () => setEditingVariation(null) }
                    mode="edit"
                    variation={ editingVariation }
                    colorOptions={ colorOptions }
                    sizes={ sizes }
                    isLoading={ productIsLoading }
                    onSubmit={ handleUpdateVariation }
                />

                {/*==== Add (quick picker + manual) ====*/}
                <AddVariationModal
                    visible={ showAddModal }
                    onClose={ () => setShowAddModal(false) }
                    availableCombos={ availableCombos }
                    colorOptions={ colorOptions }
                    sizes={ sizes }
                    previewSku={ previewSku }
                    isLoading={ productIsLoading }
                    onSubmit={ handleAddVariations }
                />
            </SafeAreaView>
        </Modal>
    );
};

export default ManageVariationsModal;
