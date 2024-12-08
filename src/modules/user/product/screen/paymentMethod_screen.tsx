import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { ArrowDown2, ArrowLeft, ArrowRight, Call, Location, Sms } from 'iconsax-react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CheckBox from '@react-native-community/checkbox';
import SavedAddressesModal from '../modals/saved_addresses_modal';

const PaymentMethodScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  const [saveMeasurementForNextTime, setSaveMeasurementForNextTime] = useState(false);
  const [showSavedAddressesModal, setShowSavedAddressesModal] = useState(false);

  const handleShowSavedAddressesModal = (value: boolean) => {
    setShowSavedAddressesModal(value);
  };
  
  return (
    <SafeAreaView className="h-full w-full relative flex-1 pt-[15px] bg-lightGray">
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/*==== Header ====*/}
      <View className="h-auto w-full px-[20px] flex-row items-center justify-between">
        <TouchableOpacity onPress={ () => navigation.pop() }>
          <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" />
          </View>
        </TouchableOpacity>
        <Text className="font-semibold text-lg text-baseGreen">Payment Method</Text>
        <View className="h-[40px] w-[40px]" />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View className="pt-[30px] pb-5 px-[20px]">
          <Text className="font-normal text-2xl text-gray-700">Kindly provide us your payment method</Text>

          <Text className="mt-5 font-medium text-base text-gray-600">Select existing payment method</Text>

          <View className="h-auto w-full mt-6 px-5 py-5 border border-gray-200 rounded-xl bg-[#eeeff5]">
            <View className="flex-row items-center justify-between">
              <Text className="font-Montserrat font-normal text-base text-gray-700">Otor John Stephen</Text>
              <Text className="font-Montserrat font-medium text-base text-gray-700">GT Bank</Text>
            </View>

            <Image
              source={ require("../../../../assets/atm_chip.png") }
              resizeMode="cover"
              className="h-[26px] w-[31px] mt-4"
            />

            <View className="mt-2 flex flex-row">
              <Text className="mr-1 font-semibold text-xl">**** **** **** ****</Text>
              <Text className="font-Montserrat text-lg">4687</Text>
            </View>

            <View className="mt-4 flex-row items-center justify-between">
              <Text>Expiry date: 06/25</Text>
              <Image
                source={ require("../../../../assets/master_card_logo.png") }
                resizeMode="contain"
                className="h-[18px] w-[31px]"
              />
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={ () => handleShowSavedAddressesModal(true) }
            className="h-[55px] w-full mt-6 flex-row items-center justify-center gap-x-1"
          >
            <Text className="font-normal text-base text-baseGreen">View More Cards</Text>
            <ArrowRight size={ 22 } className="text-baseGreen" />
          </TouchableOpacity>

          <Text className="mt-4 font-medium text-center">OR</Text>

          <Text className="mt-3 font-medium text-base text-center text-gray-700">Enter new payment card</Text>

          <Text aria-label="CardNumber" nativeID="cardNumber" className="mt-5">Card number</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
            <TextInput
              aria-label="CardNumber"
              aria-labelledby="cardNumber"
              keyboardType="number-pad"
              placeholder="Enter card number"
              placeholderTextColor="#9ca3af"
              className="text-base"
              onChangeText={ () => {} }
            />
          </View>

          <Text aria-label="CardName" nativeID="cardName" className="mt-5">Card name</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
            <TextInput
              aria-label="CardName"
              aria-labelledby="cardName"
              keyboardType="default"
              placeholder="Enter card name"
              placeholderTextColor="#9ca3af"
              className="text-base"
              onChangeText={ () => {} }
            />
          </View>

          <View className="flex-row justify-between">
          <View className="w-[48%]">
              <Text aria-label="ExpiryDate" nativeID="expiryDate" className="mt-5">Exp date</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                <TextInput
                  aria-label="ExpiryDate"
                  aria-labelledby="expiryDate"
                  keyboardType="numeric"
                  placeholder="DD/MM"
                  placeholderTextColor="#9ca3af"
                  className="text-base"
                  onChangeText={ () => {} }
                />
              </View>
            </View>

            <View className="w-[48%]">
              <Text aria-label="CVV" nativeID="cvv" className="mt-5">CVV</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                <TextInput
                  aria-label="CVV"
                  aria-labelledby="cvv"
                  keyboardType="numeric"
                  placeholder="***"
                  placeholderTextColor="#9ca3af"
                  className="text-base"
                  onChangeText={ () => {} }
                />
              </View>
            </View>
          </View>

          <View className="mt-5 flex-row items-start">
            <CheckBox
              value={ saveMeasurementForNextTime }
              onValueChange={ (newValue) => setSaveMeasurementForNextTime(newValue) }
              tintColors={{ true: "#133522", false: "#151518" }}
            />
            <Text className="ml-2 text-lg">Save my payment card details for next time</Text>
          </View>

          <TouchableOpacity 
            onPress={ () => navigation.navigate("homeScreen") }
            className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
          >
            <Text className="text-lg text-white mr-2">Proceed</Text>
            <ArrowRight className="text-white" />
          </TouchableOpacity>
        </View>   
      </ScrollView>

      { (showSavedAddressesModal === true) && (
        <SavedAddressesModal handleShowSavedAddressesModal={ handleShowSavedAddressesModal } />
      ) }
      
    </SafeAreaView>
  )
}

export default PaymentMethodScreen;