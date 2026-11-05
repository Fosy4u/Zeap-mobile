import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Trash, Warning2 } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import AuthCheck from '../../auths/components/authCheck';
import AppLoader from '../../general/components/appLoader';
import useDeleteAccountHook from '../hooks/deleteAccount_hook';

const DELETED_ITEMS = [
  "Your profile and login",
  "Saved delivery addresses and body measurements",
  "Order history, reviews, points and vouchers",
  "Your shop, products and payout details (if you sell on Zeaper)",
];

const DeleteAccountScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  const {
    accountEmail,
    confirmEmail,
    setConfirmEmail,
    isEmailMatched,
    showEmailMismatch,
    isDeleting,
    confirmDeleteAccount,
  } = useDeleteAccountHook();

  return (
    <SafeAreaView className="h-full w-full flex-1">
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View className="h-auto w-full px-5 pt-5 pb-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={ () => navigation.pop() }>
          <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" />
          </View>
        </TouchableOpacity>
        <Text className="font-montserratSemiBold text-lg text-baseGreen">Delete Account</Text>
        <View className="h-[40px] w-[40px]" />
      </View>

      <ScrollView showsVerticalScrollIndicator={ false } keyboardShouldPersistTaps="handled">
        <View className="px-5 pt-5 pb-20">

          <View className="h-auto w-full p-4 rounded-xl border border-red-200 bg-red-50">
            <View className="flex-row items-center gap-x-2">
              <Warning2 size={ 22 } color="#DC2626" variant="Bold" />
              <Text className="font-montserratSemiBold text-base text-red-600">This can't be undone</Text>
            </View>
            <Text className="mt-3 font-montserratMedium text-sm leading-5 text-gray-700">
              Deleting your account permanently removes it from Zeaper. You will lose:
            </Text>
            { DELETED_ITEMS.map((item) => (
              <View key={ item } className="mt-2 flex-row items-start">
                <Text className="mr-2 text-sm text-gray-700">•</Text>
                <Text className="flex-1 font-montserratMedium text-sm leading-5 text-gray-700">{ item }</Text>
              </View>
            )) }
            <Text className="mt-3 font-montserratMedium text-sm leading-5 text-gray-700">
              Orders that are still being processed may still be completed or refunded.
            </Text>
          </View>

          <Text className="mt-8 font-montserratSemiBold text-base text-gray-800">Confirm it's you</Text>
          <Text className="mt-1 font-montserratMedium text-sm leading-5 text-gray-500">
            Type <Text className="font-montserratSemiBold text-gray-800">{ accountEmail || "your account email" }</Text> to confirm you want to delete your account.
          </Text>

          <Text className="mt-5">Email address</Text>
          <View className={ `h-auto w-full mt-1.5 px-3 py-1 border rounded-xl bg-gray-100 ${ showEmailMismatch ? "border-red-400" : "border-gray-300" }` }>
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={ false }
              editable={ !isDeleting }
              placeholder="Enter your email address"
              placeholderTextColor="#9ca3af"
              className="h-[44px] text-base"
              onChangeText={ setConfirmEmail }
              value={ confirmEmail }
            />
          </View>
          { showEmailMismatch && (
            <Text className="mt-1 text-red-500 text-xs">This doesn't match the email on your account.</Text>
          ) }

          <TouchableOpacity
            onPress={ confirmDeleteAccount }
            disabled={ !isEmailMatched || isDeleting }
            className={ `h-[55px] w-auto mt-10 flex flex-row items-center justify-center rounded-xl bg-red-600 ${ (!isEmailMatched || isDeleting) ? "opacity-40" : "" }` }
          >
            <Trash size={ 22 } color="#FFFFFF" />
            <Text className="ml-2 text-lg text-white">Delete My Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={ () => navigation.pop() }
            disabled={ isDeleting }
            className="h-[55px] w-auto mt-4 flex flex-row items-center justify-center rounded-xl bg-lightGreen"
          >
            <Text className="text-lg text-baseGreen">Keep My Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      { isDeleting && <AppLoader loadingAdditionalMessage="Deleting your account..." /> }
    </SafeAreaView>
  );
}

export default AuthCheck(DeleteAccountScreen);
