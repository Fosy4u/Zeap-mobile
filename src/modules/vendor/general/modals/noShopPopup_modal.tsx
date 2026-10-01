import React from "react";
import {
    ActivityIndicator,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { ArrowLeft, Home2, MessageQuestion, Refresh2, ShopAdd, ShopRemove } from "iconsax-react-native";
import { RootState } from "../../../../redux/store/store";
import RootNavigationStackModel from "../../../../routes/model/routes_model";

interface IProps {
    /* Re-runs the /shop/auth check. Left out, "Try again" is hidden. */
    onRetry?: () => void;
    isRetrying?: boolean;
    /* Copy overrides, for callers that know more than this modal can infer. */
    title?: string;
    message?: string;
}

interface IReasonProps {
    icon: string;
    text: string;
}

/* Emoji marker plus flowing copy, following the vendor welcome screen so the
   two "what happens next" states read as one family. */
const Reason: React.FC<IReasonProps> = ({ icon, text }) => (
    <View className="mt-2.5 flex-row items-start">
        <Text className="text-xs leading-5">{ icon }</Text>
        <Text className="ml-2 flex-1 font-montserratMedium text-xs text-gray-700 leading-5">
            { text }
        </Text>
    </View>
);

const NoShopPopupModal: React.FC<IProps> = ({ onRetry, isRetrying, title, message }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { userData } = useSelector((state: RootState) => state.profileState);

    /* Flagged as a seller but no shop came back, so there WAS one — creating
       another isn't the fix; talking to an admin is. */
    const wasSeller = !!userData?.isVendor || !!userData?.shopId;

    const heading = title ?? (wasSeller ? "We Can't Find Your Shop" : "You don't have a Shop");
    const body = message ?? (wasSeller
        ? "Your account is registered as a seller, but we couldn't load any shop details for it. This usually means the shop has been closed or terminated."
        : "We couldn't find any shop associated with your account. To start selling on Zeaper, you need to create a shop.");

    /* Falls back to the marketplace when nothing is behind us on the stack, so
       "Go back" can never be a dead button. */
    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }
        navigation.reset({ index: 0, routes: [{ name: "homeScreen", params: { screen: "Home" } }] });
    };

    const handleGoHome = () => {
        navigation.reset({ index: 0, routes: [{ name: "homeScreen", params: { screen: "Home" } }] });
    };

    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />

            <View className="h-full w-full absolute inset-0 bg-black opacity-60" />

            {/* h-auto so the card follows its copy — the reasons and actions
                both vary with the case being explained. */}
            <View className="h-auto w-[330px] max-h-[88%] rounded-3xl bg-white overflow-hidden">

                {/*==== Header ====*/}
                <ImageBackground
                    source={ require("../../../../../assets/images/warning_modal_image.png") }
                    resizeMode="contain"
                    className="h-[110px] w-full items-center justify-center bg-baseGreen"
                >
                    <View className="h-[66px] w-[66px] items-center justify-center rounded-full bg-white/10">
                        <ShopRemove size={ 34 } color="#D5B07B" variant="Bold" />
                    </View>
                </ImageBackground>

                {/* flexShrink lets the body scroll once the copy outgrows the
                    card's max height — RN defaults it to 0, which clips. */}
                <ScrollView
                    showsVerticalScrollIndicator={ false }
                    style={{ flexShrink: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }}
                >
                    <Text className="w-full font-montserratSemiBold text-lg text-center text-baseGreen">
                        { heading }
                    </Text>

                    <Text className="w-full mt-2.5 font-montserratMedium text-sm text-center text-gray-600 leading-5">
                        { body }
                    </Text>

                    {/*==== Why this happens ====*/}
                    <View className="w-full mt-4 p-3.5 rounded-2xl border border-yellow-200 bg-lightGold">
                        <Text className="font-montserratSemiBold text-xs text-baseGreen">
                            Why you're seeing this
                        </Text>

                        { wasSeller ? (
                            <>
                                <Reason icon="🚫" text="Your shop may have been terminated or disabled by an admin." />
                                <Reason icon="⏳" text="It may still be under review, and isn't available to open yet." />
                                <Reason icon="📶" text="Or we simply couldn't reach the shop right now — try again below." />
                            </>
                        ) : (
                            <>
                                <Reason icon="🛍️" text="You haven't created a shop on this account yet." />
                                <Reason icon="👤" text="Or your shop belongs to a different account — check which one you're signed in with." />
                            </>
                        ) }
                    </View>

                    {/*==== Primary action ====*/}
                    { wasSeller ? (
                        <TouchableOpacity
                            onPress={ () => navigation.navigate("contactSupportScreen") }
                            activeOpacity={ 0.85 }
                            className="h-[52px] w-full mt-5 flex-row items-center justify-center rounded-2xl bg-baseGreen"
                        >
                            <MessageQuestion size={ 18 } color="#FFFFFF" variant="Bold" />
                            <Text className="ml-2 font-montserratSemiBold text-sm text-white">Contact Admin</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={ () => navigation.navigate("vendorOnboardingScreen") }
                            activeOpacity={ 0.85 }
                            className="h-[52px] w-full mt-5 flex-row items-center justify-center rounded-2xl bg-baseGreen"
                        >
                            <ShopAdd size={ 18 } color="#FFFFFF" variant="Bold" />
                            <Text className="ml-2 font-montserratSemiBold text-sm text-white">Create a Shop</Text>
                        </TouchableOpacity>
                    ) }

                    {/*==== Retry ====*/}
                    { onRetry && (
                        <TouchableOpacity
                            onPress={ onRetry }
                            disabled={ isRetrying }
                            activeOpacity={ 0.85 }
                            className={ `h-[52px] w-full mt-3 flex-row items-center justify-center rounded-2xl bg-lightGreen ${ isRetrying ? "opacity-60" : "" }` }
                        >
                            { isRetrying ? (
                                <ActivityIndicator color="#133522" size="small" />
                            ) : (
                                <Refresh2 size={ 18 } color="#133522" variant="Bold" />
                            ) }
                            <Text className="ml-2 font-montserratSemiBold text-sm text-baseGreen">
                                { isRetrying ? "Checking…" : "Try again" }
                            </Text>
                        </TouchableOpacity>
                    ) }

                    {/*==== Escape hatches ====*/}
                    <View className="h-auto w-full mt-3 flex-row">
                        <TouchableOpacity
                            onPress={ handleGoBack }
                            activeOpacity={ 0.85 }
                            className="h-[48px] flex-1 flex-row items-center justify-center rounded-2xl bg-gray-100"
                        >
                            <ArrowLeft size={ 16 } color="#133522" />
                            <Text className="ml-1.5 font-montserratMedium text-sm text-baseGreen">Go back</Text>
                        </TouchableOpacity>
                        <View className="w-[10px]" />

                        <TouchableOpacity
                            onPress={ handleGoHome }
                            activeOpacity={ 0.85 }
                            className="h-[48px] flex-1 flex-row items-center justify-center rounded-2xl bg-gold"
                        >
                            <Home2 size={ 16 } color="#133522" variant="Bold" />
                            <Text className="ml-1.5 font-montserratMedium text-sm text-baseGreen">Marketplace</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default NoShopPopupModal;
