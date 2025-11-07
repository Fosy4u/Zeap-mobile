import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import CheckBox from '@react-native-community/checkbox';

interface IProps {
    autoPricePercentage: string;
    isAutoPriceAdjustment: boolean;
    setIsAutoPriceAdjustment: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPriceAdjustmentModal: React.Dispatch<React.SetStateAction<boolean>>;
    setPriceAdjustmentModalType: React.Dispatch<React.SetStateAction<string>>;
};

const StepSixComponent: React.FC<IProps> = ({
        autoPricePercentage, isAutoPriceAdjustment, setIsAutoPriceAdjustment,
        setShowPriceAdjustmentModal, setPriceAdjustmentModalType,
    }) => {
    // console.log("IS AUTO PRICE ADJUSTMENT: ", isAutoPriceAdjustment);

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 6: Price Adjustment</Text>
            <Text className="mt-2 font-montserratMedium">Set variations for your product item.</Text>

            <View className="h-auto w-full mt-5 px-5 py-4 rounded-xl border border-blue-800 bg-blue-50">
                <Text className="font-montserratSemiBold text-xs text-gray-700">Note:</Text>
                <Text className="font-montserratMedium text-justify text-xs text-gray-700 leading-5">
                    Allow auto price adjustment for this product. If accepted, the price of this product will be adjusted by our automated system/admin based on market conditions like demand, competitor, inflation, exchange rate, etc.
                </Text>
                <Text className="font-montserratMedium text-justify text-xs text-gray-700 leading-5">
                    This will help you stay competitive in the market and increase your sales.
                </Text>
                <Text className="font-montserratMedium text-justify text-xs text-gray-700 leading-5">
                    The price adjustment would never go below or beyond your chosen percentage.
                </Text>
            </View>

            <Text aria-label="Auto Price Adjustment" nativeID="isAutoPriceAdjustment" className="mt-5 font-montserratSemiBold text-sm text-gray-700">Auto price adjustment</Text>
            <View className="h-auto w-full mt-1 flex-row items-center justify-start">
                <CheckBox
                    onValueChange={ () => {
                        setShowPriceAdjustmentModal(true);

                        if (autoPricePercentage === "" || autoPricePercentage === "0") {
                            setPriceAdjustmentModalType("Activate");
                            setIsAutoPriceAdjustment(false);
                        } else {
                            setPriceAdjustmentModalType("Deactivate");
                        }
                    } }
                    value={ isAutoPriceAdjustment }
                />
                <Text className="font-montserratMedium text-baseGreen">Enable auto price adjustment</Text>
            </View>

            { autoPricePercentage !== "0" && (
                <>
                    <Text aria-label="Auto Price Adjustment" nativeID="isAutoPriceAdjustment" className="mt-5 font-montserratSemiBold text-sm text-gray-700">Adjustment Percentage</Text>
                    <TouchableOpacity
                        onPress={ () => {
                            setPriceAdjustmentModalType("Activate");
                            setShowPriceAdjustmentModal(true);
                        } }
                        className="h-auto w-[50%] mt-2 px-5 py-4 rounded-xl border border-green-800 bg-green-50"
                    >
                        <Text className="font-montserratMedium font-semibold text-baseGreen text-base text-center">{ autoPricePercentage }%</Text>
                    </TouchableOpacity>
                </>
            )}

        </View>
    )
}
export default StepSixComponent;
