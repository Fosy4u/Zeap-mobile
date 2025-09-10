import React, { useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

interface IProps {
    loadingAdditionalMessage?: string;
}

const AppLoader: React.FC<IProps> = ({ loadingAdditionalMessage }) => {
    const spinValue = useSharedValue(0);

    useEffect(() => {
        spinValue.value = withRepeat(
            withTiming(1, { duration: 1000 }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${spinValue.value * 360}deg` }]
        };
    });

    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex-1 items-center justify-center bg-black/80 z-[9999]">
          <Animated.Image
            source={require("../../../../assets/images/app_icon.png")}
            style={animatedStyle}
            className="h-[50px] w-[50px]"
            resizeMode="cover"
          />
          <Text className="mt-4 font-montserratNormal text-sm text-white">{ loadingAdditionalMessage ? loadingAdditionalMessage : "Please wait..." }</Text>
        </SafeAreaView>
    );
};

export default AppLoader;