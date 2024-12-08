import React, { useEffect } from 'react'
import { Animated, View } from 'react-native';

const AppLoader = () => {

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
        inputRange: [0, 1], // Start and end values of animation
        outputRange: ["0deg", "360deg"], // Degrees for rotation
    });


    return (
        <View className="flex-1 items-center justify-center">
          <Animated.Image
            source={require("../../../assets/app_logo.png")} // Replace with your logo path
            style={[{ transform: [{ rotate: spin }] }]}
            className="h-[50px] w-[50px]"
            resizeMode="cover"
          />
        </View>
    );
};

export default AppLoader;