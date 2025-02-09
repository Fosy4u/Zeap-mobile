import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styled} from 'nativewind';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ArrowRotateRight, TickSquare, Truck} from 'iconsax-react-native';
import OrderFilterBottomSheetComponent from '../components/orderFilterBottomSheet_component.tsx';

const StyledImage = styled(Image);
const StyledView = styled(View);

const OrdersScreen = () => {
  const [showOrderFilterBottomSheet, setShowOrderFilterBottomSheet] =
    useState(false);

  const handleShowOrderFilterBottomSheet = (value: boolean) => {
    setShowOrderFilterBottomSheet(value);
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  const payments = [
    {
      id: 1,
      orderId: '62500',
      productImage: require('../../../../../assets/images/home/sweat_shirt.png'),
      productName: 'Men’s Long Sleeves Polo',
      date: '2025/01/01',
      status: 'Processing',
      orderBy: 'Otor John Stephen',
      time: '06:04am',
      amount: 1000,
    },
    {
      id: 2,
      orderId: '62501',
      productImage: require('../../../../../assets/images/home/sweat_shirt.png'),
      productName: 'Men’s Long sleeves polo',
      date: '2025/01/02',
      status: 'Confirmed',
      orderBy: 'Jane Doe',
      time: '08:15am',
      amount: 2500,
    },
    {
      id: 3,
      orderId: '62502',
      productImage: require('../../../../../assets/images/home/sweat_shirt.png'),
      productName: 'Men’s Long sleeves polo',
      date: '2025/01/03',
      status: 'Shipped',
      orderBy: 'Sam Wilson',
      time: '10:30am',
      amount: 1800,
    },
    {
      id: 4,
      orderId: '62503',
      productImage: require('../../../../../assets/images/home/sweat_shirt.png'),
      productName: 'Men’s Long sleeves polo',
      date: '2025/01/04',
      status: 'Delivered',
      orderBy: 'John Doe',
      time: '01:20pm',
      amount: 3000,
    },
    {
      id: 5,
      orderId: '62504',
      productImage: require('../../../../../assets/images/home/short_sleeve_shirt.png'),
      productName: 'Men’s short sleeves shirt',
      date: '2025/01/04',
      status: 'Delivered',
      orderBy: 'John Doe',
      time: '01:20pm',
      amount: 3000,
    },
  ];

  const renderStatus = (status: string) => {
    switch (status) {
      case 'Processing':
        return (
          <View className="p-2 bg-orange/10 border border-orange flex flex-row items-center justify-center rounded-lg">
            <ArrowRotateRight size={14} className="text-orange mr-1" />
            <Text className="text-orange text-xs">Processing</Text>
          </View>
        );
      case 'Confirmed':
        return (
          <View className="p-2 bg-[#E3ECFF] flex border border-[#9EBDF8] flex-row items-center justify-center rounded-lg">
            <TickSquare size={14} className="text-[#3461B9] mr-1" />
            <Text className="text-[#3461B9] text-xs">Confirmed</Text>
          </View>
        );
      case 'Shipped':
        return (
          <View className="p-2 bg-orange/10 border border-orange flex flex-row items-center justify-center rounded-lg">
            <Truck size={14} className="text-orange mr-1" />
            <Text className="text-orange text-xs">Shipped</Text>
          </View>
        );
      case 'Delivered':
        return (
          <View className="p-2 bg-lightGreen/70 flex border border-[#369460] flex-row items-center justify-center rounded-lg">
            <TickSquare size={14} className="text-[#369460] mr-1" />
            <Text className="text-[#369460] text-xs">Delivered</Text>
          </View>
        );
    }
  };

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-screen w-full flex-1">
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
                onPress={() => handleShowOrderFilterBottomSheet(true)}>
                <StyledImage
                  source={require('../../../../../assets/images/filter_gold.png')}
                  className="h-[25px] w-[25px]"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ORDER CARD */}
          <ScrollView className="p-5">
            <View className="gap-2 mb-32">
              {payments.length > 0 ? (
                payments.map(payment => (
                  <TouchableOpacity
                    key={payment.id}
                    onPress={() =>
                      navigation.navigate('orderRequestDetailsScreen', {
                        orderId: payment.orderId,
                        order: payment,
                      })
                    }>
                    <StyledView
                      key={payment.id}
                      className="mb-1 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
                      <View className="flex-row justify-between">
                        <Text className="text-base text-gray-700 font-semibold">
                          Order# {payment.orderId}
                        </Text>
                        <StyledView>{renderStatus(payment.status)}</StyledView>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <StyledImage
                            source={payment.productImage}
                            resizeMode="contain"
                            className="h-[60px] w-[40px] rounded-xl"
                          />
                          <View className="ml-2.5">
                            <Text className="text-base">
                              {payment.productName}
                            </Text>
                            <Text className="text-base font-bold">
                              ₦{payment.amount}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View className="mt-2">
                        <Text className="text-xs font-semibold">
                          By: {payment.orderBy} - {payment.date} -{' '}
                          {payment.time}
                        </Text>
                      </View>
                    </StyledView>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-base text-gray-500">
                  No payments found
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Bottom Sheet */}
          {showOrderFilterBottomSheet && (
            <OrderFilterBottomSheetComponent
              handleShowOrderFilterBottomSheet={
                handleShowOrderFilterBottomSheet
              }
            />
          )}
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default OrdersScreen;
