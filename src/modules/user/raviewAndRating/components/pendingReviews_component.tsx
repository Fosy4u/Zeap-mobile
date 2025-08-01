import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ArrowRight } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setReviewOrder } from '../slices/reviewAndRating_slice';

const PendingReviewsComponent = () => {
    const { pendingReviews, isLoading, loadingMessage } = useSelector((state: RootState) => state.reviewAndRatingState);
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    return (
        <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false}>
            {pendingReviews.length > 0 ? (
                pendingReviews.map((review, index) => (
                    <View key={index} className="mb-3 p-4 rounded-lg bg-lightGray">
                        <View className="flex-row items-start">
                            <View className="relative">
                                <Image 
                                    source={{ uri: review.order?.images?.[0]?.link}}
                                    className="w-20 h-28 rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>
                            <View className="flex-1 ml-4">
                                <Text className="text-gray-800 font-montserratRegular text-[14px]">
                                    {review.order?.title || 'Product Name'}
                                </Text>
                                <Text className="mt-2 text-gray-600 font-montserratMedium text-[13px]">
                                    Order no: {review.order?.orderId || 'N/A'}
                                </Text>
                                <Text className="text-gray-600 font-montserratRegular text-[13px] mb-3">
                                    Delivered on: {review.order?.deliveryDate ? new Date(review.order.deliveryDate).toLocaleDateString() : 'N/A'}
                                </Text>
                                <TouchableOpacity 
                                    className="flex-row items-center"
                                    onPress={() => {
                                        if (review.order) {
                                            dispatch(setReviewOrder(review.order));
                                            navigation.navigate('rateAndReviewScreen');
                                        }
                                    }}
                                >
                                    <Text className="text-baseGreen font-montserratMedium text-[14px] mr-2">
                                        Rate This Product
                                    </Text>
                                    <ArrowRight color="#133522" size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                <View className="flex-1 justify-center items-center mt-20">
                    <Text className="text-gray-500 font-montserratMedium text-[16px] text-center">
                        No pending reviews
                    </Text>
                    <Text className="text-gray-400 font-montserratLight text-[14px] text-center mt-2">
                        You don't have any products waiting for review
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

export default PendingReviewsComponent; 