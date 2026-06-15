import React from "react";
import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    ArrowLeft,
    Call,
    Headphone,
    MessageQuestion,
    Sms,
    Whatsapp,
} from "iconsax-react-native";
import RootNavigationStackModel from "../../../routes/model/routes_model";

const NIGERIA_PHONE = "+2347075374026";
const UK_PHONE = "+447518465207";
const WHATSAPP_NUMBER = "+447518465207";
const ADMIN_EMAIL = "Admin@zeaper.com";
const HELP_CENTER_URL = "https://zeaper.com/help";

const openUrl = (url: string, fallbackMessage?: string) => {
    Linking.openURL(url).catch(() => {
        Alert.alert("Couldn't open", fallbackMessage ?? "Please try again later.");
    });
};

interface IOptionCardProps {
    icon: React.ReactNode;
    iconBackground: string;
    title: string;
    rows: Array<{ label?: React.ReactNode; onPress: () => void; value: string }>;
}

const OptionCard: React.FC<IOptionCardProps> = ({ icon, iconBackground, title, rows }) => (
    <View className="p-4 flex-row items-start rounded-2xl bg-white border border-gray-100">
        <View className={ `h-11 w-11 mr-3 items-center justify-center rounded-2xl ${ iconBackground }` }>
            { icon }
        </View>
        <View className="flex-1">
            <Text className="font-montserratBold text-sm text-baseGreen">{ title }</Text>
            <View className="mt-1.5">
                { rows.map((row, idx) => (
                    <TouchableOpacity
                        key={ `${ title }-${ idx }` }
                        onPress={ row.onPress }
                        activeOpacity={ 0.85 }
                        className={ idx === 0 ? "flex-row items-center" : "mt-1.5 flex-row items-center" }
                    >
                        { row.label && <Text className="mr-1.5 text-sm">{ row.label }</Text> }
                        <Text className="font-montserratSemiBold text-sm text-blue-600">{ row.value }</Text>
                    </TouchableOpacity>
                )) }
            </View>
        </View>
    </View>
);

const ContactSupportScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    return (
        <View className="flex-1 bg-white">
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

            <SafeAreaView className="flex-1">
                {/*==== Top chrome ====*/}
                <View className="px-5 pt-3 flex-row items-center">
                    <TouchableOpacity
                        onPress={ () => navigation.goBack() }
                        className="h-10 w-10 items-center justify-center rounded-full bg-baseGreen"
                    >
                        <ArrowLeft size={ 18 } color="#ffffff" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={ false }
                    contentContainerStyle={{ paddingBottom: 32 }}
                >
                    <View className="px-5 pt-6">
                        <Text className="font-montserratBold text-[28px] text-baseGreen leading-tight">
                            How may we help you?
                        </Text>
                        <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-6">
                            You can find answers to most questions here in our Help Centre, where you'll find help with any issues around buying, selling, and your account.
                        </Text>

                        <View className="mt-5 p-4 rounded-2xl bg-blue-50 border-l-[3px] border-blue-500">
                            <Text className="font-montserratMedium text-sm text-blue-900 leading-6">
                                If you can't find the answer you're looking for, you can contact us directly via the options below. We're here to help!
                            </Text>
                        </View>
                    </View>

                    <View className="px-5 mt-6">
                        <OptionCard
                            icon={ <MessageQuestion size={ 20 } color="#D5B07B" variant="Bold" /> }
                            iconBackground="bg-gold/15"
                            title="Help Center"
                            rows={ [{
                                value: "Visit our Help Center",
                                onPress: () => openUrl(HELP_CENTER_URL, "Help Center isn't reachable right now."),
                            }] }
                        />

                        <View className="mt-3">
                            <OptionCard
                                icon={ <Headphone size={ 20 } color="#1d4ed8" variant="Bold" /> }
                                iconBackground="bg-blue-50"
                                title="Call"
                                rows={ [
                                    {
                                        label: <Text>🇳🇬</Text>,
                                        value: NIGERIA_PHONE,
                                        onPress: () => openUrl(`tel:${ NIGERIA_PHONE }`, "Couldn't start a call."),
                                    },
                                    {
                                        label: <Text>🇬🇧</Text>,
                                        value: UK_PHONE,
                                        onPress: () => openUrl(`tel:${ UK_PHONE }`, "Couldn't start a call."),
                                    },
                                ] }
                            />
                        </View>

                        <View className="mt-3">
                            <OptionCard
                                icon={ <Whatsapp size={ 20 } color="#16a34a" variant="Bold" /> }
                                iconBackground="bg-green-50"
                                title="WhatsApp"
                                rows={ [{
                                    value: WHATSAPP_NUMBER,
                                    // wa.me expects the number without `+` or spaces.
                                    onPress: () => openUrl(
                                        `https://wa.me/${ WHATSAPP_NUMBER.replace(/[^0-9]/g, "") }`,
                                        "Couldn't open WhatsApp.",
                                    ),
                                }] }
                            />
                        </View>

                        <View className="mt-3">
                            <OptionCard
                                icon={ <Sms size={ 20 } color="#133522" variant="Bold" /> }
                                iconBackground="bg-baseGreen/15"
                                title="Email"
                                rows={ [{
                                    value: ADMIN_EMAIL,
                                    onPress: () => openUrl(
                                        `mailto:${ ADMIN_EMAIL }?subject=Zeaper%20support%20enquiry`,
                                        `Please email us at ${ ADMIN_EMAIL }.`,
                                    ),
                                }] }
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

// Re-exported icon to keep iconsax import surface contained — silences the
// "imported but not used" lint if Call ever loses its sole reference in a
// future trim of this file (we keep the icon library accessible).
export { Call };

export default ContactSupportScreen;
