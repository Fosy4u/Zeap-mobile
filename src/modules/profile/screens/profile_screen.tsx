import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { ArrowRight2, Bank, Camera, ClipboardText, DocumentText1, Headphone, Like1, Logout, Element3, Notification, Profile, Receipt21, Ruler, Setting2, Shop, Ticket } from 'iconsax-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useLogoutHook from '../../auths/hooks/logout_hook';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import useAddressHook from '../../user/address/hooks/address_hook';
import UserAvatar from '../../general/components/userAvatar_component';
import { useLazyGetAuthShopQuery } from '../../vendor/general/apis/general_api';
import { setShop } from '../../vendor/general/slices/general_slice';
import ModuleAppBarComponent from '../../general/components/moduleAppBar_component';
import AppLoader from '../../general/components/appLoader';
import NotificationBadgeComponent from '../../notifications/components/notificationBadge_component';
import AppStatusBar from "../../general/components/appStatusBar";
import useProfilePicUploadHook from '../hooks/profilePicUpload_hook';
import { clearPendingDestination } from '../../auths/slices/authState_slice';

const ProfileScreen = () => {
  const { userData } = useSelector((state: RootState) => state.profileState );
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.generalState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const route = useRoute();
  const dispatch = useDispatch();

  const isVendorMode = (route.params as { mode?: string } | undefined)?.mode === "vendor";

  const { signOutUser } = useLogoutHook();
  const { selectedImage, isUploadingProfilePic, handleChooseProfilePic, handleCancelProfilePic, handleSaveProfilePic } = useProfilePicUploadHook();
  // console.log("USER DATA::: ", userData);

  const {
    handleGetDeliveryAddresses
  } = useAddressHook();

  const [getAuthShop] = useLazyGetAuthShopQuery();

  const isShopOwner = !!userData?.isVendor;

  const showShopAdmin = isVendorMode && isShopOwner;

  useEffect(() => {
    handleGetDeliveryAddresses();
  }, []);

  useEffect(() => {
    if (!showShopAdmin) return;
    (async () => {
      try {
        const authShop = await getAuthShop().unwrap();
        if (authShop) dispatch(setShop(authShop));
      } catch {
      }
    })();
  }, [showShopAdmin]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full w-full flex-1">

        <AppStatusBar backgroundColor={isVendorMode ? "#133522" : "transparent"} barStyle="light-content" />

        <ModuleAppBarComponent
          title="My Profile"
          variant={ isVendorMode ? "vendor" : "buyer" }
          rightIcon={
            <View>
              <Notification color={ isVendorMode ? "#D5B07B" : "#133522" } size={ 24 } variant="Bold" />
              <NotificationBadgeComponent />
            </View>
          }
          onRightPress={ () => navigation.navigate(
            isVendorMode ? "vendorNotificationsScreen" : "userNotificationsScreen"
          ) }
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 96, paddingHorizontal: 20 }}
        >

          <View className="mt-5">

            {/*==== Profile Image ====*/}
            <View className="h-auto w-full py-7 flex-1 items-center rounded-2xl bg-[#F8F9FE]">
              <View>
                { selectedImage?.uri ? (
                  <Image source={{ uri: selectedImage.uri }} style={{ height: 90, width: 90, borderRadius: 45 }} />
                ) : (
                  <UserAvatar
                    photoURL={ userData.imageUrl?.link }
                    firstName={userData.firstName}
                    lastName={userData.lastName}
                    displayName={(userData as any).displayName}
                    email={userData.email}
                    isGuest={!!userData.isGuest}
                    seed={userData.uid || userData.email}
                    size={90}
                  />
                ) }
                { !userData.isGuest && !selectedImage && (
                  <TouchableOpacity
                    onPress={ handleChooseProfilePic }
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    className="h-[30px] w-[30px] absolute -bottom-1 -right-1 items-center justify-center rounded-full border-2 border-white bg-gold"
                  >
                    <Camera size={ 15 } color="#133522" variant="Bold" />
                  </TouchableOpacity>
                ) }
              </View>

              { selectedImage && (
                <View className="mt-3 flex-row" style={{ columnGap: 8 }}>
                  <TouchableOpacity
                    onPress={ handleSaveProfilePic }
                    disabled={ isUploadingProfilePic }
                    className="h-[34px] min-w-[72px] px-4 items-center justify-center rounded-lg bg-baseGreen"
                  >
                    { isUploadingProfilePic
                      ? <ActivityIndicator size="small" color="#FFFFFF" />
                      : <Text className="font-montserratMedium text-sm text-white">Save</Text>
                    }
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={ handleCancelProfilePic }
                    disabled={ isUploadingProfilePic }
                    className="h-[34px] px-4 items-center justify-center rounded-lg bg-red-50"
                  >
                    <Text className="font-montserratMedium text-sm text-red-700">Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) }

              { !userData.isGuest && (
                <>
                  <Text className="mt-3 text-xl text-baseGreen">{ userData.firstName }</Text>
                  <Text className="text-sm text-baseGreen">{ userData.email }</Text>
                </>
              ) }

              { userData.isGuest && (
                <View className="w-full mt-5 px-5 flex-row" style={{ columnGap: 12 }}>
                  <TouchableOpacity
                    onPress={ () => {
                      dispatch(clearPendingDestination());
                      navigation.navigate("loginScreen");
                    } }
                    className="h-[48px] flex-1 items-center justify-center rounded-xl border border-baseGreen bg-lightGreen"
                  >
                    <Text className="font-montserratMedium text-base text-baseGreen">Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={ () => {
                      dispatch(clearPendingDestination());
                      navigation.navigate("signUpScreen");
                    } }
                    className="h-[48px] flex-1 items-center justify-center rounded-xl bg-baseGreen"
                  >
                    <Text className="font-montserratMedium text-base text-white">Sign Up</Text>
                  </TouchableOpacity>
                </View>
              ) }
            </View>

            <View className="mt-5">

              {/* User Dashboard */}
              <CardItems
                handleOnPress={ () => navigation.navigate("userDashboardScreen") }
                title="My Dashboard"
                icon={ <Element3 color="gray" /> }
              />

              { isShopOwner && !isVendorMode && (
                <CardItems
                  handleOnPress={ () => navigation.navigate("vendorHomeScreen", { screen: "Dashboard" }) }
                  title="My Shop"
                  icon={ <Shop color="gray" /> }
                />
              ) }

              {/* Personal information */}
              <CardItems
                handleOnPress={ () => navigation.navigate("personalInformationScreen") }
                title="Personal information"
                icon={ <Profile color="gray" /> }
              />

              { showShopAdmin && (
                <>
                  {/* Shop information */}
                  <CardItems
                    handleOnPress={ () => navigation.navigate("shopInformationScreen") }
                    title="Shop information"
                    icon={ <Shop color="gray" /> }
                  />

                  {/* Bank details */}
                  <CardItems
                    handleOnPress={ () => navigation.navigate("bankDetailsScreen") }
                    title="Bank details"
                    icon={ <Bank color="gray" /> }
                  />

                  <CardItems
                    handleOnPress={ () => navigation.navigate("policiesScreen") }
                    title="Policies / Contract"
                    icon={ <ClipboardText color="gray" /> }
                  />

                  {/* Identity & shop document */}
                  <CardItems
                    handleOnPress={ () => navigation.navigate("shopDocumentsScreen") }
                    title="Identity & shop document"
                    icon={ <DocumentText1 color="gray" /> }
                  />
                </>
              ) }

              {/* Notifications */}
              <CardItems
                handleOnPress={ () => navigation.navigate(userData?.isVendor ? "vendorNotificationsScreen" : "userNotificationsScreen") }
                title="Notifications"
                icon={ <Notification color="gray" /> }
              />

              <CardItems
                handleOnPress={ () => isVendorMode
                  ? navigation.navigate("vendorHomeScreen", { screen: "Orders" })
                  : navigation.navigate("ordersScreen")
                }
                title={ isVendorMode ? "Order Requests" : "My Orders" }
                icon={ <Receipt21 color="gray" /> }
              />

              { !isVendorMode && (
                <CardItems
                  handleOnPress={ () => navigation.navigate("savedMeasurementsScreen") }
                  title="Measurements"
                  icon={ <Ruler color="gray" /> }
                />
              ) }

              {/* Points & Vouchers */}
              <CardItems
                handleOnPress={ () => {
                  navigation.navigate("pointAndVoucherScreen", {
                    from: "Profile Screen",
                    code: ""
                  });
                } }
                title="Points & Vouchers"
                icon={ <Ticket color="gray" /> }
              />

              {/* Reviews & Rating */}
              <CardItems
                handleOnPress={ () => navigation.navigate("reviewAndRatingScreen") }
                title="Reviews & Rating"
                icon={ <Like1 color="gray" /> }
              />

              {/* Settings */}
              <CardItems
                handleOnPress={ () => navigation.navigate("settingsScreen") }
                title="Settings"
                icon={ <Setting2 color="gray" /> }
              />

              {/* Help and support */}
              <CardItems
                handleOnPress={ () => navigation.navigate("contactSupportScreen") }
                title="Help and support"
                icon={ <Headphone color="gray" /> }
              />

              {/* Logout */}
              { !userData.isGuest && (
                <CardItems
                  handleOnPress={ () => signOutUser() }
                  title="Logout"
                  icon={ <Logout color="gray" /> }
                />
              ) }
            </View>
          </View>
          
        </ScrollView>
      </SafeAreaView>

      { isLoading &&
        <AppLoader loadingAdditionalMessage={ loadingMessage } />
      }

    </GestureHandlerRootView>
  )
}

export default ProfileScreen;

interface ICardItemProps {
  handleOnPress: () => void;
  title: string;
  icon: React.ReactNode;
}

const CardItems = (props: ICardItemProps) => {
  const { handleOnPress, title, icon } = props;
  return (
    <TouchableOpacity onPress={ handleOnPress }>
      <View className="h-auto w-full mb-4 flex-row items-center justify-between">
        <View className="h-auto w-fit flex-row items-center gap-x-4">
          <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
            { icon }
          </View>
          <Text className="text-lg text-gray-700">{ title }</Text>
        </View>
        <ArrowRight2 size={ 24 } className="text-gray-700" />
      </View>
    </TouchableOpacity>
  );
};