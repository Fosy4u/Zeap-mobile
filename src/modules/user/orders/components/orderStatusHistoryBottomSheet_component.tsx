import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { useEffect } from 'react'
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import useOrderHook from '../hooks/order_hook';
import FormatWords from '../../../../utils/formatWords';
import { timeAgo } from '../../../../utils/formatTime';
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

type IOrderStatusHistoryBottomSheetComponent = {
    bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
    snapPoints: string[];
    setShowBottomSheetModal: (value: boolean) => void;
}

const OrderStatusHistoryBottomSheetComponent = ({ bottomSheetModalRef, snapPoints, setShowBottomSheetModal }: IOrderStatusHistoryBottomSheetComponent) => {
    const { orderHistory, selectedOrderStatus } = useSelector((state: RootState) => state.orderState);
    const statusHistories = orderHistory.statusHistory;

    const { historyIsLoading } = useOrderHook();

    const currentStatusIndex = statusHistories.findIndex(
      (item) => item.name === selectedOrderStatus.name,
    );
    const spinValue = useSharedValue(0);

    useEffect(() => {
        spinValue.value = withRepeat(
            withTiming(1, { duration: 1000 }),
            -1,
            false
        );
    }, []);

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
                                Status History
                            </Text>
                        </View>
                        <Text className="mt-3 text-[16px] text-gray-700 ">Order status history and time constraints.</Text>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={ false }
                        showsHorizontalScrollIndicator={ false }
                        stickyHeaderHiddenOnScroll={ true }
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
                    >
                        <View className="mt-2 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                            { statusHistories.map((statusHistory, index) => {
                                const isActive = index <= currentStatusIndex;
                                const isLastItem = index === statusHistories.length - 1;
                                
                                return(
                                    <View key={ statusHistory.name }>
                                        <View className="h-auto w-full flex-row items-center">
                                            <View
                                            className="h-[14px] w-[14px] mr-3 rounded-full"
                                            style={{ backgroundColor: isActive ? "#138e40" : "#dadada" }} // green or gray
                                            />
                                            <Text>{ FormatWords.capitalizeWord(statusHistory.value) } - ({ statusHistory.date ? timeAgo(statusHistory.date) : "N/A" })</Text>
                                        </View>

                                        {!isLastItem && (
                                            <View className="h-[15px] w-[1.9px] ml-1.5 my-0.5 bg-[#dadada]" />
                                        )}


                                        {/* {index !== statusHistories.length - 1 && (
                                            <View className="h-[15px] w-[1.9px] ml-1.5 my-0.5 bg-[#dadada]" />
                                        )} */}
                                    </View>
                                )}
                            )}
                        </View>
                    </ScrollView>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
}

export default OrderStatusHistoryBottomSheetComponent;