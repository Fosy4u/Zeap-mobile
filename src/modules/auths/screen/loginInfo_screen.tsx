import React, { useEffect, useRef } from 'react'
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, BackHandler, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { ArrowRight, Bag2 } from 'iconsax-react-native';
import useLoginHook from '../hooks/login_hook';
import AppLoader from '../../general/components/appLoader';
import { useDispatch } from 'react-redux';
import { clearPendingDestination } from '../slices/authState_slice';
import showToast from '../../../utils/showToast';

const LoginInfoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  // Reuse the login hook's Google flow so social sign-in here behaves exactly
  // like the dedicated login screen — including the post-auth redirect back to
  // the protected screen the user was bounced from (pendingDestination).
  const { handleGoogleSignIn, isGoogleLoading } = useLoginHook();

  // Apple Sign-In isn't wired up yet (no native handler exists). Be honest
  // instead of silently doing nothing, and point users to a working option.
  const handleApplePressed = () => {
    Alert.alert(
      "Apple Sign-In coming soon",
      "Apple Sign-In isn't available yet. Please continue with email or Google.",
    );
  };
  /* Opting out of logging in also drops the stashed destination — otherwise a
     later, unrelated sign-in would bounce the user into the screen they left. */
  const handleContinueShopping = () => {
    dispatch(clearPendingDestination());
    navigation.navigate("homeScreen", { screen: "Home" });
  };

  const backPressCount = useRef(0);
  const backPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount.current === 0) {
        backPressCount.current = 1;
        showToast('Press back again to exit');
        
        // Reset the counter after 2 seconds
        if (backPressTimer.current) {
          clearTimeout(backPressTimer.current);
        }
        backPressTimer.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);
        
        return true;
      }
      
      if (backPressCount.current === 1) {
        BackHandler.exitApp();
        return true;
      }
      
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
      if (backPressTimer.current) {
        clearTimeout(backPressTimer.current);
      }
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Scrollable so the last action stays reachable on short screens and at
          large font scales — the stack is ~585pt before any accessibility bump. */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={ false }
      >
      <View className="mt-20 flex-1 items-center justify-start px-6">
        <View className="h-[48px] w-auto mx-auto mt-6 relative">
          <View className="h-[35px] w-auto mx-auto px-3.5 flex items-center justify-center rounded-lg bg-gold">
            <Text>Hello</Text>
          </View>
          <View className="h-0 w-0 absolute top-[30px] left-[40%] translate-x-[-118px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-gold" />
        </View>

        {/* Title */}
        <Text className="mt-5 text-2xl font-bold text-gray-800 mb-3 text-center">
          Login Required
        </Text>

        {/* Description */}
        <Text className="text-base text-gray-600 text-center mb-8">
          You need to be logged in to access this feature. Please login to continue using our services.
        </Text>

        {/* Proceed to Login Button */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('loginScreen')}
          className="h-[55px] w-full mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
          >
            <Text className="text-lg text-white mr-2">Proceed to Login</Text>
            <ArrowRight className="text-white" />
        </TouchableOpacity>

        <View className="mt-6 px-1.5 flex-row items-center">
          <View className="h-[0.5px] mr-2 flex-1 bg-gray-400" />
          <Text>OR LOGIN USING</Text>
          <View className="h-[0.5px] ml-2 flex-1 bg-gray-400" />
        </View>

        <View className="mt-8 flex-row justify-center">
          <TouchableOpacity
              onPress={ handleGoogleSignIn }
              disabled={ isGoogleLoading }
              className="h-[55px] w-full flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl bg-transparent"
              style={{ opacity: isGoogleLoading ? 0.6 : 1 }}
            >
              { isGoogleLoading ? (
                <ActivityIndicator size="small" color="#133522" />
              ) : (
                <>
                  <Image source={ require("../../../../assets/images/google_logo.png") } className="h-[20px] w-[20px] mr-1" />
                  <View className="w-[5px]" />
                  <Text className="font-medium text-lg text-baseGreen">Google</Text>
                </>
              ) }
          </TouchableOpacity>

          <View className="w-[15px]" />

          <TouchableOpacity
            onPress={ handleApplePressed }
            className="h-[55px] w-full flex-1 flex-row items-center justify-center border border-gray-300 rounded-xl bg-transparent"
          >
            <Image source={ require("../../../../assets/images/apple_logo.png") } className="h-[20px] w-[20px] mr-1" />
            <Text className="font-medium text-lg text-baseGreen">Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Option */}
        <TouchableOpacity
          onPress={() => navigation.navigate('signUpScreen')}
          className="w-full mt-5"
        >
          <Text className="text-primary text-center font-medium">
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={ handleContinueShopping }
          className="h-[55px] w-full mt-8 flex flex-row items-center justify-center rounded-xl border border-gray-300 bg-transparent"
        >
          <Bag2 size={ 18 } color="#133522" />
          <Text className="ml-2 text-lg text-baseGreen">Continue Shopping</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

      {/* Full-screen overlay while the Google flow runs — it navigates away on
          success, so this covers the brief auth + profile-fetch window. */}
      { isGoogleLoading && (
        <AppLoader loadingAdditionalMessage="Signing in with Google..." />
      ) }
    </SafeAreaView>
  )
}

export default LoginInfoScreen;