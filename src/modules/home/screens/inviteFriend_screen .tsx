import React from 'react'
import { Image, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { ArrowLeft, DocumentCopy } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';


const InviteFriendScreen = () => {
  const { bestDeals } = useSelector((state: RootState) => state.homeState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1 px-[25px] pt-[20px]">
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
          />

          {/*==== Header ====*/}
          <View className="h-auto w-full flex-row items-center justify-between">
            <TouchableOpacity onPress={ () => navigation.pop() }>
              <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                <ArrowLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="font-semibold text-lg text-baseGreen">Invite Friend</Text>
            <View className="h-[40px] w-[40px]" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mt-10 flex items-center">
              <Image
                className="h-[174px] w-[180px]"
                resizeMode="cover"
                source={require("../../../assets/home/invite_friend.png")}
              />
              <Text className="mt-6 text-center text-lg">
                <Text className="text-gray-700">Get </Text>
                <Text className="text-[#369460] font-semibold">100 points</Text>
                <Text className="text-gray-700"> for every successful referral to make</Text>
              </Text>

              <View className="h-auto w-full mt-5 py-6 flex items-center border border-[#ffe9c9] rounded-2xl bg-lightGold">
                <Text className="text-sm text-gray-800">Your unique referral code</Text>
                <View className="mt-2.5 flex-row items-center">
                  <Text className="mr-3 font-medium text-lg text-left text-gray-800">AjpLVir33062qRQUv</Text>
                  <DocumentCopy variant="Bold" className="text-[22px] text-gray-800" />
                </View>
              </View>

              <View className="mt-8 flex items-center">
                <Text className="font-medium text-lg text-gray-800">How it works?</Text>
                <Text className="mt-3 text-gray-800 text-center text-base">
                  Lorem ipsum dolor sit amet consectetur. Et tincidunt vel sit ornare orci. Morbi amet pharetra proin et odio integer. Duis pellentesque maecenas duis felis fringilla posuere tempus nullam. Mauris laoreet dui cursus massa semper faucibus. Neque nisi aliquet lobortis euismod nec enim vivamus felis purus.
                  Lorem morbi egestas nibh quisque urna id dui. Dignissim justo dignissim quis nibh.
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default InviteFriendScreen;