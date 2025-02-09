import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Add, ArrowRight} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';

interface IProps {
  handleShowUpdateOrderBottomSheet: (value: boolean) => void;
}

const UpdateOrderStatusBottomSheetComponent: React.FC<IProps> = ({
  handleShowUpdateOrderBottomSheet,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 1.4;
  const slideAnimation = useRef<Animatable.View>(null);

  // State to manage checkbox selection
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // Toggle checkbox selection
  const toggleCheckbox = (status: string) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter(item => item !== status));
    } else {
      setSelectedStatus([...selectedStatus, status]);
    }
  };

  useEffect(() => {
    if (slideAnimation.current) {
      slideAnimation.current.animate(
        {
          0: {translateY: modalHeight},
          1: {translateY: 0},
        },
        1000,
      );
    }
  }, [modalHeight]);

  const handleCloseUpdateOrderBottomSheet = () => {
    if (slideAnimation.current) {
      slideAnimation.current
        .animate(
          {
            0: {translateY: 0, opacity: 1},
            1: {translateY: modalHeight, opacity: 0},
          },
          500,
        )
        .then(() => {
          handleShowUpdateOrderBottomSheet(false);
        });
    } else {
      handleShowUpdateOrderBottomSheet(false);
    }
  };

  return (
    <SafeAreaView className="h-full w-full absolute bg-black/70">
      <Animatable.View
        ref={slideAnimation}
        className="w-full absolute bottom-0 rounded-t-xl bg-white"
        style={{
          height: modalHeight,
          transform: [{translateY: modalHeight}],
        }}>
        {/*==== Header ====*/}
        <View className="h-[110px] w-full pt-4 px-5 rounded-t-xl rounded-b-3xl bg-baseGreen">
          <View className="h-auto w-full flex-row items-center justify-between ">
            <View className="px-6" />

            <Text className="font-montserratMedium text-xl text-white">
              Update Order Status
            </Text>

            <TouchableOpacity
              onPress={() => handleCloseUpdateOrderBottomSheet()}
              className="bg-[#20704329] p-1 rounded-xl">
              <Add color="#D5B07B" size={36} className="rotate-45" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-[calc(78%)] w-full px-5 flex-col justify-between">
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            stickyHeaderHiddenOnScroll={true}
            contentContainerStyle={{paddingHorizontal: 0, paddingBottom: 40}}>
            <Text className="font-montserratMedium mt-7 text-base text-gray-700">
              Select order status and update
            </Text>

            {/* Checkboxes with Status */}
            {[
              {
                id: '1',
                status: 'Order Processing',
              },
              {
                id: '2',
                status: 'Order Confirmed',
              },
              {
                id: '3',
                status: 'Order Pending',
              },
              {
                id: '4',
                status: 'Order Shipped',
              },
              {
                id: '5',
                status: 'Order Dispatched',
              },
              {
                id: '6',
                status: 'Order Delivered',
              },
            ].map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleCheckbox(item.status)}
                className="flex-row items-center mt-5">
                <View
                  className={`h-5 w-5 rounded-md border-2 ${
                    selectedStatus.includes(item.status)
                      ? 'bg-[#369460] border-[#369460]'
                      : 'border-baseGreen'
                  } flex items-center justify-center`}>
                  {/* Always show the checkmark */}
                  <Text
                    className={`text-xs ${
                      selectedStatus.includes(item.status)
                        ? 'text-white'
                        : 'text-baseGreen'
                    }`}>
                    ✓
                  </Text>
                </View>
                <View className="ml-3">
                  <Text className="text-gray-600">{item.status}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Update Button */}
            <TouchableOpacity
              onPress={() => {}}
              className="h-[55px] w-auto mt-7 flex flex-row items-center justify-center rounded-xl bg-baseGreen">
              <Text className="text-lg text-white mr-2">Update</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default UpdateOrderStatusBottomSheetComponent;
