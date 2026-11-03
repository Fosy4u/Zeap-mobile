import React from 'react';
import { FlatList, SafeAreaView, StatusBar, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { ArrowLeft, ArrowRight } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { useGetPromoProductsQuery } from '../apis/product_api';
import IPromoProduct from '../models/promotion_model';
import SkeletonBlock from '../../../general/components/skeletonBlock_component';
import EmptyListComponent from '../../../general/components/emptyList_component';
import encodeMediaUri from '../../../../utils/encodeMediaUri';

const SalesScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { data: promos = [], isLoading } = useGetPromoProductsQuery();
    const bannerWidth = useWindowDimensions().width - 40;
    const bannerHeight = Math.round(bannerWidth * 9 / 16);

    const openPromo = (promo: IPromoProduct) => {
        if (!promo.promoId) return;
        navigation.navigate("productListScreen", { screenTitle: promo.title || "Sales Promotions", filters: { promoId: promo.promoId }, source: "Promo Products" });
    };

    return (
        <SafeAreaView className="h-full w-full flex-1 pt-5 bg-lightGray">
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />

            {/*==== Header ====*/}
            <View className="h-auto w-full px-5 flex-row items-center justify-between">
                <TouchableOpacity onPress={ () => navigation.goBack() }>
                    <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                        <ArrowLeft color="white" />
                    </View>
                </TouchableOpacity>
                <Text className="font-semibold text-lg text-baseGreen">All Sales Promotions</Text>
                <View className="h-[40px] w-[40px]" />
            </View>

            { isLoading ? (
                <View className="mt-6 px-5">
                    { [0, 1, 2].map((key) => (
                        <View key={ key } className="mb-4">
                            <SkeletonBlock width={ bannerWidth } height={ bannerHeight } radius={ 16 } />
                        </View>
                    )) }
                </View>
            ) : (
                <FlatList
                    data={ promos }
                    keyExtractor={ (promo, index) => promo.promoId ?? `${ index }` }
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 16 }}
                    showsVerticalScrollIndicator={ false }
                    ListEmptyComponent={ <EmptyListComponent standalone message="No sales running right now." /> }
                    renderItem={ ({ item: promo }) => {
                        const media = promo.largeScreenImageUrl;
                        const mediaUri = encodeMediaUri(media?.link);
                        return (
                            <TouchableOpacity activeOpacity={ 0.9 } onPress={ () => openPromo(promo) } className="rounded-2xl overflow-hidden bg-white">
                                <View style={{ width: bannerWidth, height: bannerHeight }} className="bg-lightGold">
                                    { media?.type === "video" ? (
                                        <Video source={{ uri: mediaUri }} style={{ width: bannerWidth, height: bannerHeight }} resizeMode="cover" repeat muted />
                                    ) : media?.type === "image" ? (
                                        <FastImage source={{ uri: mediaUri }} style={{ width: bannerWidth, height: bannerHeight }} resizeMode={ FastImage.resizeMode.cover } />
                                    ) : null }
                                </View>
                                <View className="px-4 py-3 flex-row items-center justify-between">
                                    <Text className="flex-1 font-montserratSemiBold text-base text-baseGreen" numberOfLines={ 1 }>{ promo.title }</Text>
                                    <View className="ml-3 px-3 py-1.5 flex-row items-center rounded-full bg-gold">
                                        <Text className="font-montserratSemiBold text-xs text-baseGreen">Shop Now</Text>
                                        <ArrowRight size={ 14 } color="#133522" style={{ marginLeft: 4 }} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    } }
                />
            ) }
        </SafeAreaView>
    );
};

export default SalesScreen;
