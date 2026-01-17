import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight2, Global, Lock, MoneyChange, Moon, Notification, SecuritySafe } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';

const SettingsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    
    return (
        <SafeAreaView className="h-full w-full flex-1">
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
                <Text className="font-montserratSemiBold text-lg text-baseGreen">Settings</Text>
                <View className="h-[40px] w-[40px]" />
            </View>

            {/*==== Content ====*/}
            <ScrollView showsVerticalScrollIndicator={ false }>
                <View className="px-5 pt-5 pb-20">

                    {/* ==== Change Password ==== */}
                    <CardItems
                        handleOnPress={ () => navigation.navigate("changePasswordSettingsScreen") }
                        title="Change password"
                        icon={ <Lock className="text-gray-800" /> }
                    />

                    {/* ==== Notifications Settings ==== */}
                    <CardItems
                        handleOnPress={ () => navigation.navigate("notificationSettingsScreen") }
                        title="Notification settings"
                        icon={ <Notification className="text-gray-800" /> }
                    />

                    {/* ==== Security ==== */}
                    <CardItems
                        handleOnPress={ () => navigation.navigate("securitySettingsScreen") }
                        title="Security"
                        icon={ <SecuritySafe className="text-gray-800" /> }
                    />

                    {/* ==== Language ==== */}
                    <CardItems
                        handleOnPress={ () => navigation.navigate("languageSettingsScreen") }
                        title="Language"
                        icon={ <Global className="text-gray-800" /> }
                    />

                    {/* ==== Currency ==== */}
                    <CardItems
                        handleOnPress={ () => navigation.navigate("currencySettingsScreen") }
                        title="Currency"
                        icon={ <MoneyChange className="text-gray-800" /> }
                    />

                    {/* ==== Dark Mode ==== */}
                    {/* <CardItems
                        handleOnPress={ () => null }
                        title="Dark mode"
                        icon={ <Moon className="text-gray-800" /> }
                    /> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SettingsScreen;



interface ICardItemProps {
  handleOnPress: () => void;
  title: string;
  icon: React.ReactNode;
}

const CardItems = (props: ICardItemProps) => {
  const { handleOnPress, title, icon } = props;
  return (
    <TouchableOpacity onPress={ handleOnPress }>
      <View className="h-auto w-full mb-7 flex-row items-center justify-between">
        <View className="h-auto w-fit flex-row items-center gap-x-4">
          <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
            { icon }
          </View>
          <Text className="font-montserratMedium text-base text-gray-800">{ title }</Text>
        </View>
        <ArrowRight2 size={ 24 } className="text-gray-700" />
      </View>
    </TouchableOpacity>
  );
};