import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Receipt21 } from 'iconsax-react-native';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { RootState } from '../../../../redux/store/store';
import { setNewOrderId, setShowOrderSuccessModal } from '../slices/payment_slice';

const OrderSuccessPopupModal = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const { newOrderId } = useSelector((state: RootState) => state.paymentState);

    const handleDismiss = () => {
        dispatch(setShowOrderSuccessModal(false));
        dispatch(setNewOrderId(""));
    };

    // The order is placed, so the checkout + Paystack screens are spent and must
    // not stay in the back stack — popping back into a finished Paystack WebView
    // lands on a blank light-gray screen. Reset the stack so the receipt/orders
    // screen sits directly on top of Home; "back" from it then returns Home.
    const handleViewReceipt = () => {
        const orderId = newOrderId;
        handleDismiss();
        navigation.reset({
            index: 1,
            routes: [
                { name: "homeScreen", params: { screen: "Home" } },
                { name: "receiptScreen", params: { orderId } },
            ],
        });
    };

    const handleViewOrder = () => {
        handleDismiss();
        navigation.reset({
            index: 1,
            routes: [
                { name: "homeScreen", params: { screen: "Home" } },
                { name: "ordersScreen" },
            ],
        });
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
                    <Text className="font-semibold text-xl text-green-600">Order Placed!</Text>
                    <Text className="mt-2.5 text-center text-base leading-5">
                        Your order has been placed successfully. You can view your receipt or jump to your orders.
                    </Text>

                    <TouchableOpacity
                        onPress={ handleViewReceipt }
                        className="h-[50px] w-full mt-5 px-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                        <Receipt21 size={ 18 } color="white" variant="Bold" />
                        <Text className="ml-2 text-base text-white">View Receipt</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={ handleViewOrder }
                        className="h-[50px] w-full mt-3 px-5 flex flex-row items-center justify-center rounded-xl bg-lightGreen"
                    >
                        <Text className="text-base text-baseGreen mr-2">View Order</Text>
                        <ArrowRight color="#133522" size={ 18 } />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default OrderSuccessPopupModal;
