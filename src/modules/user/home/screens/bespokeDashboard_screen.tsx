import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ArrowRight } from 'iconsax-react-native'
import React from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import FastImage from 'react-native-fast-image'
import RootNavigationStackModel from '../../../../routes/model/routes_model'
import AppStatusBar from "../../../general/components/appStatusBar";
import CategoryBannerComponent from '../components/categoryBanner_component'
import CategoryTileComponent from '../components/categoryTile_component'
import CategoryLatestProductsComponent from '../components/categoryLatestProducts_component'

const BESPOKE_FILTER = { isBespoke: "true" };

const BespokeDashboardScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const openCollection = (screenTitle: string, filters: Record<string, string>) => {
        navigation.navigate("productListScreen", { screenTitle, filters });
    };

    const bespokeForOccasions = [
        {
            id: 1,
            title: "Wedding Dresses",
            image: require("../../../../../assets/images/categories/occasion_wedding.jpg"),
            screenTitle: "Bespoke Wedding Dresses",
            occasion: "Wedding,Bridal,Bridesmaid,Bridal Shower,Bride",
        },
        {
            id: 2,
            title: "Evening Wear",
            image: require("../../../../../assets/images/categories/occasion_evening.jpg"),
            screenTitle: "Bespoke Evening Wear",
            occasion: "Evening",
        },
        {
            id: 3,
            title: "Gala Events",
            image: require("../../../../../assets/images/categories/occasion_gala.jpg"),
            screenTitle: "Bespoke Gala Events",
            occasion: "Gala,Party,Date",
        },
        {
            id: 4,
            title: "Office Attire",
            image: require("../../../../../assets/images/categories/occasion_office.jpg"),
            screenTitle: "Bespoke Office Attire",
            occasion: "Office,Work,Business,Corporate",
        },
        {
            id: 5,
            title: "Cultural Events",
            image: require("../../../../../assets/images/categories/occasion_cultural.jpg"),
            screenTitle: "Bespoke Cultural Events",
            occasion: "Cultural",
        },
        {
            id: 6,
            title: "Casual",
            image: require("../../../../../assets/images/categories/occasion_casual.jpg"),
            screenTitle: "Bespoke Casual Wear",
            occasion: "Casual,Smart Casual",
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
                    title="Bespoke Fashion"
                    subtitle="Crafting Unique Styles Just for You"
                    titleClassName="text-3xl"
                    image={ require("../../../../../assets/images/categories/bespoke_hero_poster.jpg") }
                    videoUri="https://www.zeaper.com/video/bespokeHome.mov"
                    onPress={ () => openCollection("Bespoke Collections", BESPOKE_FILTER) }
                />

                {/*==== Tailored To Perfection Section ====*/}
                <View className="h-auto w-full mt-5 py-10 px-5 bg-lightGold rounded-md">
                    <Text className="font-montserratBold text-baseGreen text-3xl text-center">Bespoke</Text>
                    <Text className="font-montserratMedium text-baseGreen text-xs text-center">Tailored To Perfection</Text>

                    <Text className="mt-5 font-montserratMedium text-baseGreen text-xs text-center">
                        "Experience the art of bespoke tailoring with our exclusive collection.
                        Each piece is crafted to your unique specifications, ensuring a perfect
                        fit and unparalleled style."
                    </Text>
                </View>

                {/*==== Bespoke For Men Section ====*/}
                <CategoryBannerComponent
                    title="Bespoke For Real Men"
                    subtitle="Men With Class"
                    image={ require("../../../../../assets/images/categories/bespoke_men.jpg") }
                    onPress={ () => openCollection("All Men's Bespoke Collections", { ...BESPOKE_FILTER, gender: "Male" }) }
                />

                {/*==== Guarantee Return Section ====*/}
                <View className="h-auto w-full mt-5 pt-5 pb-8 px-2 border border-gray-100 rounded-md">
                    <FastImage
                        style={{ height: 200, width: "100%", borderRadius: 6 }}
                        resizeMode={ FastImage.resizeMode.cover }
                        source={ require("../../../../../assets/images/categories/bespoke_guarantee.jpg") }
                    />

                    <Text className="mt-5 font-montserratBold text-baseGreen text-xl text-center">Guarantee Return</Text>
                    <Text className="mt-2 px-5 font-montserratMedium text-baseGreen text-xs text-center">
                        "We guarantee return and cash back if tailor fails to deliver."
                    </Text>

                    {/*==== Explore Button ====*/}
                    <TouchableOpacity
                        className="mt-5 mx-auto px-4 py-3 flex-row items-center bg-gold rounded-md"
                        onPress={ () => openCollection("Bespoke Collections", BESPOKE_FILTER) }
                    >
                        <Text className="font-montserratMedium text-xs text-baseGreen">Browse Our Collections</Text>
                        <ArrowRight size={14} variant="Linear" className="ml-2 text-baseGreen" />
                    </TouchableOpacity>
                </View>

                {/*==== Bespoke For Women Section ====*/}
                <CategoryBannerComponent
                    title="Bespoke For Women"
                    subtitle="Women With Style"
                    image={ require("../../../../../assets/images/categories/bespoke_women.jpg") }
                    onPress={ () => openCollection("All Women's Bespoke Collections", { ...BESPOKE_FILTER, gender: "Female" }) }
                />

                {/*==== Bespoke For Occasions Section ====*/}
                <View className="h-auto w-full mt-7">
                    <Text className="font-montserratBold text-baseGreen text-xl">Bespoke For Occasions</Text>
                    <Text className="text-xs text-baseGreen italic">Tailored for Every Special Moment</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full mt-4"
                    >
                        { bespokeForOccasions.map((item, index) => (
                            <CategoryTileComponent
                                key={ item.id }
                                title={ item.title }
                                image={ item.image }
                                width={ 240 }
                                height={ 320 }
                                isLast={ index === bespokeForOccasions.length - 1 }
                                onPress={ () => openCollection(item.screenTitle, { ...BESPOKE_FILTER, productType: "bespokeCloth", occasion: item.occasion }) }
                            />
                        )) }
                    </ScrollView>
                </View>

                {/*==== Bespoke Shoes Section ====*/}
                <CategoryBannerComponent
                    title="Bespoke Shoes"
                    subtitle={"Custom-made shoes tailored to your specific \nneeds and preferences"}
                    image={ require("../../../../../assets/images/categories/shoes_banner.jpg") }
                    onPress={ () => openCollection("Bespoke Shoes", { ...BESPOKE_FILTER, productType: "bespokeShoe" }) }
                />

                {/*==== Bespoke Latest Section ====*/}
                <CategoryLatestProductsComponent title="Bespoke Latest Arrivals" filters={ BESPOKE_FILTER } />
            </View>
        </View>
    );
};

export default BespokeDashboardScreen;
