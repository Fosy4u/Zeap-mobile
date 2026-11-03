import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { ArrowDown2, ArrowRight, Eye, EyeSlash } from 'iconsax-react-native';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from '../../../routes/model/routes_model';
import SuccessPopupModal from '../modals/successPopup_modal';

import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useRegisterHook from '../hooks/register_hook';
import useLoginHook from '../hooks/login_hook';
import { Controller, useWatch } from 'react-hook-form';
import CountryCodePickerSheet, { ICountryPhoneCode } from '../../general/components/countryCodePickerSheet_component';
import countriesPhoneCodes from '../../../utils/countriesPhoneCodes.json';
import { phoneCodeForCurrency } from '../../../utils/currencyToPhoneCode';
import { setShowConfirmPassword, setShowPassword, setShowSuccessModal } from '../slices/authState_slice';
import AppLoader from '../../general/components/appLoader';

const RegisterScreen = () => {
  const { showPassword, showConfirmPassword, isVendorData, showSuccessModal } = useSelector((state: RootState) => state.authState);
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.generalState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();

  const {
    control, handleSubmit, onSubmit, handleGoogleSignUp, isGoogleLoading, errors, setDialCode, redirectAfterAuth,
    step, handleContinueWithEmail, handleUseDifferentEmail, isCheckingEmail, existingFirstName, getValues,
  } = useRegisterHook();
  const { onSubmit: logIn, isLoading: isLoggingIn } = useLoginHook();
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleLogIn = () => {
    if (!loginPassword) {
      setLoginPasswordError("Password is required.");
      return;
    }
    setLoginPasswordError("");
    logIn({ email: getValues("email").trim().toLowerCase(), password: loginPassword });
  };
  const preferredCurrency = useSelector((state: RootState) => state.profileState.userData?.prefferedCurrency);
  const [selectedCountry, setSelectedCountry] = useState<ICountryPhoneCode | undefined>(
    () => countriesPhoneCodes.find((country) => country.code === phoneCodeForCurrency(preferredCurrency).code),
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const password = useWatch({ control, name: "password" }) ?? "";
  const passwordRules = [
    { message: "Password must be at least 8 characters.", isValid: password.length >= 8 },
    { message: "Password needs an uppercase letter.", isValid: /[A-Z]/.test(password) },
    { message: "Password needs a lowercase letter.", isValid: /[a-z]/.test(password) },
    { message: "Password needs a number.", isValid: /\d/.test(password) },
  ];
  const unmetPasswordRule = password ? passwordRules.find((passwordRule) => !passwordRule.isValid)?.message : undefined;
  const passwordMessage = unmetPasswordRule ?? errors.password?.message;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["80%"], []);

  const setShowBottomSheetModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1">
          <StatusBar
              backgroundColor="transparent"
              barStyle="dark-content"
          />

          <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              className="flex-1 w-full"
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          >

            <View className="h-[48px] w-auto mx-auto mt-12 relative">
              <View className="h-[35px] w-auto mx-auto px-3.5 flex items-center justify-center rounded-lg bg-gold">
                <Text>Hello, there! Let’s</Text>
              </View>
              <View className="h-0 w-0 absolute top-[30px] left-[50%] translate-x-[-118px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold" />
            </View>

            <View className="h-auto w-full mt-4 px-[20px] flex items-center">
              <Text className="font-semibold text-2xl text-baseGreen">{ (step === "login") ? `Welcome back, ${ existingFirstName }!` : "Create A New Account" }</Text>
              <Text className="mt-3 text-center text-base">
                { (step === "email") ? "Enter your email address to get started" : (step === "login") ? "Enter your password to log in" : "Enter your details below to create a new account" }
              </Text>
            </View>

            {/* ==== Form ==== */}
            <View className="h-auto w-full">

              { (step === "email") ? (
                <>
              <Text aria-label="Email" nativeID="emailAddress" className="mt-5">Email address</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                <Controller
                    control={ control }
                    name="email"
                    rules={{ required: true }}
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            aria-label="Email"
                            aria-labelledby="emailAddress"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Enter email address"
                            placeholderTextColor="#9ca3af"
                            className="h-[44px] text-base"
                            onBlur={ onBlur }
                            onChangeText={ onChange }
                            value={ value }
                        />
                    ) }
                />
                { errors.email && (<Text className="text-red-500 text-xs">{errors.email.message}</Text>) }
              </View>

              <TouchableOpacity
                  onPress={ handleContinueWithEmail }
                  disabled={ isCheckingEmail }
                  className="h-[55px] w-auto mt-6 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
              >
                <Text className="text-lg text-white mr-2">{ isCheckingEmail ? "Please wait..." : "Continue" }</Text>
                { !isCheckingEmail && <ArrowRight className="text-white" /> }
              </TouchableOpacity>
                </>
              ) : (step === "login") ? (
                <>
              <View className="mt-5 px-4 py-3 flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50">
                <Text className="flex-1 font-montserratMedium text-sm text-gray-800" numberOfLines={ 1 }>{ getValues("email") }</Text>
                <TouchableOpacity onPress={ () => {
                  setLoginPassword("");
                  setLoginPasswordError("");
                  handleUseDifferentEmail();
                } } className="ml-3">
                  <Text className="font-montserratSemiBold text-xs text-baseGreen underline">Use different email</Text>
                </TouchableOpacity>
              </View>

              <Text aria-label="Password" nativeID="loginPassword" className="mt-5">Password</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                <TextInput
                    aria-labelledby="loginPassword"
                    secureTextEntry={ !showLoginPassword }
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    className="h-[44px] flex-1 text-base"
                    autoFocus
                    value={ loginPassword }
                    onChangeText={ (value) => {
                      setLoginPassword(value);
                      if (loginPasswordError) setLoginPasswordError("");
                    } }
                    onSubmitEditing={ handleLogIn }
                />
                <TouchableOpacity onPress={ () => setShowLoginPassword(!showLoginPassword) }>
                  { showLoginPassword ? <Eye className="text-gray-400" /> : <EyeSlash className="text-gray-400" /> }
                </TouchableOpacity>
              </View>
              { !!loginPasswordError && (<Text className="mt-1 text-red-500 text-xs">{ loginPasswordError }</Text>) }

              <TouchableOpacity onPress={ () => navigation.navigate("forgotPasswordScreen") } className="mt-3 self-end">
                <Text className="text-sm text-baseGreen">Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  onPress={ handleLogIn }
                  disabled={ isLoggingIn }
                  className="h-[55px] w-auto mt-6 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
              >
                <Text className="text-lg text-white mr-2">{ isLoggingIn ? "Please wait..." : "Log In" }</Text>
                { !isLoggingIn && <ArrowRight className="text-white" /> }
              </TouchableOpacity>
                </>
              ) : (
                <>
              <View className="mt-5 px-4 py-3 flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50">
                <Text className="flex-1 font-montserratMedium text-sm text-gray-800" numberOfLines={ 1 }>{ getValues("email") }</Text>
                <TouchableOpacity onPress={ handleUseDifferentEmail } className="ml-3">
                  <Text className="font-montserratSemiBold text-xs text-baseGreen underline">Use different email</Text>
                </TouchableOpacity>
              </View>

              <Text aria-label="First Name" nativeID="firstName" className="mt-5">First Name</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                <Controller
                    control={ control }
                    name="firstName"
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            aria-label="First Name"
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
              <Text aria-label="Last Name" nativeID="lastName" className="mt-5">Last Name</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                <Controller
                    control={ control }
                    name="lastName"
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            aria-label="Last Name"
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

              <Text aria-label="PhoneNumber" nativeID="phoneNumber" className="mt-5">Phone Number</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
                <TouchableOpacity
                    onPress={ () => setShowCountryPicker(true) }
                    style={{ height: 44, minWidth: 96, paddingRight: 8, marginRight: 8, flexDirection: "row", alignItems: "center", borderRightWidth: 1, borderRightColor: "#d1d5db" }}
                    accessibilityLabel="Select country code"
                >
                    <Text style={{ fontSize: 16 }} numberOfLines={ 1 }>{ selectedCountry?.emoji } { selectedCountry?.dial_code }</Text>
                    <ArrowDown2 size={ 14 } color="#6b7280" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
                <Controller
                    control={ control }
                    name="phoneNumber"
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            aria-label="PhoneNumber"
                            aria-labelledby="phoneNumber"
                            keyboardType="phone-pad"
                            placeholder="Enter phone number"
                            placeholderTextColor="#9ca3af"
                            className="h-[44px] flex-1 text-base"
                            onBlur={ onBlur }
                            onChangeText={ (text) => onChange(text.replace(/[^0-9]/g, "")) }
                            value={ value }
                        />
                    ) }
                />
              </View>
              { errors.phoneNumber && (<Text className="mt-1 text-red-500 text-xs">{errors.phoneNumber.message}</Text>) }

              <Text aria-label="Password" nativeID="password" className="mt-5">Password</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                <Controller
                    control={ control }
                    name="password"
                    rules={{ required: true }}
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            aria-label="Password"
                            aria-labelledby="password"
                            secureTextEntry={ !showPassword }
                            placeholder="Enter password"
                            placeholderTextColor="#9ca3af"
                            className="h-[44px] flex-1 text-base"
                            onBlur={ onBlur }
                            onChangeText={ onChange }
                            value={ value }
                        />
                    ) }
                />
                <TouchableOpacity onPress={ () => dispatch(setShowPassword(!showPassword)) }>
                  { showPassword ? <Eye className="text-gray-400" /> : <EyeSlash className="text-gray-400" /> }
                </TouchableOpacity>
              </View>
              { !!passwordMessage && (<Text className="mt-1 text-red-500 text-xs">{ passwordMessage }</Text>) }

              <Text aria-label="ConfirmPassword" nativeID="confirmPassword" className="mt-6">Confirm password</Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                <Controller
                    control={ control }
                    name="confirmPassword"
                    rules={{ required: true }}
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            aria-label="ConfirmPassword"
                            aria-labelledby="confirmPassword"
                            secureTextEntry={ !showConfirmPassword }
                            placeholder="Repeat password"
                            placeholderTextColor="#9ca3af"
                            className="h-[44px] flex-1 text-base"
                            onBlur={ onBlur }
                            onChangeText={ onChange }
                            value={ value }
                        />
                    ) }
                />
                <TouchableOpacity onPress={ () => dispatch(setShowConfirmPassword(!showConfirmPassword)) }>
                  { showConfirmPassword ? <Eye className="text-gray-400" /> : <EyeSlash className="text-gray-400" /> }
                </TouchableOpacity>
              </View>
              { errors.confirmPassword && (<Text className="mt-1 text-red-500 text-xs">{errors.confirmPassword.message}</Text>) }

              <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  disabled={ isLoading }
                  className="h-[55px] w-auto mt-6 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
              >
                <Text className="text-lg text-white mr-2">{ isLoading ? "Creating Account..." : "Create Account" }</Text>
                <ArrowRight className="text-white" />
              </TouchableOpacity>
                </>
              ) }
              {/* <View className="mt-6 flex flex-row items-center">
                <Text>Will you like to sell too?</Text>
                <TouchableOpacity
                    onPress={ () => setShowBottomSheetModal() }
                >
                  <InfoCircle variant="Bold" size={18} className="ml-2 text-gray-400" />
                </TouchableOpacity>
              </View>
              <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                <Controller
                    control={ control }
                    name="isVendor"
                    rules={{ required: true }}
                    render={ ({ field: { onChange, value } }) => (
                        <SelectList
                            data={ isVendorData }
                            defaultOption={{ key: value, value: value }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 12, paddingVertical: 17, borderColor: "transparent" }}
                            inputStyles={{ fontSize: 16, color: "#606060" }}
                            dropdownStyles={{ height: "auto", width: "100%", marginTop: -15, borderColor: "transparent" }}
                            dropdownTextStyles={{ color: "#606060", fontSize: 16 }}
                            dropdownItemStyles={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 5 }}
                            placeholder="Select an option"
                            search={ false }
                            setSelected={ onChange }
                        />
                    ) }
                />
                { errors.isVendor && (<Text className="text-red-500 text-xs">{errors.isVendor.message}</Text>) }
              </View> */}


              { step !== "login" && (
                <>
              <View className="mt-7 px-1.5 flex-row items-center">
                <View className="h-[0.5px] mr-2 flex-1 bg-gray-400" />
                <Text>OR CREATE ACCOUNT USING</Text>
                <View className="h-[0.5px] ml-2 flex-1 bg-gray-400" />
              </View>

              <View className="mt-8 flex-1 flex-row justify-center">
                <TouchableOpacity
                    onPress={ handleGoogleSignUp }
                    disabled={ isLoading || isGoogleLoading }
                    className="h-[55px] w-full flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl bg-transparent"
                >
                  <Image source={ require("../../../../assets/images/google_logo.png") } className="h-[20px] w-[20px] mr-1" />
                  <View className="w-[5px]" />
                  <Text className="font-medium text-lg text-baseGreen">{ isGoogleLoading ? "Please wait..." : "Continue with Google" }</Text>
                </TouchableOpacity>

              </View>

              <View className="w-full mt-6 mb-10 flex-1 flex-row justify-center">
                <Text className="mr-1">Already have an account?</Text>

                <TouchableOpacity
                    onPress={ () => navigation.navigate("loginScreen") }
                >
                  <Text className="text-baseGreen">Login Now</Text>
                </TouchableOpacity>
              </View>
                </>
              ) }
            </View>
          </ScrollView>

          <CountryCodePickerSheet
            visible={ showCountryPicker }
            selectedCountryCode={ selectedCountry?.code }
            onSelect={ (country) => {
              setSelectedCountry(country);
              setDialCode(country.dial_code);
            } }
            onClose={ () => setShowCountryPicker(false) }
          />

          { showSuccessModal &&
            <SuccessPopupModal
              bodyText="You have successfully created your account."
              screenURL="loginScreen"
              buttonLabel="Continue"
              onProceed={ () => {
                dispatch(setShowSuccessModal(false));
                redirectAfterAuth();
              } }
            />
          }

          {/* { showBottomSheetModal && <BottomSheetModal closeBottomSheet={ setShowBottomSheetModal } /> } */}
          <BottomSheetModal
            ref={ bottomSheetModalRef }
            index={ 0 }
            snapPoints={ snapPoints }
            // onChange={ handleSheetChanges }
          >
            <BottomSheetView className="flex-1">
              <Text className="mt-5 font-semibold text-center text-xl text-gray-800">How To Become A Seller</Text>
              <ScrollView
                  showsVerticalScrollIndicator={ false }
                  showsHorizontalScrollIndicator={ false }
                  contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
              >
                  <Text className="mt-3 text-justify text-lg">
                      Lorem ipsum dolor sit amet consectetur. Quis in ullamcorper mauris aliquam ultrices libero tincidunt vitae. 
                      Dui nullam urna venenatis consequat neque dignissim. Elit a aenean erat justo suscipit orci elit aliquet hendrerit. 
                      Sit lacinia eros lorem porta. Tortor pulvinar id integer purus commodo arcu tortor. Hendrerit habitasse ullamcorper 
                      gravida morbi ridiculus augue id. Et odio nulla lorem cursus. Pellentesque aliquam nam lacus neque et faucibus purus. 
                      Quam enim aliquet facilisis aliquet suspendisse. Fusce in feugiat mauris convallis amet. Ante suspendisse ultricies 
                      iaculis diam diam neque dui. Libero pellentesque cras nec dolor. Ut porta consequat sed dolor tincidunt vitae pellentesque. 
                      At at ipsum auctor vel eleifend sem. Nulla mollis vel ullamcorper enim maecenas sed. Feugiat ac fermentum orci elit 
                      tincidunt facilisis. Nec volutpat mauris odio placerat ut egestas. At vestibulum blandit ut sed ligula. Maecenas gravida.
                  </Text>
              </ScrollView>
            </BottomSheetView>
          </BottomSheetModal>
            
        </SafeAreaView>

        { isLoading &&
          <AppLoader loadingAdditionalMessage={ loadingMessage } />
        }
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default RegisterScreen;