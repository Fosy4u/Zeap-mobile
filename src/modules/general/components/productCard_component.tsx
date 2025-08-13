import React from 'react'
import IProduct from '../../user/products/models/product_model';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View } from 'react-native-animatable';
import { Heart, Star1 } from 'iconsax-react-native';
import FormatWords from '../../../utils/formatWords';
import FastImage from 'react-native-fast-image';
import { Text } from 'react-native';

interface IProductCardItemProps {
  product: IProduct;
  handleOnPress: () => void;
  orientation: "Horizontal" | "Vertical";
}

const ProductCardComponent = (props: IProductCardItemProps) => {
     const { product, handleOnPress, orientation } = props;
    return (
        <TouchableOpacity
            onPress={ handleOnPress }
            className={`h-auto mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE] ${ orientation === "Horizontal" ? "w-[340px] flex-row justify-start" : "w-[170px]" }`}
            >
            <View className={`relative p-2 flex rounded-xl bg-white ${ orientation === "Horizontal" ? "h-[150px] w-[130px] mr-4 justify-center" : "items-center" }`}>
                <FastImage
                    source={{
                        uri: product?.colors?.[0]?.images?.[0]?.link!,
                        priority: FastImage.priority.normal
                    }}
                    // defaultSource={ require("../../../../../assets/images/app_logo.png") }
                    defaultSource={ require("../../../../assets/images/app_logo.png") }
                    resizeMode={ FastImage.resizeMode.cover }
                    className="h-[120px] w-[100px] rounded-lg"
                    fallback
                />
                <View className="h-[35px] w-[35px] absolute top-2 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                    <Heart color="gray" />
                </View>
            </View>
            <View className={`mt-3 ${ orientation === "Horizontal" ? "w-[160px]" : "" }`}>
                <Text className={`text-gray-800 ${ orientation === "Horizontal" ? "text-base" : "text-sm" }`}>{ FormatWords.truncateWords(product.title, 30) }</Text>
                <View className="mt-1.5 flex-row items-center justify-between">
                    <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ product.categories.productGroup.split("-").join(" ") }</Text>

                    <View className="flex-row">
                        <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                        <Text>4.3</Text>
                    </View>
                </View>
                <Text className="mt-2.5 text-base font-medium text-gray-900">₦{ product.variations[0].price.toLocaleString() }</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ProductCardComponent;
