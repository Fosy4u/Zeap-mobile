import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ArrowDown2, ArrowRight, Calendar, Camera } from "iconsax-react-native";
import { RootState } from "../../../redux/store/store";
import { SelectList } from "react-native-dropdown-select-list";
import DatePicker from "react-native-date-picker";
import SuccessPopupModal from "../../auths/modals/successPopup_modal";

import { setShowSuccessModal } from "../slices/settings_slice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../routes/model/routes_model";


const ProfileSetupScreen = () => {
  const { phoneCodeOptions, heightUnitOptions, weightUnitOptions, complexionOptions, shoeSizeOptions, bestOutfitOptions, bestColorOptions, showSuccessModal } = useSelector((state: RootState) => state.settingsState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("");
  const [selectedHeightUnit, setSelectedHeightUnit] = useState("Inches");
  const [selectedWeightUnit, setSelectedWeightUnit] = useState("Kilogram");
  const [selectedShoeSize, setSelectedShoeSize] = useState("");
  const [selectedBestOutfit, setSelectedBestOutfit] = useState("");
  const [selectedBestColor, setSelectedBestColor] = useState("");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isSeller, setIsSeller] = useState(true);

  const data = [
    { key: "Yes", value: "Yes" },
    { key: "No", value: "No" },
  ]

  const convertDate = (dateString: string): string => {
    const [month, day, year] = dateString.split("/");
    return `${day}/${month}/${year}`;
  };

  const handleProceed = (): void => {
    if (isSeller) {
      setTimeout(() => {
        dispatch(setShowSuccessModal(true));
      }, 1000);
    } else {
      navigation.navigate("loginScreen");
    }
  };
  

  return (
    <SafeAreaView className="flex-1 items-center">
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View className="h-full w-full px-5 pb-10">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >

          <View className="h-[48px] w-auto mx-auto mt-12 relative">
            <View className="h-[35px] w-auto mx-auto px-3.5 flex items-center justify-center rounded-lg bg-gold">
              <Text>Hello, there! Let’s</Text>
            </View>
            <View className="h-0 w-0 absolute top-[30px] left-[50%] translate-x-[-118px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold" />
          </View>

          <Text className="mt-4 font-semibold text-2xl text-center text-baseGreen">Setup Your Profile</Text>

          <View className="h-[150px] w-[150px] mx-auto mt-10 p-2 rounded-full" style={{ borderStyle: "dashed", borderWidth: 1, borderColor: "#d1d5db" }}>
            <View className="h-full w-full rounded-full flex items-center justify-center bg-gray-200">
              <Camera size={20} color="#9ca3af" variant="Bold" />
            </View>
          </View>
          <Text className="mt-3.5 text-center text-xs">Upload Profile Photo</Text>

          {/* ==== Form ==== */}
          <View className="h-auto w-full">

            <Text aria-label="FirstName" nativeID="firstName" className="mt-5">First name</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="FirstName"
                aria-labelledby="firstName"
                keyboardType="name-phone-pad"
                placeholder="Enter first name"
                placeholderTextColor="#9ca3af"
                className="text-base"
                onChangeText={(value) => null}
              />
            </View>

            <Text aria-label="LastName" nativeID="lastName" className="mt-5">Last name</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="LastName"
                aria-labelledby="lastName"
                keyboardType="name-phone-pad"
                placeholder="Enter last name"
                placeholderTextColor="#9ca3af"
                className="text-base"
                onChangeText={(value) => null}
              />
            </View>

            <Text aria-label="PhoneNumber" nativeID="phoneNumber" className="mt-5">Phone number</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 flex flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
              <Text className="mb-1 text-lg">+</Text>
              <SelectList
                setSelected={ setSelected }
                data={ phoneCodeOptions }
                maxHeight={100}
                boxStyles={{ height: 30, width: "auto", paddingHorizontal: 5, paddingVertical: 0, borderColor: "transparent" }}
                inputStyles={{ marginTop: 1, fontSize: 16, color: "#9ca3af" }}
                dropdownStyles={{ height: "auto", width: "auto", borderColor: "transparent" }}
                dropdownItemStyles={{ paddingHorizontal: 40 }}
                arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="ml-1 mt-1" /> }
                search={ true }
                placeholder="234"
              />rist
              <TextInput
                aria-label="PhoneNumber"
                aria-labelledby="phoneNumber"
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                placeholderTextColor="#9ca3af"
                className="text-base"
                onChangeText={(value) => null}
              />
            </View>

            <Text aria-label="DateOfBirth" nativeID="dateOfBirth" className="mt-5">Date of birth</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TouchableOpacity
                onPress={ () => setOpen(true) }
                className="h-auto w-full flex flex-row items-center justify-between"
              >
                <TextInput
                  onFocus={() => setOpen(true)}
                  value={ convertDate(date.toLocaleDateString()) }
                  aria-label="DateOfBirth"
                  aria-labelledby="dateOfBirth"
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#9ca3af"
                  className="text-base"
                />
                <Calendar className="text-gray-400" />
              </TouchableOpacity>
              <DatePicker
                modal
                open={ open }
                date={ date }
                mode="date"
                title={"Select date of birth"}
                onConfirm={ (date) => {
                  setDate(date);
                  setOpen(false);
                } }
                onCancel={ () => setOpen(false) }
              />
            </View>

            <Text className="mt-5">Countries</Text>
            <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
              <SelectList
                setSelected={ setSelected }
                data={ data }
                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                dropdownItemStyles={{ paddingHorizontal: 15 }}
                search={ false }
              />
            </View>

            <Text className="mt-5">Cities</Text>
            <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
              <SelectList
                setSelected={ setSelected }
                data={ data }
                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                dropdownItemStyles={{ paddingHorizontal: 15 }}
                search={ false }
              />
            </View>

            <Text aria-label="PostalCode" nativeID="postalCode" className="mt-5">Postal code</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="PostalCode"
                aria-labelledby="postalCode"
                keyboardType="number-pad"
                placeholder="Enter postal code"
                placeholderTextColor="#9ca3af"
                className="text-base"
                onChangeText={(value) => null}
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
                onChangeText={(value) => null}
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
                onChangeText={(value) => null}
              />
            </View>

            <Text aria-label="Weight" nativeID="height" className="mt-5">Weight { selectedWeightUnit === "Kilogram" ? "(in kilogram)" : "(in pounds)" }</Text>
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
                onChangeText={(value) => null}
              />
            </View>

            <Text aria-label="Complexions" nativeID="height" className="mt-5">Complexions</Text>
            <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
              <SelectList
                setSelected={ setSelected }
                data={ complexionOptions }
                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                dropdownItemStyles={{ paddingHorizontal: 15 }}
                search={ false }
                // placeholder=""
              />
            </View>

            <Text aria-label="ShoeSize" nativeID="height" className="mt-5">ShoeSize</Text>
            <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
              <SelectList
                setSelected={ setSelectedShoeSize }
                data={ shoeSizeOptions }
                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                dropdownItemStyles={{ paddingHorizontal: 15 }}
                search={ false }
                // placeholder=""
              />
            </View>

            <Text aria-label="BestOutfit" nativeID="height" className="mt-5">Best outfit</Text>
            <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
              <SelectList
                setSelected={ setSelectedBestOutfit }
                data={ bestOutfitOptions }
                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                dropdownItemStyles={{ paddingHorizontal: 15 }}
                search={ false }
                // placeholder=""
              />
            </View>

            <Text aria-label="BestColor" nativeID="height" className="mt-5">Best color</Text>
            <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
              <SelectList
                setSelected={ setSelectedBestColor }
                data={ bestColorOptions }
                boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                dropdownItemStyles={{ paddingHorizontal: 15 }}
                search={ false }
                // placeholder=""
              />
            </View>

            <TouchableOpacity 
              onPress={ () => handleProceed() }
              className="h-[55px] w-auto mt-6 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="text-lg text-white mr-2">{ (isSeller) ? "Save And Continue" : "Proceed"}</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>

      { showSuccessModal &&
        <SuccessPopupModal
          bodyText={ (isSeller) 
            ? "You have successfully setup your profile. Kindly proceed to setup your shop." 
            : "You have successfully setup your profile. Kindly login into your account"
          }
          screenURL={ (isSeller) ? "shopSetupScreen" : "loginScreen"}
        />
      }
    
    </SafeAreaView>
  );
};
  

export default ProfileSetupScreen;