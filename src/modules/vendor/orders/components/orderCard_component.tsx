import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import FastImage from 'react-native-fast-image';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';
import IOrder from '../models/oder_model';
import { IStatus } from '../hooks/order_hook';

interface IProps {
    order: IOrder;
    status: IStatus;
}

const OrderCardComponent: React.FC<IProps> = ({ order, status }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    // console.log("ORDER DATA::: ", order);

    return (
        <TouchableOpacity
            onPress={ () => {
                navigation.navigate("vendorOrderDetailsScreen", {
                    from: "Orders Screen",
                    orderId: order._id!
                });
            } }
        >
            <View className="mb-3 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-x-2">
                    <Text className="font-montserratRegular text-gray-700">Order#:</Text>
                    <Text className="font-montserratSemiBold text-baseGreen">{order.orderId}</Text>
                    </View>

                    {(() => {
                    const statusName = order.status!.name!.charAt(0).toUpperCase() + order.status!.name!.slice(1);
                    const Icon = status[statusName].icon;

                    return (
                        <View className={`p-2 ${status[statusName].bgColor} flex border ${status[statusName].borderColor} flex-row items-center justify-center rounded-lg`}>
                        <Icon size={14} className={`${status[statusName].textColor} mr-1`} />
                        <Text className={`${status[statusName].textColor} text-xs`}>{statusName}</Text>
                        </View>
                    );
                    })()}
                </View>
                <View className="flex-row items-center">
                    <FastImage
                    source={{ uri: order.images![0].link! }}
                    defaultSource={require('../../../../../assets/images/app_logo.png')}
                    resizeMode="contain"
                    className="h-[70px] w-[50px] rounded-xl"
                    />
                    <View className="ml-2.5 flex-1 ">
                    <Text className="font-montserratMedium text-baseGreen leading-4 flex-shrink flex-wrap">
                        {order.product?.title!}
                    </Text>
                    <Text className="font-montserratSemiBold text-baseGreen">
                        {order.amount!.length > 0 ? formatCurrency(order.amount![0].value!, order.amount![0].currency) : "₦0.0"}
                    </Text>
                    </View>
                </View>
                <View className="mt-2 flex-row items-center gap-x-2">
                    <Text className="font-montserratRegular text-gray-700">Order date:</Text>
                    <Text className="font-montserratMedium text-sm text-gray-800">{formatDate(order.createdAt!.toString(), false)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderCardComponent; 