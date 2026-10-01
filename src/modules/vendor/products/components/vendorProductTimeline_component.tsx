import React from 'react';
import { View, Text } from 'react-native';
import { ITimeLine } from '../models/vendorProductDetails_model';
import { Add } from 'iconsax-react-native';
import { timeAgo } from '../../../../utils/formatTime';

interface IProps {
  timelines: ITimeLine[];
}

const VendorProductTimelineComponent: React.FC<IProps> = ({ timelines }) => {

  const orderedTimelines = [...(timelines ?? [])].reverse();

  return (
    <View className="h-auto w-full mt-5">
      <Text className="font-semibold">Activities</Text>

      <View className="mt-2">
        { orderedTimelines.map((timeline, index) => (
          <View key={ timeline._id }>
            <View className="h-auto w-full flex-row items-start">
              <View className="h-10 w-10 mr-3 flex items-center justify-center border border-gray-300 rounded-full">
                <Add size={ 27 } className="text-gray-500" />
              </View>

              <View className="flex-1 pt-1">
                <Text className="font-montserratMedium text-gray-800">{ timeline.description }</Text>
                <View className="mt-0.5 flex-row items-center flex-wrap">
                  <Text className="text-xs text-gray-500">By { timeline.actionBy?.firstName ?? "Unknown" }</Text>
                  <Text className="mx-1 text-xs text-gray-400">•</Text>
                  {/* Relative time ("5 min ago"), matching the web timeline.
                      timeAgo falls back to an absolute date past 30 days. */}
                  <Text className="text-xs text-gray-500">{ timeAgo(timeline.date!) }</Text>
                </View>
              </View>
            </View>
            {index !== orderedTimelines.length - 1 && (
              <View className="h-8 w-[1.9px] ml-[19px] my-0.5 bg-gray-300" />
            )}
          </View>
        )) }
      </View>
    </View>
  );
};

export default VendorProductTimelineComponent;