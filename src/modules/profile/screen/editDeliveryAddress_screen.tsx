import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowDown2, ArrowLeft, ArrowRight } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import CheckBox from '@react-native-community/checkbox';
import { SelectList } from 'react-native-dropdown-select-list';

const EditDeliveryAddressScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  const [saveDefaultDeliveryAddress, setSaveDefaultDeliveryAddress] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("in");
    const unitOptions = [
        { "key": "in", "value": "in" },
        { "key": "cm", "value": "cm" },
    ];
    
    return (
        <GestureHandlerRootView>
            <SafeAreaView className="h-full w-full flex-1 px-5 pt-2 pb-3">

                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />

                {/*==== Header ====*/}
                <View className="h-auto w-full py-3 flex-row items-center justify-between">
                    <TouchableOpacity onPress={ () => navigation.pop() }>
                        <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                        <TouchableOpacity onPress={ () => navigation.pop() }>
                        <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                            <ArrowLeft color="white" />
                        </View>
                    </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <Text className="font-semibold text-lg text-baseGreen">Edit Delivery Details</Text>
                    
                    <View className="h-[40px] w-[40px]" />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View>
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
                                value={ saveDefaultDeliveryAddress }
                                onValueChange={ (newValue) => setSaveDefaultDeliveryAddress(newValue) }
                                tintColors={{ true: "#133522", false: "#151518" }}
                            />
                            <Text className="ml-2 text-lg">Set as default delivery address</Text>
                        </View>

                        <TouchableOpacity 
                            onPress={ () => navigation.navigate("homeScreen") }
                            className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-lg text-white mr-2">Update Delivery Address</Text>
                            <ArrowRight className="text-white" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default EditDeliveryAddressScreen;