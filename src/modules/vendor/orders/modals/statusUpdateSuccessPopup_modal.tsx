import React from 'react';
import { Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { setShowStatusSuccessModal } from '../slices/orderState_slice';
import useOrderHook from '../hooks/order_hook';

const StatusUpdateSuccessPopupModal = () => {
    const dispatch = useDispatch();
    const { order, isLoading } = useSelector((state: RootState) => state.vendorOrderState);

    const { handleGetOrderDetails, handleGetOrderHistory } = useOrderHook();

    /* The vendor stays on the order they just updated, so pull the fresh details
       and history — the history also drives which action buttons show. */
    const handleOk = async () => {
        if (order?._id) {
            await handleGetOrderDetails(order._id);
            await handleGetOrderHistory(order._id);
        }
        dispatch(setShowStatusSuccessModal(false));
    };

    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />

            <View className="h-full w-full absolute inset-0 bg-black opacity-60" />
            <View className="w-[320px] rounded-2xl bg-white">
                <View className="h-[120px] w-full p-3 flex items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-baseGreen">
                    <Image
                        className="h-auto w-auto"
                        resizeMode="cover"
                        source={ require("../../../../../assets/images/success_modal_image.png") }
                    />
                    <FastImage
                        className="h-full w-full absolute"
                        source={ require("../../../../../assets/images/success_animation.gif") }
                    />
                </View>

                <View className="px-5 pt-5 pb-6 items-center">
                    <Text className="font-semibold text-xl text-green-600">Congratulations</Text>
                    <Text className="mt-2.5 text-center text-base leading-5">
                        You have successfully updated the status of <Text className="font-montserratSemiBold text-gray-900">order# { order.orderId }</Text>
                    </Text>

                    <TouchableOpacity
                        onPress={ handleOk }
                        disabled={ isLoading }
                        className={ `h-[50px] w-full mt-5 px-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen ${ isLoading ? "opacity-50" : "" }` }
                    >
                        <Text className="text-base text-white">{ isLoading ? "Refreshing..." : "View Order" }</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default StatusUpdateSuccessPopupModal;
