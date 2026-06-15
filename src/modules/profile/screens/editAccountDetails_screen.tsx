import React from "react";
import AuthCheck from "../../auths/components/authCheck";
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowDown2, ArrowLeft, ArrowRight } from "iconsax-react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Controller } from "react-hook-form";

import RootNavigationStackModel from "../../../routes/model/routes_model";
import useEditAccountDetailsHook from "../hooks/editAccountDetails_hook";
import CountriesPhoneCodeModal from "../modals/countriesPhoneCode_modal";
import SuccessPopupModal from "../../auths/modals/successPopup_modal";
import AppLoader from "../../general/components/appLoader";


const EditAccountDetailsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const {
        // form
        control, errors,

        // redux-derived
        selectedCountry, selectedPhoneCode, showPhoneCodeModal,
        heightUnitOptions, weightUnitOptions, complexionOptions,
        shoeSizeOptions, bestOutfitOptions, bestColorOptions,
        isLoading, loadingMessage,
        openPhoneCodeModal,

        // local UI state
        setSelected,
        selectedHeightUnit, setSelectedHeightUnit,
        selectedWeightUnit, setSelectedWeightUnit,
        setSelectedShoeSize,
        setSelectedBestOutfit,
        setSelectedBestColor,
        showSuccessModal, setShowSuccessModal,
        selectedStateIso, setSelectedStateIso,
        setSelectedCity,

        // computed
        isVendor,
        countryIso,
        isCountryChosen,
        countryOptions,
        stateOptions,
        cityOptions,

        // handlers
        handleProceed,
        handleCountrySelected,
    } = useEditAccountDetailsHook();

    // Success-modal "Done" handler — close the modal and go back to the
    // Personal Information screen so the user lands where they started.
    const handleSuccessDone = () => {
        setShowSuccessModal(false);
        navigation.navigate("personalInformationScreen");
    };


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
                    <Text className="font-semibold text-lg text-baseGreen">Edit Account Details</Text>

                    <View className="h-[40px] w-[40px]" />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    className="h-full w-full pb-2"
                >

                    {/* ==== Form ==== */}
                    <View className="h-auto w-full my-5">

                        <Text aria-label="FirstName" nativeID="firstName" className="mt-5">First name</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                            <Controller
                                control={control}
                                name="firstName"
                                render={ ({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        aria-label="FirstName"
                                        aria-labelledby="firstName"
                                        keyboardType="name-phone-pad"
                                        placeholder="Enter first name"
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

                        <Text aria-label="LastName" nativeID="lastName" className="mt-5">Last name</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                            <Controller
                                control={control}
                                name="lastName"
                                render={ ({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        aria-label="LastName"
                                        aria-labelledby="lastName"
                                        keyboardType="name-phone-pad"
                                        placeholder="Enter last name"
                                        placeholderTextColor="#9ca3af"
                                        className="text-base"
                                        onBlur={ onBlur }
                                        onChangeText={ onChange }
                                        value={ value }
                                    />
                                ) }
                            />
                        </View>

                        <Text aria-label="PhoneNumber" nativeID="phoneNumber" className="mt-5">Phone number</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
                            <TouchableOpacity
                                onPress={ openPhoneCodeModal }
                                className="flex-row items-center"
                            >
                                <Text className="mb-1 text-lg">{ selectedPhoneCode.dial_code }</Text>
                                <View className="h-[30px] w-[2px] mx-2 bg-gray-300" />
                            </TouchableOpacity>
                            <Controller
                                control={control}
                                name="phoneNumber"
                                render={ ({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        aria-label="PhoneNumber"
                                        aria-labelledby="phoneNumber"
                                        keyboardType="phone-pad"
                                        placeholder="Enter phone number"
                                        placeholderTextColor="#9ca3af"
                                        className="text-base"
                                        onBlur={ onBlur }
                                        onChangeText={ onChange }
                                        value={ value }
                                    />
                                ) }
                            />
                        </View>

                        {/* Country — typeable search via SelectList. Tapping the box turns it
                            into a search input and brings up the keyboard. Same search/expand
                            behavior as the State and City pickers below. */}
                        <Text aria-label="Country" nativeID="country" className="mt-5">Country</Text>
                        <View className="h-auto w-full mt-1.5 py-0 border border-gray-300 rounded-xl bg-gray-100">
                            <SelectList
                                key={`country-${selectedPhoneCode?.code || "none"}`}
                                setSelected={ handleCountrySelected }
                                data={ countryOptions }
                                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                                inputStyles={{ flex: 1, fontSize: 16, color: "#9ca3af" }}
                                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                                dropdownItemStyles={{ paddingHorizontal: 15 }}
                                search={ true }
                                searchPlaceholder="Search country"
                                placeholder={ selectedCountry || "Select country" }
                            />
                        </View>

                        {/* State (depends on Country)
                            NOTE: the wrapper View is intentionally NOT `flex-row`. When
                            `search={true}` the SelectList's internal search row uses
                            `flex: 1`, but a `flex-row` parent collapses the SelectList to
                            its content's intrinsic width — making the search input render
                            at half the box width. Keeping the wrapper as a block (`w-full`
                            only) lets the SelectList stretch edge-to-edge. */}
                        <Text className="mt-5">State</Text>
                        {isCountryChosen && stateOptions.length > 0 ? (
                            <View className="h-auto w-full mt-1.5 py-0 border border-gray-300 rounded-xl bg-gray-100">
                                <SelectList
                                    key={`state-${countryIso}`}
                                    setSelected={ setSelectedStateIso }
                                    data={ stateOptions }
                                    boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                                    inputStyles={{ flex: 1, fontSize: 16, color: "#9ca3af" }}
                                    dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                                    dropdownItemStyles={{ paddingHorizontal: 15 }}
                                    search={ true }
                                    searchPlaceholder="Search state"
                                    placeholder="Select state"
                                />
                            </View>
                        ) : (
                            <View className="h-auto w-full mt-1.5 px-3 py-4 border border-gray-300 rounded-xl bg-gray-100 opacity-50">
                                <Text className="text-base text-gray-400">
                                    { isCountryChosen ? "No states available" : "Select a country first" }
                                </Text>
                            </View>
                        )}

                        {/* City (depends on State) — same `flex-row`-removal rationale as State above. */}
                        <Text className="mt-5">City</Text>
                        {selectedStateIso && cityOptions.length > 0 ? (
                            <View className="h-auto w-full mt-1.5 py-0 border border-gray-300 rounded-xl bg-gray-100">
                                <SelectList
                                    key={`city-${countryIso}-${selectedStateIso}`}
                                    setSelected={ setSelectedCity }
                                    data={ cityOptions }
                                    boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                                    inputStyles={{ flex: 1, fontSize: 16, color: "#9ca3af" }}
                                    dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                                    dropdownItemStyles={{ paddingHorizontal: 15 }}
                                    search={ true }
                                    searchPlaceholder="Search city"
                                    placeholder="Select city"
                                />
                            </View>
                        ) : (
                            <View className="h-auto w-full mt-1.5 px-3 py-4 border border-gray-300 rounded-xl bg-gray-100 opacity-50">
                                <Text className="text-base text-gray-400">
                                    { selectedStateIso ? "No cities available" : "Select a state first" }
                                </Text>
                            </View>
                        )}

                        <Text aria-label="PostalCode" nativeID="postalCode" className="mt-5">Postal code</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                            <TextInput
                                aria-label="PostalCode"
                                aria-labelledby="postalCode"
                                keyboardType="number-pad"
                                placeholder="Enter postal code"
                                placeholderTextColor="#9ca3af"
                                className="text-base"
                            />
                        </View>

                        <Text aria-label="Address" nativeID="address" className="mt-5">Address</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                            <TextInput
                                aria-label="Address"
                                aria-labelledby="address"
                                keyboardType="default"
                                placeholder="Enter address"
                                placeholderTextColor="#9ca3af"
                                multiline={ true }
                                autoComplete="address-line1"
                                textAlignVertical="top"
                                className="h-[80px] text-base"
                            />
                        </View>

                        <Text aria-label="Height" nativeID="height" className="mt-5">Height { selectedHeightUnit === "Inches" ? "(in inches)" : "(in centimeter)" }</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-1 flex flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
                            <SelectList
                                setSelected={ setSelectedHeightUnit }
                                data={ heightUnitOptions }
                                maxHeight={100}
                                boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                                dropdownStyles={{ height: "auto", width: "auto", borderColor: "transparent" }}
                                dropdownItemStyles={{ paddingHorizontal: 10 }}
                                arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                                search={ false }
                                placeholder="Inches"
                            />
                            <View className="h-[35px] w-[1] mr-2 bg-slate-300" />
                            <TextInput
                                aria-label="Height"
                                aria-labelledby="height"
                                keyboardType="phone-pad"
                                placeholder="Enter your height"
                                placeholderTextColor="#9ca3af"
                                className="text-base"
                            />
                        </View>

                        <Text aria-label="Weight" nativeID="weight" className="mt-5">Weight { selectedWeightUnit === "Kilogram" ? "(in kilogram)" : "(in pounds)" }</Text>
                        <View className="h-auto w-full mt-1.5 px-3 py-1 flex flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
                            <SelectList
                                setSelected={ setSelectedWeightUnit }
                                data={ weightUnitOptions }
                                maxHeight={100}
                                boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                                dropdownStyles={{ height: "auto", width: "auto", borderColor: "transparent" }}
                                dropdownItemStyles={{ paddingHorizontal: 10 }}
                                arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                                search={ false }
                                placeholder="Kilogram"
                            />
                            <View className="h-[35px] w-[1] mr-2 bg-slate-300" />
                            <TextInput
                                aria-label="Weight"
                                aria-labelledby="weight"
                                keyboardType="phone-pad"
                                placeholder="Enter your weight"
                                placeholderTextColor="#9ca3af"
                                className="text-base"
                            />
                        </View>

                        <Text aria-label="Complexions" nativeID="complexions" className="mt-5">Complexions</Text>
                        <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                            <SelectList
                                setSelected={ setSelected }
                                data={ complexionOptions }
                                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                                dropdownItemStyles={{ paddingHorizontal: 15 }}
                                search={ false }
                            />
                        </View>

                        <Text aria-label="ShoeSize" nativeID="shoeSize" className="mt-5">ShoeSize</Text>
                        <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                            <SelectList
                                setSelected={ setSelectedShoeSize }
                                data={ shoeSizeOptions }
                                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                                dropdownItemStyles={{ paddingHorizontal: 15 }}
                                search={ false }
                            />
                        </View>

                        <Text aria-label="BestOutfit" nativeID="bestOutfit" className="mt-5">Best outfit</Text>
                        <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                            <SelectList
                                setSelected={ setSelectedBestOutfit }
                                data={ bestOutfitOptions }
                                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                                dropdownItemStyles={{ paddingHorizontal: 15 }}
                                search={ false }
                            />
                        </View>

                        <Text aria-label="BestColor" nativeID="bestColor" className="mt-5">Best color</Text>
                        <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                            <SelectList
                                setSelected={ setSelectedBestColor }
                                data={ bestColorOptions }
                                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                                dropdownItemStyles={{ paddingHorizontal: 15 }}
                                search={ false }
                            />
                        </View>

                        {/* Submit button — label and behavior driven by isVendor (from auth user data):
                              vendor    → "Proceed"               → save details + navigate to next setup step
                              non-vendor → "Update Account Details" → save details + show success modal */}
                        <TouchableOpacity
                            onPress={ handleProceed }
                            className="h-[55px] w-auto mt-8 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-lg text-white mr-2">{ isVendor ? "Proceed" : "Update Account Details" }</Text>
                            <ArrowRight className="text-white" />
                        </TouchableOpacity>

                    </View>
                </ScrollView>

            </SafeAreaView>

            { showPhoneCodeModal && <CountriesPhoneCodeModal option="PhoneCodes" /> }

            { showSuccessModal &&
                <SuccessPopupModal
                    bodyText="You have successfully updated your account details."
                    // screenURL kept for type compatibility; the actual destination
                    // is owned by handleSuccessDone via the onProceed override.
                    screenURL="loginScreen"
                    buttonLabel="Done"
                    onProceed={ handleSuccessDone }
                />
            }

            { isLoading && <AppLoader loadingAdditionalMessage={ loadingMessage } /> }
        </GestureHandlerRootView>
    );
};


export default AuthCheck(EditAccountDetailsScreen);
