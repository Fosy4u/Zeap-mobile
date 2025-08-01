import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Heart, Star1 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import IProduct from '../../products/models/product_model';

interface IProps {
    product: IProduct;
}

const SavedProductCard: React.FC<IProps> = ({ product }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    return (
        <TouchableOpacity
            onPress={ () => navigation.navigate("productDetailScreen") }
            className="h-auto w-full flex-1 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE]"
        >
            <View className="h-auto w-full relative py-1 rounded-xl bg-white">
                <Image
                    className="h-[100px] w-full rounded-t-2xl"
                    resizeMode="contain"
                    source={ 
                        product.colors[0]?.images[1]?.link
                        ? { uri: product.colors[0]?.images[1]?.link }
                        : require("../../../../../assets/images/app_logo.png")
                    }
                />
                <View className="h-[35px] w-[35px] absolute top-1 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                    <Heart color="gray" />
                </View>
            </View>
            <View className="mt-3">
                <Text className="text-sm text-gray-800">{ product.title }</Text>
                <View className="mt-1.5 flex-row items-center justify-between">
                    <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">
                        { product.categories.productGroup.split("-").join(" ") }
                    </Text>

                    <View className="flex-row">
                        <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                        <Text>4.3</Text>
                    </View>
                </View>
                <Text className="mt-2.5 text-base font-medium text-gray-900">
                    ₦{ product.variations[0].price.toLocaleString() }
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default SavedProductCard; 