import React from "react";
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, ArrowRight2, Like1, Dislike, MessageQuestion } from "iconsax-react-native";
import HTMLView from "react-native-htmlview";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import {
    useGetHelpArticleQuery,
    useGetHelpArticlesQuery,
    useMarkHelpArticleHelpfulMutation,
} from "../apis/help_api";
import IHelpArticle, { labelForCategory, labelForSubCategory } from "../models/helpArticle_model";
import SkeletonBlock from "../components/skeletonBlock_component";
import AppStatusBar from "../components/appStatusBar";
import handleError from "../hooks/errorHandler_hook";

const CONTENT_WIDTH = Dimensions.get("window").width - 40;

const htmlStyles = {
    p: { color: "#374151", fontSize: 14, lineHeight: 24 },
    li: { color: "#374151", fontSize: 14, lineHeight: 24 },
    h1: { color: "#133522", fontSize: 18, fontWeight: "bold" as const, marginBottom: 6 },
    h2: { color: "#133522", fontSize: 16, fontWeight: "bold" as const, marginBottom: 6 },
    h3: { color: "#133522", fontSize: 15, fontWeight: "bold" as const, marginBottom: 6 },
    a: { color: "#2563eb", textDecorationLine: "underline" as const },
    strong: { fontWeight: "bold" as const },
};

const HelpArticleScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { params } = useRoute<RouteProp<RootNavigationStackModel, "helpArticleScreen">>();

    const articleId = params?.articleId ?? "";
    const category = params?.category ?? "";
    const subCategory = params?.subCategory ?? "";
    const isDetail = !!articleId;

    const { data: article, isFetching: isFetchingArticle } = useGetHelpArticleQuery(
        { articleId },
        { skip: !isDetail },
    );
    const { data: articles, isFetching: isFetchingList } = useGetHelpArticlesQuery(
        { category, subCategory },
        { skip: isDetail || !category || !subCategory },
    );

    const [markHelpful, { isLoading: isMarking }] = useMarkHelpArticleHelpfulMutation();

    const handleMarkHelpful = async (isHelpful: string) => {
        if (!article?.articleId) { return; }
        try {
            await markHelpful({ articleId: article.articleId, isHelpful }).unwrap();
        } catch (error) {
            handleError(error);
        }
    };

    const openArticle = (item: IHelpArticle) => {
        navigation.push("helpArticleScreen", {
            articleId: item.articleId,
            category: item.category,
            subCategory: item.subCategory,
        });
    };

    const isFetching = isDetail ? isFetchingArticle : isFetchingList;
    const headerTitle = isDetail
        ? (labelForSubCategory(article?.subCategory) || "Help Article")
        : (labelForSubCategory(subCategory) || "Help Articles");

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
                    <Text numberOfLines={ 1 } className="flex-1 mx-3 mr-10 font-montserratSemiBold text-base text-baseGreen text-center">
                        { headerTitle }
                    </Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={ false } contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                    { isFetching ? (
                        <View className="gap-y-3">
                            { [0, 1, 2, 3].map((index) => (
                                <SkeletonBlock key={ index } width={ CONTENT_WIDTH } height={ index === 0 ? 70 : 44 } radius={ 10 } />
                            )) }
                        </View>
                    ) : isDetail ? (
                        !article ? (
                            <Text className="mt-10 font-montserratMedium text-sm text-gray-400 text-center">
                                This article is no longer available.
                            </Text>
                        ) : (
                            <View>
                                <Text className="font-montserratBold text-[20px] text-baseGreen leading-tight">{ article.title }</Text>

                                <Text className="mt-2 font-montserratMedium text-xs text-gray-400">
                                    { labelForCategory(article.category) }
                                    { !!article.subCategory && ` · ${ labelForSubCategory(article.subCategory) }` }
                                </Text>

                                <View className="mt-4">
                                    <HTMLView value={ article.content || "<p>No content available</p>" } stylesheet={ htmlStyles } />
                                </View>

                                {/*==== Was this helpful? ====*/}
                                <View className="mt-10 p-5 items-center rounded-2xl bg-lightGray border border-gray-100">
                                    <Text className="font-montserratMedium text-sm text-gray-600">Was this article helpful?</Text>
                                    <View className="mt-3 flex-row items-center gap-x-3">
                                        <TouchableOpacity
                                            onPress={ () => handleMarkHelpful("yes") }
                                            disabled={ isMarking }
                                            className={ `px-5 py-2 flex-row items-center gap-x-2 rounded-lg border ${ article.markedIsHelpful ? "bg-baseGreen border-baseGreen" : "border-gray-300" } ${ isMarking ? "opacity-60" : "" }` }
                                        >
                                            <Like1 size={ 15 } color={ article.markedIsHelpful ? "#ffffff" : "#6b7280" } variant="Bold" />
                                            <Text className={ `font-montserratMedium text-xs ${ article.markedIsHelpful ? "text-white" : "text-gray-600" }` }>Yes</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={ () => handleMarkHelpful("no") }
                                            disabled={ isMarking }
                                            className={ `px-5 py-2 flex-row items-center gap-x-2 rounded-lg border ${ article.markedIsNotHelpful ? "bg-red-600 border-red-600" : "border-gray-300" } ${ isMarking ? "opacity-60" : "" }` }
                                        >
                                            <Dislike size={ 15 } color={ article.markedIsNotHelpful ? "#ffffff" : "#6b7280" } variant="Bold" />
                                            <Text className={ `font-montserratMedium text-xs ${ article.markedIsNotHelpful ? "text-white" : "text-gray-600" }` }>No</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    ) : (articles?.length ?? 0) === 0 ? (
                        <Text className="mt-10 font-montserratMedium text-sm text-gray-400 text-center">
                            No articles found for { labelForSubCategory(subCategory) || "this topic" } yet.
                        </Text>
                    ) : (
                        <View>
                            <Text className="font-montserratMedium text-xs text-gray-400">
                                { articles!.length } { articles!.length === 1 ? "article" : "articles" } found
                            </Text>

                            { articles!.map((item) => (
                                <TouchableOpacity
                                    key={ item._id ?? item.articleId }
                                    onPress={ () => openArticle(item) }
                                    className="p-4 mt-3 flex-row items-center rounded-2xl border border-gray-100 bg-lightGray"
                                >
                                    <MessageQuestion size={ 18 } color="#D5B07B" variant="Bold" />
                                    <Text numberOfLines={ 3 } className="flex-1 ml-3 font-montserratMedium text-sm text-gray-700 leading-5">
                                        { item.title }
                                    </Text>
                                    <ArrowRight2 size={ 16 } color="#133522" />
                                </TouchableOpacity>
                            )) }
                        </View>
                    ) }
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default HelpArticleScreen;
