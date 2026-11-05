import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ArrowRight, Heart, Star1 } from 'iconsax-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { setReviewOrder } from '../slices/reviewAndRating_slice';
import { RootState } from '../../../../redux/store/store';
import { formatReviewDate, normalizeReviewOrder } from '../models/review_model';
import useWishlistToggle from '../../saved/hooks/wishlistToggle_hook';
import IProduct from '../../products/models/product_model';

const GivenReviewsComponent = () => {
    const { givenReviews } = useSelector((state: RootState) => state.reviewAndRatingState);
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { isSaved, toggleSave } = useWishlistToggle();

    return (
        <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false}>
            {givenReviews.length > 0 ? (
                givenReviews.map((review, index) => {
                  const order = normalizeReviewOrder(review);
                  const saved = isSaved(order.productId);

                  return (
                    <View key={index} className="bg-white rounded-lg border border-gray-200 px-3 py-3 mb-4">
                        <View className="flex-row items-start">
                            <View className="relative">
                                <Image
                                    source={ order.images?.[0]?.link
                                        ? { uri: order.images[0].link }
                                        : require("../../../../../assets/images/image_placeholder.png") }
                                    className="w-20 h-24 rounded-lg"
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    onPress={ () => toggleSave({ productId: order.productId, colors: order.color ? [{ value: order.color }] : [] } as unknown as IProduct) }
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    className="h-[35px] w-[35px] absolute top-0 right-0 flex items-center justify-center rounded-xl bg-gray-200"
                                >
                                    <Heart color={ saved ? "#e11d48" : "gray" } variant={ saved ? "Bold" : "Linear" } />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className="text-gray-800 font-montserratMedium text-[15px] mb-1">
                                    {order.title || 'Product Name'}
                                </Text>
                                <Text className="text-gray-600 font-montserratLight text-[13px] mb-1">
                                    Order no: {order.orderId || 'N/A'}
                                </Text>
                                <Text className="text-gray-600 font-montserratLight text-[13px] mb-3">
                                    Delivered on: {formatReviewDate(order.deliveryDate)}
                                </Text>
                                <View className="flex-row items-center justify-between">
                                    <TouchableOpacity
                                        onPress={() => {
                                            dispatch(setReviewOrder(order));
                                            navigation.navigate('rateAndReviewScreen');
                                        }}
                                        className="flex-1 flex-row items-center mr-2"
                                    >
                                        <Text className="text-green-600 font-montserratMedium text-[12px] mr-1" numberOfLines={ 1 }>
                                            View or Edit Review
                                        </Text>
                                        <ArrowRight color="#16a34a" size={14} />
                                    </TouchableOpacity>

                                    <View className="flex-row items-center">
                                        <Star1 color="#E4A01C" size={18} variant="Bold" />
                                        <Text className="ml-1 text-gray-700 font-montserratMedium text-[14px]">
                                            { order.rating ?? 0 }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                  );
                })
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