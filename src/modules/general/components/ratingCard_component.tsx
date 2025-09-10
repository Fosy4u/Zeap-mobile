import { Star1 } from 'iconsax-react-native';
import React from 'react'
import { View, Text } from 'react-native';
import IReviewIndicator from '../models/reviewIndicator_model';
import IReviewAndRating from '../models/review_model';

interface IProps {
  reviewAndRating: IReviewAndRating;
  reviewIndicators: IReviewIndicator[];
};

const RatingCardComponent: React.FC<IProps> = ({ reviewAndRating, reviewIndicators }) => {

    return (
        <View className="mt-2 p-2 flex-row items-center justify-between rounded-md bg-gray-200">
            <View className="flex-1">
            { reviewIndicators.map((reviewIndicator, index) => (
                <View key={ `rate_${reviewIndicator.rate}_index_${index}` } className="my-1 flex-row items-center">
                <Text className="mr-1 text-xs">{ reviewIndicator.rate }</Text>
                <Star1 color="#E4A01C" size={12} variant="Bold" className="mr-0.5" />
                <View className="h-[5px] ml-1 flex-1 rounded-md bg-gray-300">
                    <View
                    style={{ width: `${reviewIndicator.percentage}%` }} 
                    className="h-[4px] rounded-md bg-baseGreen"
                    />
                </View>
                </View>
            ))}
            </View>

            <View className="h-auto w-[30%] items-center justify-center">
                <Text className="font-semibold text-lg text-black">{ reviewAndRating.averageRating?.toFixed(1) }</Text>
                <View className="mt-2a flex-row items-center">
                    { [...Array(5)].map((rate, index) =>  (
                    <Star1 
                        key={ index } 
                        color={index < Math.floor(reviewAndRating.averageRating!) ? "#E4A01C" : "#C0C0C0"} 
                        size={12} 
                        variant="Bold" 
                        className="mr-0.5"
                    />
                    )) }
                </View>
                <Text className="mt-1 text-xs">({ reviewAndRating.reviews?.length } Review{ reviewAndRating.reviews!.length !== 1 ? 's' : '' })</Text>
            </View>
        </View>
    );
}

export default RatingCardComponent;