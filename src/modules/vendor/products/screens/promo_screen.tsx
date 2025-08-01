import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import AppHeaderComp from '../../general/components/appHeader_comp';
import { ArrowRight } from 'iconsax-react-native';
import useVendorProductHook from '../hooks/vendorProduct_hook';
import IPromotion from '../models/promotion_model';
import AppLoader from '../../../general/components/appLoader';

const PromoScreen = () => {
    const { isLoading, loadingMessage } = useSelector((state: RootState) => state.generalState);

    const { promotions, handleGetAvailablePromos, selectedPromo, setSelectedPromo, handleApplyPromo, handleFormatDate } = useVendorProductHook();

    useEffect(() => {
        handleGetAvailablePromos();
    }, []);

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-gray-50">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />
                    
            {/* ==== Header ==== */}
            <AppHeaderComp title="Join Promo" />
            
            <ScrollView
                showsHorizontalScrollIndicator={ false }
                className="h-full w-full px-5 py-5"
            >
                <Text className="mt-1 font-montserratSemiBold text-gray-600">All ongoing promo</Text>

                <View className="h-auto w-full mt-3">
                    { promotions && promotions.length !== 0 ? (
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
                                        { promotion?.discount?.fixedPercentage! ? promotion?.discount?.fixedPercentage! : 0 }%
                                    </Text>
                                </View>

                                <Text className="mt-4 font-montserratMedium text-xs">{ promotion?.description }</Text>
                                
                                <Text className="mt-5 font-montserratSemiBold text-xs text-baseGreen">Allowed products</Text>
                                <View className="mt-2 flex-row flex-wrap items-center space-y-2">
                                    { promotion?.permittedProductTypes!.map((eachProductType: string, index: number) => (
                                        <Text key={ `${index}_${eachProductType}` } className="mr-2 px-2 py-1 font-montserratMedium text-[10px] rounded-md bg-white">{
                                            eachProductType === "readyMadeCloth" ? "Ready Made Clothes"
                                            : eachProductType === "readyMadeShoe" ? "Ready Made Shoes"
                                            : eachProductType === "bespokeCloth" ? "Bespoke Clothes"
                                            : eachProductType === "bespokeShoe" ? "Bespoke Shoes" : "Accessories"
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
                
                
                {/* ==== Apply Promotion Button ==== */}
                <TouchableOpacity
                    onPress={ () => handleApplyPromo() }
                    className="h-[55px] w-auto my-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                    <Text className="text-lg text-white mr-2">Join Promo</Text>
                    <ArrowRight className="text-white" />
                </TouchableOpacity>
            </ScrollView>
            
            { isLoading && 
                <AppLoader loadingAdditionalMessage={ loadingMessage } />
            }
        </SafeAreaView>
    );
};

export default PromoScreen;