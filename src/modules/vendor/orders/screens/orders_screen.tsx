import React, { useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CloseCircle, SearchNormal1 } from 'iconsax-react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView, RefreshControl} from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { setShowOrderFilterBottomSheet } from '../../home/slices/vendorHome_slice.tsx';
import useOrderHook from '../hooks/order_hook.ts';
import { RootState } from '../../../../redux/store/store.ts';
import OrderCardComponent from '../components/orderCard_component.tsx';
import EmptyListComponent from '../../../general/components/emptyList_component.tsx';
import SkeletonBlock from '../../../general/components/skeletonBlock_component.tsx';
import ModuleAppBarComponent from '../../../general/components/moduleAppBar_component.tsx';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook.ts';
import { hasActiveOrderFilter } from '../models/orderFilter_model.ts';
import AppStatusBar from "../../../general/components/appStatusBar";


const OrdersScreen = () => {
  const { isLoading, ordersHaveFetched } = useSelector((state: RootState) => state.vendorOrderState);
  const dispatch = useDispatch();
  // console.log("ORDERS::: ", orders);

  const {
    visibleOrders, searchPhrase, handleSearchOrders,
    filters, handleClearOrderFilters, handleGetOrders,
  } = useOrderHook();
  const { currencyRefreshToken } = useDisplayCurrency();
  const hasFilters = hasActiveOrderFilter(filters);

  useEffect(() => {
    handleGetOrders();
  }, [currencyRefreshToken]);

  // Skeleton on the first load only; refreshes keep the rows and use the spinner.
  const isLoadingOrders = !ordersHaveFetched;


  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-screen w-full flex-1 pb-[1px]">
          <AppStatusBar backgroundColor="#133522" barStyle="light-content" />

          {/* ==== Header ==== */}
          <ModuleAppBarComponent
            title="All Order Request"
            variant="vendor"
            rightIcon={
              <Image
                source={require('../../../../../assets/images/filter_gold.png')}
                className="h-[25px] w-[25px]"
              />
            }
            onRightPress={() => dispatch(setShowOrderFilterBottomSheet(true))}
          />

          {/*==== Search Box — filters the fetched orders as you type (product
               name or order number). No endpoint call, so it stays instant. ====*/}
          <View className="h-auto w-full mt-4 px-5">
            <View className="h-[55px] w-full px-3 py-1 flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
              <SearchNormal1 color="#9ca3af" size={20} />
              <TextInput
                placeholder="Search by product name or order number"
                placeholderTextColor="#9ca3af"
                value={searchPhrase}
                onChangeText={handleSearchOrders}
                autoCorrect={false}
                className="h-[44px] ml-2.5 flex-1 text-base text-baseGreen"
              />
              { !!searchPhrase && (
                <TouchableOpacity onPress={() => handleSearchOrders("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <CloseCircle color="#9ca3af" size={20} variant="Bold" />
                </TouchableOpacity>
              ) }
            </View>

            { hasFilters && (
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="font-montserratMedium text-xs text-gray-500">
                  { visibleOrders.length } { visibleOrders.length === 1 ? "order" : "orders" } match your filters
                </Text>
                <TouchableOpacity onPress={ handleClearOrderFilters }>
                  <Text className="font-montserratSemiBold text-xs text-baseGreen">Clear filters</Text>
                </TouchableOpacity>
              </View>
            ) }
          </View>

          {/* Loading is handled before the list, so an empty list while loading
              can't fall through to ListEmptyComponent. */}
          { isLoadingOrders ? (
            <View style={{ padding: 20 }}>
              { [0, 1, 2, 3].map((row) => (
                <View key={ row } style={{ marginBottom: 16 }}>
                  <SkeletonBlock
                    width={ Dimensions.get('window').width - 40 }
                    height={ 120 }
                    radius={ 12 }
                  />
                </View>
              )) }
            </View>
          ) : (
            <FlatList
              data={visibleOrders}
              keyExtractor={(item) => item._id!}
              contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
              renderItem={({ item }) => (
                <OrderCardComponent order={item} />
              )}
              ListEmptyComponent={() => (
                <View className="px-5 flex-1 items-center py-8">
                  { (searchPhrase.trim() || hasFilters) ? (
                    <Text className="font-montserratMedium text-sm text-gray-500 text-center">
                      No order matches your search or filters.
                    </Text>
                  ) : (
                    <EmptyListComponent message="ordered product yet." />
                  ) }
                </View>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={() => handleGetOrders()}
                />
              }
            />
          ) }
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default OrdersScreen;
