import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, Star1 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import IProduct from '../models/product_model';
import { setProductID } from '../slices/product_slice';
import { AppDispatch } from '../../../../redux/store/store';

interface IProps {
    product: IProduct;
}

const ProductListCard: React.FC<IProps> = ({ product }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch<AppDispatch>();

    return (
        <TouchableOpacity
            onPress={() => {
                dispatch(setProductID(product.productId));
                navigation.navigate('productDetailScreen');
            }}>
            <View className="h-auto w-full mt-4 p-4 flex-row rounded-xl bg-[#F8F9FE]">
                <View className="h-[150px] w-[130px] relative mr-4 py-2 flex justify-center items-center rounded-xl bg-white">
                    <FastImage
                        source={{
                            uri: product.colors[0]?.images[0]?.link!,
                            priority: FastImage.priority.normal
                        }}
                        defaultSource={require('../../../../../assets/images/app_logo.png')}
                        resizeMode={FastImage.resizeMode.cover}
                        className="h-[120px] w-[90px] rounded-2xl"
                        fallback
                    />
                    <View className="h-[35px] w-[35px] absolute top-2 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                        <Heart color="gray" />
                    </View>
                </View>

                <View className="w-[160px] mt-3">
                    <Text className="text-base text-gray-800">
                        {product.title}
                    </Text>
                    <View className="mt-3 flex-row items-center justify-between">
                        <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">
                            {product.categories.productGroup.split('-').join(' ')}
                        </Text>

                        <View className="flex-row">
                            <Star1
                                color="#E4A01C"
                                size={18}
                                variant="Bold"
                                className="mr-0.5"
                            />
                            <Text>4.3</Text>
                        </View>
                    </View>
                    <Text className="mt-2.5 text-base font-medium text-gray-900">
                        ₦{product.variations[0].price.toLocaleString()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProductListCard; 