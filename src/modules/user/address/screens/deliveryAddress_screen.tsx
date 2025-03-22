import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { ArrowDown2, ArrowLeft, ArrowRight, Call, Location, Map, Sms } from 'iconsax-react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CheckBox from '@react-native-community/checkbox';
import SavedAddressesBottomSheet from '../components/savedAddressesBottomSheet_component.tsx';
import useAddressHook from '../hooks/address_hook.ts';
import { Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store.ts';
import { setSaveAddressForNextTime, setShowSavedAddressesBottomSheet } from '../slices/address_slice.ts';
import countries from "../../../../utils/worldCountries.json";
import AppLoader from '../../../general/components/appLoader.tsx';

const DeliveryAddressScreen = () => {
  const { selectedAddress, saveAddressForNextTime, showSavedAddressesBottomSheet } = useSelector((state: RootState) => state.addressState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();

  const {
    control, handleSubmit, onSubmit, errors, getValues, isLoading,
    allDeliveryAddresses, handleGetAllDeliveryAddresses, isLoadingAllDeliveryAddresses,
    deliveryAddress, handleGetDeliveryAddress,
  } = useAddressHook();


  useEffect(() => {
    handleGetAllDeliveryAddresses();
  }, []);
  // console.log("ALL DELIVERY ADDRESSES::: ", allDeliveryAddresses);
  

  
  return (
    <SafeAreaView className="h-full w-full relative flex-1 bg-lightGray">
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
        <Text className="font-montserratSemiBold text-lg text-baseGreen">Delivery Address</Text>
        <View className="h-[40px] w-[40px]" />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View className="pt-[30px] pb-5 px-[20px]">
          <Text className="font-montserratMedium text-2xl text-gray-700">Kindly provide us your delivery address</Text>

          <Text className="mt-5 font-montserratMedium text-base text-gray-600">Select existing delivery address</Text>

          { allDeliveryAddresses?.length !== 0 && (
            <View className="h-auto w-full mt-6 px-5 py-5 border border-gray-200 rounded-xl bg-[#F8F9FE]">
              <View className="flex-row items-center justify-between">
                <Text className="font-montserratSemiBold text-base text-gray-700">{ selectedAddress.user! }</Text>
                <TouchableOpacity>
                  <Text className="font-montserratMedium">Edit</Text>
                </TouchableOpacity>
              </View>

              <View className="mt-4 flex-row items-center">
                <Call size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                <Text className="font-montserratMedium">{ selectedAddress.phoneNumber! }</Text>
              </View>

              <View className="mt-4 flex-row items-center">
                <Location size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                <Text className="font-montserratMedium">{ selectedAddress.address! }</Text>
              </View>

              <View className="mt-4 flex-row items-center">
                <Map size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                <Text className="font-montserratMedium">{ selectedAddress.region }</Text>
              </View>
            </View>
          )}
          
          <TouchableOpacity 
            onPress={ () => dispatch(setShowSavedAddressesBottomSheet(true)) }
            className="h-[55px] w-full mt-6 flex-row items-center justify-center gap-x-1 rounded-xl bg-lightGreen"
          >
            <Text className="font-montserratMedium text-base text-baseGreen">View More Address</Text>
            <ArrowRight size={ 22 } className="text-baseGreen" />
          </TouchableOpacity>

          <Text className="mt-4 font-montserratMedium text-center">OR</Text>

          <Text className="mt-3 font-montserratMedium text-base text-center text-gray-700">Enter new delivery address</Text>

          {/*==== Form ====*/}
          <View>
            <Text aria-label="Address" nativeID="address" className="mt-5 font-montserratMedium">Address</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <Controller
                control={ control }
                name="address"
                rules={{ required: true }}
                render={ ({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    aria-label="Address"
                    aria-labelledby="address"
                    keyboardType="default"
                    placeholder="Enter your address"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onBlur={ onBlur }
                    onChangeText={ onChange }
                    value={ value }
                  />
                ) }
              />
              { errors.address && (<Text className="text-red-500 text-xs">{errors.address.message}</Text>) }
            </View>

            <Text aria-label="City" nativeID="city" className="mt-5">City</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <Controller
                control={ control }
                name="region"
                rules={{ required: true }}
                render={ ({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    aria-label="City"
                    aria-labelledby="city"
                    keyboardType="default"
                    placeholder="Enter your city"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onBlur={ onBlur }
                    onChangeText={ onChange }
                    value={ value }
                  />
                ) }
              />
              { errors.region && (<Text className="text-red-500 text-xs">{errors.region.message}</Text>) }
            </View>

            <Text aria-label="Country" nativeID="country" className="mt-5 font-montserratMedium">Country</Text>
            <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
            <Controller
              control={control}
              name="country"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <SelectList
                  setSelected={(val: any) => onChange(val)}
                  data={countries}
                  arrowicon={<ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />}
                  boxStyles={{
                    height: "auto",
                    width: "100%",
                    paddingHorizontal: 12,
                    paddingVertical: 17,
                    borderColor: "transparent"
                  }}
                  inputStyles={{ fontSize: 16, color: "#606060" }}
                  dropdownStyles={{
                    height: "auto",
                    width: "100%",
                    marginTop: -15,
                    borderColor: "transparent"
                  }}
                  dropdownTextStyles={{ color: "#606060", fontSize: 16 }}
                  dropdownItemStyles={{
                    paddingHorizontal: 15,
                    paddingTop: 10,
                    paddingBottom: 5
                  }}
                  placeholder="Select your country"
                  search={true}
                />
              )}
            />
            </View>

            <Text aria-label="PostalCode" nativeID="postalCode" className="mt-5 font-montserratMedium">Postal code (optional)</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <Controller
                control={ control }
                name="postalCode"
                rules={{ required: true }}
                render={ ({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    aria-label="PostalCode"
                    aria-labelledby="postalCode"
                    keyboardType="numeric"
                    placeholder="Enter postal code"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onBlur={ onBlur }
                    onChangeText={ onChange }
                    value={ value }
                  />
                ) }
              />
              { errors.postalCode && (<Text className="text-red-500 text-xs">{errors.postalCode.message}</Text>) }
            </View>

            <Text aria-label="Phone" nativeID="phoneNumber" className="mt-5 font-montserratMedium">Phone</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <Controller
                control={ control }
                name="phoneNumber"
                rules={{ required: true }}
                render={ ({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    aria-label="Phone"
                    aria-labelledby="phoneNumber"
                    keyboardType="number-pad"
                    placeholder="Enter phone number"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onBlur={ onBlur }
                    onChangeText={ onChange }
                    value={ value }
                  />
                ) }
              />
              { errors.phoneNumber && (<Text className="text-red-500 text-xs">{errors.phoneNumber.message}</Text>) }
            </View>

            <View className="mt-5 flex-row items-center">
              <CheckBox
                value={ saveAddressForNextTime }
                onValueChange={ (newValue) => dispatch(setSaveAddressForNextTime(newValue)) }
                tintColors={{ true: "#133522", false: "#151518" }}
              />
              <Text className="ml-2 font-montserratMedium text-lg">Save my address for next time</Text>
            </View>

            <TouchableOpacity 
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="text-lg text-white mr-2">{ isLoading ? "Please wait..." : "Proceed" }</Text>
              { isLoading ? null : <ArrowRight className="text-white" /> }
            </TouchableOpacity>
          </View>
          
        </View>   
      </ScrollView>

      {/*==== Loading State ====*/}
      { (isLoadingAllDeliveryAddresses) && <AppLoader loadingAdditionalMessage="Loading delivery address." /> }

      { showSavedAddressesBottomSheet && (
        <SavedAddressesBottomSheet />
      ) }
      
    </SafeAreaView>
  )
}

export default DeliveryAddressScreen;