import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import IProduct from '../models/product_model';
import { setProductID } from '../slices/product_slice';
import { AppDispatch } from '../../../../redux/store/store';
import formatCurrency from '../../../../utils/formatCurrency';
import FormatWords from '../../../../utils/formatWords';
import useWishlistToggle from '../../saved/hooks/wishlistToggle_hook';

interface IProps {
    product: IProduct;
}

const ProductListCard: React.FC<IProps> = (props) => {
    const { product } = props;
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch<AppDispatch>();
    const { isSaved, toggleSave } = useWishlistToggle();
    const saved = isSaved(product?.productId);
    // console.log("PRODUCT LIST ITEM::: ", product);
    

    return (
        <TouchableOpacity
            onPress={() => {
                dispatch(setProductID(product.productId));
                navigation.navigate('productDetailScreen');
            }}
            className="h-auto w-full mt-4 px-3 py-3 flex-row rounded-xl bg-[#F8F9FE]"
        >
            <View className="h-[160px] w-[130px] relative mr-3 flex justify-center items-center rounded-xl bg-white">
                <FastImage
                    source={{
                        uri: product.colors[0]?.images[0]?.link!,
                        priority: FastImage.priority.normal
                    }}
                    defaultSource={require('../../../../../assets/images/app_logo_green.png')}
                    resizeMode={FastImage.resizeMode.cover}
                    className="h-[150px] w-[120px] rounded-lg"
                    fallback
                />
                <TouchableOpacity
                    onPress={ () => toggleSave(product) }
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    className="h-[35px] w-[35px] absolute top-0 right-0 flex items-center justify-center rounded-xl bg-gray-200"
                >
                    <Heart color={ saved ? "#e11d48" : "gray" } variant={ saved ? "Bold" : "Linear" } />
                </TouchableOpacity>
            </View>

            <View className="flex-1 mt-3">
                <Text className="font-montserratMedium text-base text-gray-800">
                    {product.title}
                </Text>
                <View className="mt-3 flex-row items-center justify-between">
                    <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">
                        { FormatWords.productGroupLabel(product.categories?.productGroup, product?.productType) }
                    </Text>

                    {/* <View className="flex-row">
                        <Star1
                            color="#E4A01C"
                            size={18}
                            variant="Bold"
                            className="mr-0.5"
                        />
                        <Text>4.3</Text>
                    </View> */}
                </View>
                <View className="flex-row items-center flex-wrap">
                    { (() => {
                        const variation = product?.variations?.[0];
                        if (!variation) return null;
                        const currency = variation.currency || "NGN";
                        return (
                            <>
                                <Text className="mt-2.5 text-base font-medium text-gray-900">{ variation.discount ? formatCurrency(variation.discount || "0", currency, false) : formatCurrency(variation.price || "0", currency, false) }</Text>
                                <Text className="mt-2.5 ml-2 text-sm font-medium text-gray-400 line-through">{ variation.discount && formatCurrency(variation.price || "0", currency, false) }</Text>
                            </>
                        );
                    })() }
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProductListCard; 