import React from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Dislike, Like1, Star1 } from 'iconsax-react-native';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import useReviewsHook from '../hooks/reviews_hook';

interface IProps {
    route: RouteProp<RootNavigationStackModel, "reviewListScreen">
};

const ReviewListScreen: React.FC<IProps> = ({ route }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { reviews, productID } = route.params;
    const { handleReviewLike, handleReviewDislike } = useReviewsHook(productID);
    console.log("PRODUCT ID::: ", productID);
    

    return (
        <GestureHandlerRootView>
            <SafeAreaView className="h-full w-full flex-1 px-[25px] pt-[20px]">
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
            />

            {/*==== Header ====*/}
            <View className="h-auto w-full flex-row items-center justify-between">
                <TouchableOpacity onPress={ () => navigation.pop() }>
                <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                    <ArrowLeft color="white" />
                </View>
                </TouchableOpacity>
                <Text className="font-semibold text-lg text-baseGreen">Reviews</Text>
                <View className="h-[40px] w-[40px]" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="mt-5 bg-lightGray">
                    { (reviews && reviews.length !== 0)
                    ? reviews.slice(0, 3).map((review) => (
                    <View key={ review._id } className="mt-6">
                        <View className="h-auto w-full flex-row items-end justify-between">
                        <View className="flex-row items-center justify-start">
                            <Image
                                className="h-[45px] w-[45px] mr-3 rounded-full"
                                resizeMode="cover"
                                source={ 
                                    review.user!.imageUrl!?.link!
                                    ? { uri: review.user!.imageUrl!?.link! }
                                    : require("../../../../assets/app_logo.png")
                                }
                            />

                            <View>
                            <Text className="font-medium">{ review.user!.firstName! + " " + review.user!.lastName! }</Text>
                            <Text className="mt-1.5 text-xs">Posted { new Date(review.updatedAt!).toLocaleString() }</Text>
                            </View>
                        </View>

                        <View className="mb-1 flex-row">
                            <Star1 color="#E4A01C" size={16} variant="Bold" className="mr-0.5" />
                            <Text className="text-xs">4.3</Text>
                        </View>
                        </View>

                        <Text className="h-auto w-full mt-2 text-xs">{ review.review! }</Text>

                        <View className="mt-2 flex-row items-center">
                        <View className="mr-10 flex-row items-center">
                            <TouchableOpacity onPress={ () => handleReviewLike({ reviewId: review._id! }) }>
                            <Like1 size={16} variant="Bold" className="mr-1.5 text-blue-800" />
                            </TouchableOpacity>
                            <Text className="text-xs">{ review.likes!.value! } Likes</Text>
                        </View>
                        <View className="flex-row items-center">
                            <TouchableOpacity onPress={ () => handleReviewDislike({ reviewId: review._id! }) }>
                            <Dislike size={16} variant="Bold" className="mr-1.5 text-red-800" />
                            </TouchableOpacity>
                            <Text className="text-xs">{ review.dislikes!.value! } Dislikes</Text>
                        </View>
                        </View>
                    </View>
                    ))
                    : (
                    <View className="h-auto w-full pt-10 flex items-center">
                        <Text>No review for this product.</Text>
                    </View>
                    ) }
                </View>
            </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default ReviewListScreen;