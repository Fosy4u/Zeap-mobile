import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArrowLeft, ArrowRight, Call, Location, Sms, Map } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

const PersonalInformationScreen = () => {
    const { userData } = useSelector((state: RootState) => state.profileState );
    const { deliveryAddresses } = useSelector((state: RootState) => state.addressState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const defaultAddress = deliveryAddresses.find(address => address.isDefault);


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
                            <ArrowLeft color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className="font-semibold text-lg text-baseGreen">Personal Information</Text>
                    <View className="h-[40px] w-[40px]" />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {/*==== Personal Info ====*/}
                    <View className="h-auto w-full mt-7 px-3 py-5 border border-gray-200 bg-[#F8F9FE] rounded-lg">
                        <View className="h-auto w-full flex-row justify-between">
                            <Text className="font-medium text-lg text-baseGreen">Account details</Text>
                            <TouchableOpacity
                            onPress={ () => navigation.navigate("editAccountDetailsScreen") }
                                className="flex-row items-center"
                            >
                                <Text className="mr-1 font-medium text-baseGreen">Edit</Text>
                                <ArrowRight color="#133522" size={18} />
                            </TouchableOpacity>
                        </View>

                        <View className="h-auto w-full mt-7 flex-row justify-between">
                            <Text className="text-sm text-gray">Full name</Text>
                            <Text className="text-sm text-gray-600">{ userData.firstName } { userData.lastName }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Email</Text>
                            <Text className="text-sm text-gray-600">{ userData.email }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Phone number</Text>
                            <Text className="text-sm text-gray-600">{ userData.phoneNumber }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Gender</Text>
                            <Text className="text-sm text-gray-600">{ "Male" }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">DOB</Text>
                            <Text className="text-sm text-gray-600">{ "27/06/2024" }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Country</Text>
                            <Text className="text-sm text-gray-600">{ "Nigeria" }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">City</Text>
                            <Text className="text-sm text-gray-600">{ "Abuja" }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Postcode</Text>
                            <Text className="text-sm text-gray-600">{ "9000001" }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Address</Text>
                            <Text className="text-sm text-gray-600">{ "38 Ashiek Jarma Street, Abuja" }</Text>
                        </View>
                    </View>

                    {/*==== Delivery Address ====*/}
                    <View
                        className={`h-auto w-full mt-4 px-5 py-5 relative border border-gray-200 bg-[#F8F9FE] rounded-xl `}
                    >
                        <View className="h-auto w-full flex-row justify-between">    
                            <View className="flex-row items-center space-x-1">
                                <Text className="font-medium text-lg text-baseGreen">Delivery address</Text>
                                <Text className="font-medium text-sm text-gray">(Default)</Text>
                            </View>
                            <TouchableOpacity
                                onPress={ () => navigation.navigate("addressScreen") }
                                className="flex-row items-center"
                            >
                                <Text className="mr-1 font-medium text-baseGreen">View more</Text>
                                <ArrowRight color="#133522" size={18} />
                            </TouchableOpacity>
                        </View>
                        <Text className="mt-5 font-Montserrat text-base text-gray-700">{ defaultAddress?.user! }</Text>
            
                        <View className="mt-4 flex-row items-center">
                            <Call size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                            <Text>{ defaultAddress?.phoneNumber! }</Text>
                        </View>
            
                        <View className="mt-4 flex-row items-center">
                            <Location size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                            <Text>{ defaultAddress?.address! }</Text>
                        </View>
            
                        <View className="mt-4 flex-row items-center">
                            <Map size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                            <Text>{ defaultAddress?.region! }</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default PersonalInformationScreen;