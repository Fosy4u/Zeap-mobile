import React, { useEffect, useState } from 'react';
import { Modal, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import IVendorProductDetails from '../models/vendorProductDetails_model';
import PriceAdjustmentModal from '../modals/priceAdjustment_modal';
import { useSaveAutoPricePercentageMutation } from '../apis/bespokeProduct_api';
import { showAppToast } from '../../../general/slices/general_slice';
import handleError from '../../../general/hooks/errorHandler_hook';

interface IProps {
    product: IVendorProductDetails;
    onUpdated: () => void;
}

const VendorAutoPriceAdjustmentComponent: React.FC<IProps> = ({ product, onUpdated }) => {
    const dispatch = useDispatch();
    const savedPercentage = product.autoPriceAdjustment?.adjustmentPercentage ?? 0;
    const savedIsAdjustable = !!product.autoPriceAdjustment?.isAdjustable && savedPercentage > 0;

    const [autoPricePercentage, setAutoPricePercentage] = useState(String(savedPercentage));
    const [isAutoPriceAdjustment, setIsAutoPriceAdjustment] = useState(savedIsAdjustable);
    const [showPriceAdjustmentModal, setShowPriceAdjustmentModal] = useState(false);
    const [priceAdjustmentModalType, setPriceAdjustmentModalType] = useState("Activate");
    const [saveAutoPricePercentage, { isLoading }] = useSaveAutoPricePercentageMutation();

    useEffect(() => {
        setAutoPricePercentage(String(savedPercentage));
        setIsAutoPriceAdjustment(savedIsAdjustable);
    }, [savedPercentage, savedIsAdjustable]);

    const saveAdjustment = async (isAdjustable: boolean, adjustmentPercentage: number) => {
        try {
            await saveAutoPricePercentage({ productId: product.productId, isAdjustable, adjustmentPercentage }).unwrap();
            setShowPriceAdjustmentModal(false);
            dispatch(showAppToast({ title: "Auto price adjustment", message: "Product successfully updated." }));
            onUpdated();
        } catch (error) {
            handleError(error);
        }
    };

    const openModal = (type: "Activate" | "Deactivate") => {
        setPriceAdjustmentModalType(type);
        setShowPriceAdjustmentModal(true);
    };

    const closeModal: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
        setShowPriceAdjustmentModal(value);
        setAutoPricePercentage(String(savedPercentage));
        setIsAutoPriceAdjustment(savedIsAdjustable);
    };

    return (
        <View className="h-auto w-full mt-2 px-3 py-4 border border-gray-200 rounded-xl bg-lightGray">
            <View className="flex-row items-center justify-between">
                <Text className="flex-1 mr-3 font-montserratMedium text-sm text-gray-700">Enable auto price adjustment</Text>
                <Switch
                    value={ savedIsAdjustable }
                    onValueChange={ (enabled) => openModal(enabled ? "Activate" : "Deactivate") }
                    trackColor={{ false: "#d1d5db", true: "#133522" }}
                    thumbColor="#FFFFFF"
                />
            </View>

            { savedIsAdjustable && (
                <>
                    <Text className="mt-4 font-montserratMedium text-sm text-gray-700">Adjustment Percentage</Text>
                    <TouchableOpacity
                        onPress={ () => openModal("Activate") }
                        className="h-auto w-full mt-2 py-3.5 rounded-xl border border-green-800 bg-green-50"
                    >
                        <Text className="font-montserratSemiBold text-base text-center text-baseGreen">{ savedPercentage }%</Text>
                    </TouchableOpacity>
                    <Text className="mt-1.5 font-montserratMedium text-xs text-gray-500">Tap the percentage to change it.</Text>
                </>
            ) }

            <Modal visible={ showPriceAdjustmentModal } transparent animationType="fade" statusBarTranslucent onRequestClose={ () => closeModal(false) }>
                <PriceAdjustmentModal
                    priceAdjustmentModalType={ priceAdjustmentModalType }
                    autoPricePercentage={ autoPricePercentage }
                    productIsLoading={ isLoading }
                    setAutoPricePercentage={ setAutoPricePercentage }
                    setShowPriceAdjustmentModal={ closeModal }
                    setIsAutoPriceAdjustment={ setIsAutoPriceAdjustment }
                    handleSaveAutoPricePercentage={ () => saveAdjustment(true, Number(autoPricePercentage)) }
                    handleDeactivateAutoPriceAdjustment={ () => saveAdjustment(false, 0) }
                />
            </Modal>
        </View>
    );
};

export default VendorAutoPriceAdjustmentComponent;
