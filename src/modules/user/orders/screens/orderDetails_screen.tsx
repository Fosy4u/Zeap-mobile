import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ArrowLeft, ArrowRight, Call, Location, Sms } from 'iconsax-react-native';
import formatCurrency from '../../../../utils/formatCurrency';
import { timeAgo } from '../../../../utils/formatTime';
import useGeneralHook from '../../../general/hooks/general_hook';
import OrderStatusHistoryComponent from '../components/orderStatusHistory_component';
import { setShowStatusHistory } from '../slices/order_slice';
import useOrderHook from '../hooks/order_hook';
import FastImage from 'react-native-fast-image';

const OrderDetailsScreen: React.FC = () => {
    const { orderDetails, showStatusHistory } = useSelector((state: RootState) => state.orderState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const { handleGetOrderHistory } = useOrderHook();
    const { getColorCode } = useGeneralHook();  
    
    React.useEffect(() => {
        handleGetOrderHistory();
    }, []);

    return (
        <SafeAreaView className="h-auto w-full flex-1 pb-2 px-5 pt-2 bg-lightGray">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />

            {/* ==== Header ==== */}
            <View className="h-auto w-full py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={ () => navigation.pop() }>
                    <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                    <TouchableOpacity onPress={ () => navigation.pop() }>
                    <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                        <ArrowLeft color="white" />
                    </View>
                </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <Text className="font-semibold text-lg text-baseGreen">Order Details</Text>
                
                <View className="h-[40px] w-[40px]" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                
                {/* ==== Order Summary ==== */}
                <View className="mt-2 p-4 bg-[#F7F8FC] rounded-xl border border-gray-200">
                    <Text className="mb-1 font-montserratMedium text-base text-gray-700">Order ID: {orderDetails.orderId}</Text>
                    <Text className="font-montserratMedium text-sm text-gray-500">{orderDetails.productOrders.length} item{orderDetails.productOrders.length > 1 ? 's' : ''}</Text>
                    <Text className="mt-1 font-montserratMedium text-sm text-gray-500">Placed on { timeAgo(orderDetails.createdAt) }</Text>
                    <Text className="mt-1.5 font-montserratMedium text-gray-500">{ formatCurrency((orderDetails.payment.total/100), orderDetails.payment.currency) }</Text>

                    <View className="h-auto w-full mt-4">
                        <Text className="font-montserratMedium text-xs text-gray-500">
                            Order Progress: { orderDetails.progress.value }%
                        </Text>
                        <View className="h-[8px] w-full mt-1 bg-gray-200 rounded-lg">
                            <View style={{ height: 8, width: `${ orderDetails.progress.value }%`, backgroundColor: "#133522", borderRadius: 10 }} />
                        </View>
                    </View>
                </View>

               {/* ==== Items in  your Order ==== */}
                <Text className="mt-7 font-montserratSemiBold text-base text-gray-700">Items in your order - ({ orderDetails.productOrders.length })</Text>
                { orderDetails.productOrders.map((productOrder) => (
                    <View key={ productOrder._id } className="mt-2 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                        <View className="flex-row justify-between mb-2">
                            <View className={ `px-3 py-1 rounded ${ productOrder.status.name === "delivered" ? "bg-green-600" : "bg-yellow-600" }` }>
                                <Text className="font-montserratMedium text-white text-xs">{ productOrder.status.name.charAt(0).toUpperCase() + productOrder.status.name.slice(1) }</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <FastImage
                                source={{
                                    uri: productOrder.images[0].link,
                                    priority: FastImage.priority.normal
                                }}
                                defaultSource={ require("../../../../../assets/images/app_logo.png") }
                                resizeMode={ FastImage.resizeMode.cover }
                                className="h-[115px] w-[80px] mr-3 rounded-lg"
                            />
                            <View className="flex-1">
                                <Text className="font-montserratSemiBold text-gray-700">{ productOrder.product.title }</Text>
                                <View className="flex-row items-center mt-1">
                                    <Text className="font-montserratMedium text-xs text-gray-500">Color: { productOrder.color.charAt(0).toUpperCase() + productOrder.color.slice(1) }</Text>
                                    <View className="h-2.5 w-2.5 ml-1 rounded-full" style={ { backgroundColor: getColorCode(productOrder.color!) } } />
                                </View>
                                <Text className="mt-1 font-montserratMedium text-xs text-gray-500">QTY: { productOrder.quantity }</Text>
                                <Text className="mt-1.5 font-montserratMedium text-gray-500">{ formatCurrency(productOrder.amount[0].value, productOrder.amount[0].currency) }</Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            // onPress={() => dispatch(setShowStatusHistory(!showStatusHistory))}
                            onPress={() => dispatch(setShowStatusHistory(!showStatusHistory))}
                            className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGold"
                        >
                            <Text className="font-montserratMedium text-base text-green-800">{ showStatusHistory ? "Hide Status History" : "Show Status History" }</Text>
                            <ArrowRight size={ 18 } className="ml-2 text-green-800" />
                        </TouchableOpacity>


                        {showStatusHistory && <OrderStatusHistoryComponent statusHistory={ productOrder.status! } />}
                    </View>
                )) }

                {/* ==== Payment Information ==== */}
                <Text className="mt-7 font-montserratSemiBold text-base text-gray-700">Payment information</Text>
                <View className="mt-2 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                    <View className="flex-row justify-start">
                        <View className={ `px-3 py-1 rounded ${ orderDetails.payment.status === "success" ? "bg-green-600" : "bg-yellow-600" }` }>
                            <Text className="font-montserratMedium text-white text-xs">{ orderDetails.payment.status.charAt(0).toUpperCase() + orderDetails.payment.status.slice(1) }</Text>
                        </View>
                    </View>
                    <View className="flex-row justify-between mt-3">
                        <Text className="font-montserratMedium text-gray-500">Payment ref</Text>
                        <Text className="font-montserratMedium text-gray-500">{orderDetails.payment.reference}</Text>
                    </View>
                    <View className="flex-row justify-between mt-3">
                        <Text className="font-montserratMedium text-gray-500">Items total</Text>
                        <Text className="font-montserratMedium text-gray-500">{ formatCurrency((orderDetails.payment.itemsTotal/100), orderDetails.payment.currency) }</Text>
                    </View>
                    <View className="flex-row justify-between mt-3">
                        <Text className="font-montserratMedium text-gray-500">Delivery fee</Text>
                        <Text className="font-montserratMedium text-gray-500">{ formatCurrency((orderDetails.payment.deliveryFee/100), orderDetails.payment.currency) }</Text>
                    </View>
                    <View className="flex-row justify-between mt-4">
                        <Text className="font-montserratSemiBold text-base text-gray-700">Total</Text>
                        <Text className="font-montserratSemiBold text-base text-gray-700">{ formatCurrency((orderDetails.payment.total/100), orderDetails.payment.currency) }</Text>
                    </View>
                </View>

                {/* ==== Delivery Address ==== */}
                <View className="mt-5 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                    <Text className="font-montserratSemiBold text-base text-gray-700">Delivery address</Text>

                    <Text className="mt-4 font-montserratMedium text-base text-gray-700">{ orderDetails.deliveryDetails.address }</Text>
                    <View className="mt-4 flex-row items-center">
                        <Call size={18} color="#222" className="mr-2" />
                        <Text className="ml-2 font-montserratMedium">{ orderDetails.deliveryDetails.phoneNumber }</Text>
                    </View>
                    <View className="mt-4 flex-row items-center">
                        <Sms size={18} color="#222" className="mr-2" />
                        <Text className="ml-2 font-montserratMedium">{ orderDetails.deliveryDetails.firstName } { orderDetails.deliveryDetails.lastName }</Text>
                    </View>
                    <View className="mt-4 flex-row items-center">
                        <Location size={18} color="#222" className="mr-2" />
                        <Text className="ml-2 font-montserratMedium">{ orderDetails.deliveryDetails.region }, { orderDetails.deliveryDetails.country }</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default OrderDetailsScreen; 