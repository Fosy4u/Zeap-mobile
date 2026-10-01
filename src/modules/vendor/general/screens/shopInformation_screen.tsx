import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArrowLeft } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import AuthCheck from '../../../auths/components/authCheck';
import { display, yesNo } from '../../../../utils/displayValue';
import useShopGuardHook from '../hooks/shopGuard_hook';
import NoShopPopupModal from '../modals/noShopPopup_modal';

const ShopInformationScreen = () => {
    /* Resolves the shop itself rather than trusting what the dashboard left in
       the store — this screen is reachable straight from Profile. */
    const { shop, isResolvingShop, isCheckingShop, hasNoShop, recheckShop } = useShopGuardHook();
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    return (
        <GestureHandlerRootView>
            <SafeAreaView className="h-full w-full flex-1">

                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />

                {/*==== Header ====*/}
                <View className="h-auto w-full px-5 pt-5 pb-3 flex-row items-center justify-between">
                    <TouchableOpacity onPress={ () => navigation.pop() }>
                        <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                            <ArrowLeft color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className="font-semibold text-lg text-baseGreen">Shop Information</Text>
                    <View className="h-[40px] w-[40px]" />
                </View>

                {/* A loader while the first check runs — blank rows would read
                    as "your shop has no name". */}
                { isResolvingShop && !hasNoShop && (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator color="#133522" />
                        <Text className="mt-2 text-xs text-gray-500">Loading shop details…</Text>
                    </View>
                ) }

                { hasNoShop && (
                    <NoShopPopupModal onRetry={ recheckShop } isRetrying={ isCheckingShop } />
                ) }

                { !isResolvingShop && !hasNoShop && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
                >
                    {/*==== Account details ====*/}
                    <View className="h-auto w-full mt-7 px-3 py-5 border border-gray-200 bg-[#F8F9FE] rounded-lg">
                        <Text className="font-medium text-lg text-baseGreen">Shop details</Text>

                        <View className="h-auto w-full mt-7 flex-row justify-between">
                            <Text className="text-sm text-gray">Shop name</Text>
                            <Text className="text-sm text-gray-600">{ display(shop?.shopName) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Shop ID</Text>
                            <Text className="text-sm text-gray-600">{ display(shop?.shopId) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Tailor</Text>
                            <Text className="text-sm text-gray-600">{ yesNo(shop?.isTailor) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Shoemaker</Text>
                            <Text className="text-sm text-gray-600">{ yesNo(shop?.isShoeMaker) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Makeup artist</Text>
                            <Text className="text-sm text-gray-600">{ yesNo(shop?.isMakeUpArtist) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Email</Text>
                            <Text className="text-sm text-gray-600">{ display(shop?.email) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Phone number</Text>
                            <Text className="text-sm text-gray-600">{ display(shop?.phoneNumber) }</Text>
                        </View>
                    </View>
                </ScrollView>
                ) }
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default AuthCheck(ShopInformationScreen);
