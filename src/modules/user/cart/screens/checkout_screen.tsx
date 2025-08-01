import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { ArrowDown2, ArrowLeft, ArrowRight, Call, Location, Map, Sms } from 'iconsax-react-native';
import CheckBox from '@react-native-community/checkbox';
import useAddressHook from '../../address/hooks/address_hook.ts';
import { Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store.ts';
import { setSaveAddressForNextTime, setShowEditEmail } from '../../address/slices/address_slice.ts';
import AppLoader from '../../../general/components/appLoader.tsx';
import useEditAccountDetailsHook from '../../../profile/hooks/editAccountDetails_hook.ts';
import { setAcceptMarketing } from '../../../profile/slices/profileState_slice.ts';
import useCartHook from '../hooks/cart_hook.ts';
import formatCurrency from '../../../../utils/formatCurrency.ts';
import countries from "../../../../utils/deliveryCountries.json";
import { SelectList } from 'react-native-dropdown-select-list';

const CheckoutScreen = () => {
  const { orderSummary, selectedDeliveryFee, deliveryDates, isLoading: isCartLoading, loadingMessage: cartLoadingMessage } = useSelector((state: RootState) => state.cartState);
  const { showEditEmail, selectedAddress, saveAddressForNextTime, isLoading: isAddressLoading, loadingMessage: addressLoadingMessage } = useSelector((state: RootState) => state.addressState);
  const { cart } = useSelector((state: RootState) => state.cartState);
  const { userData, acceptMarketing, isLoading: isProfileLoading } = useSelector((state: RootState) => state.profileState );
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const isLoading = isCartLoading || isAddressLoading || isProfileLoading;
  const loadingMessage = cartLoadingMessage || addressLoadingMessage;
  // console.log("ORDER SUMMERY::: ", deliveryDates);
  
  const {
    handleGetDeliveryMethod,
    handleGetOderSummary,
    handleProceedToPayment,
  } = useCartHook();
  const { 
    control: editAccountDetailsControl,
    handleSubmit: editAccountDetailsHandleSubmit,
    onSubmit: editAccountDetailsOnSubmit,
    errors: editAccountDetailsErrors
  } = useEditAccountDetailsHook();

  const {
      control, errors,
      handleSubmit: addressHandleSubmit, handleGetDeliveryAddresses,
  } = useAddressHook();

  useEffect(() => {
    handleGetDeliveryAddresses();
    handleGetDeliveryMethod();
    handleGetOderSummary();
  }, []); 

  
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
        <Text className="font-montserratSemiBold text-lg text-baseGreen">Checkout</Text>
        <View className="h-[40px] w-[40px]" />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View className="pt-[30px] pb-5 px-[20px]">
          <Text className="font-montserratMedium text-2xl text-gray-700">Kindly provide us your delivery address</Text>          

          {/*==== Contact Information ====*/}
          <View className="h-auto w-full mt-6 px-5 py-5 border border-gray-200 rounded-xl bg-[#F8F9FE]">
            <View className="flex-row items-center justify-between">
              <Text className="font-montserratSemiBold text-base text-gray-700">Contact Information</Text>
              <TouchableOpacity onPress={ () => dispatch(setShowEditEmail(true)) }>
                <Text className="font-montserratMedium">Edit</Text>
              </TouchableOpacity>
            </View>

            { (userData.email === "") ? (
              <View>
                <Text aria-label="Email" nativeID="email" className="mt-5 font-montserratMedium">Email</Text>
                <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                  <Controller
                    control={ editAccountDetailsControl }
                    name="email"
                    rules={{ required: true }}
                    render={ ({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        aria-label="Email"
                        aria-labelledby="email"
                        keyboardType="default"
                        placeholder="Enter your email"
                        placeholderTextColor="#9ca3af"
                        className="text-base"
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                      />
                    ) }
                  />
                  { editAccountDetailsErrors.email && (<Text className="text-red-500 text-xs">{editAccountDetailsErrors.email.message}</Text>) }
                </View>

                <View className="mt-5 flex-row items-center">
                  <CheckBox
                    value={ acceptMarketing }
                    onValueChange={ (newValue) => dispatch(setAcceptMarketing(newValue)) }
                    tintColors={{ true: "#133522", false: "#151518" }}
                  />
                  <Text className="ml-2 font-montserratMedium text-sm">I would like to receive news and offers from Zeap.</Text>
                </View>

                <View className="flex-row items-center gap-x-4">
                  <TouchableOpacity
                    onPress={ () => dispatch(setShowEditEmail(false)) }
                    className="h-[55px] w-auto mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
                  >
                    <Text className="text-lg text-baseGreen">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={editAccountDetailsHandleSubmit(editAccountDetailsOnSubmit)}
                    disabled={isProfileLoading}
                    className="h-[55px] w-auto mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                  >
                    <Text className="text-lg text-white mr-2">{ isProfileLoading ? "Please wait..." : "Submit" }</Text>
                    { isProfileLoading ? null : <ArrowRight className="text-white" /> }
                  </TouchableOpacity>
                </View>                
              </View>
            ) : (
              (showEditEmail) ? (
                <View>
                  <Text aria-label="Email" nativeID="email" className="mt-5 font-montserratMedium">Email</Text>
                  <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                    <Controller
                      control={ editAccountDetailsControl }
                      name="email"
                      rules={{ required: true }}
                      render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          aria-label="Email"
                          aria-labelledby="email"
                          keyboardType="default"
                          placeholder="Enter your email"
                          placeholderTextColor="#9ca3af"
                          className="text-base"
                          onBlur={ onBlur }
                          onChangeText={ onChange }
                          value={ value }
                        />
                      ) }
                    />
                    { editAccountDetailsErrors.email && (<Text className="text-red-500 text-xs">{editAccountDetailsErrors.email.message}</Text>) }
                  </View>
  
                  <View className="mt-5 flex-row items-center">
                    <CheckBox
                      value={ acceptMarketing }
                      onValueChange={ (newValue) => dispatch(setAcceptMarketing(newValue)) }
                      tintColors={{ true: "#133522", false: "#151518" }}
                    />
                    <Text className="ml-2 font-montserratMedium text-sm">I would like to receive news and offers from Zeap.</Text>
                  </View>
  
                  <View className="flex-row items-center gap-x-4">
                    <TouchableOpacity
                      onPress={ () => dispatch(setShowEditEmail(false)) }
                      className="h-[55px] w-auto mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
                    >
                      <Text className="text-lg text-baseGreen">Cancel</Text>
                    </TouchableOpacity>
  
                    <TouchableOpacity 
                      onPress={editAccountDetailsHandleSubmit(editAccountDetailsOnSubmit)}
                      disabled={isProfileLoading}
                      className="h-[55px] w-auto mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                      <Text className="text-lg text-white mr-2">{ isProfileLoading ? "Please wait..." : "Submit" }</Text>
                      { isProfileLoading ? null : <ArrowRight className="text-white" /> }
                    </TouchableOpacity>
                  </View>                
                </View>
              ) : (
                <View className="mt-5 flex-row items-center space-x-2">
                  <Sms size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                  <Text className="font-montserratMedium">{ userData.email }</Text>
                </View>
              )
            ) }
            
          </View>

          {/*==== Selected Address ====*/}
          { (selectedAddress !== null && Object.entries(selectedAddress).length > 0) && (
            <View className="h-auto w-full mt-6 px-5 py-5 border border-gray-200 rounded-xl bg-[#F8F9FE]">
              <View className="flex-row items-center justify-between">
                <Text className="font-montserratSemiBold text-base text-gray-700">Delivery Address</Text>
                <TouchableOpacity
                  onPress={ () => navigation.navigate("addressScreen") }
                  className="h-auto w-auto px-3 py-2  bg-baseGreen rounded-lg"
                >
                  <Text className="font-Montserrat font-medium text-xs text-white">Change Address</Text>
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
              
              <View className="h-[1px] w-full mt-4 bg-gray-200" />

              <View>
                <Text aria-label="FirstName" nativeID="firstName" className="mt-5 font-montserratMedium">First Name</Text>
                <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                    <Controller
                    control={ control }
                    name="firstName"
                    rules={{ required: true }}
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                        aria-label="FirstName"
                        aria-labelledby="firstName"
                        keyboardType="default"
                        placeholder="Enter your first name"
                        placeholderTextColor="#9ca3af"
                        className="text-base"
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        />
                    ) }
                    />
                    { errors.firstName && (<Text className="text-red-500 text-xs">{errors.firstName.message}</Text>) }
                </View>

                <Text aria-label="LastName" nativeID="lastName" className="mt-5 font-montserratMedium">Last Name</Text>
                <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                    <Controller
                    control={ control }
                    name="lastName"
                    rules={{ required: true }}
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                        aria-label="LastName"
                        aria-labelledby="lastName"
                        keyboardType="default"
                        placeholder="Enter your last name"
                        placeholderTextColor="#9ca3af"
                        className="text-base"
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        />
                    ) }
                    />
                    { errors.lastName && (<Text className="text-red-500 text-xs">{errors.lastName.message}</Text>) }
                </View>

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

                <Text aria-label="Region" nativeID="region" className="mt-5">State/Region</Text>
                <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                    <Controller
                    control={ control }
                    name="region"
                    rules={{ required: true }}
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                        aria-label="Region"
                        aria-labelledby="region"
                        keyboardType="default"
                        placeholder="Enter your state/region"
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
                        defaultOption={ countries.find(country => country.key === value) }
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
                      disabled={ userData.isGuest }
                      onValueChange={ (newValue) => dispatch(setSaveAddressForNextTime(newValue)) }
                      tintColors={{ true: "#133522", false: "#151518" }}
                    />
                    <Text className="ml-2 font-montserratMedium text-base">Save my address for next time.</Text>
                </View>
                <Text className="mt-1 ml-1 font-montserratMedium text-xs text-gray-400">{ userData.isGuest && "You need to be logged in to save your address for next time." }</Text>
              </View>
            </View>
          )}

          {/*==== Delivery Method ====*/}
          <View className="h-auto w-full mt-6 px-5 py-5 border border-gray-200 rounded-xl bg-[#F8F9FE]">
            <View className="flex-row items-center justify-between">
              <Text className="font-montserratSemiBold text-base text-gray-700">Delivery Method</Text>
              <TouchableOpacity
                onPress={ () => navigation.navigate("deliveryMethodScreen") }
                className="h-auto w-auto px-3 py-2  bg-baseGreen rounded-lg"
              >
                <Text className="font-Montserrat font-medium text-xs text-white">Change Method</Text>
              </TouchableOpacity>
            </View>
  
            <View className="mt-2">
              <Text className="font-montserratSemiBold">{ selectedDeliveryFee.method!.charAt(0).toUpperCase() + selectedDeliveryFee.method!.slice(1) }</Text>
              <Text className="font-montserratMedium text-sm">{ selectedDeliveryFee.label! }</Text>
            </View>         
          </View>

          {/*==== Subtotal ====*/}
          <View className="h-auto w-full mt-5 px-5 py-5 border border-gray-200 rounded-xl bg-[#F8F9FE]">
            <Text className="font-montserratSemiBold text-base text-gray-700">Order Summary</Text>
            <View className="h-auto w-full mt-5 px-3 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Voucher Code"
                aria-labelledby="voucherCode"
                keyboardType="default"
                placeholder="Enter voucher code"
                placeholderTextColor="#9ca3af"
                className="text-base"
                // onBlur={ onBlur }
                // onChangeText={ onChange }
                // value={ value }
                
              />
              <TouchableOpacity
              onPress={ () => {} }
                className="px-4 py-2 bg-baseGreen rounded-lg"
                disabled={ isLoading }
              >
                <Text className="font-Montserrat font-medium text-xs text-white">Apply</Text>
              </TouchableOpacity>
            </View>
                               
            <View className="h-[1px] w-full mt-4 bg-gray-200" />

            <View className="h-auto w-full mt-5 flex-row items-center justify-between">
              <Text className="text-base text-baseGreen">Item Subtotal ({ cart.basketItems?.length })</Text>
              <Text className="font-semibold text-base text-baseGreen">{ formatCurrency(Number(orderSummary.subTotal || 0), orderSummary.currency || "NGN") }</Text>
            </View>
            <View className="h-auto w-full mt-2 flex-row items-center justify-between">
              <Text className="text-base text-baseGreen">Delivery Fee</Text>
              <Text className="font-semibold text-base text-baseGreen">{ orderSummary.deliveryFee !== "0.00" ? formatCurrency(Number(orderSummary.deliveryFee || 0), orderSummary.currency || "NGN") : "Free" }</Text>
            </View>
            <View className="h-auto w-full mt-2 flex-row items-center justify-between">
              <Text className="text-base text-baseGreen">Total</Text>
              <Text className="font-semibold text-lg text-baseGreen">{ formatCurrency(Number(orderSummary.total || 0), orderSummary.currency || "NGN") }</Text>
            </View>
          </View>


          <TouchableOpacity 
            onPress={ () => {
              addressHandleSubmit(handleProceedToPayment)();
            } }
            className="h-[55px] w-auto mt-7 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
          >
            <Text className="text-lg text-white mr-2">Proceed to Payment</Text>
            <ArrowRight className="text-white" />
          </TouchableOpacity>      
        </View>   
      </ScrollView>

      {/*==== Loading State ====*/}
      { (isLoading) && <AppLoader loadingAdditionalMessage={ loadingMessage } /> }
      
    </SafeAreaView>
  )
}

export default CheckoutScreen;