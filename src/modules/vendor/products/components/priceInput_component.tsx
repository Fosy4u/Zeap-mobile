import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { useCommissionRate } from './pricingHeadsUp_component';

export const sanitizePrice = (value: string) => {
    const [whole, ...rest] = value.replace(/[^0-9.]/g, "").split(".");
    return rest.length ? `${ whole }.${ rest.join("").slice(0, 2) }` : whole;
};

export const formatAmount = (value: number | string, symbol = "₦") => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return `${ symbol }0`;
    return `${ symbol }${ amount.toLocaleString("en-US", { minimumFractionDigits: amount % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 }) }`;
};

export const groupDigits = (value: string) => {
    const [whole, decimals] = value.split(".");
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimals !== undefined ? `${ grouped }.${ decimals }` : grouped;
};

interface IProps {
    value: string;
    onChangeValue: (value: string) => void;
    productType?: string;
    placeholder?: string;
}

const PriceInputComponent: React.FC<IProps> = ({ value, onChangeValue, productType, placeholder = "Enter amount" }) => {
    const { shop } = useSelector((state: RootState) => state.vendorGeneralState);
    const symbol = shop?.currency?.symbol || "₦";
    const commissionRate = useCommissionRate(productType);
    const rawValue = sanitizePrice(String(value ?? ""));
    const amount = Number(rawValue);

    return (
        <View>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 flex-row items-center border rounded-xl border-gray-200 bg-gray-50">
                <Text className="mr-1 font-montserratMedium text-base text-gray-700">{ symbol }</Text>
                <TextInput
                    value={ groupDigits(rawValue) }
                    keyboardType="decimal-pad"
                    placeholder={ placeholder }
                    placeholderTextColor="#9ca3af"
                    className="h-[44px] flex-1 font-montserratMedium text-base"
                    onChangeText={ (text) => onChangeValue(sanitizePrice(text)) }
                />
            </View>
            { commissionRate !== null && rawValue !== "" && amount >= 0 && (
                <Text className="mt-1.5 ml-1 font-montserratMedium text-xs text-gray-500">
                    Zeaper takes { formatAmount(amount * commissionRate / 100, symbol) }. You keep about { formatAmount(amount * (100 - commissionRate) / 100, symbol) }.
                </Text>
            ) }
        </View>
    );
};

export default PriceInputComponent;
