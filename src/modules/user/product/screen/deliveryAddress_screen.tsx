import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { ArrowDown2, ArrowLeft, ArrowRight, Call, Location, Sms } from 'iconsax-react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CheckBox from '@react-native-community/checkbox';
import SavedAddressesModal from '../modals/saved_addresses_modal';

const DeliveryAddressScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  const [selectedUnit, setSelectedUnit] = useState("in");
  const [saveMeasurementForNextTime, setSaveMeasurementForNextTime] = useState(false);
  const [showSavedAddressesModal, setShowSavedAddressesModal] = useState(false);
  const unitOptions = [
      { "key": "in", "value": "in" },
      { "key": "cm", "value": "cm" },
  ];

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
        <Text className="font-semibold text-lg text-baseGreen">Delivery Address</Text>
        <View className="h-[40px] w-[40px]" />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View className="pt-[30px] pb-5 px-[20px]">
          <Text className="font-normal text-2xl text-gray-700">Kindly provide us your delivery address</Text>

          <Text className="mt-5 font-medium text-base text-gray-600">Select existing delivery address</Text>

          <View className="h-auto w-full mt-6 px-5 py-5 border border-gray-200 rounded-xl bg-[#F8F9FE]">
            <View className="flex-row items-center justify-between">
              <Text className="font-Montserrat font-medium text-base text-gray-700">Otor John Stephen</Text>
              <TouchableOpacity>
                <Text>Edit</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-4 flex-row items-center">
              <Call size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
              <Text>08130000000</Text>
            </View>

            <View className="mt-4 flex-row items-center">
              <Sms size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
              <Text>otorjohn@gmail.com</Text>
            </View>

            <View className="mt-4 flex-row items-center">
              <Location size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
              <Text>No.38 Ashiek Jarma street, Jabi Abuja</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={ () => handleShowSavedAddressesModal(true) }
            className="h-[55px] w-full mt-6 flex-row items-center justify-center gap-x-1"
          >
            <Text className="font-normal text-base text-baseGreen">View More Address</Text>
            <ArrowRight size={ 22 } className="text-baseGreen" />
          </TouchableOpacity>

          <Text className="mt-4 font-medium text-center">OR</Text>

          <Text className="mt-3 font-medium text-base text-center text-gray-700">Enter new delivery address</Text>

          <Text aria-label="Name" nativeID="fullName" className="mt-5">Name</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
            <TextInput
              aria-label="Name"
              aria-labelledby="fullName"
              keyboardType="name-phone-pad"
              placeholder="Enter name"
              placeholderTextColor="#9ca3af"
              className="text-base"
              onChangeText={ () => {} }
            />
          </View>

          <Text aria-label="Phone" nativeID="phoneNumber" className="mt-5">Phone</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
            <TextInput
              aria-label="Phone"
              aria-labelledby="phoneNumber"
              keyboardType="number-pad"
              placeholder="Enter phone number"
              placeholderTextColor="#9ca3af"
              className="text-base"
              onChangeText={ () => {} }
            />
          </View>

          <Text aria-label="Email" nativeID="emailAddress" className="mt-5">Email address</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
            <TextInput
              aria-label="Email"
              aria-labelledby="emailAddress"
              keyboardType="email-address"
              placeholder="Enter email address"
              placeholderTextColor="#9ca3af"
              className="text-base"
              onChangeText={ () => {} }
            />
          </View>

          <Text aria-label="Country" nativeID="country" className="mt-5">Country</Text>
          <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
            <SelectList
              setSelected={ setSelectedUnit }
              data={ unitOptions }
              arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
              boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 12, paddingVertical: 17, borderColor: "transparent" }}
              inputStyles={{ fontSize: 16, color: "#606060" }}
              dropdownStyles={{ height: "auto", width: "100%", marginTop: -15, borderColor: "transparent" }}
              dropdownTextStyles={{ color: "#606060", fontSize: 16 }}
              dropdownItemStyles={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 5 }}               
              placeholder="Select your country"
              search={ false }
            />
          </View>

          <Text aria-label="City" nativeID="city" className="mt-5">City</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
            <TextInput
              aria-label="City"
              aria-labelledby="city"
              keyboardType="default"
              placeholder="Enter your city"
              placeholderTextColor="#9ca3af"
              className="text-base"
              onChangeText={ () => {} }
            />
          </View>

          <Text aria-label="Street" nativeID="streetAddress" className="mt-5">Street address</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
            <TextInput
              aria-label="Street"
              aria-labelledby="streetAddress"
              keyboardType="default"
              placeholder="Enter your street address"
              placeholderTextColor="#9ca3af"
              className="text-base"
              onChangeText={ () => {} }
            />
          </View>

          <Text aria-label="PostalCode" nativeID="postalCode" className="mt-5">Postal code (optional)</Text>
          <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
            <TextInput
              aria-label="PostalCode"
              aria-labelledby="postalCode"
              keyboardType="numeric"
              placeholder="Enter postal code"
              placeholderTextColor="#9ca3af"
              className="text-base"
              onChangeText={ () => {} }
            />
          </View>

          <View className="mt-5 flex-row items-center">
            <CheckBox
              value={ saveMeasurementForNextTime }
              onValueChange={ (newValue) => setSaveMeasurementForNextTime(newValue) }
              tintColors={{ true: "#133522", false: "#151518" }}
            />
            <Text className="ml-2 text-lg">Save my address for next time</Text>
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

export default DeliveryAddressScreen;