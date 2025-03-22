import React, { useEffect } from 'react'
import { Animated, Text, View } from 'react-native';

interface IProps {
    loadingAdditionalMessage?: string;
};

const AppLoader: React.FC<IProps> = ({ loadingAdditionalMessage }) => {

    const spinValue = new Animated.Value(0);

    useEffect(() => {
        const spinAnimation = Animated.loop(
            Animated.timing(spinValue, {
            toValue: 1, // Full rotation (360 degrees)
            duration: 1000, // Duration of one spin in milliseconds
            useNativeDriver: true, // Improve performance with native animations
            })
        );
        spinAnimation.start();
        return () => spinAnimation.stop();
    }, [spinValue]);

    // Interpolating the spin value to create a rotation effect
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });


    return (
        <View className="h-full w-full absolute inset-0 flex-1 items-center justify-center bg-black/80">
          <Animated.Image
            source={require("../../../../assets/images/app_icon.png")}
            style={[{ transform: [{ rotate: spin }] }]}
            className="h-[50px] w-[50px]"
            resizeMode="cover"
          />
          <Text className="mt-4 font-montserratNormal text-sm text-white">{ loadingAdditionalMessage ? loadingAdditionalMessage : "Please wait..." }</Text>
        </View>
    );
};

export default AppLoader;