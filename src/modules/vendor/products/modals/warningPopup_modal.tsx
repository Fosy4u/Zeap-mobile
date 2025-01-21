import React, {Dispatch, SetStateAction} from 'react'
import {useNavigation} from '@react-navigation/native';
import {ArrowRight} from 'iconsax-react-native';
import {useDispatch} from 'react-redux';
import {Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View} from 'react-native'
import FastImage from 'react-native-fast-image';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";

interface Props {
    bodyText: string;
    screenURL: keyof RootNavigationStackModel;
    setShowWarningModal:  React.Dispatch<React.SetStateAction<boolean>>;
};

const WarningPopupModal: React.FC<Props> = ({bodyText, screenURL, setShowWarningModal}) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const screenName = (screenURL === "profileSetupScreen")
        ? ("Setup") : (screenURL === "loginScreen")
            ? ("Login") : ("Shop");
    const url = (screenURL === "profileSetupScreen")
        ? ("profileSetupScreen") : (screenURL === "loginScreen")
            ? ("loginScreen") : ("shopSetupScreen");


    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />

            <View className="h-full w-full absolute inset-0 bg-black opacity-60"/>
            <View className="h-[340px] w-[320px] rounded-2xl bg-white">
                <View
                    className="h-[120px] w-full p-3 flex items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-baseGreen">
                    <Image
                        className="h-auto w-auto"
                        resizeMode="cover"
                        source={require("../../../../../assets/images/warning_modal_image.png")}
                    />
                    <FastImage
                        className="h-full w-full absolute"
                        source={require("../../../../../assets/images/success_animation.gif")}
                    />
                </View>
                <View className="px-4 pb-2 flex-1 items-center justify-center">
                    <Text className="font-montserratSemiBold text-xl text-gold">Hold Up</Text>
                    <Text className="h-auto w-full mx-7 mt-2.5 font-montserratMedium text-center leading-5">
                        {bodyText}
                    </Text>

                    <View className="h-auto w-full mt-8 flex-row">
                        <TouchableOpacity
                            onPress={ () => setShowWarningModal(false) }
                            className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-red-50"
                        >
                            <Text className="font-montserratMedium text-red-700">No, Cancel</Text>
                        </TouchableOpacity>
                        <View className="w-[10px]"/>

                        <TouchableOpacity
                            onPress={() => null}
                            className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="font-montserratRegular text-white">Yes, Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default WarningPopupModal;