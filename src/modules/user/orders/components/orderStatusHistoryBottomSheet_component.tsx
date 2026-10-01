import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import FormatWords from '../../../../utils/formatWords';
import { timeAgo } from '../../../../utils/formatTime';
import { setShowCancelOrderModal } from '../slices/order_slice';
import { canCancelOrderStatus } from '../utils/orderCancellation';

type IOrderStatusHistoryBottomSheetComponent = {
    bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
    snapPoints: string[];
    setShowBottomSheetModal: (value: boolean) => void;
}

const OrderStatusHistoryBottomSheetComponent = ({ bottomSheetModalRef, snapPoints, setShowBottomSheetModal }: IOrderStatusHistoryBottomSheetComponent) => {
    const { orderHistory, selectedOrderStatus } = useSelector((state: RootState) => state.orderState);
    const dispatch = useDispatch();
    const statusHistories = orderHistory.statusHistory;

    const currentStatusIndex = statusHistories.findIndex(
      (item) => item.name === selectedOrderStatus.name,
    );

    const canCancel = canCancelOrderStatus(selectedOrderStatus);

    /* The confirmation dialog cannot stack above the sheet's portal, so the
       sheet stands down and hands the screen over to the modal. */
    const handleOpenCancelModal = () => {
        setShowBottomSheetModal(false);
        dispatch(setShowCancelOrderModal(true));
    };

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            // Match the measurement sheet — fixed header + close button, not draggable.
            enablePanDownToClose={false}
            handleComponent={null}
            onDismiss={() => setShowBottomSheetModal(false)}
        >
            <BottomSheetView className="flex-1">
                <View className="h-full w-full px-5 pt-7">

                    {/*==== Modal Header ====*/}
                    <View className="h-auto w-full flex-row items-start justify-between">
                        <Text className="font-montserratMedium text-2xl text-gray-700">Status History</Text>

                        <TouchableOpacity onPress={ () => setShowBottomSheetModal(false) }>
                            <Image
                                className="h-[30px] w-[30px]"
                                source={ require("../../../../../assets/images/close.png") }
                            />
                        </TouchableOpacity>
                    </View>

                    <LinearGradient
                        colors={[
                            "rgba(229, 231, 235, 0)",
                            "#e5e7eb",
                            "#9ca3af",
                            "#e5e7eb",
                            "rgba(229, 231, 235, 0)"
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-[1px] w-full mt-3 rounded"
                    />

                    <Text className="mt-4 text-base text-gray-700">Order status history and time constraints.</Text>

                    <ScrollView
                        showsVerticalScrollIndicator={ false }
                        showsHorizontalScrollIndicator={ false }
                        contentContainerStyle={{ paddingBottom: 60 }}
                    >
                        <View className="mt-3 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                            { statusHistories.map((statusHistory, index) => {
                                const isActive = index <= currentStatusIndex;
                                const isLastItem = index === statusHistories.length - 1;

                                return(
                                    <View key={ statusHistory.name }>
                                        <View className="h-auto w-full flex-row items-center">
                                            <View
                                                className="h-[14px] w-[14px] mr-3 rounded-full"
                                                style={{ backgroundColor: isActive ? "#138e40" : "#dadada" }}
                                            />
                                            <Text>{ FormatWords.capitalizeWord(statusHistory.value) } - ({ statusHistory.date ? timeAgo(statusHistory.date) : "N/A" })</Text>
                                        </View>

                                        { !isLastItem && (
                                            <View className="h-[15px] w-[1.9px] ml-1.5 my-0.5 bg-[#dadada]" />
                                        ) }
                                    </View>
                                )}
                            ) }
                        </View>

                        {/*==== Cancel Order ====*/}
                        <TouchableOpacity
                            disabled={ !canCancel }
                            onPress={ handleOpenCancelModal }
                            className={ `h-[55px] w-full mt-5 flex-row items-center justify-center rounded-xl ${ canCancel ? "bg-red-50 border border-red-200" : "bg-gray-100 border border-gray-200" }` }
                        >
                            <Text className={ `font-montserratMedium text-base ${ canCancel ? "text-red-700" : "text-gray-400" }` }>
                                Cancel Order
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
}

export default OrderStatusHistoryBottomSheetComponent;