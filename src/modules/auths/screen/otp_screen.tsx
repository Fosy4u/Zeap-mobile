import React, { useState } from 'react'
import { ArrowRight } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import OTPTextView from 'react-native-otp-textinput';
import { useNavigation } from '@react-navigation/native';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const OTPScreen = () => {
  let [otpInput, setOTPInput] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  return (
    <SafeAreaView className="flex-1 items-center px-5">
        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
        />

        <ScrollView>

          <View className="h-[48px] w-auto mx-auto mt-12 relative">
            <View className="h-[35px] w-auto mx-auto px-3.5 flex items-center justify-center rounded-lg bg-gold">
              <Text>Now let's</Text>
            </View>
            <View className="h-0 w-0 absolute top-[30px] left-[50%] translate-x-[-142px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold" />
          </View>

          <View className="h-auto w-full mt-4 px-[15px] flex items-center">
              <Text className="font-semibold text-2xl text-baseGreen">Verify OTP Received</Text>
              <Text className="mt-3 text-center text-base">Enter the 5 digit code sent to your email. This will help us verify your email and enable you change your password</Text>
          </View>

          {/* ==== Form ==== */}
          <View className="h-auto w-full mt-7">

            <View>
              <OTPTextView
                inputCount={ 5 }
                tintColor="#133522"
                textInputStyle={{ borderWidth: 1, borderRadius: 10 }}
                handleTextChange={ setOTPInput }
                autoFocus={ true }
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity 
              onPress={ () => navigation.navigate("resetPasswordScreen") }
              className="h-[55px] w-auto mt-[200px] flex flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="text-lg text-white mr-2">Proceed</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
        
    </SafeAreaView>
  )
}

export default OTPScreen;