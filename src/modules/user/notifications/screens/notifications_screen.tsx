import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ArrowLeft } from 'iconsax-react-native';

const UserNotificationsScreen = () => {
    const { notifications } = useSelector((state: RootState) => state.notificationsState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    return (
        <SafeAreaView className="h-auto w-full flex-1 pb-24 px-5 pt-2 bg-lightGray">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />

            {/* ==== Header ==== */}
            <View className="h-auto w-full py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={ () => navigation.pop() }>
                    <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                    <TouchableOpacity onPress={ () => navigation.pop() }>
                    <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                        <ArrowLeft color="white" />
                    </View>
                </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <Text className="font-semibold text-lg text-baseGreen">Notifications</Text>
                
                <View className="h-[40px] w-[40px]" />
            </View>

            {/*==== Notification List ====*/}
            <ScrollView
                showsVerticalScrollIndicator={false} 
                className="h-auto w-full flex-1 pt-[20px]"
            >
                { notifications.length !== 0
                    ? notifications.map((notification, index) => (
                        <TouchableOpacity key={ index } 
                            onPress={ () => {
                                // navigation.navigate("notificationDetailScreen", { notificationID: notification.id });
                            } }
                        >
                            <View key={ index } className="h-auto w-full  mt-4 p-4 flex-row rounded-xl border border-gray-200 bg-[#F8F9FE]">
                                <Image
                                    className="h-[45px] w-[45px] rounded-2xl"
                                    resizeMode="cover"
                                    source={ 
                                        notification.type === "Order"
                                        ? require("../../../../../assets/images/order_notification.png")
                                        : notification.type === "Payment"
                                        ? require("../../../../../assets/images/payment_notification.png")
                                        : notification.type === "Dispatch"
                                        ? require("../../../../../assets/images/dispatch_notification.png")
                                        : require("../../../../../assets/images/app_logo.png")
                                    }
                                />
                                <View className="flex-1 ml-3">
                                    <Text className="font-medium text-base text-baseGreen">{ notification.title }</Text>
                                    <Text className="mt-1 text-sm text-gray-600">{ notification.description }</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                    : <View className="h-[300px] w-full flex-1 items-center justify-center">
                        <Text className="text-lg">No notification available</Text>  
                    </View> }
            </ScrollView>
        </SafeAreaView>
    );
};

export default UserNotificationsScreen;