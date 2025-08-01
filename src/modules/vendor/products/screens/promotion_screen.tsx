import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import AppHeaderComp from '../../general/components/appHeader_comp';
import useVendorProductHook from '../hooks/vendorProduct_hook';
import AppLoader from '../../../general/components/appLoader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import IPromotion from '../models/promotion_model';
import FastImage from 'react-native-fast-image';
import { ArrowRight2 } from 'iconsax-react-native';

const PromotionScreen = () => {
    const { isLoading, loadingMessage } = useSelector((state: RootState) => state.generalState);

    const { promotions, handleGetAvailablePromos, selectedPromo, setSelectedPromo, handleApplyPromo, handleFormatDate } = useVendorProductHook();

    useEffect(() => {
        handleGetAvailablePromos();
    }, []);

    return (
        <SafeAreaView className="h-full w-full flex-1">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />

            {/*==== Header ====*/}
            <AppHeaderComp title="Promotions" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="h-full w-full mt-2 px-5 pt-3"
            >
                <View className="gap-3">
                    {promotions && promotions.length !== 0 ? (
                        promotions?.map((promotion: IPromotion) => (
                            <TouchableOpacity
                                key={promotion._id}
                                onPress={() => setSelectedPromo(promotion)}
                                className={`px-3 py-3.5 border rounded-xl ${ promotion._id === selectedPromo._id ? "border-green-600 bg-green-50" : "border-gray-300"}`}
                            >
                                <View className="flex-row justify-between">
                                    <Text className="font-montserratMedium text-base text-gray-700">
                                        Discount: { promotion?.discount?.fixedPercentage! }%
                                    </Text>
                                    <Text className={`px-2 py-1 flex items-center justify-center font-montserratMedium text-xs rounded-lg border ${
                                        promotion?.status === "live" 
                                        ? "border-green-300 bg-green-50" 
                                        : promotion?.status === "scheduled"
                                        ? "border-blue-300 bg-blue-50"
                                        : promotion?.status === "under review"
                                        ? "border-orange/30 bg-orange/10"
                                        : "border-red-300 bg-red-50"
                                    }`}>
                                        { promotion?.status && promotion?.status?.charAt(0).toUpperCase() + promotion?.status.slice(1) }
                                    </Text>
                                </View>

                                <View className="h-auto w-full mt-4 flex-row items-start space-x-3">
                                    <FastImage
                                        source={{
                                            uri: promotion?.smallScreenImageUrl?.link!,
                                            priority: FastImage.priority.normal
                                        }}
                                        defaultSource={ require("../../../../../assets/images/app_logo.png") }
                                        resizeMode={ FastImage.resizeMode.cover }
                                        fallback
                                        className="h-[100px] w-[100px] rounded-xl"
                                    />
                                    <View className="h-auto flex-1">
                                        <Text className="font-montserratMedium text-lg text-baseGreen">{ promotion?.title }</Text>
                                        <Text className="text-xs text-gray-500">({ promotion?.subTitle })</Text>

                                        <Text className="mt-1.5 text-sm text-gray-500">{ promotion?.description }</Text>
                                    </View>
                                </View>

                                <Text className="mt-3">
                                    { `${ handleFormatDate(promotion?.startDate!) } - ${ handleFormatDate(promotion?.endDate!) }` }
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View className="h-[100px] w-full flex items-center justify-center">
                            <Text className="text-base text-gray-500">No promotions found</Text>
                        </View>
                    )}
                </View>

                {/* ==== Apply Promotion Button ==== */}
                <TouchableOpacity
                    onPress={ () => handleApplyPromo() }
                    className="h-[55px] w-[80%] mx-auto mt-5 flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                    <Text className="text-lg text-white mr-2">Apply Promotion</Text>
                    <ArrowRight2 size={20} className="text-white" />
                </TouchableOpacity>
            </ScrollView>

            { isLoading && 
                <AppLoader loadingAdditionalMessage={ loadingMessage } />
            }
        </SafeAreaView>
    )
}

export default PromotionScreen