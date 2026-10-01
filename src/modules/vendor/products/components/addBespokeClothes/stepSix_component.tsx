import React, { useState } from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { CloseCircle, InfoCircle } from 'iconsax-react-native';

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

    const [showInfo, setShowInfo] = useState(true);

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 6: Price Adjustment</Text>
            <Text className="mt-2 font-montserratMedium">Set variations for your product item.</Text>

            { showInfo && (
                <View className="h-auto w-full mt-5 p-4 flex-row rounded-xl bg-blue-50">
                    <InfoCircle size={ 20 } color="#2563eb" variant="Bold" />
                    <View className="flex-1 ml-3">
                        <Text className="font-montserratSemiBold text-sm text-blue-700">Info alert!</Text>
                        <Text className="mt-2 font-montserratMedium text-xs text-blue-700 leading-5">
                            Allow auto price adjustment for this product. If accepted, the price of this product will be adjusted by our automated system/admin based on market conditions like demand, competition, inflation, exchange rate, etc.
                        </Text>
                        <Text className="mt-3 font-montserratMedium text-xs text-blue-700 leading-5">
                            This will help you stay competitive in the market and increase your sales.
                        </Text>
                        <Text className="mt-3 font-montserratMedium text-xs text-blue-700 leading-5">
                            The price adjustment will never go below or beyond your chosen percentage.
                        </Text>
                    </View>
                    <TouchableOpacity onPress={ () => setShowInfo(false) } className="ml-2">
                        <CloseCircle size={ 18 } color="#2563eb" />
                    </TouchableOpacity>
                </View>
            ) }

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
                    boxType="square"
                    lineWidth={ 1.5 }
                    tintColor="#151518"
                    onCheckColor="#ffffff"
                    onFillColor="#133522"
                    onTintColor="#133522"
                    animationDuration={ 0.15 }
                    style={{ height: 20, width: 20, marginRight: 8 }}
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
