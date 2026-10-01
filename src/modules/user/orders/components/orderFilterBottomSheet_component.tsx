import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { useMemo } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import useOrderHook from '../hooks/order_hook';

export type IOrderFilterBottomSheetComponent = {
    bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
    snapPoints: string[];
    setShowBottomSheetModal: (value: boolean) => void;
}

const OrderFilterBottomSheetComponent = ({ bottomSheetModalRef, snapPoints, setShowBottomSheetModal }: IOrderFilterBottomSheetComponent) => {
    const { orders } = useSelector((state: RootState) => state.orderState);

    const { filterOrdersByStatus } = useOrderHook();

    const filterCounts = useMemo(() => {
        /* The API can return an order with no productOrders (and a product order
           with no status), so every hop is guarded — one miss throws here. */
        const countByStatus = (status: string) =>
            (orders ?? []).filter(order =>
                (order?.productOrders ?? []).some(
                    productOrder => productOrder?.status?.name?.toLowerCase() === status,
                ),
            ).length;

        return {
            allCount: (orders ?? []).length,
            placedCount: countByStatus('placed'),
            confirmedCount: countByStatus('confirmed'),
            processingCount: countByStatus('processing'),
            readyCount: countByStatus('ready'),
            dispatchedCount: countByStatus('dispatched'),
            deliveredCount: countByStatus('delivered'),
            cancelledCount: countByStatus('cancelled'),
        };
    }, [orders]);

    // The full lifecycle — Confirmed and Ready were missing, so orders sitting in
    // those states weren't filterable here.
    const filterItems = [
        { name: 'All', count: filterCounts.allCount },
        { name: 'Placed', count: filterCounts.placedCount },
        { name: 'Confirmed', count: filterCounts.confirmedCount },
        { name: 'Processing', count: filterCounts.processingCount },
        { name: 'Ready', count: filterCounts.readyCount },
        { name: 'Dispatched', count: filterCounts.dispatchedCount },
        { name: 'Delivered', count: filterCounts.deliveredCount },
        { name: 'Cancelled', count: filterCounts.cancelledCount },
    ];


    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose
            onDismiss={() => setShowBottomSheetModal(false)}
        >
            <BottomSheetView className="flex-1">
                <View className="h-full w-full pt-5">

                    {/*==== Modal Header ====*/}
                    <View className="mx-[25px]">
                        <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                            <Text className="text-[24px] leading-[34px] text-black">
                                Filter Orders
                            </Text>
                        </View>
                        <Text className="mt-3 text-[16px] text-gray-700 ">Select your preferred order type.</Text>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={ false }
                        showsHorizontalScrollIndicator={ false }
                        stickyHeaderHiddenOnScroll={ true }
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
                    >
                        <View className="mt-6">
                            { filterItems.map((item, index) => (
                                <TouchableOpacity
                                    onPress={ () => {
                                        filterOrdersByStatus(item.name);
                                        bottomSheetModalRef.current?.dismiss();
                                    } }
                                    key={ index }>
                                    <View className="h-auto w-full py-2">
                                        <Text className="font-medium text-[14px] text-gray-700">
                                            { item.name } ({ item.count } { item.count <= 1 ? 'order' : 'orders' })
                                        </Text>

                                        <View className="h-[1px] w-full mt-4 bg-gray-200" />
                                    </View>
                                </TouchableOpacity>
                            )) }
                        </View>
                    </ScrollView>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
}

export default OrderFilterBottomSheetComponent