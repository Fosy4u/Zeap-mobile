import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ArrowRight2, Headphone, Like1, Logout, Notification, Profile, Receipt21, Ruler, Setting2, Ticket } from 'iconsax-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useLogoutHook from '../../auths/hooks/logout_hook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';


const ProfileScreen = () => {
  const { userData } = useSelector((state: RootState) => state.profileState );
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const { clearStorage } = useLogoutHook();

  const handleLogoutUser = async (): Promise<void> => {
    await clearStorage();
  }


  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full w-full flex-1 px-5 pt-2 pb-3">

        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
        />

        {/*==== Header ====*/}
        <View className="h-auto w-full py-3 flex-row items-center justify-between">
          <View className="h-[40px] w-[40px]" />
          <Text className="font-semibold text-lg text-baseGreen">My Profile</Text>
          <TouchableOpacity
            className="bg-lightGreen p-2.5 rounded-full"
            onPress={ () => null }
          >
            <Notification color="#133522" size={24} variant="Bold" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >

          <View className="mt-5">

            {/*==== Profile Image ====*/}
            <View className="h-auto w-full py-7 flex-1 items-center rounded-2xl bg-[#F8F9FE]">
              <Image
                className="h-[80px] w-[80px] rounded-full"
                resizeMode="cover"
                source={require("../../../assets/home/profile_image.png")}
              />
              <Text className="mt-3 text-xl text-baseGreen">{ userData.firstName }</Text>
              <Text className="text-sm text-baseGreen">{ userData.email }</Text>
            </View>

            <View className="mt-5">
              <TouchableOpacity onPress={ () => navigation.navigate("personalInformationScreen") }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <View className="h-auto w-fit flex-row items-center gap-x-4">
                    <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
                      <Profile color="gray" />
                    </View>
                    <Text className="text-lg text-gray-700">Personal information</Text>
                  </View>
                  <ArrowRight2 size={ 24 } className="text-gray-700" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={ () => null }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <View className="h-auto w-fit flex-row items-center gap-x-4">
                    <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
                      <Notification color="gray" />
                    </View>
                    <Text className="text-lg text-gray-700">Notifications</Text>
                  </View>
                  <ArrowRight2 size={ 24 } className="text-gray-700" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={ () => null }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <View className="h-auto w-fit flex-row items-center gap-x-4">
                    <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
                      <Receipt21 color="gray" />
                    </View>
                    <Text className="text-lg text-gray-700">Orders</Text>
                  </View>
                  <ArrowRight2 size={ 24 } className="text-gray-700" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={ () => null }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <View className="h-auto w-fit flex-row items-center gap-x-4">
                    <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
                      <Ruler color="gray" />
                    </View>
                    <Text className="text-lg text-gray-700">Measurements</Text>
                  </View>
                  <ArrowRight2 size={ 24 } className="text-gray-700" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={ () => null }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <View className="h-auto w-fit flex-row items-center gap-x-4">
                    <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
                      <Ticket color="gray" />
                    </View>
                    <Text className="text-lg text-gray-700">Vouchers</Text>
                  </View>
                  <ArrowRight2 size={ 24 } className="text-gray-700" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={ () => null }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <View className="h-auto w-fit flex-row items-center gap-x-4">
                    <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
                      <Like1 color="gray" />
                    </View>
                    <Text className="text-lg text-gray-700">Reviews & Rating</Text>
                  </View>
                  <ArrowRight2 size={ 24 } className="text-gray-700" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={ () => null }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <View className="h-auto w-fit flex-row items-center gap-x-4">
                    <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
                      <Setting2 color="gray" />
                    </View>
                    <Text className="text-lg text-gray-700">Settings</Text>
                  </View>
                  <ArrowRight2 size={ 24 } className="text-gray-700" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={ () => null }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <View className="h-auto w-fit flex-row items-center gap-x-4">
                    <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
                      <Headphone color="gray" />
                    </View>
                    <Text className="text-lg text-gray-700">Help and support</Text>
                  </View>
                  <ArrowRight2 size={ 24 } className="text-gray-700" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={ () => handleLogoutUser() }>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <View className="h-auto w-fit flex-row items-center gap-x-4">
                    <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
                      <Logout color="gray" />
                    </View>
                    <Text className="text-lg text-gray-700">Logout</Text>
                  </View>
                  <ArrowRight2 size={ 24 } className="text-gray-700" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default ProfileScreen;