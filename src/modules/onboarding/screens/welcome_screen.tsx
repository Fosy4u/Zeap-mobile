import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight } from 'iconsax-react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native'

const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  return (
    <SafeAreaView className="flex-1">
      <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
      />

      <View className="flex-[0.5] items-center justify-center bg-white">
        <Image
          source={require("../../../assets/app_logo.png")}
          className="h-[80px] w-[80px] mt-14 rounded-2xl"
        />

        <Image
          source={ require("../../../assets/welcome_image.png") }
          resizeMode={"contain"}
          className="h-[250px] w-auto mt-10"
        />
      </View>

      <View className="flex-[0.5] px-7 items-center bg-white">
        
        <Text className="mt-8 font-bold text-2xl text-baseGreen">Welcome to ZEAP ✌🏽</Text>
        <Text className="mt-3 text-center text-base">Let’s get you into the system, ASAP</Text>

        <TouchableOpacity 
          onPress={ () => navigation.navigate("loginScreen") }
          className="h-[55px] w-full mt-12 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
        >
          <Text className="text-lg text-white">Login</Text>
          <View className="w-[5px]" />
          <ArrowRight className="text-white" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={ () => navigation.navigate("signUpScreen") }
          className="h-[55px] w-full mt-5 flex flex-row items-center justify-center rounded-xl bg-lightGreen"
        >
          <Text className="font-medium text-lg text-baseGreen">Create Account</Text>
          <View className="w-[5px]" />
          <ArrowRight className="text-baseGreen" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={ () => null }
          className="h-[55px] w-full mt-5 flex flex-row items-center justify-center rounded-xl bg-lightGold"
        >
          <Text className="font-medium text-lg text-baseGreen">Continue As Guest</Text>
          <View className="w-[5px]" />
          <ArrowRight className="text-baseGreen" />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}

export default WelcomeScreen;