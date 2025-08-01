import React from 'react';
import { SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface IProps {
    priceAdjustmentModalType: string;
    autoPricePercentage: string;
    setAutoPricePercentage: React.Dispatch<React.SetStateAction<string>>;
    setShowPriceAdjustmentModal: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAutoPriceAdjustment: React.Dispatch<React.SetStateAction<boolean>>;
    handleSaveAutoPricePercentage: () => void;
    handleDeactivateAutoPriceAdjustment: () => void;
};



const PriceAdjustmentModal: React.FC<IProps> = ({
        priceAdjustmentModalType, autoPricePercentage, setAutoPricePercentage,
        setShowPriceAdjustmentModal, setIsAutoPriceAdjustment,
        handleSaveAutoPricePercentage, handleDeactivateAutoPriceAdjustment,
    }) => {

    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />

            <View className="h-full w-full absolute inset-0 bg-black opacity-60"/>
            <View className={`w-[320px] rounded-2xl bg-white ${ priceAdjustmentModalType === "Activate" ? "h-[360px]" : "h-[270px]" }`}>
                <View className="h-[80px] w-full p-3 flex items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-baseGreen">
                    <Text className="font-montserratSemiBold text-white text-md">
                        { priceAdjustmentModalType === "Activate"
                            ? "Set Percentage Limit for Auto Price Adjustment."
                            : "Deactivate Auto Price Adjustment?"
                        }
                    </Text>
                </View>
                <View className="px-4 pb-2 flex-1">
                    <View className="h-auto w-full mt-3 px-3 py-2 rounded-xl border border-amber-400 bg-amber-50">
                        <Text className="font-montserratMedium text-justify text-xs text-gray-700 leading-5">
                            { priceAdjustmentModalType === "Activate"
                                ? "This action will set the percentage limit for auto price adjustment. The price adjustment would never go below or beyond your chosen percentage."
                                : "This action will disable auto price adjustment for this product. Are you sure you want to continue?"
                            }
                        </Text>
                    </View>

                    { priceAdjustmentModalType === "Activate" && (
                        <View className="h-auto w-full mt-5 px-3 py-0.5 flex-row items-center border rounded-xl border-gray-200 bg-gray-50">
                            <TextInput
                                aria-label="Product Title"
                                aria-labelledby="productTitle"
                                keyboardType="number-pad"
                                placeholder="Enter limit"
                                placeholderTextColor="#9ca3af"
                                className="flex-1 font-montserratMedium text-base"
                                // onBlur={ onBlur }
                                onChangeText={ (value) => {
                                    setAutoPricePercentage(value);
                                    (value === "" || value === "0") ? setIsAutoPriceAdjustment(false) : setIsAutoPriceAdjustment(true);
                                } }
                                value={ autoPricePercentage }
                            />
                            <Text className="font-montserratSemiBold text-base text-baseGreen">%</Text>
                        </View>
                    ) }
                    
                    { priceAdjustmentModalType === "Activate" ? (
                        <View className="h-auto w-full mt-6 flex-row justify-between space-x-3">
                            <TouchableOpacity
                                onPress={ () => {
                                    if (autoPricePercentage === "" || autoPricePercentage === "0") {
                                        setIsAutoPriceAdjustment(false);
                                    } else {
                                        setIsAutoPriceAdjustment(true);
                                    }

                                    setShowPriceAdjustmentModal(false);
                                } }
                                className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-red-50"
                            >
                                <Text className="font-montserratMedium text-red-700">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleSaveAutoPricePercentage() }
                                disabled={ autoPricePercentage === "" || autoPricePercentage === "0" }
                                className={ autoPricePercentage === "" || autoPricePercentage === "0" ? "h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-gray-200" : "h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen" }
                            >
                                <Text className="font-montserratRegular text-white">Save</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="h-auto w-full mt-6 flex-row justify-between space-x-3">
                            <TouchableOpacity
                                onPress={ () => setShowPriceAdjustmentModal(false) }
                                className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-red-50"
                            >
                                <Text className="font-montserratMedium text-red-700">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={ () => handleDeactivateAutoPriceAdjustment() }
                                className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                            >
                                <Text className="font-montserratRegular text-white">Yes, I'm sure</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    
                </View>
            </View>
        </SafeAreaView>
    );
}

export default PriceAdjustmentModal;