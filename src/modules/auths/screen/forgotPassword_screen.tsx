import React from 'react'
import { ArrowRight } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';

const ForgotScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>()

  return (
    <SafeAreaView className="flex-1 items-center px-5">
        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
        />

        <ScrollView>

          <View className="h-[48px] w-auto mx-auto mt-12 relative">
            <View className="h-[35px] w-auto mx-auto px-3.5 flex items-center justify-center rounded-lg bg-gold">
              <Text>We learnt you</Text>
            </View>
            <View className="h-0 w-0 absolute top-[30px] left-[50%] translate-x-[-128px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold" />
          </View>

          <View className="h-auto w-full mt-4 px-[17px] flex items-center">
              <Text className="font-semibold text-2xl text-baseGreen">Forgot Your Password</Text>
              <Text className="mt-3 text-center text-base">Enter the email address or phone number associated to your account and  we will send you a code to reset your password</Text>
          </View>

          {/* ==== Form ==== */}
          <View className="h-auto w-full mt-7">

            <Text aria-label="Email" nativeID="emailAddress" className="mt-5">Email address</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Email"
                aria-labelledby="emailAddress"
                keyboardType="email-address"
                placeholder="Enter email address"
                placeholderTextColor="#9ca3af"
                className="text-base"
                onChangeText={(value) => null}
              />
            </View>

            <Text aria-label="Phone Number" nativeID="phoneNumber" className="mt-5">Phone number</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Phone Number"
                aria-labelledby="phoneNumber"
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                placeholderTextColor="#9ca3af"
                className="text-base"
                onChangeText={(value) => null}
              />
            </View>

            <TouchableOpacity 
              onPress={ () => navigation.navigate("otpScreen") }
              className="h-[55px] w-auto mt-14 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="text-lg text-white mr-2">Proceed</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
        
    </SafeAreaView>
  )
}

export default ForgotScreen;