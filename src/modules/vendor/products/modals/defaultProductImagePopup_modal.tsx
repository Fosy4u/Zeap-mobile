import React from 'react';
import {Image, ImageBackground, SafeAreaView, StatusBar, Text, TouchableOpacity, View} from 'react-native'

interface Props {
    bodyText: string;
    setShowDefaultImageModal:  React.Dispatch<React.SetStateAction<boolean>>;
    handleSetDefaultImage: () => void;
};

const DefaultProductImagePopupModal: React.FC<Props> = ({ bodyText, setShowDefaultImageModal, handleSetDefaultImage }) => {


    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />

            <View className="h-full w-full absolute inset-0 bg-black opacity-60"/>
            <View className="h-[340px] w-[320px] rounded-2xl bg-white">
                <ImageBackground
                    source={require("../../../../../assets/images/warning_modal_image.png")}
                    resizeMode="contain"
                    className="h-[120px] w-full p-3 flex items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-baseGreen"
                    imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                />
                <View className="px-4 pb-2 flex-1 items-center justify-center">
                    <Text className="font-montserratSemiBold text-xl text-gold">Default Image</Text>
                    <Text className="h-auto w-full mx-7 mt-2.5 font-montserratMedium text-center leading-5">
                        {bodyText}
                    </Text>

                    <View className="h-auto w-full mt-5 flex-row">
                        <TouchableOpacity
                            onPress={ () => setShowDefaultImageModal(false) }
                            className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-red-50"
                        >
                            <Text className="font-montserratMedium text-red-700">No, Cancel</Text>
                        </TouchableOpacity>
                        <View className="w-[10px]"/>

                        <TouchableOpacity
                            onPress={ () => handleSetDefaultImage() }
                            className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="font-montserratRegular text-white">Yes, I'm Sure</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default DefaultProductImagePopupModal;