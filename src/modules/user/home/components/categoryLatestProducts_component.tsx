import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import ProductCardComponent from '../../../general/components/productCard_component';
import SkeletonBlock from '../../../general/components/skeletonBlock_component';
import IProduct from '../../products/models/product_model';
import { useGetFilteredProductsQuery } from '../../products/apis/product_api';
import { setProductID } from '../../products/slices/product_slice';

interface IProps {
    title: string;
    filters: Record<string, string>;
}

const NEWEST_SOURCE = "Newest Products";

const CategoryLatestProductsComponent: React.FC<IProps> = ({ title, filters }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const { data: products = [], isLoading } = useGetFilteredProductsQuery({
        queryParams: { ...filters, limit: 10, pageNumber: 1 } as any,
        screenTitle: NEWEST_SOURCE,
    });

    return (
        <View className="mt-6">
            <View className="flex-row justify-between items-center">
                <Text className="font-medium text-base text-baseGreen">{ title }</Text>
                <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: title, filters, source: NEWEST_SOURCE }) }>
                    <Text className="text-sm text-baseGreen">See all</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={ false }
                className="h-auto w-full mt-2"
            >
                { isLoading ? (
                    [0, 1, 2].map((key) => (
                        <View key={ key } className="mr-4">
                            <SkeletonBlock width={ 170 } height={ 300 } radius={ 16 } />
                        </View>
                    ))
                ) : products.length === 0 ? (
                    <Text className="py-6 text-sm text-gray-400">No products yet.</Text>
                ) : products.map((product: IProduct) => (
                    <ProductCardComponent
                        key={ product.productId }
                        product={ product }
                        handleOnPress={ () => {
                            dispatch(setProductID(product.productId));
                            navigation.navigate("productDetailScreen");
                        } }
                        orientation="Vertical"
                    />
                )) }
            </ScrollView>
        </View>
    );
};

export default CategoryLatestProductsComponent;
