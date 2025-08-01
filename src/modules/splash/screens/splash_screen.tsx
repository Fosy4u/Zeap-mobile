import React, { useState } from 'react';
import { View, Text, Dimensions, SafeAreaView } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import useSplashHook from '../hooks/splash_hook';
import AppLoader from '../../general/components/appLoader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

const SplashScreen = () => {
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.generalState);

  const counters = ["00", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
  const { height } = Dimensions.get("window");
  
  const slideUpValue = useSharedValue(height);
  const slideUpTwoValue = useSharedValue(height);
  const zoomInValue = useSharedValue(3000);
  const zoomInTwoValue = useSharedValue(500);
  const fadeOutValue = useSharedValue(0);
  const fadeOutCounterValue = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useSharedValue(30);
  const [animationStarted, setAnimationStarted] = useState(false);

  // const slideUpStyle = useAnimatedStyle(() => ({
  //   transform: [{ translateY: slideUpValue.value }]
  // }));

  const slideUpTwoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideUpTwoValue.value }]
  }));

  const zoomInStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoomInValue.value }]
  }));

  const zoomInTwoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoomInTwoValue.value }]
  }));

  const fadeOutStyle = useAnimatedStyle(() => ({
    opacity: fadeOutValue.value
  }));

  // const fadeOutCounterStyle = useAnimatedStyle(() => ({
  //   opacity: fadeOutCounterValue.value
  // }));

  const slideAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }]
  }));

  useSplashHook({
    counters, height, zoomInValue, zoomInTwoValue, fadeOutValue, fadeOutCounterValue, slideUpValue,
    slideUpTwoValue, currentIndex, slideAnim, animationStarted, setAnimationStarted, setCurrentIndex
  });

  // const startSplashAnimation = () => {
  //   // Define animations
  //   const animations = [
  //     Animated.timing(zoomInValue, {
  //       toValue: 0,
  //       duration: 2000,
  //       useNativeDriver: false,
  //     }),
  //     Animated.timing(zoomInTwoValue, {
  //       toValue: 80,
  //       duration: 2000,
  //       useNativeDriver: false,
  //     }),
  //     Animated.timing(fadeOutValue, {
  //       toValue: 1,
  //       delay: 1000,
  //       duration: 1600,
  //       useNativeDriver: false,
  //     }),
  //     Animated.timing(fadeOutCounterValue, {
  //       toValue: 1,
  //       delay: 3500,
  //       duration: 2000,
  //       useNativeDriver: false,
  //     }),
  //     Animated.timing(slideUpValue, {
  //       toValue: 300,
  //       duration: 2000,
  //       useNativeDriver: false,
  //     }),
  //     Animated.timing(slideUpTwoValue, {
  //       toValue: height / 1.5,
  //       delay: 2000,
  //       duration: 2000,
  //       useNativeDriver: false,
  //     }),
  //   ];
    
  //   // Start animations in parallel
  //   Animated.parallel(animations).start(() => {
  //     setAnimationStarted(true);
  //   });
  // };

  // const checkIsUserLoggedInAndNavigate = async () => {
  //   const userData = await getUserData();
  //   if (userData) {
  //     const isVendor = userData.isVendor
  //     if (isVendor) {
  //       navigation.navigate("vendorHomeScreen", { screen: "Dashboard" });
  //     } else {
  //       navigation.navigate("homeScreen", { screen: "Dashboard" });
  //     }
  //   } else {
  //     // userData not found, proceed with splash screens animations
  //     startSplashAnimation();
  //   }
  // };

  // useEffect(() => {
  //   const checkForFirstTimer = async () => {
  //     try {
  //       const encodedString = await EncryptedStorage.getItem("isFirstTimer");

  //       if (encodedString !== null) {
  //         const isFirstTimer = JSON.parse(encodedString);
  //         if (isFirstTimer) {
  //           // If user is a first timer, proceed with splash screens animations
  //           startSplashAnimation();
  //         } else {
  //           checkIsUserLoggedInAndNavigate();
  //         }
  //       } else {
  //         // If isFirstTimer is not set, assume it's a first-time user
  //         await EncryptedStorage.setItem("isFirstTimer", JSON.stringify(true));
  //         startSplashAnimation();
  //       }
  //     } catch (error) {
  //       console.error("Error checking first timer status:", error);
  //       startSplashAnimation();
  //     }
  //   };

  //   checkForFirstTimer();
  // }, [checkIsUserLoggedInAndNavigate]);

  // useEffect(() => {
  //   (async () => {
  //     if (animationStarted && currentIndex >= 0 && currentIndex < counters.length) {
  //       Animated.timing(slideAnim, {
  //         toValue: 0,
  //         duration: 200,
  //         useNativeDriver: true,
  //       }).start(() => {
  //         slideAnim.setValue(20);
  //         setCurrentIndex(prevIndex => prevIndex + 1);
  //       });
  //     } else if (currentIndex >= counters.length) {
  //       await EncryptedStorage.setItem("isFirstTimer", JSON.stringify(false));
  //       navigation.navigate("onboardingOneScreen");
  //     }
  //   })();
  // }, [currentIndex, animationStarted, navigation]);


  return (
    <SafeAreaView className="h-screen w-full relative">
      <View className="h-full w-full absolute justify-center items-center">
        <Animated.View
          className="bg-green-950 rounded-full"
          style={[zoomInStyle, { width: 300, height: 300 }]}
        />
        <Animated.Image
          source={require("../../../../assets/images/app_logo.png")}
          className="h-[80px] w-[80px] rounded-2xl absolute top-16"
          style={[zoomInTwoStyle, fadeOutStyle]}
        />
      </View>

      <Animated.View className="h-auto w-full flex items-center"
        style={slideUpTwoStyle} >
        <FastImage
          style={{ height: 100, width: 100 }}
          source={require("../../../../assets/images/loading.gif")}
        />
      </Animated.View>

      <View className="h-full w-full absolute justify-center items-center">
        {animationStarted && currentIndex >= 0 && currentIndex < counters.length && (
          <Animated.View
            className="absolute bottom-[100px] rounded-full"
            style={slideAnimStyle}
          >
            <Text className="text-gray-700 text-4xl font-bold">
              {counters[currentIndex]}
            </Text>
          </Animated.View>
        )}
      </View>

      { isLoading && 
        <AppLoader loadingAdditionalMessage={ loadingMessage } />
      }
    </SafeAreaView>
  );
};

export default SplashScreen;