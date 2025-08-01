import React from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Dislike, Like1, Star1 } from 'iconsax-react-native';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import useGeneralHook from '../hooks/general_hook';
import IReview from '../models/review_model';
import { formatDate } from '../../../utils/formatDate';
import AppHeaderComp from '../../vendor/general/components/appHeader_comp';
import RatingCardComponent from '../components/ratingCard_component';

interface IProps {
    route: RouteProp<RootNavigationStackModel, "reviewListScreen">
};

const ReviewListScreen: React.FC<IProps> = ({ route }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { reviewAndRating, reviewIndicators, productID } = route.params;


    const { handleReviewLike, handleReviewDislike } = useGeneralHook();
    

    return (
        <GestureHandlerRootView>
            <SafeAreaView className="h-full w-full flex-1">
                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />

                {/*==== Header ====*/}
                <AppHeaderComp title="Reviews" />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="mt-5 px-5 bg-lightGray">

                        {/* ==== Rating card ==== */}
                        <RatingCardComponent reviewAndRating={ reviewAndRating } reviewIndicators={ reviewIndicators } />
        
                        { (reviewAndRating && reviewAndRating.reviews!.length !== 0)
                        ? reviewAndRating.reviews!.slice(0, 3).map((review) => (
                        <View key={ review._id } className="mt-6">
                            <View className="h-auto w-full flex-row items-end justify-between">
                            <View className="flex-row items-center justify-start">
                                <Image
                                    className="h-[45px] w-[45px] mr-3 rounded-full"
                                    resizeMode="cover"
                                    source={ 
                                        review.user!.imageUrl!?.link!
                                        ? { uri: review.user!.imageUrl!?.link! }
                                        : require("../../../../assets/images/app_logo.png")
                                    }
                                />

                                <View>
                                    <Text className="font-medium">{ review.user!.firstName! + " " + review.user!.lastName! }</Text>
                                    <View className="mt-1.5 flex-row items-center">
                                        <Text>Posted: </Text>
                                        <Text>{ review.updatedAt ? formatDate(review.updatedAt!.toString()) : '' }</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="mb-1 flex-row">
                                <Star1 color="#E4A01C" size={16} variant="Bold" className="mr-0.5" />
                                <Text className="text-xs">{ review.rating! }</Text>
                            </View>
                            </View>

                            <Text className="h-auto w-full mt-2 text-xs">{ review.review! }</Text>

                            <View className="mt-2 flex-row items-center">
                                <View className="mr-10 flex-row items-center">
                                    <TouchableOpacity onPress={ () => handleReviewLike({ _id: review._id! }) }>
                                    <Like1 size={16} variant="Bold" className="mr-1.5 text-blue-800" />
                                    </TouchableOpacity>
                                    <Text className="text-xs">{ review.likes!.value! } Likes</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <TouchableOpacity onPress={ () => handleReviewDislike({ _id: review._id! }) }>
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