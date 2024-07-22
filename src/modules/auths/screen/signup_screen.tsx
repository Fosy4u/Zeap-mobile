import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { ArrowRight, Eye, EyeSlash, InfoCircle } from 'iconsax-react-native';
import { Image, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from '../../../routes/model/routes_model';
import SuccessPopupModal from '../modals/successPopup_modal';

import { setShowBottomSheetModal, setShowSuccessModal } from '../../setting/slices/settings_slice';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const SignUpScreen = () => {
  const { isSellerOptions, showSuccessModal, showBottomSheetModal } = useSelector((state: RootState) => state.settingsState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selected, setSelected] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["80%"], []);

  const setShowBottomSheetModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlesubmitSignUp = (): void => {
    setTimeout(() => {
      dispatch(setShowSuccessModal(true));
    }, 1000);
  };

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 items-center">
          <StatusBar
              backgroundColor="transparent"
              barStyle="dark-content"
          />

          <View className="px-5">
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

              <View className="h-auto w-full mt-4 px-[20px] flex items-center">
                  <Text className="font-semibold text-2xl text-baseGreen">Create A New Account</Text>
                  <Text className="mt-3 text-center text-base">Enter your email address and password to create a new account</Text>
              </View>

              {/* ==== Form ==== */}
              <View className="h-auto w-full">

                <Text aria-label="Email" nativeID="emailAddress" className="mt-5">Email address</Text>
                <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                  <TextInput
                    aria-label="Email"
                    aria-labelledby="emailAddress"
                    keyboardType="email-address"
                    placeholder="Enter email address"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onChangeText={(value) => null}
                  />
                </View>

                <View className="mt-6 flex flex-row items-center">
                  <Text>Will you like to sell too?</Text>
                  <TouchableOpacity
                    onPress={ () => setShowBottomSheetModal() }
                  >
                    <InfoCircle variant="Bold" size={18} className="ml-2 text-gray-400" />
                  </TouchableOpacity>
                </View>
                <View className="h-auto w-full mt-1.5 py-0 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                  <SelectList
                    setSelected={ setSelected }
                    data={ isSellerOptions }
                    boxStyles={{ height: "auto", width: "100%", paddingHorizontal: 15, paddingVertical: 17, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                    dropdownStyles={{ height: "auto", width: "100%", borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 15 }}
                    search={ false }
                    // placeholder=""
                  />
                </View>

                <Text aria-label="Password" nativeID="password" className="mt-6">Password</Text>
                <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                  <TextInput
                    aria-label="Password"
                    aria-labelledby="password"
                    secureTextEntry={ showPassword }
                    placeholder="Enter password"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onChangeText={(value) => null}
                  />
                  <TouchableOpacity onPress={ () => setShowPassword(!showPassword) }>
                    { showPassword ? <Eye className="text-gray-400" /> : <EyeSlash className="text-gray-400" /> }
                  </TouchableOpacity>
                </View>


                <Text aria-label="ConfirmPassword" nativeID="confirmPassword" className="mt-6">Confirm password</Text>
                <View className="h-auto w-full mt-1.5 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                  <TextInput
                    aria-label="ConfirmPassword"
                    aria-labelledby="confirmPassword"
                    secureTextEntry={ showPassword }
                    placeholder="Repeat password"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onChangeText={(value) => null}
                  />
                  <TouchableOpacity onPress={ () => setShowPassword(!showPassword) }>
                    { showPassword ? <Eye className="text-gray-400" /> : <EyeSlash className="text-gray-400" /> }
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  onPress={ () => handlesubmitSignUp() }
                  className="h-[55px] w-auto mt-6 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                >
                  <Text className="text-lg text-white mr-2">Create Account</Text>
                  <ArrowRight className="text-white" />
                </TouchableOpacity>

                <View className="mt-7 px-1.5 flex-row items-center">
                  <View className="h-[0.5px] mr-2 flex-1 bg-gray-400" />
                  <Text>OR CREATE ACCOUNT USING</Text>
                  <View className="h-[0.5px] ml-2 flex-1 bg-gray-400" />
                </View>

                <View className="mt-8 flex-1 flex-row justify-center">
                  <TouchableOpacity 
                      onPress={ () => null }
                      className="h-[55px] w-full flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl bg-transparent"
                    >
                      <Image source={ require("../../../assets/google_logo.png") } className="h-[20px] w-[20px] mr-1" />
                      <View className="w-[5px]" /> 
                      <Text className="font-medium text-lg text-baseGreen">Google</Text>
                  </TouchableOpacity>

                  <View className="w-[15px]" />

                  <TouchableOpacity 
                    onPress={ () => null }
                    className="h-[55px] w-full flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl bg-transparent"
                  >
                    <Image source={ require("../../../assets/apple_logo.png") } className="h-[20px] w-[20px] mr-1" />
                    <Text className="font-medium text-lg text-baseGreen">Apple</Text>
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
              </View>
            </ScrollView>
          </View>

          { showSuccessModal &&
            <SuccessPopupModal
              bodyText="You have successfully created your account. Kindly proceed to setting up your account."
              screenURL="profileSetupScreen"
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
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default SignUpScreen;