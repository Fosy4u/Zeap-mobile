import React, { useState } from 'react'
import { ArrowRight, Eye, EyeSlash } from 'iconsax-react-native';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CheckBox from "@react-native-community/checkbox";
import { useNavigation } from '@react-navigation/native';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ForgotScreen from './forgotPassword_screen';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
              <Text>Hello, { "Otor John" }</Text>
            </View>
            <View className="h-0 w-0 absolute top-[30px] left-[50%] translate-x-[-121px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold" />
          </View>

          <View className="h-auto w-full mt-4 px-[20px] flex items-center">
              <Text className="font-semibold text-2xl text-baseGreen">Welcome Back</Text>
              <Text className="mt-3 text-center text-base">Enter your email and password to login to your account</Text>
          </View>

          {/* ==== Form ==== */}
          <View className="h-auto w-full">

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

            <Text aria-label="Password" nativeID="password" className="mt-6">Password</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Password"
                aria-labelledby="password"
                secureTextEntry={ showPassword }
                placeholder="Enter password"
                placeholderTextColor="#9ca3af"
                className="text-base"
                onChangeText={(value) => null}
              />
              <TouchableOpacity onPress={ () => setShowPassword(!showPassword) }>
                { showPassword ? <Eye className="text-gray-400" /> : <EyeSlash className="text-gray-400" /> }
              </TouchableOpacity>
            </View>

            <View className="mt-6 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <CheckBox
                  value={ rememberMe }
                  onValueChange={ (newValue) => setRememberMe(newValue) }
                  tintColors={{ true: "#133522", false: "#151518" }}
                />
                <Text>Remember me</Text>
              </View>
              <TouchableOpacity onPress={ () => navigation.navigate("forgotPasswordScreen") }>
                <Text>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={ () => null }
              className="h-[55px] w-auto mt-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="text-lg text-white mr-2">Login</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>

            <View className="mt-6 px-1.5 flex-row items-center">
              <View className="h-[0.5px] mr-2 flex-1 bg-gray-400" />
              <Text>OR LOGIN USING</Text>
              <View className="h-[0.5px] ml-2 flex-1 bg-gray-400" />
            </View>

            <View className="mt-8 flex-1 flex-row justify-center">
              <TouchableOpacity 
                  onPress={ () => null }
                  className="h-[55px] w-full flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl bg-transparent"
                >
                  <Image source={ require("../../../assets/google_logo.png") } className="h-[20px] w-[20px] mr-1" />
                  <View className="w-[5px]" /> 
                  <Text className="font-medium text-lg text-baseGreen">Google</Text>
              </TouchableOpacity>

              <View className="w-[15px]" />

              <TouchableOpacity 
                onPress={ () => null }
                className="h-[55px] w-full flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl bg-transparent"
              >
                <Image source={ require("../../../assets/apple_logo.png") } className="h-[20px] w-[20px] mr-1" />
                <Text className="font-medium text-lg text-baseGreen">Apple</Text>
              </TouchableOpacity>
            </View>

            <View className="w-full mt-6 flex-1 flex-row justify-center">
              <Text className="mr-1">Don’t have an account?</Text>

              <TouchableOpacity
                onPress={ () => navigation.navigate("signUpScreen") }
              >
                <Text className="text-baseGreen">Create New Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
    </SafeAreaView>
  )
}

export default LoginScreen;