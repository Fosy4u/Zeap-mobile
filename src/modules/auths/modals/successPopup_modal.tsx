import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { ArrowRight } from 'iconsax-react-native';
import { useDispatch } from 'react-redux';
import { Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import RootNavigationStackModel from '../../../routes/model/routes_model';

import { setShowSuccessModal } from '../../setting/slices/settings_slice';

interface Props {
    bodyText: string;
    screenURL: keyof RootNavigationStackModel;
};

const SuccessPopupModal: React.FC<Props> = ({ bodyText, screenURL }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const destinationScreen = (screenURL === "profileSetupScreen") 
        ? ("Setup") : (screenURL === "loginScreen") 
        ? ("Login") : ("Shop");
    

    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />
        
            <View className="h-full w-full absolute inset-0 bg-black opacity-60" />
            <View className="h-[320px] w-[320px] rounded-2xl bg-white">
                <View className="h-[120px] w-full p-3 flex items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-baseGreen">
                    <Image
                        className="h-auto w-auto"
                        resizeMode="cover"
                        source={require("../../../assets/success_modal_image.png")}
                    />
                    <FastImage
                       className="h-full w-full absolute"
                        source={require("../../../assets/success_animation.gif")}
                    />
                </View>
                <View className="flex-1 items-center justify-center">
                    <Text className="font-semibold text-xl text-green-600">Congratulations</Text>
                    <Text className="mx-7 mt-2.5 text-center text-base leading-5">
                        { bodyText }
                    </Text>
                    
                    <TouchableOpacity 
                        onPress={ () => {
                            dispatch(setShowSuccessModal(false));
                            navigation.navigate(screenURL);
                        } }
                        className="h-[50px] w-auto mt-5 px-8 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                        <Text className="text-base text-white mr-2">Proceed To { destinationScreen }</Text>
                        <ArrowRight className="text-white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default SuccessPopupModal;