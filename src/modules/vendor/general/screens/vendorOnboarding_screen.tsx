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
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootState } from "../../../../redux/store/store";
import {
    ArrowLeft,
    ArrowRight,
    Bag,
    Chart,
    ClipboardTick,
    Global,
    Headphone,
    Note1,
    People,
    PlayCircle,
    Profile2User,
    Scissor,
    Shop,
    ShoppingCart,
    TickCircle,
    Truck,
    Wallet,
} from "iconsax-react-native";

import RootNavigationStackModel from "../../../../routes/model/routes_model";

// Tapping the video card opens the onboarding video in the native YouTube
// app (or the browser if not installed). The `&t=6s` jumps a few seconds in
// to skip the static intro frame.
const VENDOR_VIDEO_URL = "https://www.youtube.com/watch?v=gguCDZpJQT4&t=6s";

interface ICard {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
}

const partnerCards: ICard[] = [
    { icon: Chart,        title: "Grow Your Revenue",   description: "Boost your sales with access to a growing customer base." },
    { icon: Global,       title: "Global Reach",        description: "Expand beyond borders and reach customers worldwide instantly." },
    { icon: TickCircle,   title: "Simple & Efficient",  description: "A smooth vendor dashboard designed to save you time and effort." },
    { icon: Truck,        title: "Seamless Logistics",  description: "We handle the logistics for you — from order to delivery, stress-free." },
    { icon: Headphone,    title: "Dedicated Support",   description: "Our team is here to guide you at every stage of your journey." },
    { icon: Profile2User, title: "Community Access",    description: "Join a thriving fashion ecosystem of creators and entrepreneurs." },
];

const sellingCards: ICard[] = [
    { icon: Shop,           title: "Easy Setup",          description: "Setting up your store on Zeaper is quick and easy. Start selling in no time." },
    { icon: ClipboardTick,  title: "Business Activation", description: "Our admin team reviews your application and activates your business." },
    { icon: Note1,          title: "List",                description: "Add your products and showcase them beautifully to eager shoppers." },
    { icon: People,         title: "Sell",                description: "Share with millions of customers and grow your brand visibility." },
    { icon: Truck,          title: "We Deliver",          description: "Sit back and relax while we handle the delivery logistics for you." },
    { icon: Wallet,         title: "Get Paid",            description: "Receive your payments quickly and securely after every sale." },
];

interface IAudienceCard {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
}

const audienceCards: IAudienceCard[] = [
    { icon: Scissor,      title: "Bespoke Fashion",     description: "Tailors, shoemakers, and custom fashion creators can showcase unique, made-to-measure designs." },
    { icon: ShoppingCart, title: "Ready-to-Wear",       description: "Sell stylish, curated collections that are ready to be shipped instantly to customers." },
    { icon: Bag,          title: "Accessories & More",  description: "From shoes to bags and beyond — our marketplace welcomes all fashion categories." },
];

const VendorOnboardingScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { shop } = useSelector((state: RootState) => state.vendorGeneralState);

    // A populated `shopId` is the cheapest "the user already has a shop" check
    // — the slice's initial state has shopId as "". Status "new" means the
    // post-create welcome / document-upload flow is still pending, so we send
    // the user back there; any other status means a verified shop, so jump
    // straight to the dashboard.
    const hasShop = !!shop?.shopId;
    const shopStatus = (shop as any)?.status;
    const isNewShop = hasShop && shopStatus === "new";

    const handleOpenVideo = () => {
        Linking.openURL(VENDOR_VIDEO_URL).catch(() => {
            Alert.alert("Video unavailable", "Could not open the onboarding video. Please try again later.");
        });
    };

    // BECOME A VENDOR pushes the user into the 9-step registration stepper.
    const handleBecomeVendor = () => {
        navigation.navigate("vendorRegistrationScreen");
    };

    // MY SHOP — shown when the user already has a shop. Routes to the welcome
    // screen if their shop status is "new" (pending document upload / review),
    // otherwise drops them on the vendor dashboard.
    const handleMyShop = () => {
        if (isNewShop) {
            navigation.navigate("vendorWelcomeScreen");
        } else {
            navigation.navigate("vendorHomeScreen", { screen: "Dashboard" });
        }
    };

    const ctaLabel = hasShop ? "MY SHOP" : "BECOME A VENDOR";
    const onCtaPress = hasShop ? handleMyShop : handleBecomeVendor;

    return (
        <View className="flex-1 bg-baseGreen">
            <StatusBar backgroundColor="#0c1e15" barStyle="light-content" />

            <SafeAreaView className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={ false }
                    contentContainerStyle={{ paddingBottom: 48 }}
                >
                    {/*==== Header (back button) ====*/}
                    <View className="px-5 pt-3 flex-row items-center">
                        <TouchableOpacity onPress={ () => navigation.goBack() }>
                            <View className="h-[40px] w-[40px] items-center justify-center rounded-full bg-white/[0.1]">
                                <ArrowLeft color="#D5B07B" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/*==== Hero ====*/}
                    <View className="px-5 pt-6 pb-10 items-center">
                        <Text className="font-montserratBold text-3xl text-gold text-center" style={{ letterSpacing: 2 }}>
                            WELCOME VENDORS
                        </Text>
                        <Text className="mt-3 text-center text-sm text-white/80 leading-5">
                            Join Zeaper and become part of a global fashion marketplace that empowers creators, celebrates diversity, and delivers unmatched value to customers worldwide.
                        </Text>

                        {/* Commission promo pill — kept inset so the wrapped copy
                            on small phones doesn't kiss the screen edges. */}
                        <View className="mt-6 mx-3 px-4 py-3 flex-row items-center rounded-full bg-white">
                            <Text className="text-base">🎉</Text>
                            <Text className="mx-1.5 text-center text-xs text-gray-800">
                                <Text className="font-montserratSemiBold">0% Commission</Text>
                                <Text className="text-gray-600"> — Keep </Text>
                                <Text className="font-montserratSemiBold text-green-600">100%</Text>
                                <Text className="text-gray-600"> of your earnings during our launch phase!</Text>
                            </Text>
                            <Text className="text-base">🎉</Text>
                        </View>

                        {/* CTA */}
                        <TouchableOpacity
                            onPress={ onCtaPress }
                            className="mt-7 px-8 py-3.5 rounded-xl bg-gold"
                            activeOpacity={ 0.85 }
                        >
                            <Text className="font-montserratBold text-sm text-baseGreen" style={{ letterSpacing: 1.2 }}>
                                { ctaLabel }
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/*==== Video card ====*/}
                    <View className="px-5">
                        <TouchableOpacity
                            onPress={ handleOpenVideo }
                            activeOpacity={ 0.85 }
                            className="w-full rounded-2xl overflow-hidden"
                            style={{ aspectRatio: 16 / 9, backgroundColor: "#0a1a13" }}
                        >
                            {/* Top-left: title + author */}
                            <View className="px-4 pt-4 flex-row items-center">
                                <View className="h-7 w-7 items-center justify-center rounded-full bg-pink-600">
                                    <Text className="font-montserratBold text-xs text-white">O</Text>
                                </View>
                                <View className="ml-2">
                                    <Text className="font-montserratSemiBold text-sm text-white">Zeaper Vendor Onboarding Guide</Text>
                                    <Text className="text-[10px] text-white/60">Officialzeaper</Text>
                                </View>
                            </View>

                            {/* Center play button */}
                            <View className="absolute inset-0 items-center justify-center">
                                <View className="h-14 w-14 items-center justify-center rounded-xl bg-red-600">
                                    <PlayCircle size={ 36 } color="#ffffff" variant="Bold" />
                                </View>
                            </View>

                            {/* Bottom-right "Watch on YouTube" */}
                            <View className="absolute bottom-3 right-4 flex-row items-center">
                                <Text className="text-[10px] text-white/80">Watch on </Text>
                                <Text className="font-montserratSemiBold text-[11px] text-white">▶ YouTube</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/*==== Why Partner With Us ====*/}
                    <View className="px-5 pt-12">
                        <Text className="font-montserratBold text-2xl text-gold text-center">Why Partner With Us</Text>

                        <View className="mt-6 flex-row flex-wrap">
                            { partnerCards.map((card) => (
                                <View key={ card.title } className="w-1/2 p-1.5">
                                    <View className="p-4 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                                        <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(213,176,123,0.15)" }}>
                                            <card.icon size={ 18 } color="#D5B07B" variant="Bold" />
                                        </View>
                                        <Text className="mt-3 font-montserratSemiBold text-sm text-white">{ card.title }</Text>
                                        <Text className="mt-1.5 text-[11px] leading-4 text-white/70">{ card.description }</Text>
                                    </View>
                                </View>
                            )) }
                        </View>
                    </View>

                    {/*==== Selling Simplified ====*/}
                    <View className="px-5 pt-12">
                        <Text className="font-montserratBold text-2xl text-gold text-center">Selling Simplified</Text>

                        <View className="mt-6 flex-row flex-wrap">
                            { sellingCards.map((card) => (
                                <View key={ card.title } className="w-1/2 p-1.5">
                                    <View className="p-4 items-center rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                                        <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(213,176,123,0.15)" }}>
                                            <card.icon size={ 18 } color="#D5B07B" variant="Bold" />
                                        </View>
                                        <Text className="mt-3 font-montserratSemiBold text-sm text-white text-center">{ card.title }</Text>
                                        <Text className="mt-1.5 text-[11px] leading-4 text-white/70 text-center">{ card.description }</Text>
                                    </View>
                                </View>
                            )) }
                        </View>
                    </View>

                    {/*==== Who Can Join Us? ====*/}
                    <View className="px-5 pt-12">
                        <Text className="font-montserratBold text-2xl text-gold text-center">Who Can Join Us?</Text>

                        <View className="mt-6">
                            { audienceCards.map((card) => (
                                <View key={ card.title } className="p-5 rounded-2xl mb-3" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                                    <View className="items-center">
                                        <View className="h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: "rgba(213,176,123,0.15)" }}>
                                            <card.icon size={ 24 } color="#D5B07B" variant="Bold" />
                                        </View>
                                        <Text className="mt-3 font-montserratSemiBold text-base text-white text-center">{ card.title }</Text>
                                        <Text className="mt-1.5 text-xs leading-5 text-white/70 text-center">{ card.description }</Text>
                                    </View>
                                </View>
                            )) }
                        </View>

                        {/* Sticky-feeling secondary CTA — gives users a clear next step
                            after they've read the full pitch without scrolling back up. */}
                        <TouchableOpacity
                            onPress={ onCtaPress }
                            className="mt-4 h-[55px] flex-row items-center justify-center rounded-xl bg-gold"
                            activeOpacity={ 0.85 }
                        >
                            <Text className="font-montserratBold text-sm text-baseGreen mr-2" style={{ letterSpacing: 1.2 }}>
                                { ctaLabel }
                            </Text>
                            <ArrowRight size={ 18 } color="#133522" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default VendorOnboardingScreen;