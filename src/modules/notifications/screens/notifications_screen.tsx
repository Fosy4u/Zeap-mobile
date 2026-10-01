import React, { useEffect, useRef } from 'react';
import AuthCheck from '../../auths/components/authCheck';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { Trash } from 'iconsax-react-native';
import AppHeaderComp from '../../vendor/general/components/appHeader_comp';
import useNotificationHook from '../hooks/notification_hook';
import formatDate from '../../../utils/formatDate';
import handleNotificationNavigation from '../utils/notificationNavigation';
import NotificationsSkeletonLoader from '../components/notificationsSkeletonLoader_component';
import AppStatusBar from "../../general/components/appStatusBar";

const UserNotificationsScreen = () => {
    const { notifications, isLoading } = useSelector((state: RootState) => state.notificationsState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    // Call the Notification Hook
    const { handleDeleteNotification, handleMarkAllAsRead, handleMarkNotificationAsSeen } = useNotificationHook();

    // Mark the inbox as read once, the first time it has loaded — clears the
    // dashboard bell badge. Guarded with a ref so it fires a single time.
    const hasMarkedAsRead = useRef(false);
    useEffect(() => {
        if (!hasMarkedAsRead.current && notifications.length > 0) {
            hasMarkedAsRead.current = true;
            handleMarkAllAsRead();
        }
    }, [notifications]);

    // Newest first — sort a copy so the redux array isn't mutated. The backend
    // returns them oldest→newest, which read upside down on screen.
    const sortedNotifications = [...notifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <SafeAreaView className="h-auto w-full pb-1 flex-1 bg-lightGray">
            <AppStatusBar backgroundColor="#133522" barStyle="light-content" />

            {/* ==== Header ==== */}
            <AppHeaderComp title="Notifications" />

            {/*==== Notification List ====*/}
            { (isLoading && notifications.length === 0) ? (
                <NotificationsSkeletonLoader />
            ) : (
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="h-auto w-full px-5 pt-[20px] flex-1"
            >
                { sortedNotifications.length !== 0
                    ? sortedNotifications.map((notification) => (
                        <TouchableOpacity key={ notification._id }
                            onPress={ () => {
                                // Always fire — local seen:true is optimistic, so it can't gate the call.
                                handleMarkNotificationAsSeen(notification._id);
                                handleNotificationNavigation(notification.data);
                            } }
                        >
                            <View className="h-auto w-full mt-4 p-4 rounded-xl border border-gray-200 bg-[#F8F9FE]">
                                <View className="h-auto w-full flex-row items-start justify-start">
                                    <Image
                                        className="h-[45px] w-[45px] mt-1.5 rounded-2xl"
                                        resizeMode="cover"
                                        source={ 
                                            notification.image ? { uri: notification.image } : notification.title.includes("Order") || notification.title.includes("order")
                                            ? require("../../../../assets/images/order_notification.png")
                                            : notification.title.includes("Payment") || notification.title.includes("payment")
                                            ? require("../../../../assets/images/payment_notification.png")
                                            : notification.title.includes("Dispatch") || notification.title.includes("dispatch")
                                            ? require("../../../../assets/images/dispatch_notification.png")
                                            : require("../../../../assets/images/app_logo_green.png")
                                        }
                                    />
                                    <View className="flex-1 ml-3">
                                        <Text className="font-medium text-base text-baseGreen">{ notification.title }</Text>
                                        <Text className="mt-1 text-sm text-gray-600">{ notification.body }</Text>
                                    </View>
                                </View>

                                <View className="h-auto w-full mt-2 flex-row items-end justify-between">
                                    <Text className="ml-4">{ formatDate(notification.createdAt) }</Text>
                                    <TouchableOpacity
                                        onPress={ () => handleDeleteNotification(notification._id) }
                                        className="bg-red-100 p-2.5 rounded-full"
                                    >
                                        <Trash size={ 18 } className="text-red-700" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                    : <View className="h-[300px] w-full flex-1 items-center justify-center">
                        <Text className="text-lg">No notification available</Text>  
                    </View>
                }
                <View className="h-10" />
            </ScrollView>
            ) }
        </SafeAreaView>
    );
};

// Loading fallback shown while AuthCheck runs its token refresh — mirrors the
// real screen's chrome (status bar + header) with the notification-shaped
// skeleton in the body, so the user never sees a blank white screen on the way
// in. Once the auth check passes, the screen below shows the same skeleton
// while the inbox fetch is in flight.
const NotificationsLoadingScreen = () => (
    <SafeAreaView className="h-auto w-full pb-1 flex-1 bg-lightGray">
        <AppStatusBar backgroundColor="#133522" barStyle="light-content" />
        <AppHeaderComp title="Notifications" />
        <NotificationsSkeletonLoader />
    </SafeAreaView>
);

export default AuthCheck(UserNotificationsScreen, NotificationsLoadingScreen);