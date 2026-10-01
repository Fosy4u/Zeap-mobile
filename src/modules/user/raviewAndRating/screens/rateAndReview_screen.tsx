import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ActivityIndicator, SafeAreaView, StatusBar, Text, TouchableOpacity, View, Image, TextInput, ScrollView } from 'react-native';
import { ArrowRight } from 'iconsax-react-native';
import AppHeaderComp from '../../../vendor/general/components/appHeader_comp';
import useReviewAndRatingHook from '../hooks/reviewAndRating_hook';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';

const RateAndReviewScreen = () => {
    const { reviewOrder, isLoading, loadingMessage } = useSelector((state: RootState) => state.reviewAndRatingState);

    const { control, handleSubmit, onSubmit, onInvalid, errors, isEditing } = useReviewAndRatingHook();

    // Renders the message for a field that failed validation.
    const fieldError = (message?: string) => (
        message ? <Text className="mt-1.5 font-montserratRegular text-[12px] text-red-500">{ message }</Text> : null
    );

    // Show loading or error state if reviewOrder is not available
    if (!reviewOrder) {
        return (
            <SafeAreaView className="h-full w-full flex-1 bg-white">
                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <AppHeaderComp title="Rate and Review" />
                <View className="flex-1 justify-center items-center px-5">
                    <Text className="text-gray-500 font-montserratMedium text-[16px] text-center">
                        No product data available
                    </Text>
                    <Text className="text-gray-400 font-montserratLight text-[14px] text-center mt-2">
                        Please go back and select a product to review
                    </Text>
                </View>
            </SafeAreaView>
        );
    }


    const renderStars = (currentRating: number, onRatingChange: (rating: number) => void) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity 
                    key={i} 
                    onPress={() => onRatingChange(i)}
                    className="mr-2"
                >
                    <Text className={`text-2xl ${i <= currentRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                    </Text>
                </TouchableOpacity>
            );
        }
        return stars;
    };

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <SafeAreaView className="h-full w-full flex-1 bg-white">
                    <StatusBar
                        backgroundColor="transparent"
                        barStyle="dark-content"
                    />

                    {/*==== Header ====*/}
                    <AppHeaderComp title={ isEditing ? "View or Edit Review" : "Rate and Review" } />

                    <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
                        {/*==== Rating Section ====*/}
                        <View className="mb-8">
                            <Text className="text-gray-700 font-montserratMedium text-[16px] mb-4">
                                { isEditing ? "Update your rating for this product" : "Select the stars to rate this product" }
                            </Text>
                            
                            <View className="flex-row items-start mb-4">
                                <Image 
                                    source={{ uri: reviewOrder?.images?.[0]?.link }}
                                    className="w-20 h-24 rounded-lg mr-4"
                                    resizeMode="cover"
                                />
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-montserratMedium text-[16px] mb-2">
                                        {reviewOrder?.title || 'Product Name'}
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="rating"
                                        render={({ field: { value, onChange } }) => (
                                            <View className="flex-row items-center">
                                                {renderStars(value, onChange)}
                                            </View>
                                        )}
                                    />
                                    { fieldError(errors.rating?.message) }

                                </View>
                            </View>
                        </View>

                        {/*==== Review Form ====*/}
                        <View>
                            <Text className="text-gray-700 font-montserratMedium text-[16px] mb-4">
                                { isEditing ? "Your review" : "Leave a review" }
                            </Text>

                            {/* Review Title */}
                            <View className="mb-4">
                                <Text className="text-gray-600 font-montserratMedium text-[14px] mb-2">
                                    Title
                                </Text>
                                <Controller
                                    control={control}
                                    name="reviewTitle"
                                    render={({ field: { value, onChange } }) => (
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="E.g I like it, I don't like it"
                                            placeholderTextColor="#9CA3AF"
                                            className="h-[44px] border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-montserratRegular text-[14px]"
                                        />
                                    )}
                                />
                                { fieldError(errors.reviewTitle?.message) }

                            </View>

                            {/* Your Name */}
                            <View className="mb-4">
                                <Text className="text-gray-600 font-montserratMedium text-[14px] mb-2">
                                    Your name
                                </Text>
                                <Controller
                                    control={control}
                                    name="reviewerName"
                                    render={({ field: { value, onChange } }) => (
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="Enter your name"
                                            placeholderTextColor="#9CA3AF"
                                            className="h-[44px] border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-montserratRegular text-[14px]"
                                        />
                                    )}
                                />
                                { fieldError(errors.reviewerName?.message) }

                            </View>

                            {/* Review */}
                            <View className="mb-6">
                                <Text className="text-gray-600 font-montserratMedium text-[14px] mb-2">
                                    Review
                                </Text>
                                <Controller
                                    control={control}
                                    name="detailedReview"
                                    render={({ field: { value, onChange } }) => (
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="Tell us more about your rating..."
                                            placeholderTextColor="#9CA3AF"
                                            multiline
                                            numberOfLines={4}
                                            textAlignVertical="top"
                                            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-montserratRegular text-[14px] min-h-[100]"
                                        />
                                    )}
                                />
                                { fieldError(errors.detailedReview?.message) }

                            </View>

                            {/* Image Matches Product */}
                            <View className="mb-10">
                                <Text className="text-gray-600 font-montserratMedium text-[14px] mb-3">
                                    Does the product image match the product?
                                </Text>
                                <Controller
                                    control={control}
                                    name="imageMatch"
                                    render={({ field: { value, onChange } }) => (
                                        <View className="flex-row space-x-6">
                                            <TouchableOpacity 
                                                onPress={() => onChange("yes")}
                                                className="flex-row items-center"
                                            >
                                                <View className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${
                                                    value === "yes" ? "border-baseGreen bg-baseGreen" : "border-gray-300"
                                                }`}>
                                                    {value === "yes" && (
                                                        <View className="w-2 h-2 rounded-full bg-white" />
                                                    )}
                                                </View>
                                                <Text className="text-gray-700 font-montserratRegular text-[14px]">
                                                    Yes
                                                </Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity 
                                                onPress={() => onChange("no")}
                                                className="flex-row items-center"
                                            >
                                                <View className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${
                                                    value === "no" ? "border-baseGreen bg-baseGreen" : "border-gray-300"
                                                }`}>
                                                    {value === "no" && (
                                                        <View className="w-2 h-2 rounded-full bg-white" />
                                                    )}
                                                </View>
                                                <Text className="text-gray-700 font-montserratRegular text-[14px]">
                                                    No
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                                { fieldError(errors.imageMatch?.message) }

                            </View>
                        </View>
                    </ScrollView>

                    {/*==== Submit Button ====*/}
                    <View className="px-5 pb-6">
                        {/* Disabled while the request is in flight so a second
                            tap cannot post the review twice. */}
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit, onInvalid)}
                            disabled={isLoading}
                            className={`rounded-lg py-4 flex-row items-center justify-center ${ isLoading ? "bg-baseGreen/60" : "bg-baseGreen" }`}
                        >
                            <Text className="text-white font-montserratMedium text-[16px] mr-2">
                                { isLoading ? (loadingMessage || "Submitting...") : (isEditing ? "Update Review" : "Submit Review") }
                            </Text>
                            { isLoading
                                ? <ActivityIndicator size="small" color="white" />
                                : <ArrowRight color="white" size={20} /> }
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default RateAndReviewScreen; 