import React from 'react';
import { IStatus } from '../models/order_model';
import { Text, View } from 'react-native';
import { timeAgo } from '../../../../utils/formatTime';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import FormatWords from '../../../../utils/formatWords';

interface IProps {
  statusHistory: IStatus;
}

const OrderStatusHistoryComponent: React.FC<IProps> = ({ statusHistory }) => {
  const { orderHistory } = useSelector((state: RootState) => state.orderState);
  const statusHistories = orderHistory.statusHistory;
  console.log("ORDER STATUS HISTORY::: ", statusHistories);
  


     // Find the current status index
    const currentStatusName = Array.isArray(statusHistory)
      ? statusHistory[statusHistory.length - 1]?.name
      : statusHistory.name;

    const currentStatusIndex = statusHistories.findIndex(
      (item) => item.name === currentStatusName
    );

    return (
      <View className="h-auto w-full mt-5">
        <View className="mt-5">
          <Text className="font-montserratSemiBold text-baseGreen ">Status History</Text>
          
          <View className="mt-2 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">

            { statusHistories.map((statusHistory, index) => {
              const isActive = index <= currentStatusIndex;
            
              return(
                <View key={ statusHistory.name }>
                  <View className="h-auto w-full flex-row items-center">
                    <View
                      className="h-[14px] w-[14px] mr-3 rounded-full"
                      style={{ backgroundColor: isActive ? "#138e40" : "#dadada" }} // green or gray
                    />
                    <Text>{ FormatWords.capitalizeWord(statusHistory.value) } - ({ timeAgo(statusHistory.date) })</Text>
                  </View>

                  <View className="h-[15px] w-[1.9px] ml-1.5 my-0.5 bg-[#dadada]" />

                  <View className="h-auto w-full flex-row items-center">
                    <View
                      className="h-[14px] w-[14px] mr-3 rounded-full bg-[#dadada]"
                    />
                    <Text>{ FormatWords.capitalizeWord(orderHistory.nextStatus.value) } - (Up next)</Text>
                  </View>

                  {/* {index !== statusHistories.length - 1 && (
                    <View className="h-[15px] w-[1.9px] ml-1.5 my-0.5 bg-[#dadada]" />
                  )} */}
                </View>
              )}
            ) }
          </View>
        </View>
      </View>
    );
}

export default OrderStatusHistoryComponent;