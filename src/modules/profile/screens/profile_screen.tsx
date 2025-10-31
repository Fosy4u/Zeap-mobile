import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ArrowRight2, Headphone, Like1, Logout, Element3, Notification, Profile, Receipt21, Ruler, Setting2, Ticket } from 'iconsax-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useLogoutHook from '../../auths/hooks/logout_hook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import AppLoader from '../../general/components/appLoader';
import useAddressHook from '../../user/address/hooks/address_hook';


const ProfileScreen = () => {
  const { userData } = useSelector((state: RootState) => state.profileState );
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.generalState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  
  const { signOutUser } = useLogoutHook();
  // console.log("USER DATA::: ", userData);

  const {
    handleGetDeliveryAddresses
  } = useAddressHook();

  useEffect(() => {
    handleGetDeliveryAddresses();
  }, []);


  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full w-full flex-1 px-5 pt-2 pb-20">

        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
        />

        {/*==== Header ====*/}
        <View className="h-auto w-full py-3 flex-row items-center justify-between">
          <View className="h-[40px] w-[40px]" />
          <Text className="font-semibold text-lg text-baseGreen">My Profile</Text>
          <TouchableOpacity
            className="bg-lightGreen p-2.5 rounded-full"
            onPress={ () => navigation.navigate(userData?.isVendor ? "vendorNotificationsScreen" : "userNotificationsScreen") }
          >
            <Notification color="#133522" size={24} variant="Bold" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >

          <View className="mt-5">

            {/*==== Profile Image ====*/}
            <View className="h-auto w-full py-7 flex-1 items-center rounded-2xl bg-[#F8F9FE]">
              <Image
                className="h-[80px] w-[80px] rounded-full"
                resizeMode="cover"
                source={require("../../../../assets/images/home/profile_image.png")}
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

              {/* Personal information */}
              <CardItems
                handleOnPress={ () => navigation.navigate("personalInformationScreen") }
                title="Personal information"
                icon={ <Profile color="gray" /> }
              />

              {/* Notifications */}
              <CardItems
                handleOnPress={ () => navigation.navigate(userData?.isVendor ? "vendorNotificationsScreen" : "userNotificationsScreen") }
                title="Notifications"
                icon={ <Notification color="gray" /> }
              />

              {/* Orders */}
              <CardItems
                handleOnPress={ () => navigation.navigate("ordersScreen") }
                title="Orders"
                icon={ <Receipt21 color="gray" /> }
              />

              {/* Measurements */}
              <CardItems
                handleOnPress={ () => navigation.navigate("measurementScreen") }
                title="Measurements"
                icon={ <Ruler color="gray" /> }
              />

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
                handleOnPress={ () => null }
                title="Help and support"
                icon={ <Headphone color="gray" /> }
              />

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