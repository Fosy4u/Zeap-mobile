import React from 'react'
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {ImageBackground, SafeAreaView, StatusBar, Text, TouchableOpacity, View} from 'react-native'
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";

interface Props {
    /* Optional override — left out, the modal shows the standard submit
       confirmation copy (kept in step with the web's confirm dialog). */
    bodyText?: string;
    screenURL: keyof RootNavigationStackModel;
    setShowWarningModal:  React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmitProduct: () => void;
};

/* Submit-confirmation copy, matching the web confirm dialog wording. */
const SUBMIT_WARNING_TITLE = "Are you sure you want to submit this product?";
const SUBMIT_WARNING_BODY =
    "This will change the status of the product to under review and seller will not be able to edit the product without contacting the admin except for the variation";

const WarningPopupModal: React.FC<Props> = ({ bodyText, screenURL, setShowWarningModal, handleSubmitProduct }) => {
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
            {/* Height follows the copy — the web wording runs several lines,
                which the old fixed 340px box clipped. */}
            <View className="h-auto w-[320px] pb-5 rounded-2xl bg-white">
                <ImageBackground
                    source={require("../../../../../assets/images/warning_modal_image.png")}
                    resizeMode="contain"
                    className="h-[120px] w-full p-3 flex items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-baseGreen"
                    imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                />
                <View className="px-4 pt-5 pb-2 items-center justify-center">
                    <Text className="w-full font-montserratSemiBold text-base text-center text-gold">
                        { SUBMIT_WARNING_TITLE }
                    </Text>
                    <Text className="h-auto w-full mt-2.5 font-montserratMedium text-sm text-center leading-5">
                        { bodyText ?? SUBMIT_WARNING_BODY }
                    </Text>

                    <View className="h-auto w-full mt-5 flex-row">
                        <TouchableOpacity
                            onPress={ () => setShowWarningModal(false) }
                            className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-red-50"
                        >
                            <Text className="font-montserratMedium text-red-700">No, cancel</Text>
                        </TouchableOpacity>
                        <View className="w-[10px]"/>

                        <TouchableOpacity
                            onPress={ () => handleSubmitProduct() }
                            className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="font-montserratRegular text-white">Yes, I'm sure</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default WarningPopupModal;