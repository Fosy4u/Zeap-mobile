import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ITimeLine } from '../models/productDetails_model';

interface IProps {
  timelines: ITimeLine[];
}

const TimelineComponent: React.FC<IProps> = ({ timelines }) => {

  return (
    <View className="h-auto w-full mt-5">
      <Text className="font-semibold">3 Weeks</Text>
      <Text className="mt-1">Delivery timeline</Text>

      <View className="mt-5">
        { timelines.map((timeline, index) => (
          <View key={ timeline._id }>
            <View className="h-auto w-full flex-row items-center">
              <View className="h-[14px] w-[14px] mr-3 rounded-full bg-gold" />
              <Text>{ timeline.description }</Text>
            </View>
            {index !== timelines.length - 1 && (
              <View className="h-[15px] w-[1.9px] ml-1.5 my-0.5 bg-[#717472]" />
            )}
          </View>
        )) }
      </View>
    </View>
  )
}

export default TimelineComponent;