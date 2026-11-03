import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppHeaderComp from '../../general/components/appHeader_comp';
import { ArrowRight } from 'iconsax-react-native';
import useVendorProductHook from '../hooks/vendorProduct_hook';
import IPromotion from '../models/promotion_model';
import PromoSkeletonLoader from '../components/promoSkeletonLoader_component';
import AppStatusBar from "../../../general/components/appStatusBar";

const PromoScreen = () => {

    const {
        promotions, handleGetAvailablePromos, selectedPromo, setSelectedPromo, handleApplyPromo,
        handleFormatDate, isLoadingPromotions,
        discountPercentage, setDiscountPercentage, isFixedPromo, promoRange,
    } = useVendorProductHook();

    const hasSelection = !!selectedPromo?.promoId;
    const isFixed = isFixedPromo(selectedPromo);
    const { min, max } = promoRange(selectedPromo);

    useEffect(() => {
        handleGetAvailablePromos();
    }, []);

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-gray-50">
            <AppStatusBar backgroundColor="#133522" barStyle="light-content" />
                    
            {/* ==== Header ==== */}
            <AppHeaderComp title="Join Promo" />
            
            <ScrollView
                showsHorizontalScrollIndicator={ false }
                className="h-full w-full px-5 py-5"
                contentContainerStyle={{ paddingBottom: 260 }}
            >
                <Text className="mt-1 font-montserratSemiBold text-gray-600">All ongoing promo</Text>

                <View className="h-auto w-full mt-3">
                    { isLoadingPromotions ? (
                        <PromoSkeletonLoader />
                    ) : promotions && promotions.length !== 0 ? (
                        promotions?.map((promotion: IPromotion) => (
                            <TouchableOpacity
                                key={ promotion._id }
                                onPress={ () => setSelectedPromo(promotion) }
                                className={`my-3 px-4 py-5 border rounded-xl ${ promotion._id === selectedPromo._id ? "border-lightGreen bg-green-50" : "border-gray-200 bg-grey-50"}`}
                            >
                                <Text className="font-montserratSemiBold text-baseGreen">{ promotion?.title }</Text>
                                <Text className="text-xs">({ promotion?.subTitle })</Text>
                                <Text className="mt-4 font-montserratMedium">
                                    { `${ handleFormatDate(promotion?.startDate!) } - ${ handleFormatDate(promotion?.endDate!) }` }
                                </Text>

                                <View className="mt-4 flex-row items-center space-x-2">
                                    <Text className="font-montserratMedium">
                                        Discount:
                                    </Text>
                                    <Text className="font-montserratSemiBold text-base text-baseGreen">
                                        { promotion?.discount?.type === "fixed"
                                            ? `${ promotion?.discount?.fixedPercentage ?? 0 }%`
                                            : `${ promotion?.discount?.rangePercentage?.min ?? 0 }% - ${ promotion?.discount?.rangePercentage?.max ?? 0 }%` }
                                    </Text>
                                </View>

                                <Text className="mt-4 font-montserratMedium text-xs">{ promotion?.description }</Text>
                                
                                <Text className="mt-5 font-montserratSemiBold text-xs text-baseGreen">Allowed products</Text>
                                <View className="mt-2 flex-row flex-wrap items-center space-y-2">
                                    { promotion?.permittedProductTypes!.map((eachProductType: string, index: number) => (
                                        <Text key={ `${index}_${eachProductType}` } className="mr-2 px-2 py-1 font-montserratMedium text-[10px] rounded-md bg-white">{
                                            eachProductType === "readyMadeCloth" ? "Ready to Wear Cloth"
                                            : eachProductType === "readyMadeShoe" ? "Ready to Wear Shoe"
                                            : eachProductType === "bespokeCloth" ? "Bespoke Cloth"
                                            : eachProductType === "bespokeShoe" ? "Bespoke Shoe" : "Accessory"
                                        }</Text>
                                    )) }
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View className="h-[100px] w-full flex items-center justify-center">
                            <Text className="text-base text-gray-500">No promo found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* ==== Discount percentage + Join (shown once a promo is selected) ==== */}
            { hasSelection && (
                <View className="absolute bottom-0 left-0 right-0 px-5 pt-4 pb-7 border-t border-gray-200 rounded-t-2xl bg-green-50">
                    <Text className="font-montserratMedium text-sm text-gray-700">Discount Percentage</Text>

                    { !isFixed && (
                        <Text className="mt-0.5 font-montserratMedium text-xs text-gray-500">
                            Choose any value between { min }% and { max }%.
                        </Text>
                    ) }

                    <View className="h-auto w-full mt-2 flex-row items-center rounded-xl border border-gray-300 overflow-hidden bg-white">
                        <TextInput
                            keyboardType="number-pad"
                            placeholder="Enter discount %"
                            placeholderTextColor="#9ca3af"
                            editable={ !isFixed }
                            value={ discountPercentage }
                            onChangeText={ (text) => setDiscountPercentage(text.replace(/[^0-9]/g, "")) }
                            className={ `h-[52px] flex-1 px-3 font-montserratMedium text-base ${ isFixed ? "text-gray-400" : "text-black" }` }
                        />
                        <View className="h-[52px] w-12 items-center justify-center border-l border-gray-300 bg-gray-50">
                            <Text className="font-montserratSemiBold text-base text-baseGreen">%</Text>
                        </View>
                    </View>

                    { isFixed && (
                        <Text className="mt-1.5 font-montserratMedium text-xs text-gray-500">
                            This promo uses a fixed discount and can't be changed.
                        </Text>
                    ) }

                    <TouchableOpacity
                        onPress={ () => handleApplyPromo() }
                        className="h-[55px] w-auto mt-4 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                        <Text className="text-lg text-white mr-2">Join Promo</Text>
                        <ArrowRight className="text-white" />
                    </TouchableOpacity>
                </View>
            ) }
        </SafeAreaView>
    );
};

export default PromoScreen;