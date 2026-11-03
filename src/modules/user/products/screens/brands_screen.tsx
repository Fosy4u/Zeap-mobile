import React from 'react';
import { FlatList, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { useGetProductBrandsQuery } from '../apis/product_api';
import SkeletonBlock from '../../../general/components/skeletonBlock_component';
import EmptyListComponent from '../../../general/components/emptyList_component';

const BrandsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { data: brands = [], isLoading } = useGetProductBrandsQuery();

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
                <Text className="font-semibold text-lg text-baseGreen">Brands</Text>
                <View className="h-[40px] w-[40px]" />
            </View>

            { isLoading ? (
                <View className="mt-6 px-5 flex-row flex-wrap justify-between">
                    { Array.from({ length: 8 }).map((_, index) => (
                        <View key={ index } className="mb-3">
                            <SkeletonBlock width={ 170 } height={ 76 } radius={ 12 } />
                        </View>
                    )) }
                </View>
            ) : (
                <FlatList
                    data={ brands }
                    keyExtractor={ (item) => item.brand }
                    numColumns={ 2 }
                    columnWrapperStyle={{ gap: 12 }}
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 12 }}
                    showsVerticalScrollIndicator={ false }
                    ListEmptyComponent={ <EmptyListComponent standalone message="No brands available yet." /> }
                    renderItem={ ({ item }) => (
                        <TouchableOpacity
                            onPress={ () => navigation.navigate("productListScreen", { screenTitle: `${ item.brand } Collections`, filters: { brand: item.brand } }) }
                            className="flex-1 px-4 py-4 rounded-xl border border-gray-200 bg-white"
                        >
                            <Text className="font-montserratSemiBold text-base text-baseGreen" numberOfLines={ 1 }>{ item.brand }</Text>
                            <Text className="mt-1 font-montserratMedium text-xs text-gray-500">{ item.count } { item.count === 1 ? "product" : "products" }</Text>
                        </TouchableOpacity>
                    ) }
                />
            ) }
        </SafeAreaView>
    );
};

export default BrandsScreen;
