import React from 'react'
import {useNavigation} from '@react-navigation/native';
import {ImageBackground, SafeAreaView, StatusBar, Text, TouchableOpacity, View} from 'react-native'
import FastImage from 'react-native-fast-image';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";
import useSuccessPopupHook from "../hooks/successPopup_hook.ts";

interface Props {
    bodyText?: string;
    setShowSuccessModal:  React.Dispatch<React.SetStateAction<boolean>>;
    productID?: string;
};

const PRODUCT_SUCCESS_LINES = [
    "Your product has been successfully added to your shop.",
    "Our team will review it shortly before it goes live.",
    "You can check its status anytime in your shop dashboard.",
];

const SuccessPopupModal: React.FC<Props> = ({bodyText, setShowSuccessModal, productID}) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { handleRefreshNotificationCount, handleRefreshProductList } = useSuccessPopupHook();

    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />

            <View className="h-full w-full absolute inset-0 bg-black opacity-60"/>
            <View className="h-auto w-[320px] pb-5 rounded-2xl bg-white">
                <ImageBackground
                    source={require("../../../../../assets/images/success_modal_image.png")}
                    resizeMode="contain"
                    className="h-[120px] w-full p-3 flex items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-baseGreen"
                    imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                >
                    <FastImage
                        className="h-full w-full absolute"
                        source={require("../../../../../assets/images/success_animation.gif")}
                    />
                </ImageBackground>
                <View className="px-3 pt-5 items-center justify-center">
                    <Text className="font-semibold text-xl text-green-600">🎉 Congratulations!</Text>

                    { bodyText ? (
                        <Text className="mx-2 mt-2.5 text-center text-base leading-5">
                            { bodyText }
                        </Text>
                    ) : (
                        PRODUCT_SUCCESS_LINES.map((line) => (
                            <Text key={ line } className="mx-2 mt-2.5 text-center text-base leading-5">
                                { line }
                            </Text>
                        ))
                    ) }

                    { !bodyText && !!productID && (
                        <View className="w-full mt-5 px-3 py-4 items-center rounded-xl bg-green-50">
                            <Text className="text-center font-medium text-sm text-gray-800">🚀 Want to boost your new product’s visibility?</Text>
                            <Text className="mt-1 text-center text-xs text-gray-600 leading-4">Join our latest promotional campaign to reach more customers and drive early sales!</Text>
                            <TouchableOpacity
                                onPress={ () => {
                                    setShowSuccessModal(false);
                                    handleRefreshNotificationCount();
                                    handleRefreshProductList();
                                    navigation.navigate("promoScreen");
                                } }
                                className="h-[40px] mt-3 px-6 items-center justify-center rounded-xl bg-green-600"
                            >
                                <Text className="text-sm text-white">Join Promo</Text>
                            </TouchableOpacity>
                        </View>
                    ) }

                    <View className="h-auto w-full mt-5 flex-row items-center justify-center space-x-2">
                        <TouchableOpacity
                            onPress={ () => {
                                setShowSuccessModal(false);
                                handleRefreshNotificationCount();
                                handleRefreshProductList();
                                if (productID) {
                                    navigation.navigate("vendorProductDetailsScreen", { productID });
                                } else {
                                    navigation.navigate("vendorHomeScreen", { screen: "Products" });
                                }
                            } }
                            className="h-[50px] w-auto flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
                        >
                            <Text className="text-base text-baseGreen">View Product</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={ () => {
                                setShowSuccessModal(false);
                                handleRefreshNotificationCount();
                                handleRefreshProductList();
                                navigation.navigate("vendorHomeScreen", { screen: "Dashboard" });
                            } }
                            className="h-[50px] w-auto flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-base text-white">Go to Shop</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default SuccessPopupModal;