import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, ArrowRight2, MessageQuestion } from "iconsax-react-native";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { useGetPopularHelpArticlesQuery } from "../apis/help_api";
import IHelpArticle, { HELP_CATEGORIES, HELP_SUB_CATEGORIES } from "../models/helpArticle_model";
import SkeletonBlock from "../components/skeletonBlock_component";
import AppStatusBar from "../components/appStatusBar";

const HelpCenterScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const [selectedCategory, setSelectedCategory] = useState<string>("customer");

    const { data: popularArticles, isFetching } = useGetPopularHelpArticlesQuery({ category: selectedCategory });
    const subCategories = HELP_SUB_CATEGORIES.filter((subCategory) => subCategory.categories.includes(selectedCategory));

    const openArticle = (article: IHelpArticle) => {
        navigation.navigate("helpArticleScreen", {
            articleId: article.articleId,
            category: article.category,
            subCategory: article.subCategory,
        });
    };

    return (
        <View className="flex-1 bg-white">
            <AppStatusBar backgroundColor="#ffffff" barStyle="dark-content" />

            <SafeAreaView className="flex-1">
                {/*==== Top chrome ====*/}
                <View className="px-5 pt-3 flex-row items-center">
                    <TouchableOpacity
                        onPress={ () => navigation.goBack() }
                        className="h-10 w-10 items-center justify-center rounded-full bg-baseGreen"
                    >
                        <ArrowLeft size={ 18 } color="#ffffff" />
                    </TouchableOpacity>
                    <Text className="flex-1 mr-10 font-montserratSemiBold text-base text-baseGreen text-center">Help Center</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={ false } contentContainerStyle={{ paddingBottom: 32 }}>
                    <View className="px-5 pt-6">
                        <Text className="font-montserratBold text-[24px] text-baseGreen leading-tight">
                            How may we help you?
                        </Text>
                        <Text className="mt-2 font-montserratMedium text-sm text-gray-500 leading-6">
                            Find help with buying, selling and your account.
                        </Text>
                    </View>

                    {/*==== Category Tabs ====*/}
                    <View className="h-auto w-full mt-5 px-5">
                        <View className="h-auto w-full p-1 flex-row items-center border border-gray-400 rounded-2xl">
                            { HELP_CATEGORIES.map((category) => (
                                <TouchableOpacity key={ category.value }
                                    onPress={ () => setSelectedCategory(category.value) }
                                    className={ `flex-1 px-1 py-2 rounded-xl ${ (selectedCategory === category.value) ? "bg-baseGreen" : "" }` }
                                >
                                    <Text
                                        numberOfLines={ 1 }
                                        className={ `text-center text-xs ${ (selectedCategory === category.value) ? "text-white" : "text-gray-500" }` }
                                    >
                                        { category.label }
                                    </Text>
                                </TouchableOpacity>
                            )) }
                        </View>
                    </View>

                    {/*==== Popular articles ====*/}
                    <View className="px-5 mt-7">
                        <Text className="font-montserratSemiBold text-[15px] text-gray-700">Popular Topics</Text>

                        { isFetching ? (
                            <View className="mt-3 gap-y-3">
                                { [0, 1, 2].map((index) => (
                                    <SkeletonBlock key={ index } width={ 320 } height={ 44 } radius={ 10 } />
                                )) }
                            </View>
                        ) : (popularArticles?.length ?? 0) === 0 ? (
                            <Text className="mt-3 font-montserratMedium text-sm text-gray-400">
                                No popular topics yet for this category.
                            </Text>
                        ) : (
                            <View className="mt-2">
                                { popularArticles!.map((article) => (
                                    <TouchableOpacity
                                        key={ article._id ?? article.articleId }
                                        onPress={ () => openArticle(article) }
                                        className="py-3 flex-row items-center border-b border-gray-100"
                                    >
                                        <MessageQuestion size={ 18 } color="#D5B07B" variant="Bold" />
                                        <Text numberOfLines={ 2 } className="flex-1 ml-3 font-montserratMedium text-sm text-gray-700">
                                            { article.title }
                                        </Text>
                                        <ArrowRight2 size={ 16 } color="#9ca3af" />
                                    </TouchableOpacity>
                                )) }
                            </View>
                        ) }
                    </View>

                    {/*==== Sub-categories ====*/}
                    <View className="px-5 mt-7">
                        <Text className="font-montserratSemiBold text-[15px] text-gray-700">Browse Topics</Text>

                        <View className="mt-2">
                            { subCategories.map((subCategory) => (
                                <TouchableOpacity
                                    key={ subCategory.value }
                                    onPress={ () => navigation.navigate("helpArticleScreen", {
                                        category: selectedCategory,
                                        subCategory: subCategory.value,
                                    }) }
                                    className="p-4 mt-3 flex-row items-center rounded-2xl border border-gray-100 bg-lightGray"
                                >
                                    <Text className="flex-1 font-montserratMedium text-sm text-gray-700">{ subCategory.label }</Text>
                                    <ArrowRight2 size={ 16 } color="#133522" />
                                </TouchableOpacity>
                            )) }
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default HelpCenterScreen;
