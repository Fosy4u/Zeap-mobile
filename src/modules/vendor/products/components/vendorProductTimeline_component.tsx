import React from 'react';
import { View, Text } from 'react-native';
import { ITimeLine } from '../models/vendorProductDetails_model';
import { Add } from 'iconsax-react-native';
import TimeAgo from '../../../general/components/timeAgo';

interface IProps {
  timelines: ITimeLine[];
  handleFormatDate: (date: string) => string;
}

const VendorProductTimelineComponent: React.FC<IProps> = ({ timelines, handleFormatDate }) => {

  return (
    <View className="h-auto w-full mt-5">
      <Text className="font-semibold">Activities</Text>

      <View className="mt-2">
        { timelines.map((timeline, index) => (
          <View key={ timeline._id }>
            <View className="h-auto w-full flex-row items-center">
              <View className="h-14 flex-row items-center">
                <View className="h-10 w-10 mr-3 flex items-center justify-center border border-gray-300 rounded-full">
                  <Add size={ 27 } className="text-gray-500" />
                </View>
                <View className="h-auto w-full">
                  <Text>{ timeline.description }</Text>
                  <View className="flex-row items-center">
                    <Text>By { `${timeline.actionBy?.firstName!}` }  -</Text>
                    {/* <TimeAgo time={ timeline.date! } interval={60000} className="ml-2" /> */}
                    <Text className="ml-2">{ handleFormatDate(timeline.date!) }</Text>
                  </View>
                </View>
              </View>
            </View>
            {index !== timelines.length - 1 && (
              <View className="h-8 w-[1.9px] ml-[19px] my-0.5 bg-gray-300" />
            )}
          </View>
        )) }
      </View>
    </View>
  );
};

export default VendorProductTimelineComponent;