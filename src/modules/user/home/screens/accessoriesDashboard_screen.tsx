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

const ACCESSORY_FILTER = { productType: "Accessory" };

const AccessoriesDashboardScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const openCollection = (screenTitle: string, filters: Record<string, string>) => {
        navigation.navigate("productListScreen", { screenTitle, filters });
    };

    const ourCollections = [
        {
            id: 1,
            title: "Fragrance",
            image: require("../../../../../assets/images/categories/beauty_fragrance.jpg"),
            screenTitle: "Our Fragrance Collections",
        },
        {
            id: 2,
            title: "Hair Care",
            image: require("../../../../../assets/images/categories/beauty_haircare.jpg"),
            screenTitle: "Our Hair Care Collections",
        },
        {
            id: 3,
            title: "Makeup",
            image: require("../../../../../assets/images/categories/beauty_makeup.jpg"),
            screenTitle: "Our Makeup Collections",
        },
        {
            id: 4,
            title: "Skin Care",
            image: require("../../../../../assets/images/categories/beauty_skincare.jpg"),
            screenTitle: "Our Skin Care Collections",
        },
    ];

    return (
        <View className="flex-1 h-auto w-screen pb-20 bg-white">
            <AppStatusBar backgroundColor="#112F1E" barStyle="light-content" />

            {/*==== Main Body Section ====*/}
            <View className="h-auto w-[90%]">

                {/*==== Zeaper Accessories Section ====*/}
                <CategoryBannerComponent
                    isFirst
                    title="Zeaper Accessories"
                    subtitle="Discover the latest trends in accessories."
                    image={ require("../../../../../assets/images/categories/accessories_hero.jpg") }
                    onPress={ () => openCollection("All Accessories", ACCESSORY_FILTER) }
                />

                {/*==== Our Beauty Collections Section ====*/}
                <View className="h-auto w-full mt-7">
                    <Text className="font-montserratBold text-baseGreen text-xl">Our Beauty Collections</Text>
                    <Text className="text-xs text-baseGreen italic">Designed for Every Special Moment</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full mt-4"
                    >
                        { ourCollections.map((item, index) => (
                            <CategoryTileComponent
                                key={ item.id }
                                title={ item.title }
                                image={ item.image }
                                width={ 210 }
                                height={ 240 }
                                isLast={ index === ourCollections.length - 1 }
                                onPress={ () => openCollection(item.screenTitle, { accessoryType: item.title }) }
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

                {/*==== Explore Our Bag Collection Section ====*/}
                <CategoryBannerComponent
                    title="Explore Our Bag Collection"
                    subtitle="Discover the perfect bag to complement your style."
                    buttonText="Shop Now"
                    image={ require("../../../../../assets/images/categories/accessories_bags.jpg") }
                    onPress={ () => openCollection("All Bags", { ageGroup: "Adults", accessoryType: "Bag" }) }
                />

                {/*==== Accessories Latest Arrivals Section ====*/}
                <CategoryLatestProductsComponent title="Accessories Latest Arrivals" filters={ ACCESSORY_FILTER } />
            </View>
        </View>
    );
};

export default AccessoriesDashboardScreen;
