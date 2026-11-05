import React from 'react';
import { View, Text } from 'react-native';
import { getProductTimeline } from '../../../../utils/productTimelines';

interface IProps {
  productType: string;
}

const TimelineComponent: React.FC<IProps> = ({ productType }) => {
  const timelines = getProductTimeline(productType);

  return (
    <View className="h-auto w-full mt-5">
      <Text className="mt-1">Delivery timeline</Text>

      <View className="mt-5">
        { timelines.map((timeline, index) => (
          <View key={ index }>
            <View className="h-auto w-full flex-row items-center">
              <View className="h-[14px] w-[14px] mr-3 rounded-full bg-gold" />
              <View className="flex-1">
                <Text className="font-montserratMedium text-black">{ timeline.title }</Text>
                <Text className="text-xs">{ timeline.description }</Text>
              </View>
            </View>
            {index !== timelines.length - 1 && (
              <View className="h-[20px] w-[1.9px] ml-1.5 my-0.5 bg-[#717472]" />
            )}
          </View>
        )) }
      </View>
    </View>
  );
};

export default TimelineComponent;
