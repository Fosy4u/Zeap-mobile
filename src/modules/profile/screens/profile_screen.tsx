import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowRight2, Bank, DocumentText1, Like1, Logout, Element3, Notification, Profile, Receipt21, Ruler, Setting2, Shop, Ticket } from 'iconsax-react-native';
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

const ProfileScreen = () => {
  const { userData } = useSelector((state: RootState) => state.profileState );
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.generalState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const route = useRoute();
  const dispatch = useDispatch();

  const isVendorMode = (route.params as { mode?: string } | undefined)?.mode === "vendor";

  const { signOutUser } = useLogoutHook();
  // console.log("USER DATA::: ", userData);

  const {
    handleGetDeliveryAddresses
  } = useAddressHook();

  const [getAuthShop] = useLazyGetAuthShopQuery();

  /* `isVendor` is the canonical shop-owner flag (defaults to false in the
     profile slice), so a plain buyer never qualifies for shop-owner items. */
  const isShopOwner = !!userData?.isVendor;

  /* Shop admin (Shop information, Bank details, Identity & shop document) is
     vendor-mode only — buyer mode stays a pure buyer view even for an owner. */
  const showShopAdmin = isVendorMode && isShopOwner;

  useEffect(() => {
    handleGetDeliveryAddresses();
  }, []);

  /* Refresh /shop/auth so Shop Information and Bank Details read live data even
     if the dashboard wasn't visited — only where those items are reachable. */
  useEffect(() => {
    if (!showShopAdmin) return;
    (async () => {
      try {
        const authShop = await getAuthShop().unwrap();
        if (authShop) dispatch(setShop(authShop));
      } catch {
        // Ignore — screens fall back to whatever shop data is already in store.
      }
    })();
  }, [showShopAdmin]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full w-full flex-1">

        <AppStatusBar backgroundColor={isVendorMode ? "#133522" : "transparent"} barStyle="light-content" />

        {/*==== Header ====
            Same bar in both modes — only the colours change. */}
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
              <UserAvatar
                photoURL={(userData as any).photoURL}
                firstName={userData.firstName}
                lastName={userData.lastName}
                displayName={(userData as any).displayName}
                email={userData.email}
                isGuest={!!userData.isGuest}
                seed={userData.uid || userData.email}
                size={80}
              />
              <Text className="mt-3 text-xl text-baseGreen">{ userData.firstName }</Text>
              <Text className="text-sm text-baseGreen">{ userData.email }</Text>
            </View>

            <View className="mt-5">

              {/* User Dashboard */}
              <CardItems
                handleOnPress={ () => navigation.navigate("userDashboardScreen") }
                title="My Dashboard"
                icon={ <Element3 color="gray" /> }
              />

              {/* My Shop — the way into the vendor side, so it only makes sense
                  in buyer mode; in vendor mode you are already there. */}
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

              {/* Shop admin — shop profile, payout bank details and uploaded
                  identity/shop documents, all sourced from /shop/auth. */}
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

              {/* Orders — in vendor mode this means the requests buyers placed
                  with the shop, not the orders this user placed as a buyer. */}
              <CardItems
                handleOnPress={ () => isVendorMode
                  ? navigation.navigate("vendorHomeScreen", { screen: "Orders" })
                  : navigation.navigate("ordersScreen")
                }
                title={ isVendorMode ? "Order Requests" : "My Orders" }
                icon={ <Receipt21 color="gray" /> }
              />

              {/* Measurements — a buyer's own sizing, irrelevant in vendor mode. */}
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
              {/* Hidden: the help & support screen is not wired up yet (the item
                  has no destination and does nothing when tapped). */}
              {/* <CardItems
                handleOnPress={ () => null }
                title="Help and support"
                icon={ <Headphone color="gray" /> }
              /> */}

              {/* Logout */}
              <CardItems
                handleOnPress={ () => signOutUser() }
                title="Logout"
                icon={ <Logout color="gray" /> }
              />
            </View>
          </View>
          
        </ScrollView>
      </SafeAreaView>

      {/* Full-screen overlay while signing out (logout hook flips `isLoading`). */}
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