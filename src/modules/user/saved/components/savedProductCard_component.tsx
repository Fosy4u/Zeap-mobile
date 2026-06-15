import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, Star1 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import IProduct from '../../products/models/product_model';
import FormatWords from '../../../../utils/formatWords';
import { setProductID } from '../../products/slices/product_slice';
import useWishlistToggle from '../hooks/wishlistToggle_hook';

interface IProps {
    product: IProduct;
}

const SavedProductCard: React.FC<IProps> = ({ product }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const { isSaved, toggleSave } = useWishlistToggle();
    const saved = isSaved(product?.productId);

    // Resolve the best image from the wishlist payload — walk the colors
    // until we find one that actually has an image, then take its first.
    // The previous lookup hardcoded `colors[0].images[1]`, so products with
    // a single image (or with the image only on a non-default colour) showed
    // the fallback logo.
    const productImage = product?.colors?.find((c) => (c?.images?.length ?? 0) > 0)?.images?.[0]?.link;

    return (
        <TouchableOpacity
            onPress={ () => {
                dispatch(setProductID(product.productId));
                navigation.navigate("productDetailScreen");
            } }
            className="h-auto w-full flex-1 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE]"
        >
            <View className="h-[160px] w-full relative rounded-xl overflow-hidden">
                <FastImage
                    source={
                        productImage
                            ? { uri: productImage, priority: FastImage.priority.normal }
                            : require("../../../../../assets/images/app_logo_green.png")
                    }
                    defaultSource={ require("../../../../../assets/images/app_logo_green.png") }
                    resizeMode={ FastImage.resizeMode.cover }
                    className="h-full w-full"
                />
                <TouchableOpacity
                    onPress={ () => toggleSave(product) }
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    className="h-[35px] w-[35px] absolute top-1.5 right-1.5 flex items-center justify-center rounded-xl bg-gray-200"
                >
                    <Heart color={ saved ? "#e11d48" : "gray" } variant={ saved ? "Bold" : "Linear" } />
                </TouchableOpacity>
            </View>
            <View className="mt-3">
                <Text className="text-sm text-gray-800">{ product.title }</Text>
                <View className="mt-1.5 flex-row items-center justify-between">
                    <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">
                        { FormatWords.productGroupLabel(product.categories?.productGroup, product?.productType) }
                    </Text>

                    <View className="flex-row">
                        <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                        <Text>4.3</Text>
                    </View>
                </View>
                <Text className="mt-2.5 text-base font-medium text-gray-900">
                    ₦{ product.variations[0]?.price?.toLocaleString() }
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default SavedProductCard; 