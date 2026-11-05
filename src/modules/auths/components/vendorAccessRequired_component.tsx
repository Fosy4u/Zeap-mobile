import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Shop } from 'iconsax-react-native';
import { ActivityIndicator, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';

const AccessLoadingComponent = () => (
  <View className="h-full w-full flex-1 items-center justify-center">
    <ActivityIndicator size="large" color="#133522" />
  </View>
);

const VendorAccessRequiredComponent = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("homeScreen", { screen: "Home" });
  };

  return (
    <SafeAreaView className="h-full w-full flex-1">
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View className="h-auto w-full px-5 pt-5 pb-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={ handleGoBack }>
          <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" />
          </View>
        </TouchableOpacity>
        <Text className="font-montserratSemiBold text-lg text-baseGreen">Shop Owners Only</Text>
        <View className="h-[40px] w-[40px]" />
      </View>

      <View className="flex-1 px-8 items-center justify-center">
        <View className="h-[80px] w-[80px] items-center justify-center rounded-full bg-lightGreen">
          <Shop size={ 36 } color="#133522" variant="Bold" />
        </View>
        <Text className="mt-6 font-montserratSemiBold text-lg text-gray-800 text-center">
          This area is for shop owners only
        </Text>
        <Text className="mt-2 font-montserratMedium text-sm leading-6 text-gray-500 text-center">
          Bank details, shop information, documents and policies are only available to shop owners. If you own a shop, go back and try again once your shop account is active.
        </Text>

        <TouchableOpacity
          onPress={ handleGoBack }
          className="h-[55px] w-full mt-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
        >
          <Text className="text-lg text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export { AccessLoadingComponent };
export default VendorAccessRequiredComponent;
