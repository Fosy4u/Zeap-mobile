import React from 'react'
import { ArrowRight } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Controller } from 'react-hook-form';
import useForgotPasswordHook from '../hooks/forgotPassword_hook';
import AppLoader from '../../general/components/appLoader';
import SuccessPopupModal from '../modals/successPopup_modal';

const ForgotScreen = () => {
  const { control, handleSubmit, onSubmit, errors, isLoading, showSuccessModal, submittedEmail } = useForgotPasswordHook();

  return (
    <SafeAreaView className="flex-1">
        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
        />

        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >

          <View className="h-[48px] w-auto mx-auto mt-12 relative">
            <View className="h-[35px] w-auto mx-auto px-3.5 flex items-center justify-center rounded-lg bg-gold">
              <Text>We learnt you</Text>
            </View>
            <View className="h-0 w-0 absolute top-[30px] left-[50%] translate-x-[-128px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold" />
          </View>

          <View className="h-auto w-full mt-4 px-[17px] flex items-center">
              <Text className="font-semibold text-2xl text-baseGreen">Forgot Your Password</Text>
              <Text className="mt-3 text-center text-base">Enter the email address associated to your account and we will send you a link to reset your password</Text>
          </View>

          {/* ==== Form ==== */}
          <View className="h-auto w-full mt-7">

            <Text aria-label="Email" nativeID="emailAddress" className="mt-5">Email address</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <Controller
                control={ control }
                name="email"
                render={ ({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    aria-label="Email"
                    aria-labelledby="emailAddress"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={ false }
                    editable={ !isLoading }
                    placeholder="Enter email address"
                    placeholderTextColor="#9ca3af"
                    className="h-[44px] text-base"
                    onBlur={ onBlur }
                    onChangeText={ onChange }
                    value={ value }
                  />
                ) }
              />
              { errors.email && (<Text className="text-red-500 text-xs">{ errors.email.message }</Text>) }
            </View>

            <TouchableOpacity 
              disabled={ isLoading }
              onPress={ handleSubmit(onSubmit) }
              className={ `h-[55px] w-auto mt-14 flex flex-row items-center justify-center rounded-xl bg-baseGreen ${ isLoading ? "opacity-60" : "" }` }
            >
              <Text className="text-lg text-white mr-2">Proceed</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        { isLoading && <AppLoader loadingAdditionalMessage="Sending your reset link..." /> }

        { showSuccessModal && (
          <SuccessPopupModal
            title="Check Your Email"
            bodyText={ `We've sent a password reset link to ${ submittedEmail }. Open it to set a new password, then log back in.` }
            screenURL="loginScreen"
          />
        ) }
    </SafeAreaView>
  )
}

export default ForgotScreen;