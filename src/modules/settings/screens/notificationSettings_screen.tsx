import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, Switch } from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';

const NotificationSettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  
  const [notificationSettings, setNotificationSettings] = useState({
    generalNotification: true,
    sound: true,
    payments: false,
    completeOrder: false,
    appUpdates: false,
    newServiceAvailable: true,
    newTipsAvailable: true,
  });

  const handleToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
        <Text className="font-montserratSemiBold text-lg text-baseGreen">Notification Settings</Text>
        <View className="h-[40px] w-[40px]" />
      </View>

      {/*==== Content ====*/}
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View className="px-5 pt-5 pb-20">
          <NotificationSettingItem
            title="General notification"
            value={notificationSettings.generalNotification}
            onValueChange={() => handleToggle('generalNotification')}
          />
          
          <NotificationSettingItem
            title="Sound"
            value={notificationSettings.sound}
            onValueChange={() => handleToggle('sound')}
          />
          
          <NotificationSettingItem
            title="Payments"
            value={notificationSettings.payments}
            onValueChange={() => handleToggle('payments')}
          />
          
          <NotificationSettingItem
            title="Complete order"
            value={notificationSettings.completeOrder}
            onValueChange={() => handleToggle('completeOrder')}
          />
          
          <NotificationSettingItem
            title="App updates"
            value={notificationSettings.appUpdates}
            onValueChange={() => handleToggle('appUpdates')}
          />
          
          <NotificationSettingItem
            title="New service available"
            value={notificationSettings.newServiceAvailable}
            onValueChange={() => handleToggle('newServiceAvailable')}
          />
          
          <NotificationSettingItem
            title="New tips available"
            value={notificationSettings.newTipsAvailable}
            onValueChange={() => handleToggle('newTipsAvailable')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default NotificationSettingsScreen;

interface INotificationSettingItemProps {
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const NotificationSettingItem = (props: INotificationSettingItemProps) => {
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