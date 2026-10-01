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
    // productId of the just-submitted product — "View Product" opens its details.
    productID?: string;
};

/* Product-submission copy, matching the web success dialog wording. */
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
            {/* Height follows the copy — the product message runs to three
                lines, which the old fixed 340px box clipped. */}
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

                    <View className="h-auto w-full mt-5 flex-row items-center justify-center space-x-2">
                        <TouchableOpacity
                            onPress={ () => {
                                setShowSuccessModal(false);
                                // Refresh the dashboard bell badge — the new
                                // submission generated an "under review" alert.
                                handleRefreshNotificationCount();
                                // Refresh the product listing + drafts so the
                                // new product shows without a manual reload.
                                handleRefreshProductList();
                                // Open the just-submitted product's details (it
                                // refetches by productId, so it shows the fresh
                                // "under review" status, not the stale draft).
                                // Fall back to the products list if no id.
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
                                // Refresh the dashboard bell badge before landing
                                // on the dashboard so the new count shows at once.
                                handleRefreshNotificationCount();
                                // Refresh the product listing + drafts so the
                                // new product shows without a manual reload.
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