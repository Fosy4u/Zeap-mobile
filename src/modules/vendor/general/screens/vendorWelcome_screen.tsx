import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DocumentUpload, MessageQuestion } from "iconsax-react-native";
import RootNavigationStackModel from "../../../../routes/model/routes_model";

interface IBulletProps {
    icon: string;
    text: React.ReactNode;
}

const Bullet: React.FC<IBulletProps> = ({ icon, text }) => (
    <View className="mt-5 flex-row items-start">
        <Text className="text-base leading-5">{ icon }</Text>
        <Text className="ml-2 flex-1 font-montserratMedium text-sm text-gray-700 leading-6">
            { text }
        </Text>
    </View>
);

const VendorWelcomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    return (
        <View className="flex-1 bg-white">
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

            <SafeAreaView className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={ false }
                    contentContainerStyle={{ paddingBottom: 32 }}
                >
                    <View className="px-5 pt-6">
                        {/*==== Headline ====*/}
                        <Text className="font-montserratBold text-[24px] text-baseGreen leading-tight">
                            Thank You for Signing Up!
                        </Text>

                        {/*==== Next-step yellow banner ====*/}
                        <View className="mt-5 p-4 rounded-2xl border border-yellow-200 bg-yellow-50">
                            <Text className="font-montserratMedium text-sm text-black leading-6">
                                <Text className="font-montserratBold">Next Step:</Text> Upload Your Documents by clicking on the <Text className="font-montserratBold text-green-700">"Upload Documents"</Text> button below.
                            </Text>
                        </View>

                        {/*==== Welcome paragraph ====*/}
                        <Text className="mt-6 font-montserratMedium text-sm text-gray-700 leading-6">
                            Welcome to <Text className="font-montserratBold text-black">Zeaper</Text>. Your shop has been successfully created and your account is now <Text className="font-montserratBold text-black">under review</Text>.
                        </Text>

                        {/*==== Locked-account info banner ====*/}
                        <View className="mt-5 p-4 flex-row items-start rounded-2xl bg-blue-50 border-l-[3px] border-blue-500">
                            <Text className="text-base">🔒</Text>
                            <Text className="ml-2 flex-1 font-montserratMedium text-sm text-blue-900 leading-6">
                                During this period, your account will remain disabled until verification is complete.
                            </Text>
                        </View>

                        {/*==== Bullet list ====*/}
                        <Bullet
                            icon="⏳"
                            text={
                                <>To complete your verification quickly and start selling, please upload your documents immediately.</>
                            }
                        />
                        <Bullet
                            icon="📩"
                            text={
                                <Text className="font-montserratBold text-black">
                                    Please keep an eye on your email for subsequent communication from Zeaper.
                                </Text>
                            }
                        />
                        <Bullet
                            icon="✅"
                            text={
                                <>We will activate your shop once we have reviewed the information you provided and the documents you uploaded. An admin will be in contact with you if we need any further information.</>
                            }
                        />
                        <Bullet
                            icon="📞"
                            text={
                                <>Kindly contact our team if your shop is not activated within <Text className="font-montserratBold text-black">48 hours</Text> after uploading your documents or if you have any enquiries.</>
                            }
                        />
                    </View>

                    {/*==== Actions ====*/}
                    <View className="px-5 mt-8">
                        <TouchableOpacity
                            onPress={ () => navigation.navigate("vendorDocumentUploadScreen") }
                            activeOpacity={ 0.85 }
                            className="h-14 flex-row items-center justify-center rounded-2xl bg-green-600"
                        >
                            <DocumentUpload size={ 18 } color="#ffffff" variant="Bold" />
                            <Text className="ml-2 font-montserratBold text-base text-white">Upload Documents</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={ () => navigation.navigate("contactSupportScreen") }
                            activeOpacity={ 0.85 }
                            className="mt-3 h-14 flex-row items-center justify-center rounded-2xl bg-baseGreen"
                        >
                            <MessageQuestion size={ 18 } color="#ffffff" variant="Bold" />
                            <Text className="ml-2 font-montserratBold text-base text-white">Contact Admin</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={ () => navigation.reset({ index: 0, routes: [{ name: "vendorHomeScreen", params: { screen: "Dashboard" } }] }) }
                            activeOpacity={ 0.85 }
                            className="mt-3 h-14 items-center justify-center rounded-2xl bg-gray-100"
                        >
                            <Text className="font-montserratSemiBold text-base text-baseGreen">Go to Vendor Home</Text>
                        </TouchableOpacity>

                        {/* Temporary escape hatch into the buyer-side home — handy while
                            the post-signup verification UX is still being shaped. */}
                        <TouchableOpacity
                            onPress={ () => navigation.reset({ index: 0, routes: [{ name: "homeScreen", params: { screen: "Home" } }] }) }
                            activeOpacity={ 0.85 }
                            className="mt-3 h-14 items-center justify-center rounded-2xl bg-gray-100"
                        >
                            <Text className="font-montserratSemiBold text-base text-baseGreen">Go to Marketplace</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default VendorWelcomeScreen;
