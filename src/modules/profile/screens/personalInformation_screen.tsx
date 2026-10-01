import React, { useEffect } from 'react';
import AuthCheck from '../../auths/components/authCheck';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Add, ArrowLeft, ArrowRight, Call, Location, Map } from 'iconsax-react-native';
import useAddressHook from '../../user/address/hooks/address_hook';
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
    const { handleGetDeliveryAddresses, handleStartNewAddress, handleViewAddresses } = useAddressHook();

    /* The screen previously read deliveryAddresses without ever fetching them, so
       arriving here directly showed an empty card. */
    useEffect(() => {
        handleGetDeliveryAddresses();
    }, []);

    const hasAddresses = (deliveryAddresses?.length ?? 0) > 0;
    // Default first, then the rest in the order the API returned them.
    const sortedAddresses = [...(deliveryAddresses ?? [])].sort(
        (a, b) => Number(!!b.isDefault) - Number(!!a.isDefault),
    );

    // Opens the Addresses screen straight into an empty new-address form.
    const handleAddNewAddress = () => {
        handleStartNewAddress();
        navigation.navigate("addressScreen");
    };

    const handleOpenAddresses = () => {
        handleViewAddresses();
        navigation.navigate("addressScreen");
    };

    const fullName = `${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim();

    const profile = userData as any;
    const userDetailRows: { label: string; value: any }[] = [
        { label: "Full name", value: fullName },
        { label: "Email", value: userData.email },
        { label: "Phone number", value: userData.phoneNumber },
        { label: "Gender", value: profile.gender },
        { label: "Date of birth", value: profile.dob ?? profile.dateOfBirth },
        { label: "Country", value: userData.country },
        { label: "City", value: profile.city ?? userData.region },
        { label: "Postcode", value: profile.postcode ?? profile.postCode },
        { label: "Address", value: userData.address },
        { label: "Height", value: profile.height },
        { label: "Weight", value: profile.weight },
        { label: "Complexion", value: profile.complexion },
        { label: "Shoe size", value: profile.shoeSize },
        { label: "Best outfit", value: profile.bestOutfit },
        { label: "Best colour", value: profile.bestColor ?? profile.bestColour },
        { label: "Preferred currency", value: userData.prefferedCurrency },
    ];

    return (
        <GestureHandlerRootView>
            <SafeAreaView className="h-full w-full flex-1">

                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />

                {/*==== Header ====*/}
                <View className="h-auto w-full px-5 pt-5 pb-3 flex-row items-center justify-between">
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
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
                >
                    {/*==== Personal Info ====*/}
                    <View className="h-auto w-full mt-7 px-3 py-5 border border-gray-200 bg-[#F8F9FE] rounded-lg">
                        <View className="h-auto w-full flex-row justify-between">
                            <Text className="font-medium text-lg text-baseGreen">User details</Text>
                            <TouchableOpacity
                            onPress={ () => navigation.navigate("editAccountDetailsScreen") }
                                className="flex-row items-center"
                            >
                                <Text className="mr-1 font-medium text-baseGreen">Edit</Text>
                                <ArrowRight color="#133522" size={18} />
                            </TouchableOpacity>
                        </View>

                        { userDetailRows.map((row, index) => (
                            <View
                                key={ row.label }
                                className={`h-auto w-full ${ index === 0 ? "mt-7" : "mt-5" } flex-row items-start justify-between`}
                            >
                                <Text className="flex-1 mr-3 text-sm text-gray">{ row.label }</Text>
                                <Text className="flex-1 text-right text-sm text-gray-600">{ display(row.value) }</Text>
                            </View>
                        )) }
                    </View>

                    <View
                        className={`h-auto w-full mt-4 px-5 py-5 relative border border-gray-200 bg-[#F8F9FE] rounded-xl `}
                    >
                        <View className="h-auto w-full flex-row justify-between">
                            <Text className="font-medium text-lg text-baseGreen">Delivery Addresses</Text>
                            { hasAddresses && (
                                <TouchableOpacity
                                    onPress={ handleOpenAddresses }
                                    className="flex-row items-center"
                                >
                                    <Text className="mr-1 font-medium text-baseGreen">View more</Text>
                                    <ArrowRight color="#133522" size={18} />
                                </TouchableOpacity>
                            ) }
                        </View>

                        { hasAddresses ? (
                            <>
                                { sortedAddresses.map((address) => (
                                    <TouchableOpacity
                                        key={ address._id }
                                        onPress={ handleOpenAddresses }
                                        className="h-auto w-full mt-4 px-4 py-4 border border-gray-200 rounded-xl bg-white"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <Text className="flex-1 mr-2 font-Montserrat text-base text-gray-700" numberOfLines={ 1 }>
                                                { `${ address.firstName ?? "" } ${ address.lastName ?? "" }`.trim() || display(address.user) }
                                            </Text>
                                            { address.isDefault && (
                                                <Text className="px-2 py-0.5 font-medium text-xs text-baseGreen rounded-md bg-lightGreen">Default</Text>
                                            ) }
                                        </View>

                                        <View className="mt-3 flex-row items-center">
                                            <Call size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                            <Text className="flex-1 text-sm text-gray-600">{ display(address.phoneNumber) }</Text>
                                        </View>

                                        <View className="mt-2 flex-row items-center">
                                            <Location size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                            <Text className="flex-1 text-sm text-gray-600">{ display(address.address) }</Text>
                                        </View>

                                        <View className="mt-2 flex-row items-center">
                                            <Map size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                            <Text className="flex-1 text-sm text-gray-600">{ display(address.region) }</Text>
                                        </View>
                                    </TouchableOpacity>
                                )) }

                                <TouchableOpacity
                                    onPress={ handleAddNewAddress }
                                    className="h-[50px] w-full mt-4 px-4 flex-row items-center justify-center rounded-xl border border-baseGreen bg-lightGreen"
                                >
                                    <Add color="#133522" size={ 20 } />
                                    <Text className="ml-1 font-medium text-base text-baseGreen">Add new Address</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View className="mt-5 items-center">
                                <Text className="text-center font-Montserrat text-base text-gray-600">
                                    No delivery address saved yet
                                </Text>
                                <TouchableOpacity
                                    onPress={ handleAddNewAddress }
                                    className="h-[50px] w-full mt-5 px-4 flex-row items-center justify-center rounded-xl bg-baseGreen"
                                >
                                    <Text className="font-medium text-base text-white mr-2">Add delivery address</Text>
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