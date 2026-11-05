import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight2, MoneyChange, Trash } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { RootState } from '../../../redux/store/store';

const SettingsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { userData } = useSelector((state: RootState) => state.profileState);
    const isSignedIn = !!userData?.uid && !userData?.isGuest;

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

                    {/* ==== Notifications Settings ==== */}
                    {/* <CardItems
                        handleOnPress={ () => navigation.navigate("notificationSettingsScreen") }
                        title="Notification settings"
                        icon={ <Notification className="text-gray-800" /> }
                    /> */}

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

                    { isSignedIn && (
                        <CardItems
                            handleOnPress={ () => navigation.navigate("deleteAccountScreen") }
                            title="Delete account"
                            icon={ <Trash color="#DC2626" /> }
                            isDestructive
                        />
                    ) }
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
  isDestructive?: boolean;
}

const CardItems = (props: ICardItemProps) => {
  const { handleOnPress, title, icon, isDestructive = false } = props;
  return (
    <TouchableOpacity onPress={ handleOnPress }>
      <View className="h-auto w-full mb-7 flex-row items-center justify-between">
        <View className="h-auto w-fit flex-row items-center gap-x-4">
          <View className={ `h-[55px] w-[55px] flex items-center justify-center rounded-xl border ${ isDestructive ? "border-red-100 bg-red-50" : "border-[#EDEFF4] bg-[#F8F9FE]" }` }>
            { icon }
          </View>
          <Text className={ `font-montserratMedium text-base ${ isDestructive ? "text-red-600" : "text-gray-800" }` }>{ title }</Text>
        </View>
        <ArrowRight2 size={ 24 } className={ isDestructive ? "text-red-600" : "text-gray-700" } />
      </View>
    </TouchableOpacity>
  );
};