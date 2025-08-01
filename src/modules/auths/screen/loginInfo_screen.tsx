import React, { useEffect, useRef } from 'react'
import { SafeAreaView, Text, View, TouchableOpacity, Image, BackHandler, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { ArrowRight } from 'iconsax-react-native';

const LoginInfoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const backPressCount = useRef(0);
  const backPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount.current === 0) {
        backPressCount.current = 1;
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        
        // Reset the counter after 2 seconds
        if (backPressTimer.current) {
          clearTimeout(backPressTimer.current);
        }
        backPressTimer.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);
        
        return true;
      }
      
      if (backPressCount.current === 1) {
        BackHandler.exitApp();
        return true;
      }
      
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
      if (backPressTimer.current) {
        clearTimeout(backPressTimer.current);
      }
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mt-20 flex-1 items-center justify-start px-6">
        <View className="h-[48px] w-auto mx-auto mt-6 relative">
          <View className="h-[35px] w-auto mx-auto px-3.5 flex items-center justify-center rounded-lg bg-gold">
            <Text>Hello</Text>
          </View>
          <View className="h-0 w-0 absolute top-[30px] left-[40%] translate-x-[-118px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold" />
        </View>

        {/* Title */}
        <Text className="mt-5 text-2xl font-bold text-gray-800 mb-3 text-center">
          Login Required
        </Text>

        {/* Description */}
        <Text className="text-base text-gray-600 text-center mb-8">
          You need to be logged in to access this feature. Please login to continue using our services.
        </Text>

        {/* Proceed to Login Button */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('loginScreen')}
          className="h-[55px] w-full mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
          >
            <Text className="text-lg text-white mr-2">Proceed to Login</Text>
            <ArrowRight className="text-white" />
        </TouchableOpacity>

        <View className="mt-6 px-1.5 flex-row items-center">
          <View className="h-[0.5px] mr-2 flex-1 bg-gray-400" />
          <Text>OR LOGIN USING</Text>
          <View className="h-[0.5px] ml-2 flex-1 bg-gray-400" />
        </View>

        <View className="mt-8 flex-row justify-center">
          <TouchableOpacity 
              onPress={ () => null }
              className="h-[55px] w-full flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl bg-transparent"
            >
              <Image source={ require("../../../../assets/images/google_logo.png") } className="h-[20px] w-[20px] mr-1" />
              <View className="w-[5px]" /> 
              <Text className="font-medium text-lg text-baseGreen">Google</Text>
          </TouchableOpacity>

          <View className="w-[15px]" />

          <TouchableOpacity 
            onPress={ () => null }
            className="h-[55px] w-full flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl bg-transparent"
          >
            <Image source={ require("../../../../assets/images/apple_logo.png") } className="h-[20px] w-[20px] mr-1" />
            <Text className="font-medium text-lg text-baseGreen">Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Option */}
        <TouchableOpacity
          onPress={() => navigation.navigate('signUpScreen')}
          className="w-full mt-5"
        >
          <Text className="text-primary text-center font-medium">
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default LoginInfoScreen;