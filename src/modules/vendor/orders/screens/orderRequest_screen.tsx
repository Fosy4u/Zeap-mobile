import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppHeaderComp from '../../general/components/appHeader_comp.tsx';
import {RouteProp, useNavigation} from '@react-navigation/native';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import {ArrowRight, ArrowRotateRight} from 'iconsax-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UpdateOrderStatusBottomSheetComponent from '../components/updateOrderStatusBottomSheet_component.tsx';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface IProps {
  route: RouteProp<RootNavigationStackModel, 'orderRequestDetailsScreen'>;
}

const OrderRequestDetailsScreen: React.FC<IProps> = ({route}) => {
    const [showUpdateOrderBottomSheet, setShowUpdateOrderBottomSheet] =
      useState(false);

    const handleShowUpdateOrderBottomSheet = (value: boolean) => {
      setShowUpdateOrderBottomSheet(value);
    };
      
  const {orderId, order} = route.params;

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1">
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />
          <AppHeaderComp title="Order Request" />
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="h-full w-full mt-2 px-5 pt-3">
            {/* Top Card */}
            <View className="mb-4 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
              <View className="flex-row justify-between">
                <Text className="text-base text-gray-700 font-semibold">
                  Order# {orderId}
                </Text>

                {/* Status */}
                <View className="p-2 bg-orange/10 border border-orange flex flex-row items-center justify-center rounded-lg">
                  <ArrowRotateRight size={14} className="text-orange mr-1" />
                  <Text className="text-orange text-xs">{order.status}</Text>
                </View>
              </View>
              <View className="my-2 flex-row justify-between items-center">
                <Text className="text-xs bg-[#E0E2E8] py-1.5 px-2 rounded-md font-semibold">
                  Placed on: {order.date} : {order.time}
                </Text>
                <Text className="text-xs bg-lightGreen/70 rounded-md text-[#369460] px-2 py-1.5 font-semibold">
                  Paid
                </Text>
              </View>
              <View className="flex-row pt-2 items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={order.productImage}
                    resizeMode="contain"
                    className="h-[60px] w-[40px] rounded-xl"
                  />
                  <View className="ml-2.5">
                    <Text className="text-base">{order.productName}</Text>
                    <Text className="text-base font-bold">₦{order.amount}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Items details */}
            <View className="mb-4 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
              <Text className="text-lg font-bold">Item Details</Text>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Product type</Text>
                <Text className="text-sm text-gray-700">{'Clothes'}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Category</Text>
                <Text className="text-sm text-gray-700">{'Bespoke'}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Category option</Text>
                <Text className="text-sm text-gray-700">{'Male adult'}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Quantity</Text>
                <Text className="text-sm text-gray-700">{'X2'}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Category</Text>
                <Text className="text-sm text-gray-700">{'Large(L)'}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Colour</Text>
                <Text className="text-sm text-gray-700">{'Peach'}</Text>
              </View>
            </View>

            {/* Measurement */}
            <View className="mb-4 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
              <Text className="text-lg font-bold">Measurement</Text>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Shoulder</Text>
                <Text className="text-sm text-gray-700">{'16cm'}</Text>
              </View>

              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Arm length</Text>
                <Text className="text-sm text-gray-700">{'13cm'}</Text>
              </View>

              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">body length</Text>
                <Text className="text-sm text-gray-700">{'28cm'}</Text>
              </View>

              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Chest</Text>
                <Text className="text-sm text-gray-700">{'16cm'}</Text>
              </View>

              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Wrist</Text>
                <Text className="text-sm text-gray-700">{'9cm'}</Text>
              </View>

              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="text-sm text-gray">Waist</Text>
                <Text className="text-sm text-gray-700">{'32cm'}</Text>
              </View>
            </View>

            {/* Delivery address */}
            <View className="mb-4 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
              <Text className="text-lg font-bold">Delivery address</Text>
              <Text className="text-base mt-2">
                38 Ashiek Jarma Street, off Mike Akhigbe way, opposite Chida
                Hotel, Jabi Abuja
              </Text>
            </View>

            {/* Status TimeLine */}

            <TouchableOpacity
              onPress={() => handleShowUpdateOrderBottomSheet(true)}
              className="mb-4 h-[55px] w-auto mt-1 flex flex-row items-center justify-center rounded-xl bg-baseGreen">
              <Text className="text-lg text-white mr-2">Update Status</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>
          </ScrollView>
          {/* Bottom Sheet */}
          {showUpdateOrderBottomSheet && (
            <UpdateOrderStatusBottomSheetComponent
              handleShowUpdateOrderBottomSheet={
                handleShowUpdateOrderBottomSheet
              }
            />
          )}
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default OrderRequestDetailsScreen;
