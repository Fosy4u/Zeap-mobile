import { ArrowRight, Dislike, Like1, Star1 } from 'iconsax-react-native';
import React, { useState } from 'react'
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native'

const ReviewComponent = () => {
  const [reviews] = useState([
    {
      id: "001",
      fullName: "James Ifeanyi",
      profilePicture: "",
      comment: "Lorem ipsum dolor sit amet consectetur. Dui quis tempus sagittis accumsan hendrerit tellus diam",
      date: new Date(),
      rating: 4.5,
      likes: 16,
      dislikes: 0,
    },
    {
      id: "002",
      fullName: "James Ifeanyi",
      profilePicture: "",
      comment: "Dui quis tempus sagittis accumsan hendrerit tellus diam",
      date: new Date(),
      rating: 3.5,
      likes: 16,
      dislikes: 0,
    },
  ]);

  return (
    <ScrollView className="h-auto">
      <View className="bg-lightGray">
        { reviews.map((review) => (
          <View key={ review.id } className="mt-6">
            <View className="h-auto w-full flex-row items-end justify-between">
              <View className="flex-row items-center justify-start">
                <Image
                  className="h-[45px] w-[45px] mr-3 rounded-full"
                  resizeMode="cover"
                  source={require("../../../assets/home/profile_image.png")}
                />

                <View>
                  <Text className="font-medium">{ review.fullName }</Text>
                  <Text className="mt-1.5 text-xs">Posted { review.date.toLocaleString() }</Text>
                </View>
              </View>

              <View className="mb-1 flex-row">
                <Star1 color="#E4A01C" size={16} variant="Bold" className="mr-0.5" />
                <Text className="text-xs">4.3</Text>
              </View>
            </View>

            <Text className="h-auto w-full mt-2 text-xs">{ review.comment }</Text>

            <View className="mt-2 flex-row items-center">
              <View className="mr-10 flex-row items-center">
                <Like1 size={16} variant="Bold" className="mr-1.5 text-blue-800" />
                <Text className="text-xs">16 Likes</Text>
              </View>
              <View className="flex-row items-center">
                <Dislike size={16} variant="Bold" className="mr-1.5 text-red-800" />
                <Text className="text-xs">0 Dislikes</Text>
              </View>
            </View>
          </View>
        )) }

        <Text aria-label="Comment" nativeID="comment" className="mt-6">Leave a comment</Text>
        <View className="h-auto w-full mt-1.5 p-1 border border-gray-300 rounded-xl bg-gray-100">
          <TextInput
            aria-label="Comment"
            aria-labelledby="comment"
            keyboardType="default"
            placeholder="Enter comment"
            placeholderTextColor="#9ca3af"
            multiline={ true }
            textAlignVertical="top"
            className="h-[80px] px-2 py-1.5 text-base bg-slate-100"
            onChangeText={(value) => null}
          />
        </View>

        <TouchableOpacity 
          // onPress={ () => handleProceed() }
          className="h-[55px] w-auto mt-4 flex flex-row items-center justify-center rounded-xl bg-lightGreen"
        >
          <Text className="text-base text-baseGreen mr-2">Send Comment</Text>
          <ArrowRight className="text-baseGreen" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default ReviewComponent;