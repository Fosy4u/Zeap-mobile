import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ArrowRight } from 'iconsax-react-native'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import RootNavigationStackModel from '../../../../routes/model/routes_model'
import AppStatusBar from "../../../general/components/appStatusBar";
import CategoryBannerComponent from '../components/categoryBanner_component'
import CategoryTileComponent from '../components/categoryTile_component'
import CategoryLatestProductsComponent from '../components/categoryLatestProducts_component'

const READY_MADE_FILTER = { isReadyMade: "true" };

const ReadyMadeDashboardScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const openCollection = (screenTitle: string, filters: Record<string, string>) => {
        navigation.navigate("productListScreen", { screenTitle, filters });
    };

    const readyToWearForOccasions: { id: number; title: string; image: any; screenTitle: string; filters: Record<string, string> }[] = [
        {
            id: 1,
            title: "Women",
            image: require("../../../../../assets/images/categories/rtw_women.jpg"),
            screenTitle: "All Women's Ready to Wear Collections",
            filters: { gender: "Female", ageGroup: "Adults", productType: "readyMadeCloth,readyMadeShoe" },
        },
        {
            id: 2,
            title: "Men",
            image: require("../../../../../assets/images/categories/rtw_men.jpg"),
            screenTitle: "All Men's Ready to Wear Collections",
            filters: { gender: "Male", ageGroup: "Adults", productType: "readyMadeCloth,readyMadeShoe" },
        },
        {
            id: 3,
            title: "Kids",
            image: require("../../../../../assets/images/categories/rtw_kids.jpg"),
            screenTitle: "All Kids Ready to Wear Collections",
            filters: { ageGroup: "Kids", productType: "readyMadeCloth,readyMadeShoe" },
        },
        {
            id: 4,
            title: "Dresses",
            image: require("../../../../../assets/images/categories/rtw_dresses.jpg"),
            screenTitle: "All Ready to Wear Dresses",
            filters: { gender: "Female", ageGroup: "Adults", main: "Dress", productType: "readyMadeCloth" },
        },
        {
            id: 5,
            title: "Matching Sets",
            image: require("../../../../../assets/images/categories/rtw_matching_sets.jpg"),
            screenTitle: "All Ready to Wear Matching Sets",
            filters: { ageGroup: "Adults", main: "Matching Set" },
        },
        {
            id: 6,
            title: "Shoes",
            image: require("../../../../../assets/images/categories/rtw_shoes.jpg"),
            screenTitle: "All Ready to Wear Shoes",
            filters: { ageGroup: "Adults", productType: "readyMadeShoe" },
        },
    ];

    return (
        <View className="flex-1 h-auto w-screen pb-20 bg-white">
            <AppStatusBar backgroundColor="#112F1E" barStyle="light-content" />

            {/*==== Main Body Section ====*/}
            <View className="h-auto w-[90%]">

                {/*==== Hero Section ====*/}
                <CategoryBannerComponent
                    isFirst
                    title="Ready to Wear Fashion"
                    subtitle="Instant Chic. Zero Fuss"
                    titleClassName="text-3xl"
                    image={ require("../../../../../assets/images/categories/rtw_hero_poster.jpg") }
                    videoUri="https://zeaper-web-dev.vercel.app/video/rtwHome.mov"
                    onPress={ () => openCollection("Ready to Wear Collections", READY_MADE_FILTER) }
                />

                {/*==== Ready To Wear For Occasions Section ====*/}
                <View className="h-auto w-full mt-7">
                    <Text className="font-montserratBold text-baseGreen text-xl">Ready To Wear For Occasions</Text>
                    <Text className="text-xs text-baseGreen italic">Designed for Every Special Moment</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full mt-4"
                    >
                        { readyToWearForOccasions.map((item, index) => (
                            <CategoryTileComponent
                                key={ item.id }
                                title={ item.title }
                                image={ item.image }
                                width={ 210 }
                                height={ 300 }
                                isLast={ index === readyToWearForOccasions.length - 1 }
                                onPress={ () => openCollection(item.screenTitle, { ...READY_MADE_FILTER, ...item.filters }) }
                            />
                        )) }
                    </ScrollView>
                </View>

                {/*==== Our Return Guarantee Section ====*/}
                <View className="h-auto w-full mt-5 py-10 px-5 items-center bg-lightGold rounded-md">
                    <Image
                        source={ require("../../../../../assets/images/app_logo_green.png") }
                        className="h-[50px] w-[80px] mb-3"
                        resizeMode="contain"
                    />
                    <Text className="font-montserratBold text-baseGreen text-2xl text-center">Our Return Guarantee</Text>

                    <Text className="mt-5 font-montserratMedium text-baseGreen text-xs text-center">
                        We stand behind our vendors and want you to be satisfied with your purchase.
                        If for any reason you are not satisfied, we offer a hassle-free Return and Refund Policy.
                    </Text>

                    {/*==== Learn More Button ====*/}
                    <TouchableOpacity
                        className="mt-5 mx-auto px-4 py-3 flex-row items-center bg-baseGreen rounded-md"
                        onPress={ () => navigation.navigate("helpArticleScreen", { category: "customer", subCategory: "returnsAndRefunds" }) }
                    >
                        <Text className="font-montserratRegular text-xs text-white">Learn More</Text>
                        <ArrowRight size={14} variant="Linear" className="ml-2 text-white" />
                    </TouchableOpacity>
                </View>

                {/*==== Ready To Wear Shoes Section ====*/}
                <CategoryBannerComponent
                    title="Ready To Wear Shoes"
                    subtitle={"Ready to Wear shoes for your specific \nneeds and preferences"}
                    image={ require("../../../../../assets/images/categories/shoes_banner.jpg") }
                    onPress={ () => openCollection("All Ready to Wear Shoes", { ...READY_MADE_FILTER, ageGroup: "Adults", productType: "readyMadeShoe" }) }
                />

                {/*==== Ready to Wear Latest Arrivals Section ====*/}
                <CategoryLatestProductsComponent title="Ready to Wear Latest Arrivals" filters={ READY_MADE_FILTER } />
            </View>
        </View>
    );
};

export default ReadyMadeDashboardScreen;
