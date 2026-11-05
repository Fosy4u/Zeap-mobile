import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, Linking } from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';

const NotificationSettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  
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
        <Text className="font-montserratSemiBold text-lg text-baseGreen">Notification Settings</Text>
        <View className="h-[40px] w-[40px]" />
      </View>

      {/*==== Content ====*/}
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View className="px-5 pt-5 pb-20">
          <Text className="text-base text-gray-800">Manage notification permissions and sounds in your device settings.</Text>
          <TouchableOpacity onPress={() => { void Linking.openSettings(); }} className="mt-5">
            <Text className="text-base text-baseGreen">Open device settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default NotificationSettingsScreen;
