import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IOrder from '../models/order_model';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { timeAgo } from '../../../../utils/formatTime';

interface IProps {
    order: IOrder;
}

const OrderCardComponent: React.FC<IProps> = ({ order }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    // console.log("ORDER DATA::: ", order);

    return (
        <TouchableOpacity
            onPress={ () => {
                navigation.navigate("orderDetailsScreen", {
                    from: "Orders Screen",
                    orderId: order.orderId
                });
            } }
        >
            <View className="h-auto w-full mt-4 x-5 p-4 rounded-xl border border-gray-200 bg-[#F8F9FE]">
                
                <View className="h-auto w-full flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="h-[60px] w-[60px] mr-3 items-center justify-center border border-gray-200 rounded-lg bg-gray-200">
                            <Text className="font-montserratSemiBold text-lg text-center">{ order.productOrders.length }</Text>
                            <Text className="text-center">{ order.productOrders.length > 1 ? "Items" : "Item" }</Text>
                        </View>
                        <View>
                            <Text className="font-montserratMedium text-xs text-gray-500">
                                Order ID
                            </Text>
                            <Text className="font-montserratMedium text-gray-700">
                                {order.orderId}
                            </Text>
                        </View>
                    </View>
                    
                    <View className="items-end">
                        <Text className="font-montserratMedium text-xs text-gray-500">
                            Placed On
                        </Text>
                        <Text className="font-montserratMedium text-gray-700">
                            { timeAgo(order.createdAt) }
                        </Text>
                    </View>
                </View>

                {/* ==== Progress Bar with percentage ==== */}
                <View className="h-auto w-full mt-4">
                    <Text className="font-montserratMedium text-xs text-gray-500">
                        Order Progress: { order.progress.value }%
                    </Text>
                    <View className="h-[8px] w-full mt-1 bg-gray-200 rounded-lg">
                        <View style={{ height: 8, width: `${ order.progress.value }%`, backgroundColor: "#133522", borderRadius: 10 }} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderCardComponent; 