import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import AppHeaderComp from '../../general/components/appHeader_comp';
import { ArrowRight } from 'iconsax-react-native';

const PromoScreen = () => {
    const {  } = useSelector((state: RootState) => state.vendorHomeState);

    return (
        <SafeAreaView className="lex-1 h-auto w-screen pb-2 bg-gray-50">
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
                <Text className="font-montserratSemiBold">All ongoing promo</Text>

                <View className="h-auto w-full mt-3 px-4 py-5 border border-lightGreen rounded-xl bg-green-50">
                    
                    <Text className="font-montserratSemiBold">This is the title of the promo</Text>
                    <Text className="text-xs">
                        This can be a subtitle of the promo
                    </Text>
                    <Text className="mt-4 font-montserratMedium">
                        Sunday 11th Nov - Friday 16th Nov{"\n"}{"\n"}
                        Discount: <Text className="text-lg font-montserratMedium">40%</Text>
                    </Text>

                    <Text className="mt-4 font-montserratMedium text-xs">
                        This can be a short description of the promo{"\n"}
                        mentioned above.
                    </Text>
                    
                    <Text className="mt-5 font-montserratSemiBold">Allowed products</Text>
                    <View className="mt-2 flex-row items-center">
                        <Text className="mr-2 px-2 py-1 font-montserratMedium text-[10px] rounded-md bg-white">Readymade items</Text>
                        <Text className="mr-2 px-2 py-1 font-montserratMedium text-[10px] rounded-md bg-white">Accessories</Text>
                        <Text className="px-2 py-1 font-montserratMedium text-[10px] rounded-md bg-white">Shoes</Text>
                    </View>
                </View>

                <View className="h-auto w-full mt-3 px-4 py-5 border border-gray-200 rounded-xl bg-grey-50">
                    
                    <Text className="font-montserratSemiBold">This is the title of the promo</Text>
                    <Text className="text-xs">
                        This can be a subtitle of the promo
                    </Text>
                    <Text className="mt-4 font-montserratMedium">
                        Sunday 11th Nov - Friday 16th Nov{"\n"}{"\n"}
                        Discount: <Text className="text-lg font-montserratMedium">40%</Text>
                    </Text>

                    <Text className="mt-4 font-montserratMedium text-xs">
                        This can be a short description of the promo{"\n"}
                        mentioned above.
                    </Text>
                    
                    <Text className="mt-5 font-montserratSemiBold">Allowed products</Text>
                    <View className="mt-2 flex-row items-center">
                        <Text className="mr-2 px-2 py-1 font-montserratMedium text-[10px] rounded-md bg-white">Readymade items</Text>
                        <Text className="mr-2 px-2 py-1 font-montserratMedium text-[10px] rounded-md bg-white">Accessories</Text>
                        <Text className="px-2 py-1 font-montserratMedium text-[10px] rounded-md bg-white">Shoes</Text>
                    </View>
                </View>
                
                <TouchableOpacity 
                    onPress={ () => null }
                    className="h-[55px] w-auto my-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                    <Text className="text-lg text-white mr-2">Join Promo</Text>
                    <ArrowRight className="text-white" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PromoScreen;