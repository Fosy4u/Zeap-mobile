import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import FastImage from 'react-native-fast-image';
import formatDate from '../../../../utils/formatDate';
import IOrder from '../models/oder_model';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook';
import OrderStatusPillComponent from './orderStatusPill_component';

interface IProps {
    order: IOrder;
}

const OrderCardComponent: React.FC<IProps> = ({ order }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { formatAmount } = useDisplayCurrency();
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

                    <OrderStatusPillComponent statusName={ order.status?.name } />
                </View>
                <View className="flex-row items-center">
                    <FastImage
                    source={{ uri: order.images?.[0]?.link! }}
                    defaultSource={require('../../../../../assets/images/image_placeholder.png')}
                    resizeMode="contain"
                    className="h-[70px] w-[50px] rounded-xl"
                    />
                    <View className="ml-2.5 flex-1 ">
                    <Text className="font-montserratMedium text-baseGreen leading-4 flex-shrink flex-wrap">
                        {order.product?.title!}
                    </Text>
                    <Text className="font-montserratSemiBold text-baseGreen">
                        { formatAmount(order.amount) }
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