import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ArrowLeft } from 'iconsax-react-native'
import { Pressable, SafeAreaView, StatusBar, Text, View } from 'react-native'
import RootNavigationStackModel from '../../../../routes/model/routes_model'

const NotificationsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    return (
        <SafeAreaView className='flex-1 h-auto w-screen pb-24 bg-gray-50'>
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
                />


            {/* ==== Header Section ==== */}
            <View className="h-[120px] w-full pt-4 px-5 rounded-b-3xl bg-baseGreen">

                <View className="h-auto w-full flex-row items-center justify-between ">
                    <Pressable
                        className="bg-[#20704329] p-2.5 rounded-xl"
                        onPress={ () => navigation.navigate("notificationsScreen") }
                    >
                        <ArrowLeft color="#D5B07B" size={24} />
                    </Pressable>
                    
                    <Text className="font-normal text-xl text-white">Notifications</Text>

                    <View className="px-4" />
                </View>
                
            </View>
        </SafeAreaView>
    )
}

export default NotificationsScreen