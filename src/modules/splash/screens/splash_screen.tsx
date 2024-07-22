import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Animated, Dimensions, SafeAreaView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';

// type SplashScreenNavigationProp = NativeStackNavigationProp<RootNavigationStackModel>;

// interface Props {
//   navigation: SplashScreenNavigationProp;
// }


const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  const counters = ["00", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
  const { height } = Dimensions.get("window");
  const slideUpValue = new Animated.Value(height);
  const slideUpTwoValue = new Animated.Value(height);
  const zoomInValue = new Animated.Value(3000);
  const zoomInTwoValue = new Animated.Value(500);
  const fadeOutValue = new Animated.Value(0);
  const fadeOutCounterValue = new Animated.Value(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideAnim] = useState(new Animated.Value(30));
  const [animationStarted, setAnimationStarted] = useState(false);


  useEffect(() => {

    // Define animations
    const animations = [
      Animated.timing(zoomInValue, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(zoomInTwoValue, {
        toValue: 80,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(fadeOutValue, {
        toValue: 1,
        delay: 1000,
        duration: 1600,
        useNativeDriver: false,
      }),
      Animated.timing(fadeOutCounterValue, {
        toValue: 1,
        delay: 3500,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(slideUpValue, {
        toValue: 300,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(slideUpTwoValue, {
        toValue: height / 1.5,
        delay: 2000,
        duration: 2000,
        useNativeDriver: false,
      }),
    ];
    
    // Start animations in parallel
    Animated.parallel(animations).start(() => {
      setAnimationStarted(true);
    });
  }, []);

  useEffect(() => {
    if (animationStarted && currentIndex >= 0 && currentIndex < counters.length) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        slideAnim.setValue(20);
        setCurrentIndex(prevIndex => prevIndex + 1);
      });
    } else if (currentIndex >= counters.length) {
      navigation.navigate("onboardingOneScreen");
    }
  }, [currentIndex, animationStarted, navigation]);


  return (
    <SafeAreaView className="h-screen w-full relative">
      <View className="h-full w-full absolute justify-center items-center">
        <Animated.View
          className="bg-green-950 rounded-full"
          style={{
            width: zoomInValue,
            height: zoomInValue,
            bottom: slideUpValue,
          }}
        />
        <Animated.Image
          source={require("../../../assets/app_logo.png")}
          className="h-[80px] w-[80px] rounded-2xl absolute top-16"
          style={{
            width: zoomInTwoValue,
            height: zoomInTwoValue,
            opacity: fadeOutValue
          }}
        />
      </View>

      <Animated.View className="h-auto w-full flex items-center"
        style={{ transform: [{translateY: slideUpTwoValue}] }} >
        <FastImage
          style={{ height: 100, width: 100 }}
          source={require("../../../assets/loading.gif")}
        />
      </Animated.View>

      <View className="h-full w-full absolute justify-center items-center">
        {animationStarted && currentIndex >= 0 && currentIndex < counters.length && (
          <Animated.View
            className="absolute bottom-[100px] rounded-full"
            style={{
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="text-gray-700 text-4xl font-bold">
              {counters[currentIndex]}
            </Text>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;