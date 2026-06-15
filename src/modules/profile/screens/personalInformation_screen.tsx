import React from 'react';
import AuthCheck from '../../auths/components/authCheck';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArrowLeft, ArrowRight, Call, Location, Map } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

// Render a value or "N/A" if it's missing/empty/whitespace. Used for profile fields
// where the backend may not yet have data — keeps the layout stable and gives the
// user a clear hint that editing will fill it in.
const display = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    const str = String(value).trim();
    return str.length > 0 ? str : "N/A";
};

const PersonalInformationScreen = () => {
    const { userData } = useSelector((state: RootState) => state.profileState );
    const { deliveryAddresses } = useSelector((state: RootState) => state.addressState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const defaultAddress = deliveryAddresses.find(address => address.isDefault);

    const fullName = `${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim();

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
                            <Text className="text-sm text-gray-600">{ display(fullName) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Email</Text>
                            <Text className="text-sm text-gray-600">{ display(userData.email) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Phone number</Text>
                            <Text className="text-sm text-gray-600">{ display(userData.phoneNumber) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Gender</Text>
                            <Text className="text-sm text-gray-600">{ display((userData as any).gender) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">DOB</Text>
                            <Text className="text-sm text-gray-600">{ display((userData as any).dob) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Country</Text>
                            <Text className="text-sm text-gray-600">{ display(userData.country) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">City</Text>
                            <Text className="text-sm text-gray-600">{ display((userData as any).city ?? userData.region) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Postcode</Text>
                            <Text className="text-sm text-gray-600">{ display((userData as any).postcode) }</Text>
                        </View>

                        <View className="h-auto w-full mt-5 flex-row justify-between">
                            <Text className="text-sm text-gray">Address</Text>
                            <Text className="text-sm text-gray-600">{ display(userData.address) }</Text>
                        </View>
                    </View>

                    {/*==== Delivery Address ====
                        Two states:
                        - With default address: header + "View more" link + address details.
                        - Without: centered empty-state text + button to navigate to the
                          Addresses screen (where the user can pick an existing one or
                          create a new one). The "View more" link is hidden in this state. */}
                    <View
                        className={`h-auto w-full mt-4 px-5 py-5 relative border border-gray-200 bg-[#F8F9FE] rounded-xl `}
                    >
                        <View className="h-auto w-full flex-row justify-between">
                            <View className="flex-row items-center space-x-1">
                                <Text className="font-medium text-lg text-baseGreen">Delivery address</Text>
                                { defaultAddress && (
                                    <Text className="font-medium text-sm text-gray">(Default)</Text>
                                ) }
                            </View>
                            { defaultAddress && (
                                <TouchableOpacity
                                    onPress={ () => navigation.navigate("addressScreen") }
                                    className="flex-row items-center"
                                >
                                    <Text className="mr-1 font-medium text-baseGreen">View more</Text>
                                    <ArrowRight color="#133522" size={18} />
                                </TouchableOpacity>
                            ) }
                        </View>

                        { defaultAddress ? (
                            <>
                                <Text className="mt-5 font-Montserrat text-base text-gray-700">{ defaultAddress.user }</Text>

                                <View className="mt-4 flex-row items-center">
                                    <Call size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                    <Text>{ defaultAddress.phoneNumber }</Text>
                                </View>

                                <View className="mt-4 flex-row items-center">
                                    <Location size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                    <Text>{ defaultAddress.address }</Text>
                                </View>

                                <View className="mt-4 flex-row items-center">
                                    <Map size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                    <Text>{ defaultAddress.region }</Text>
                                </View>
                            </>
                        ) : (
                            <View className="mt-5 items-center">
                                <Text className="text-center font-Montserrat text-base text-gray-600">
                                    No default delivery address selected
                                </Text>
                                <TouchableOpacity
                                    onPress={ () => navigation.navigate("addressScreen") }
                                    className="h-[50px] w-full mt-5 px-4 flex-row items-center justify-center rounded-xl bg-baseGreen"
                                >
                                    <Text className="font-medium text-base text-white mr-2">Select default delivery address</Text>
                                    <ArrowRight color="#FFFFFF" size={18} />
                                </TouchableOpacity>
                            </View>
                        ) }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default AuthCheck(PersonalInformationScreen);