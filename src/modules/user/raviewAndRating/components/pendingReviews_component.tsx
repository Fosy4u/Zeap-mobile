import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ArrowRight } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setReviewOrder } from '../slices/reviewAndRating_slice';
import { formatReviewDate, normalizeReviewOrder } from '../models/review_model';

const PendingReviewsComponent = () => {
    const { pendingReviews, isLoading, loadingMessage } = useSelector((state: RootState) => state.reviewAndRatingState);
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    return (
        <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false}>
            {pendingReviews.length > 0 ? (
                pendingReviews.map((review, index) => {
                  const order = normalizeReviewOrder(review);

                  return (
                    <View key={index} className="mb-3 p-4 rounded-lg bg-lightGray">
                        <View className="flex-row items-start">
                            <View className="relative">
                                <Image
                                    source={ order.images?.[0]?.link
                                        ? { uri: order.images[0].link }
                                        : require("../../../../../assets/images/image_placeholder.png") }
                                    className="w-20 h-28 rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>
                            <View className="flex-1 ml-4">
                                <Text className="text-gray-800 font-montserratRegular text-[14px]">
                                    {order.title || 'Product Name'}
                                </Text>
                                <Text className="mt-2 text-gray-600 font-montserratMedium text-[13px]">
                                    Order no: {order.orderId || 'N/A'}
                                </Text>
                                <Text className="text-gray-600 font-montserratRegular text-[13px] mb-3">
                                    Delivered on: {formatReviewDate(order.deliveryDate)}
                                </Text>
                                {/* Always navigates: the old `if (review.order)` guard
                                    never passed, so the button did nothing at all. */}
                                <TouchableOpacity
                                    className="flex-row items-center"
                                    onPress={() => {
                                        dispatch(setReviewOrder(order));
                                        navigation.navigate('rateAndReviewScreen');
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
                  );
                })
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