import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArrowLeft, ExportSquare } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import AuthCheck from '../../../auths/components/authCheck';
import useShopGuardHook from '../hooks/shopGuard_hook';
import NoShopPopupModal from '../modals/noShopPopup_modal';
import { useGetSellerPoliciesQuery } from '../apis/general_api';
import { openSecureLink } from '../../../../utils/safeLinks';

const PoliciesScreen = () => {
    const { shop, isResolvingShop, isCheckingShop, hasNoShop, recheckShop } = useShopGuardHook();
    const { data: policies = [], isLoading, isError, refetch } = useGetSellerPoliciesQuery();
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const signedOn = shop?.createdAt
        ? new Date(shop.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "N/A";

    const handleOpenPolicy = (link: string) => {
        openSecureLink(link);
    };

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
                    <Text className="font-semibold text-lg text-baseGreen">Policies / Contract</Text>
                    <View className="h-[40px] w-[40px]" />
                </View>

                { (isResolvingShop || isLoading) && !hasNoShop && (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator color="#133522" />
                        <Text className="mt-2 text-xs text-gray-500">Loading policies…</Text>
                    </View>
                ) }

                { hasNoShop && (
                    <NoShopPopupModal onRetry={ recheckShop } isRetrying={ isCheckingShop } />
                ) }

                { !isResolvingShop && !isLoading && !hasNoShop && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
                >
                    <View className="h-auto w-full mt-7 px-3 py-5 border border-gray-200 bg-[#F8F9FE] rounded-lg">
                        <Text className="font-medium text-lg text-baseGreen">Policies / Contract</Text>

                        { isError ? (
                            <TouchableOpacity onPress={ refetch } className="mt-5">
                                <Text className="text-sm text-gray-500">Couldn't load documents. <Text className="font-medium text-baseGreen">Tap to retry</Text></Text>
                            </TouchableOpacity>
                        ) : policies.length === 0 ? (
                            <Text className="mt-5 text-sm text-gray-500">No documents available.</Text>
                        ) : (
                            <>
                                { policies.map((policy, index) => (
                                    <TouchableOpacity
                                        key={ policy.link }
                                        onPress={ () => handleOpenPolicy(policy.link) }
                                        className={ `${ index === 0 ? "mt-6" : "mt-4" } flex-row items-center` }
                                    >
                                        <Text className="flex-1 mr-2 text-sm text-[#1C64F2] underline">{ policy.name?.trim() }</Text>
                                        <ExportSquare color="#1C64F2" size={ 16 } />
                                    </TouchableOpacity>
                                )) }

                                <Text className="mt-6 text-sm text-gray-500">Signed On: { signedOn }</Text>
                            </>
                        ) }
                    </View>
                </ScrollView>
                ) }
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default AuthCheck(PoliciesScreen, undefined, 'vendor');
