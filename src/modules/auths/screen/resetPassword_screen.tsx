import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Eye, EyeSlash } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SuccessPopupModal from '../modals/successPopup_modal';
import { RootState } from '../../../redux/store/store';

import { setShowSuccessModal } from '../../setting/slices/settings_slice';


const ResetPasswordScreen = () => {
  const { isSellerOptions, showSuccessModal } = useSelector((state: RootState) => state.settingsState);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGoToLogin = (): void => {
    setTimeout(() => {
      dispatch(setShowSuccessModal(true));
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 items-center relative">
        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
        />

        <View className="px-5">
          <ScrollView>

            <View className="h-[48px] w-auto mx-auto mt-12 relative">
              <View className="h-[35px] w-auto mx-auto px-3.5 flex items-center justify-center rounded-lg bg-gold">
                <Text>Now go ahead and</Text>
              </View>
              <View className="h-0 w-0 absolute top-[30px] left-[50%] translate-x-[-112px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold" />
            </View>

            <View className="h-auto w-full mt-4 px-[17px] flex items-center">
                <Text className="font-semibold text-2xl text-baseGreen">Reset Your Password</Text>
                <Text className="mt-3 text-center text-base">Kindly enter a new password. Always protect your password at all times and keep it safe</Text>
            </View>

            {/* ==== Form ==== */}
            <View className="h-auto w-full mt-7">

              <Text aria-label="Password" nativeID="password" className="mt-6">New Password</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                <TextInput
                  aria-label="Password"
                  aria-labelledby="password"
                  secureTextEntry={ !showPassword }
                  placeholder="Enter new password"
                  placeholderTextColor="#9ca3af"
                  className="text-base"
                  onChangeText={(value) => null}
                />
                <TouchableOpacity onPress={ () => setShowPassword(!showPassword) }>
                  { showPassword ? <Eye className="text-gray-400" /> : <EyeSlash className="text-gray-400" /> }
                </TouchableOpacity>
              </View>

              <Text aria-label="Password" nativeID="password" className="mt-6">Password</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                <TextInput
                  aria-label="Password"
                  aria-labelledby="password"
                  secureTextEntry={ !showConfirmPassword }
                  placeholder="Enter password"
                  placeholderTextColor="#9ca3af"
                  className="text-base"
                  onChangeText={(value) => null}
                />
                <TouchableOpacity onPress={ () => setShowConfirmPassword(!showConfirmPassword) }>
                  { showConfirmPassword ? <Eye className="text-gray-400" /> : <EyeSlash className="text-gray-400" /> }
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                onPress={ () => handleGoToLogin() }
                className="h-[55px] w-auto mt-14 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
              >
                <Text className="text-lg text-white mr-2">Proceed</Text>
                <ArrowRight className="text-white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        { showSuccessModal &&
          <SuccessPopupModal
            bodyText="You have successfully reset your password. Ensure you keep your password safe."
            screenURL="loginScreen"
          />
        }
        
    </SafeAreaView>
  )
}

export default ResetPasswordScreen;