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
import FormatWords from '../../../../utils/formatWords.ts';
import useOrderHook from '../hooks/order_hook.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store.ts';
import AppLoader from '../../../general/components/appLoader.tsx';
import { INextStatus } from '../models/orderHistory_model.ts';

interface IStatus {
  id: string;
  label: string;
};

const UpdateOrderStatusBottomSheetComponent = () => {
  const { orderHistory } = useSelector((state: RootState) => state.vendorOrderState);
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.generalState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  
  const {
    selectedStatus, setSelectedStatus, handleUpdateOrderStatus,
    modalHeight, slideAnimation, handleCloseUpdateOrderBottomSheet
  } = useOrderHook();

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
            {orderHistory.statusHistory?.map(status => (
              <View
                key={status.name!}
                className="flex-row items-center mt-5">
                <View
                  className="h-6 w-6 flex items-center justify-center rounded-md border-2 border-[#369460] bg-[#369460]">
                  <Text className="text-sm text-white">✓</Text>
                </View>
                <View className="ml-3">
                  <Text className="font-montserratMedium text-base text-baseGreen">{FormatWords.capitalizeWords(status.value!)}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={() => {
                if (Object.keys(selectedStatus).length === 0) {
                  setSelectedStatus(orderHistory.nextStatus!);
                } else {
                  setSelectedStatus({} as INextStatus);
                }
              }}
              className="flex-row items-center mt-5"
            >
              <View
                className={`h-6 w-6 flex items-center justify-center rounded-md border-2 ${
                  Object.keys(selectedStatus).length > 0
                    ? 'bg-[#369460] border-[#369460]'
                    : 'border-gray-400'
                }`}
              >
                {Object.keys(selectedStatus).length > 0 && (
                  <Text className="text-sm text-white">✓</Text>
                )}
              </View>
              <View className="ml-3">
                <Text className="font-montserratMedium text-base text-baseGreen">
                  {FormatWords.capitalizeWords(orderHistory.nextStatus?.value ?? '')}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Update Button */}
            <TouchableOpacity
              disabled={Object.keys(selectedStatus).length === 0}
              onPress={() => handleUpdateOrderStatus(selectedStatus.value!)}
              className={`h-[55px] w-auto mt-10 flex flex-row items-center justify-center rounded-xl 
                ${Object.keys(selectedStatus).length === 0 ? 'bg-gray-300' : 'bg-baseGreen'}`}
            >
              <Text
                className={`text-lg mr-2 ${
                  Object.keys(selectedStatus).length === 0 ? 'text-gray-500' : 'text-white'
                }`}
              >
                Update
              </Text>
              <ArrowRight
                className={`${
                  Object.keys(selectedStatus).length === 0 ? 'text-gray-500' : 'text-white'
                }`}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animatable.View>

        { isLoading &&
          <AppLoader loadingAdditionalMessage={ loadingMessage } />
        }
    </SafeAreaView>
  );
};

export default UpdateOrderStatusBottomSheetComponent;
