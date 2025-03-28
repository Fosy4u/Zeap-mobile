import React from 'react'
import {useNavigation} from '@react-navigation/native';
import {ArrowRight} from 'iconsax-react-native';
import {Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View} from 'react-native'
import FastImage from 'react-native-fast-image';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";

interface Props {
    bodyText: string;
    setShowSuccessModal:  React.Dispatch<React.SetStateAction<boolean>>;
};

const SuccessPopupModal: React.FC<Props> = ({bodyText, setShowSuccessModal}) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

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
                        source={require("../../../../../assets/images/success_modal_image.png")}
                    />
                    <FastImage
                        className="h-full w-full absolute"
                        source={require("../../../../../assets/images/success_animation.gif")}
                    />
                </View>
                <View className="px-3 flex-1 items-center justify-center">
                    <Text className="font-semibold text-xl text-green-600">Congratulations</Text>
                    <Text className="mx-2 mt-2.5 text-center text-base leading-5">
                        { bodyText }
                    </Text>

                    <View className="h-auto w-full mt-5 flex-row items-center justify-center space-x-2">
                        <TouchableOpacity 
                            onPress={ () => {
                                setShowSuccessModal(false);
                                navigation.navigate("vendorHomeScreen", { screen: "Products" });
                            } }
                            className="h-[50px] w-auto flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
                        >
                            <Text className="text-base text-baseGreen">View Products</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={ () => {
                                setShowSuccessModal(false);
                                navigation.navigate("vendorHomeScreen", { screen: "Dashboard" });
                            } }
                            className="h-[50px] w-auto flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-base text-white">Ok, Go Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default SuccessPopupModal;