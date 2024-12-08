import { Add, ArrowDown2, ArrowRight, Camera } from "iconsax-react-native";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { SelectList } from "react-native-dropdown-select-list";
import SuccessPopupModal from "../../../auths/modals/successPopup_modal";


const ShopSetupScreen = () => {
  const { phoneCodeOptions } = useSelector((state: RootState) => state.settingsState);
  const [selected, setSelected] = useState("");
  const [step, setStep] = useState("StepOne");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [socialMediaHandle, setSocialMediaHandle] = useState([{}]);

  const data = [
    { key: "Option 1", value: "Option 1" },
    { key: "Option 2", value: "Option 2" },
  ]

  const handleSubmitSignUp = (): void => {
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 1000);
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
              <Text>Congratulations, let’s</Text>
            </View>
            <View className="h-0 w-0 absolute top-[30px] left-[50%] translate-x-[-105px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold" />
          </View>

          <Text className="mt-4 font-semibold text-2xl text-center text-baseGreen">Setup Your Shop</Text>
          <Text className="mt-3.5 text-lg text-center text-baseGreen">{ (step === "StepOne") ? "1/2. Business Details" : "2/2. Business Contact Information" }</Text>

          { (step === "StepOne") && (
            <>
              <View className="h-[150px] w-[150px] mx-auto mt-8 p-2 rounded-full" style={{ borderStyle: "dashed", borderWidth: 1, borderColor: "#d1d5db" }}>
                <View className="h-full w-full rounded-full flex items-center justify-center bg-gray-200">
                  <Camera size={20} color="#9ca3af" variant="Bold" />
                </View>
              </View>
              <Text className="mt-3.5 text-center text-xs">Upload Shop Logo</Text>
            </>
          ) }

          {/* ==== Form ==== */}
          <View className="h-auto w-full">

            { (step === "StepOne") ? (
              <>
                <Text aria-label="BusinessType" nativeID="businessType" className="mt-5">What type of business do you run?</Text>
                <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                  <SelectList
                    setSelected={ setSelected }
                    data={ data }
                    boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                    dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 15 }}
                    search={ false }
                    placeholder="Select business type"
                  />
                </View>

                <Text aria-label="WhatYouDo" nativeID="whatYouDo" className="mt-5">What do you do?</Text>
                <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                  <SelectList
                    setSelected={ setSelected }
                    data={ data }
                    boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                    dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 15 }}
                    search={ false }
                    placeholder="Select what you do"
                  />
                </View>

                <Text aria-label="BusinessName" nativeID="businessName" className="mt-5">Business / shop name</Text>
                <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                  <TextInput
                    aria-label="BusinessName"
                    aria-labelledby="businessName"
                    keyboardType="default"
                    placeholder="Enter buniness name"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onChangeText={(value) => null}
                  />
                </View>

                <Text aria-label="BusinessEmail" nativeID="businessEmail" className="mt-5">Business / shop email</Text>
                <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                  <TextInput
                    aria-label="BusinessEmail"
                    aria-labelledby="businessEmail"
                    keyboardType="default"
                    placeholder="Enter business email"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onChangeText={(value) => null}
                  />
                </View>

                <Text aria-label="BusinessShopPhoneNumber" nativeID="businessShopPhoneNumber" className="mt-5">Business / shop phone number</Text>
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
                  />
                  <View className="h-[35px] w-[1] mr-2 bg-slate-300" />
                  <TextInput
                    aria-label="BusinessShopPhoneNumber"
                    aria-labelledby="businessShopPhoneNumber"
                    keyboardType="phone-pad"
                    placeholder="Enter phone number"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onChangeText={(value) => null}
                  />
                </View>

                <TouchableOpacity 
                  onPress={ () => setStep("StepTwo") }
                  className="h-[55px] w-auto mt-6 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                >
                  <Text className="text-lg text-white mr-2">Proceed</Text>
                  <ArrowRight className="text-white" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text aria-label="BusinessPhoneNumber" nativeID="businessPhoneNumber" className="mt-5">Business phone number</Text>
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
                  />
                  <View className="h-[35px] w-[1] mr-2 bg-slate-300" />
                  <TextInput
                    aria-label="BusinessPhoneNumber"
                    aria-labelledby="businessPhoneNumber"
                    keyboardType="phone-pad"
                    placeholder="Enter phone number"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onChangeText={(value) => null}
                  />
                </View>

                <Text aria-label="BusinessEmail" nativeID="businessEmail" className="mt-5">Business email</Text>
                <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                  <TextInput
                    aria-label="BusinessEmail"
                    aria-labelledby="businessEmail"
                    keyboardType="default"
                    placeholder="Enter business email"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onChangeText={(value) => null}
                  />
                </View>

                <Text aria-label="BusinessCountry" nativeID="businessCountry" className="mt-5">Business / shop country</Text>
                <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                  <SelectList
                    setSelected={ setSelected }
                    data={ data }
                    boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                    dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 15 }}
                    search={ false }
                    placeholder="Select country"
                  />
                </View>

                <Text aria-label="ShopCurrency" nativeID="shopCurrency" className="mt-5">Shop currency</Text>
                <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                  <SelectList
                    setSelected={ setSelected }
                    data={ data }
                    boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                    dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 15 }}
                    search={ false }
                    placeholder="Select shop currency"
                  />
                </View>
        
                <Text className="mt-8 text-lg text-baseGreen">Business social media handle</Text>

                { (socialMediaHandle.map((eachHandle, index) => (
                  <View key={ index }>
                    <Text aria-label="SocialMediaName" nativeID="socialMediaName" className="mt-5">Social media option</Text>
                    <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                      <SelectList
                        setSelected={ setSelected }
                        data={ data }
                        boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                        inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                        dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                        dropdownItemStyles={{ paddingHorizontal: 15 }}
                        search={ false }
                        placeholder="Select option"
                      />
                    </View>

                    <Text aria-label="SocialMediaURL" nativeID="socialMediaURL" className="mt-5">Social media url</Text>
                    <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                      <TextInput
                        aria-label="SocialMediaURL"
                        aria-labelledby="socialMediaURL"
                        keyboardType="default"
                        placeholder="Enter url"
                        placeholderTextColor="#9ca3af"
                        className="text-base"
                        onChangeText={(value) => null}
                      />
                    </View>
                    {socialMediaHandle.length > 1 && (
                      <View className="h-auto w-full mt-4 border-b border-gray-300" />
                    )}
                    
                  </View>
                ))) }

                <TouchableOpacity onPress={ () => setSocialMediaHandle((prevHandles) => [...prevHandles, {}]) }
                  className="h-auto w-full mt-4 flex flex-row justify-end"
                >
                  <Add size={ 20 } color="#133522" />
                  <Text className="mx-1 text-baseGreen">Add Another Handle</Text>
                </TouchableOpacity>
              

                <TouchableOpacity 
                  onPress={ () => handleSubmitSignUp() }
                  className="h-[55px] w-auto mt-8 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                >
                  <Text className="text-lg text-white mr-2">Proceed</Text>
                  <ArrowRight className="text-white" />
                </TouchableOpacity>
                  </>
            ) }

          </View>
        </ScrollView>
      </View>

      { showSuccessModal &&
        <SuccessPopupModal
          bodyText="You have successfully setup your shop. Kindly proceed to view your shop"
          screenURL="loginScreen"
        />
      }
    
    </SafeAreaView>
  );
};
  

export default ShopSetupScreen;