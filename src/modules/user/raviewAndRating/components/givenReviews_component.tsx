import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';

const GivenReviewsComponent = () => {
    const { givenReviews, isLoading, loadingMessage } = useSelector((state: RootState) => state.reviewAndRatingState);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Text key={i} className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                </Text>
            );
        }
        return stars;
    };

    return (
        <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false}>
            {givenReviews.length > 0 ? (
                givenReviews.map((review, index) => (
                    <View key={index} className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                        <View className="flex-row items-start">
                            <View className="relative">
                                <Image 
                                    source={{ uri: review.order.images[0]?.link }}
                                    className="w-20 h-24 rounded-lg"
                                    resizeMode="cover"
                                />
                                <TouchableOpacity className="absolute top-1 right-1 bg-gray-100 rounded-md p-1">
                                    <Text className="text-gray-600 text-xs">♡</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-1 ml-4">
                                <Text className="text-gray-800 font-montserratMedium text-[16px] mb-1">
                                    {review.order.title}
                                </Text>
                                <Text className="text-gray-600 font-montserratLight text-[13px] mb-1">
                                    Order no: {review.order.orderId}
                                </Text>
                                <Text className="text-gray-600 font-montserratLight text-[13px] mb-3">
                                    Delivered on: {new Date(review.order.deliveryDate).toLocaleDateString()}
                                </Text>
                                <TouchableOpacity className="flex-row items-center">
                                    <Text className="text-green-600 font-montserratMedium text-[14px] mr-2">
                                        Rate This Product
                                    </Text>
                                    <Text className="text-green-600 text-lg">→</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                <View className="flex-1 justify-center items-center mt-20">
                    <Text className="text-gray-500 font-montserratMedium text-[16px] text-center">
                        No reviews yet
                    </Text>
                    <Text className="text-gray-400 font-montserratLight text-[14px] text-center mt-2">
                        You haven't submitted any reviews yet
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

export default GivenReviewsComponent; 