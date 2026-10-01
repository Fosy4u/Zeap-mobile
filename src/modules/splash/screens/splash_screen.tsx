import React from 'react';
import { Dimensions, SafeAreaView, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import useSplashHook from '../hooks/splash_hook';

const SplashScreen = () => {
  const { height } = Dimensions.get("window");

  const slideUpValue = useSharedValue(height);
  const slideUpTwoValue = useSharedValue(height);
  const zoomInValue = useSharedValue(3000);
  const zoomInTwoValue = useSharedValue(500);
  const fadeOutValue = useSharedValue(0);
  const fadeOutCounterValue = useSharedValue(0);

  const slideUpTwoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideUpTwoValue.value }]
  }));

  useSplashHook({
    height, zoomInValue, zoomInTwoValue, fadeOutValue, fadeOutCounterValue, slideUpValue,
    slideUpTwoValue,
  });

  return (
    <SafeAreaView className="h-screen w-full relative">
      <Image
        source={require("../../../../assets/images/app_logo_green.png")}
        className="h-[80px] w-[120px] mt-14 self-center"
        resizeMode="contain"
      />

      <Animated.View className="h-auto w-full flex items-center"
        style={slideUpTwoStyle} >
        <FastImage
          style={{ height: 60, width: 60 }}
          source={require("../../../../assets/images/loading.gif")}
        />
      </Animated.View>

    </SafeAreaView>
  );
};

export default SplashScreen;