import React, { useState } from 'react';
import { ArrowRight, Dislike, Like1, Star1 } from 'iconsax-react-native';
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import IReview from '../models/review_model';
import { Controller } from 'react-hook-form';
import useReviewsHook from '../hooks/reviews_hook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';

interface IProps {
  reviews: IReview[];
  productID: string;
};

const ReviewComponent: React.FC<IProps> = ({ reviews, productID }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const { onSubmit, handleSubmit, handleReviewLike, handleReviewDislike, control, errors, isLoading } = useReviewsHook(productID);
  

  return (
    <ScrollView className="h-auto">
      <View className="bg-lightGray">
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

        { !showReviewForm && (
          <TouchableOpacity 
            onPress={ () => productID && navigation.navigate("reviewListScreen", {
              reviews,
              productID
            }) }
            className="h-[55px] w-full mx-auto mt-5 flex-row items-center justify-center rounded-xl bg-lightGreen"
          >
            <Text className="text-base text-baseGreen mr-2">View More Reviews</Text>
            <ArrowRight size={20} className="text-baseGreen" />
          </TouchableOpacity>
        ) }

        {/* { !showReviewForm && (
          <TouchableOpacity 
            onPress={ () => setShowReviewForm(true) }
            className="h-[55px] w-[80%] mx-auto mt-5 flex-row items-center justify-center rounded-xl bg-baseGreen"
          >
            <Text className="text-lg text-white mr-2">Write a review</Text>
            <Edit2 size={20} className="text-white" />
          </TouchableOpacity>
        ) } */}

        {/* ==== Form ==== */}
        {/* { (showReviewForm) && (
          <View className="mt-8">
            <View className="flex-row justify-between">
              <Text className="font-medium text-lg text-baseGreen text-center">Review</Text>

              <TouchableOpacity
                onPress={ () => setShowReviewForm(false) }
                className="px-4 py-2 rounded-lg bg-lightGreen">
                <Text className="text-baseGreen">Close</Text>
              </TouchableOpacity>
            </View>
            <Text aria-label="Title" nativeID="title" className="mt-3">Title<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <Controller
                control={ control }
                name="title"
                render={ ({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    aria-label="Title"
                    aria-labelledby="title"
                    keyboardType="default"
                    placeholder="Enter title"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onBlur={ onBlur }
                    onChangeText={ onChange }
                    value={ value }
                  />
                ) }
              />
              { errors.title && (<Text className="text-red-500 text-xs">{errors.title.message}</Text>) }
            </View>

            <Text aria-label="Rating" nativeID="rating" className="mt-5">Rating<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
              <Controller
                control={ control }
                name="rating"
                render={ ({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    aria-label="Rating"
                    aria-labelledby="rating"
                    keyboardType="decimal-pad"
                    placeholder="Enter rating"
                    placeholderTextColor="#9ca3af"
                    className="text-base"
                    onBlur={ onBlur }
                    onChangeText={ onChange }
                    value={ value.toString() }
                  />
                ) }
              />
              { errors.rating && (<Text className="text-red-500 text-xs">{errors.rating.message}</Text>) }
            </View>

            <Text aria-label="Review" nativeID="review" className="mt-5">Leave a review<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 p-1 border border-gray-300 rounded-xl bg-gray-100">
              <Controller
                control={ control }
                name="review"
                render={ ({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    aria-label="Review"
                    aria-labelledby="review"
                    keyboardType="default"
                    placeholder="Enter review"
                    placeholderTextColor="#9ca3af"
                    multiline={ true }
                    textAlignVertical="top"
                    className="h-[80px] px-2 py-1.5 text-base bg-slate-100"
                    onBlur={ onBlur }
                    onChangeText={ onChange }
                    value={ value }
                  />
                ) }
              />
              { errors.review && (<Text className="text-red-500 text-xs">{errors.review.message}</Text>) }
            </View>

            <TouchableOpacity 
              onPress={ handleSubmit(onSubmit) }
              className="h-[55px] w-auto mt-4 flex flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
              <Text className="text-base text-baseGreen mr-2">{ isLoading ? "Please wait..." : "Send Review" }</Text>
              { isLoading ? null : <ArrowRight className="text-baseGreen" /> }
            </TouchableOpacity>
          </View>
        ) } */}
        
      </View>
    </ScrollView>
  )
}

export default ReviewComponent;