import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ArrowRight } from 'iconsax-react-native';
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg';

const OnboardingScreen = () => {
  const [progress, setProgress] = useState(1);
  const navigation = useNavigation();

  const circleSize = 80;
  const strokeWidth = 8;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI *radius;
  const stepCount = 4;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const progressVale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressVale, {
      toValue: progress,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }, [progress]);

  const handleNextButton = () => {
    if (progress < stepCount) {
      setProgress(prevProgress => (prevProgress + 1));
    } else {
      handleGoToWelcomeScreen();
    }
  };
  const handleBackButton = () => {
    if (progress > 1) {
      setProgress(prevProgress => (prevProgress - 1));
    }
  };
  const handleGoToWelcomeScreen = () => {
    navigation.navigate("welcomeScreen");
  };
  

  return (
    <SafeAreaView className="flex-1">
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View className="flex-[0.45] items-center justify-center bg-white">
        <Image
          source={ (progress === 1) 
            ? require("../../../assets/onboarding_one_image.png")
            : (progress === 2) ? require("../../../assets/onboarding_two_image.png")
            : (progress === 3) ? require("../../../assets/onboarding_three_image.png")
            : require("../../../assets/onboarding_four_image.png")
          }
          resizeMode={"contain"}
          className="h-[250px] w-auto mt-14"
        />
      </View>


      <View className="flex-[0.55] px-7 pt-4 items-center bg-white">
        <Text className="font-bold text-2xl text-baseGreen">{ (progress === 1) 
          ? "Shop with ease and comfort"
          : (progress === 2) ? "Easy and secure payment"
          : (progress === 3) ? "Real time order tracking"
          : "Fast door-step delivery" }
        </Text>
        <Text className="mt-3 text-center text-base">Lorem ipsum dolor sit amet consectetur. Ridiculus pellentesque id commodo et odio.</Text>

        <View className="h-[80px] w-[80px] relative mx-auto mt-10 flex items-center justify-center">
          <Svg className="-rotate-90">
            <AnimatedCircle
              cx={ circleSize / 2 }
              cy={ circleSize / 2 }
              r={ radius }
              stroke="#133522"
              fill="none"
              strokeWidth={ strokeWidth }
              strokeLinecap="round"
              strokeDasharray={ circumference }
              strokeDashoffset={ progressVale.interpolate({
                inputRange: [0, stepCount],
                outputRange: [circumference, 0]
              }) }
              
            />
          </Svg>

          <View className="h-[58px] w-[58px] absolute flex items-center justify-center rounded-full bg-[#D5F4E3]">
            <Text className="font-semibold text-xl">{ progress }</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={ () => handleNextButton() }
          className="h-[55px] w-full mt-9 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
        >
          <Text className="text-lg text-white mr-2">Next</Text>
          <ArrowRight className="text-white" />
        </TouchableOpacity>

        <View className="h-auto w-full mt-5 flex-1 flex-row justify-center">
          { progress > 1 && (
            <TouchableOpacity 
              onPress={ () => handleBackButton() }
              className="h-[55px] w-full flex-1 flex-row items-center justify-center rounded-xl bg-lightGold"
            >
              <ArrowLeft className="text-baseGreen mr-2" />
              <Text className="font-medium text-lg text-baseGreen">Back</Text>
            </TouchableOpacity>
          ) }

          { progress > 1 && progress !== 4 && <View className="w-[15px]" /> }

          { progress !== 4 && (
            <TouchableOpacity 
              onPress={ () => handleGoToWelcomeScreen() }
              className="h-[55px] w-full flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
              <Text className="font-medium text-lg text-baseGreen mr-2">Skip</Text>
              <ArrowRight className="text-baseGreen" />
            </TouchableOpacity>
          ) }
        </View>
      </View>

    </SafeAreaView>
  )
}

export default OnboardingScreen;