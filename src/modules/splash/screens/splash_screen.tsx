import React, { useEffect } from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import useSplashHook from '../hooks/splash_hook';

const SplashScreen = () => {
  const loaderOpacity = useSharedValue(0);

  const loaderStyle = useAnimatedStyle(() => ({
    opacity: loaderOpacity.value
  }));

  useSplashHook();

  useEffect(() => {
    loaderOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
  }, []);

  return (
    <SafeAreaView className="flex-1 w-full">
      <View className="flex-1 w-full items-center justify-center">
        <Image
          source={require("../../../../assets/images/app_logo_green.png")}
          className="h-[80px] w-[120px]"
          resizeMode="contain"
        />

        <Animated.View className="mt-8" style={loaderStyle}>
          <FastImage
            style={{ height: 60, width: 60 }}
            source={require("../../../../assets/images/loading.gif")}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
