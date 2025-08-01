import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight2 } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, Switch } from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';

const SecuritySettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  
  const [securitySettings, setSecuritySettings] = useState({
    rememberMe: true,
    fingerprintLock: true,
    faceIdLock: false,
  });

  const handleToggle = (key: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSetupFingerprint = () => {
    // Handle fingerprint setup logic here
    console.log('Setup fingerprint pressed');
  };
    
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
        <Text className="font-montserratSemiBold text-lg text-baseGreen">Security Settings</Text>
        <View className="h-[40px] w-[40px]" />
      </View>

      {/*==== Content ====*/}
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View className="px-5 pt-5 pb-20">
          <SecuritySettingItem
            title="Remember me"
            value={securitySettings.rememberMe}
            onValueChange={() => handleToggle('rememberMe')}
          />
          
          <SecuritySettingItem
            title="Fingerprint lock"
            value={securitySettings.fingerprintLock}
            onValueChange={() => handleToggle('fingerprintLock')}
          />
          
          <SecuritySettingItem
            title="Face ID lock"
            value={securitySettings.faceIdLock}
            onValueChange={() => handleToggle('faceIdLock')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SecuritySettingsScreen;

interface ISecuritySettingItemProps {
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SecuritySettingItem = (props: ISecuritySettingItemProps) => {
  const { title, value, onValueChange } = props;
  
  return (
    <View className="h-auto w-full mb-4 flex-row items-center justify-between py-3">
      <Text className="font-montserratMedium text-base text-gray-800">{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#133522' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}; 