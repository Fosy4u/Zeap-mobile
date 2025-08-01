import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight, ArrowRight2, Eye, EyeSlash } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, TextInput } from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import useSettingsHook from '../hooks/settings_hook';
import { Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setShowConfirmNewPassword, setShowCurrentPassword, setShowNewPassword } from '../slices/settingsState_slice';

const ChangePasswordSettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  
  const { 
    control, 
    handleSubmit, 
    onSubmit, 
    errors, 
    isLoading,
    showCurrentPassword,
    showNewPassword,
    showConfirmNewPassword,
  } = useSettingsHook();
    

  return (
    <SafeAreaView className="h-full w-full flex-1 bg-white">
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      
      {/*==== Header ====*/}
      <View className="h-auto w-full px-5 pt-5 pb-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={ () => navigation.pop() }>
          <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" />
          </View>
        </TouchableOpacity>
        <Text className="font-montserratSemiBold text-lg text-baseGreen">Change Password</Text>
        <View className="h-[40px] w-[40px]" />
      </View>

      {/*==== Content ====*/}
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View className="px-5 pt-5 pb-20">
          {/* Current Password */}
          <Text className="mt-6">Current password</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  secureTextEntry={!showCurrentPassword}
                  placeholder="Enter password"
                  placeholderTextColor="#9ca3af"
                  className="text-base flex-1"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <TouchableOpacity onPress={() => dispatch(setShowCurrentPassword(!showCurrentPassword)) }>
              {showCurrentPassword ? <EyeSlash className="text-gray-400" /> : <Eye className="text-gray-400" />}
            </TouchableOpacity>
          </View>
          {errors.currentPassword && (<Text className="text-red-500 text-xs">{errors.currentPassword.message}</Text>)}

          {/* New Password */}
          <Text className="mt-6">New password</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  secureTextEntry={!showNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#9ca3af"
                  className="text-base flex-1"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <TouchableOpacity onPress={() => dispatch(setShowNewPassword(!showNewPassword)) }>
              {showNewPassword ? <EyeSlash className="text-gray-400" /> : <Eye className="text-gray-400" />}
            </TouchableOpacity>
          </View>
          {errors.newPassword && (<Text className="text-red-500 text-xs">{errors.newPassword.message}</Text>)}

          {/* Confirm New Password */}
          <Text className="mt-6">Confirm new password</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
            <Controller
              control={control}
              name="confirmNewPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  secureTextEntry={!showConfirmNewPassword}
                  placeholder="Enter new password again"
                  placeholderTextColor="#9ca3af"
                  className="text-base flex-1"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <TouchableOpacity onPress={() => dispatch(setShowConfirmNewPassword(!showConfirmNewPassword)) }>
              {showConfirmNewPassword ? <EyeSlash className="text-gray-400" /> : <Eye className="text-gray-400" />}
            </TouchableOpacity>
          </View>
          {errors.confirmNewPassword && (<Text className="text-red-500 text-xs">{errors.confirmNewPassword.message}</Text>)}

          {/* Change Password Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="h-[55px] w-auto mt-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
          >
            <Text className="text-lg text-white mr-2">
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Text>
            { isLoading ? null : <ArrowRight className="text-white" /> }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChangePasswordSettingsScreen; 