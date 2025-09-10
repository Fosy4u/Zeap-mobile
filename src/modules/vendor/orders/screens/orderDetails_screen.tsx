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
import {ArrowRight, ArrowRotateRight, TickSquare, Truck} from 'iconsax-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UpdateOrderStatusBottomSheetComponent from '../components/updateOrderStatusBottomSheet_component.tsx';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import formatDate from '../../../../utils/formatDate.ts';
import FastImage from 'react-native-fast-image';
import formatCurrency from '../../../../utils/formatCurrency.ts';
import useOrderHook from '../hooks/order_hook.ts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store.ts';
import { setShowUpdateOrderBottomSheet } from '../slices/orderState_slice.ts';
import FormatWords from '../../../../utils/formatWords.ts';

interface IProps {
  route: RouteProp<RootNavigationStackModel, 'vendorOrderDetailsScreen'>;
}

const VendorOrderDetailsScreen: React.FC<IProps> = ({route}) => {
  const { order, orderHistory, showUpdateOrderBottomSheet } = useSelector((state: RootState) => state.vendorOrderState);
  const {orderId} = route.params;
  const dispatch = useDispatch();
  console.log("CURRENT HISTORY::: ", FormatWords.capitalizeWord(orderHistory.nextStatus?.name!));
  

  const { status } = useOrderHook();

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1">
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />
          <AppHeaderComp title="Order Request" />
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="h-full w-full mt-2 px-5 pt-3">
            {/* Product Image */}
            <View className="mb-4 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
              <FastImage
                source={{uri: order.images![0].link!}}
                defaultSource={require('../../../../../assets/images/app_logo.png')}
                resizeMode="contain"
                className="h-[385px] w-full rounded-xl"
              />
            </View>

            {/* Items details */}
            <View className="mb-4 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
              <Text className="font-montserratSemiBold text-lg text-baseGreen">Item Details</Text>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <View className="flex-row items-center gap-x-2">
                  <Text className="font-montserratRegular text-gray-700">Order#:</Text>
                  <Text className="font-montserratSemiBold text-baseGreen">{order.orderId}</Text>
                </View>

                { (() => {
                  const statusName = order.status!.name!.charAt(0).toUpperCase() + order.status!.name!.slice(1);
                  const Icon = status[statusName].icon;

                  return (
                    <View className={`p-2 ${status[statusName].bgColor} flex border ${status[statusName].borderColor} flex-row items-center justify-center rounded-lg`}>
                        <Icon size={14} className={`${status[statusName].textColor} mr-1`} />
                      <Text className={`${status[statusName].textColor} text-xs`}>{statusName}</Text>
                    </View>
                  );
                })() }
              </View>
              <View className="h-auto w-full mt-5 flex-row items-center justify-between">
                <Text className="font-montserratRegular text-gray-700">SKU:</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{ order.sku! }</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row items-center justify-between">
                <Text className="font-montserratRegular text-gray-700">Order date:</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{ formatDate(order.createdAt!.toString(), false) }</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="font-montserratRegular text-gray-700">Product type</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{order.product?.categories?.main![0]}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="font-montserratRegular text-gray-700">Product group</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{order.product?.categories?.productGroup!}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="font-montserratRegular text-gray-700">Size</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{order.size}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="font-montserratRegular text-gray-700">Quantity</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{order.quantity}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="font-montserratRegular text-gray-700">Colour</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{order.color}</Text>
              </View>
            </View>

            {/* Measurement */}
            { (order.bodyMeasurements!.length > 0) && (
              <View className="mb-4 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
                <Text className="text-lg font-bold">Measurement</Text>
                <View className="h-auto w-full mt-5 flex-row justify-between">
                  <Text className="font-montserratRegular text-gray-700">Shoulder</Text>
                  <Text className="font-montserratMedium text-sm text-gray-800">{'16cm'}</Text>
                </View>

                <View className="h-auto w-full mt-5 flex-row justify-between">
                  <Text className="font-montserratRegular text-gray-700">Arm length</Text>
                  <Text className="font-montserratMedium text-sm text-gray-800">{'13cm'}</Text>
                </View>

                <View className="h-auto w-full mt-5 flex-row justify-between">
                  <Text className="font-montserratRegular text-gray-700">body length</Text>
                  <Text className="font-montserratMedium text-sm text-gray-800">{'28cm'}</Text>
                </View>

                <View className="h-auto w-full mt-5 flex-row justify-between">
                  <Text className="font-montserratRegular text-gray-700">Chest</Text>
                  <Text className="font-montserratMedium text-sm text-gray-800">{'16cm'}</Text>
                </View>

                <View className="h-auto w-full mt-5 flex-row justify-between">
                  <Text className="font-montserratRegular text-gray-700">Wrist</Text>
                  <Text className="font-montserratMedium text-sm text-gray-800">{'9cm'}</Text>
                </View>

                <View className="h-auto w-full mt-5 flex-row justify-between">
                  <Text className="font-montserratRegular text-gray-700">Waist</Text>
                  <Text className="font-montserratMedium text-sm text-gray-800">{'32cm'}</Text>
                </View>
              </View>
            ) }

            {/* Delivery Details */}
            <View className="mb-10 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
              <Text className="font-montserratSemiBold text-lg text-baseGreen">Delivery Details</Text>
              <View className="h-auto w-full mt-5">
                <Text className="font-montserratRegular text-gray-700">Vendor completion date:</Text>
                <Text className="font-montserratMedium text-base text-gray-800">{ formatDate(order.expectedVendorCompletionDate!.min!.toString(), true) } - { formatDate(order.expectedVendorCompletionDate!.max!.toString(), true) }</Text>
              </View>
              <View className="h-auto w-full mt-5">
                <Text className="font-montserratRegular text-gray-700">Vendor delivery date:</Text>
                <Text className="font-montserratMedium text-base text-gray-800">{ formatDate(order.expectedDeliveryDate!.min!.toString(), true) } - { formatDate(order.expectedDeliveryDate!.max!.toString(), true) }</Text>
              </View>
            </View>

            { (FormatWords.capitalizeWord(orderHistory.nextStatus?.name!) !== "Dispatched") && (
              <TouchableOpacity
                onPress={() => dispatch(setShowUpdateOrderBottomSheet(true))}
                className="mb-8 h-[55px] w-auto mt-1 flex flex-row items-center justify-center rounded-xl bg-baseGreen">
                <Text className="text-lg text-white mr-2">Update Status</Text>
                <ArrowRight className="text-white" />
              </TouchableOpacity>
            ) }
          </ScrollView>
          {/* Bottom Sheet */}
          {showUpdateOrderBottomSheet && (
            <UpdateOrderStatusBottomSheetComponent />
          )}
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default VendorOrderDetailsScreen;
