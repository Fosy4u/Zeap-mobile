import React from 'react'
import IProduct from '../../user/products/models/product_model';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View } from 'react-native-animatable';
import { Heart, Star1 } from 'iconsax-react-native';
import FormatWords from '../../../utils/formatWords';
import FastImage from 'react-native-fast-image';
import { Text } from 'react-native';
import formatCurrency from '../../../utils/formatCurrency';

interface IProductCardItemProps {
  product: IProduct;
  handleOnPress: () => void;
  orientation: "Horizontal" | "Vertical";
}

const ProductCardComponent: React.FC<IProductCardItemProps> = (props) => {
     const { product, handleOnPress, orientation } = props;
    return (
        <TouchableOpacity
            onPress={ handleOnPress }
            className={`mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE] ${ orientation === "Horizontal" ? "h-auto w-[340px] flex-row justify-start" : "h-[300px] w-[170px]" }`}
            >
            <View className={`relative p-2 flex rounded-xl bg-white ${ orientation === "Horizontal" ? "h-[150px] w-[130px] mr-4 justify-center" : "h-[160px] items-center" }`}>
                <FastImage
                    source={{
                        uri: product?.colors?.[0]?.images?.[0]?.link!,
                        priority: FastImage.priority.normal
                    }}
                    defaultSource={ require("../../../../assets/images/app_logo.png") }
                    resizeMode={ FastImage.resizeMode.cover }
                    className={`w-[115px] rounded-lg ${ orientation === "Horizontal" ? "h-[130px]" : "h-[145px]" }`}
                    fallback
                />
                <View className="h-[35px] w-[35px] absolute top-1.5 right-1.5 flex items-center justify-center rounded-xl bg-gray-200">
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

                <View className="flex-row items-center">
                    <Text className="mt-2.5 text-base font-medium text-gray-900">{ product.variations![0].discount ? formatCurrency(product?.variations![0].discount || "0", product?.variations![0].currency || "NGN", true) : formatCurrency(product?.variations![0].price || "0", product?.variations![0].currency || "NGN", true) }</Text>
                    <Text className="mt-2.5 ml-3 text-sm font-medium text-gray-400 line-through">{ product.variations![0].discount && formatCurrency(product?.variations![0].price || "0",  product?.variations![0].currency || "NGN", true) }</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProductCardComponent;
