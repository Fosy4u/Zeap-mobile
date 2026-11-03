import React from 'react';
import { ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { ArrowRight } from 'iconsax-react-native';

interface IProps {
    title: string;
    subtitle: string;
    buttonText?: string;
    image?: ImageSourcePropType;
    videoUri?: string;
    height?: number;
    titleClassName?: string;
    isFirst?: boolean;
    onPress: () => void;
}

const CategoryBannerComponent: React.FC<IProps> = ({
    title, subtitle, buttonText = "Explore Now", image, videoUri, height = 300, titleClassName = "text-xl", isFirst = false, onPress,
}) => {
    return (
        <View className={`w-full rounded-md overflow-hidden bg-baseGreen ${ isFirst ? "" : "mt-5" }`} style={{ height }}>
            { videoUri ? (
                <Video
                    source={{ uri: videoUri, bufferConfig: { cacheSizeMB: 200 } }}
                    poster={ image ? { source: image as any, resizeMode: "cover" } : undefined }
                    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                    resizeMode="cover"
                    repeat
                    muted
                    playInBackground={ false }
                    disableFocus
                />
            ) : image ? (
                <FastImage
                    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                    resizeMode={ FastImage.resizeMode.cover }
                    source={ image as any }
                />
            ) : null }
            <View className="absolute inset-0 bg-black/50" />

            <View className="absolute top-0 bottom-0 left-0 right-0 px-5 flex items-center justify-center">
                <Text className={`mt-24 font-montserratBold text-white text-center ${ titleClassName }`}>{ title }</Text>
                <Text className="text-xs text-white italic text-center">{ subtitle }</Text>

                <TouchableOpacity
                    className="mt-5 mx-auto px-4 py-3 flex-row items-center bg-baseGreen rounded-md"
                    onPress={ onPress }
                >
                    <Text className="font-montserratRegular text-xs text-white">{ buttonText }</Text>
                    <ArrowRight size={14} variant="Linear" className="ml-2 text-white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CategoryBannerComponent;
