import React from 'react';
import { ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

interface IProps {
    title: string;
    subtitle?: string;
    image: ImageSourcePropType;
    width: number;
    height: number;
    isLast?: boolean;
    onPress: () => void;
}

const CategoryTileComponent: React.FC<IProps> = ({ title, subtitle = "Shop now", image, width, height, isLast, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={ 0.85 }
            onPress={ onPress }
            className={`relative rounded-md overflow-hidden bg-gray-200 ${ isLast ? "" : "mr-4" }`}
            style={{ width, height }}
        >
            <FastImage
                style={{ width, height }}
                resizeMode={ FastImage.resizeMode.cover }
                source={ image as any }
            />
            <View className="h-[70px] w-full absolute bottom-0 flex items-center justify-center bg-black/60">
                <Text className="font-montserratBold text-white">{ title }</Text>
                <Text className="mt-0.5 text-xs text-white italic">{ subtitle }</Text>
            </View>
        </TouchableOpacity>
    );
};

export default CategoryTileComponent;
