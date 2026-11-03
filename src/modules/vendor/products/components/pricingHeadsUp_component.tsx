import React from 'react';
import { Text, View } from 'react-native';
import { InfoCircle } from 'iconsax-react-native';
import { useGetProductCommissionQuery } from '../apis/product_api';

export const useCommissionRate = (productType?: string): number | null => {
    const { data: commission } = useGetProductCommissionQuery();
    if (!productType || !commission) return null;
    const rate = productType.toLowerCase().startsWith("bespoke") ? commission.bespoke : commission.readyToWear;
    return Number.isFinite(rate) ? rate : null;
};

const PricingHeadsUpComponent: React.FC<{ productType?: string }> = ({ productType }) => {
    const commissionRate = useCommissionRate(productType);
    if (commissionRate === null) return null;

    return (
        <View className="h-auto w-full mt-3 p-4 flex-row rounded-xl bg-yellow-50">
            <InfoCircle size={ 20 } color="#a16207" variant="Bold" />
            <Text className="flex-1 ml-3 font-montserratMedium text-xs text-yellow-800 leading-5">
                <Text className="font-montserratSemiBold">Pricing heads-up. </Text>
                Zeaper commission for this product type is { commissionRate }%. You keep { 100 - commissionRate }% for each sale.
            </Text>
        </View>
    );
};

export default PricingHeadsUpComponent;
