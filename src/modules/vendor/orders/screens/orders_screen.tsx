import React, { useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ArrowRotateRight, Icon, TickSquare, Truck} from 'iconsax-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setShowOrderFilterBottomSheet } from '../../home/slices/vendorHome_slice.tsx';
import useOrderHook from '../hooks/order_hook.ts';
import { RootState } from '../../../../redux/store/store.ts';
import formatCurrency from '../../../../utils/formatCurrency.ts';
import formatDate from '../../../../utils/formatDate.ts';
import FastImage from 'react-native-fast-image';
import { setOrder } from '../slices/orderState_slice.ts';

const OrdersScreen = () => {
  const { orders } = useSelector((state: RootState) => state.vendorOrderState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  // console.log("ORDERS::: ", orders);
  
  const { status, handleGetOrders, handleGetOrderHistory } = useOrderHook();

  useEffect(() => {
    handleGetOrders();
  }, []);


  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-screen w-full flex-1 pb-[1px]">
          <StatusBar backgroundColor="#133522" barStyle="light-content" />
          {/* ==== Header ==== */}
          <View className="h-[120px] w-full pt-4 px-5 rounded-b-3xl bg-baseGreen">
            <View className="h-auto w-full flex-row items-center justify-between ">
              <View className="px-6" />
              <Text className="font-montserratMedium text-xl text-white">
                All Order Request
              </Text>
              <TouchableOpacity
                className="bg-[#20704329] p-2.5 rounded-xl"
                onPress={() => dispatch(setShowOrderFilterBottomSheet(true))}>
                <Image
                  source={require('../../../../../assets/images/filter_gold.png')}
                  className="h-[25px] w-[25px]"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ORDER CARD */}
          <ScrollView className="p-5">
            <View className="gap-2 mb-32">
              { orders.map(order => (
                  <TouchableOpacity
                    key={order._id}
                    onPress={() => {
                      dispatch(setOrder(order!));
                      handleGetOrderHistory(order._id!);
                      navigation.navigate('vendorOrderDetailsScreen', {
                        orderId: order.orderId!,
                      })
                    } }>
                    <View
                      className="mb-1 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
                      <View className="flex-row items-center justify-between">
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
                      <View className="flex-row items-center">
                        <FastImage
                          source={{uri: order.images![0].link!}}
                          defaultSource={require('../../../../../assets/images/app_logo.png')}
                          resizeMode="contain"
                          className="h-[70px] w-[50px] rounded-xl"
                        />
                        <View className="ml-2.5 flex-1 ">
                          <Text className="font-montserratMedium text-baseGreen leading-4 flex-shrink flex-wrap">
                            {order.product?.title!}
                          </Text>
                          <Text className="font-montserratSemiBold text-baseGreen">
                            {order.amount!.length > 0 ? formatCurrency(order.amount![0].value!, order.amount![0].currency) : "₦0.0"}
                          </Text>
                        </View>
                      </View>
                      <View className="mt-2 flex-row items-center gap-x-2">
                        <Text className="font-montserratRegular text-gray-700">Order date:</Text>
                        <Text className="font-montserratMedium text-sm text-gray-800">{ formatDate(order.createdAt!.toString(), false) }</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              }
            </View>
          </ScrollView>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default OrdersScreen;
