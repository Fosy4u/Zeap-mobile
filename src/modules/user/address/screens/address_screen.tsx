import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Add, ArrowRight, Call, Location, Map, Trash, Edit2, ArrowDown2, ArrowLeft } from 'iconsax-react-native';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, StatusBar } from 'react-native';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { Controller } from 'react-hook-form';
import { setSelectedAddress, setShowNewDeliveryAddressForm } from '../slices/address_slice.ts';
import IAddress from '../models/address_model.ts';
import useAddressHook from '../hooks/address_hook.ts';
import countries from "../../../../utils/deliveryCountries.json";
import { SelectList } from 'react-native-dropdown-select-list';
import AddressSkeletonLoader from '../components/addressSkeletonLoader_component.tsx';

const AddressScreen = () => {
    const { deliveryAddresses, selectedAddress, isLoading, showNewDeliveryAddressForm } = useSelector((state: RootState) => state.addressState);
    const { userData } = useSelector((state: RootState) => state.profileState );
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch<AppDispatch>();

    const {
        control, handleSubmit, onSubmit, errors, phoneRules,
        handleSetAsDefaultAddress, handleDeleteAddress,
        handleGetDeliveryAddresses,
        editingAddressId, handleStartNewAddress, handleStartEditAddress, handleCancelAddressForm,
    } = useAddressHook();

    useEffect(() => {
        handleGetDeliveryAddresses();
    }, []);

    // Default address first, matching the Personal Information card's order.
    const sortedAddresses = [...(deliveryAddresses ?? [])].sort(
        (a, b) => Number(!!b.isDefault) - Number(!!a.isDefault),
    );

    return (
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
                <Text className="font-montserratSemiBold text-lg text-baseGreen">
                    { showNewDeliveryAddressForm
                        ? (editingAddressId ? "Edit Address" : "Add New Address")
                        : "Delivery Addresses" }
                </Text>
                <View className="h-[40px] w-[40px]" />
            </View>

            <ScrollView showsVerticalScrollIndicator={ false }>
                <View className="px-5 pt-2 pb-20">
                    { !showNewDeliveryAddressForm && (
                        <Text className="my-2 font-Montserrat font-normal text-base text-gray-700">Your saved delivery addresses</Text>
                    ) }

                    { (!showNewDeliveryAddressForm) ? (
                        <View className="flex-1 flex-col justify-between">
                            {/*==== Add New Address — sits above the list so it is
                                 reachable without scrolling past every card. ====*/}
                            <TouchableOpacity
                                onPress={ handleStartNewAddress }
                                className="h-[55px] w-full mt-3 flex-row items-center justify-center gap-x-1 rounded-xl border border-baseGreen bg-lightGreen"
                            >
                                <Add color="#133522" size={ 20 } />
                                <Text className="font-montserratMedium text-base text-baseGreen">Add New Address</Text>
                            </TouchableOpacity>

                            <View>
                                { (isLoading && (!deliveryAddresses || deliveryAddresses.length === 0)) ? (
                                    <AddressSkeletonLoader />
                                ) : deliveryAddresses?.length > 0 ? (
                                    sortedAddresses.map((savedAddress: IAddress) => {
                                        const isSelected = savedAddress._id! === selectedAddress?._id;
                                        return (
                                        <TouchableOpacity
                                            onPress={ () => {
                                                dispatch(setSelectedAddress(savedAddress));
                                            } }
                                            key={ savedAddress._id! }
                                            className={`h-auto w-full mt-4 px-5 py-5 border ${ isSelected ? "border-[#D5B07B] bg-[#FFFAF2]" : "border-gray-200 bg-[#F8F9FE]" } rounded-xl`}
                                        >
                                            <View className="flex-row items-center justify-between">
                                                <Text className="flex-1 mr-2 font-montserratSemiBold text-base text-gray-700" numberOfLines={ 1 }>
                                                    { `${savedAddress.firstName ?? ""} ${savedAddress.lastName ?? ""}`.trim() || "Delivery address" }
                                                </Text>
                                                <View className="flex-row items-center space-x-3">
                                                    { savedAddress.isDefault && (
                                                        <Text className="px-2 py-0.5 font-montserratMedium text-xs text-baseGreen rounded-md bg-lightGreen">Default</Text>
                                                    ) }
                                                    <TouchableOpacity onPress={ () => handleStartEditAddress(savedAddress) }>
                                                        <Edit2 color="#305CDE" size={ 18 } variant="Bold" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={ () => handleDeleteAddress(savedAddress._id!) }>
                                                        <Trash color="#AA1F1F" size={ 18 } variant="Bold" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <View className="mt-4 flex-row items-center">
                                                <Call size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                                <Text className="flex-1 font-montserratMedium text-gray-700">{ savedAddress.phoneNumber! }</Text>
                                            </View>

                                            <View className="mt-4 flex-row items-center">
                                                <Location size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                                <Text className="flex-1 font-montserratMedium text-gray-700">{ savedAddress.address! }</Text>
                                            </View>

                                            <View className="mt-4 flex-row items-center">
                                                <Map size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                                <Text className="flex-1 font-montserratMedium text-gray-700">{ savedAddress.region! }</Text>
                                            </View>

                                            {/* Inline, not absolutely positioned — the old overlay
                                                sat on top of the region row on longer addresses. */}
                                            { !savedAddress.isDefault && (
                                                <TouchableOpacity
                                                    onPress={ () => handleSetAsDefaultAddress(savedAddress._id!) }
                                                    className="h-auto w-auto mt-4 px-3 py-2 self-start bg-baseGreen rounded-lg"
                                                >
                                                    <Text className="font-montserratMedium text-xs text-white">Set as default</Text>
                                                </TouchableOpacity>
                                            )}
                                        </TouchableOpacity>
                                        );
                                    })
                                ) : (
                                    <View className="mt-4 p-4 bg-gray-100 rounded-xl">
                                        <Text className="text-center text-gray-600">No delivery address saved yet. Tap "Add New Address" above to create one.</Text>
                                    </View>
                                )}
                            </View>

                        </View>
                    ) : (
                        <View className="mt-5">
                            <Text aria-label="FirstName" nativeID="firstName" className="font-montserratMedium">First Name</Text>
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
                                    className="h-[44px] text-base"
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
                                    className="h-[44px] text-base"
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
                                    className="h-[44px] text-base"
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
                                    className="h-[44px] text-base"
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
                            <View className={`h-auto w-full mt-1.5 px-3 py-1 border rounded-xl bg-gray-100 ${ errors.phoneNumber ? "border-red-400" : "border-gray-300" }`}>
                                <Controller
                                control={ control }
                                name="phoneNumber"
                                rules={{ required: true }}
                                render={ ({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                    aria-label="Phone"
                                    aria-labelledby="phoneNumber"
                                    keyboardType="phone-pad"
                                    placeholder={ phoneRules.placeholder }
                                    placeholderTextColor="#9ca3af"
                                    maxLength={ phoneRules.maxLength }
                                    className="h-[44px] text-base"
                                    onBlur={ onBlur }
                                    onChangeText={ (text) => onChange(phoneRules.sanitize(text)) }
                                    value={ value }
                                    />
                                ) }
                                />
                            </View>
                            { errors.phoneNumber ? (
                                <Text className="mt-1 text-red-500 text-xs">{ errors.phoneNumber.message }</Text>
                            ) : (
                                <Text className="mt-1 text-gray-500 text-xs">{ phoneRules.hint }</Text>
                            ) }

                            <View className="mt-5 flex-row items-center gap-x-4">
                                <TouchableOpacity
                                    onPress={ handleCancelAddressForm }
                                    className="h-[55px] w-[120px] mt-5 flex flex-row items-center justify-center rounded-xl bg-lightGreen"
                                >
                                    <Text className="text-lg text-baseGreen">Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={handleSubmit(onSubmit)}
                                    disabled={isLoading}
                                    className="h-[55px] w-auto mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                                >
                                    <Text className="text-lg text-white mr-2">{ isLoading ? "Please wait..." : (editingAddressId ? "Update Address" : "Save Address") }</Text>
                                    { isLoading ? null : <ArrowRight className="text-white" /> }
                                </TouchableOpacity>
                            </View>  
                        </View>
                    ) }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AddressScreen;