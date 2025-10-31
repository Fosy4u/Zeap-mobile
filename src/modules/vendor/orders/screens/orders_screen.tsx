import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView, RefreshControl} from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { setShowOrderFilterBottomSheet } from '../../home/slices/vendorHome_slice.tsx';
import useOrderHook from '../hooks/order_hook.ts';
import { RootState } from '../../../../redux/store/store.ts';
import OrderCardComponent from '../components/orderCard_component.tsx';
import EmptyListComponent from '../../../general/components/emptyList_component.tsx';


const OrdersScreen = () => {
  const { orders } = useSelector((state: RootState) => state.vendorOrderState);
  const dispatch = useDispatch();
  // console.log("ORDERS::: ", orders);
  
  const { status, handleGetOrders } = useOrderHook();

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
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id!}
            contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
            renderItem={({ item }) => (
              <OrderCardComponent order={item} status={status} />
            )}
            ListEmptyComponent={() => (
              <View className="px-5 flex-1 items-center py-8">
                <EmptyListComponent message="ordered product yet." />
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={handleGetOrders}
              />
            }
          />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default OrdersScreen;
