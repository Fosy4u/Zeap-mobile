import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import IOrder from '../models/order_model';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { timeAgo } from '../../../../utils/formatTime';

const MAX_PREVIEWS = 4;
const PREVIEW_SIZE = 72;
const PREVIEW_BORDER = 1;
const PREVIEW_INNER = PREVIEW_SIZE - PREVIEW_BORDER * 2;
const PREVIEW_PLACEHOLDER = require("../../../../../assets/images/image_placeholder.png");

interface IProps {
    order: IOrder;
}

const OrderCardComponent: React.FC<IProps> = ({ order }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    // console.log("ORDER DATA::: ", order);

    const productOrders = order?.productOrders ?? [];
    const itemCount = productOrders.length;
    const progressValue = order?.progress?.value ?? 0;

    const previewLinks = productOrders
        .slice(0, MAX_PREVIEWS)
        .map((productOrder) =>
            productOrder?.images?.find((image) => image?.link)?.link
            ?? productOrder?.product?.colors?.find((color) => color?.images?.[0]?.link)?.images?.[0]?.link
            ?? "");

    const previewCount = previewLinks.length;
    const hasAnyPreview = previewLinks.some(Boolean);
    const overflowCount = itemCount > MAX_PREVIEWS ? itemCount - MAX_PREVIEWS : 0;
    const isGridPreview = previewCount === MAX_PREVIEWS;
    const cellWidth = isGridPreview ? PREVIEW_INNER / 2 : PREVIEW_INNER / Math.max(previewCount, 1);
    const cellHeight = isGridPreview ? PREVIEW_INNER / 2 : PREVIEW_INNER;

    return (
        <TouchableOpacity
            onPress={ () => {
                navigation.navigate("orderDetailsScreen", {
                    from: "Orders Screen",
                    orderId: order?.orderId
                });
            } }
        >
            <View className="h-auto w-full mt-4 x-5 p-4 rounded-xl border border-gray-200 bg-[#F8F9FE]">
                
                <View className="h-auto w-full flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View
                            style={{
                                height: PREVIEW_SIZE,
                                width: PREVIEW_SIZE,
                                flexDirection: "row",
                                flexWrap: isGridPreview ? "wrap" : "nowrap",
                                alignContent: "flex-start",
                                borderWidth: PREVIEW_BORDER,
                                borderColor: "#E5E7EB",
                            }}
                            className="mr-3 overflow-hidden rounded-lg bg-gray-200"
                        >
                            { !hasAnyPreview ? (
                                <View className="flex-1 items-center justify-center">
                                    <Text className="font-montserratSemiBold text-lg text-center">{ itemCount }</Text>
                                    <Text className="text-center text-xs">{ itemCount > 1 ? "Items" : "Item" }</Text>
                                </View>
                            ) : (
                                previewLinks.map((link, index) => (
                                    <View
                                        key={ `${ order?.orderId }-preview-${ index }` }
                                        style={{
                                            width: cellWidth,
                                            height: cellHeight,
                                            borderColor: "#FFFFFF",
                                            borderLeftWidth: isGridPreview ? (index % 2 === 1 ? 1 : 0) : (index > 0 ? 1 : 0),
                                            borderTopWidth: isGridPreview && index > 1 ? 1 : 0,
                                        }}
                                    >
                                        <FastImage
                                            source={ link ? { uri: link, priority: FastImage.priority.normal } : PREVIEW_PLACEHOLDER }
                                            defaultSource={ PREVIEW_PLACEHOLDER }
                                            resizeMode={ FastImage.resizeMode.cover }
                                            style={{ height: "100%", width: "100%" }}
                                        />
                                    </View>
                                ))
                            ) }

                            { overflowCount > 0 && (
                                <View className="absolute bottom-0 right-0 px-1.5 py-0.5 rounded-tl-md bg-baseGreen">
                                    <Text className="font-montserratSemiBold text-[10px] text-white">+{ overflowCount }</Text>
                                </View>
                            ) }
                        </View>
                        <View>
                            <Text className="font-montserratMedium text-xs text-gray-500">
                                Order ID
                            </Text>
                            <Text className="font-montserratMedium text-gray-700">
                                {order?.orderId ?? "—"}
                            </Text>
                        </View>
                    </View>
                    
                    <View className="items-end">
                        <Text className="font-montserratMedium text-xs text-gray-500">
                            Placed On
                        </Text>
                        <Text className="font-montserratMedium text-gray-700">
                            { timeAgo(order?.createdAt) }
                        </Text>
                    </View>
                </View>

                {/* ==== Progress Bar with percentage ==== */}
                <View className="h-auto w-full mt-4">
                    <Text className="font-montserratMedium text-xs text-gray-500">
                        Order Progress: { progressValue }%
                    </Text>
                    <View className="h-[8px] w-full mt-1 bg-gray-200 rounded-lg">
                        <View style={{ height: 8, width: `${ progressValue }%`, backgroundColor: "#133522", borderRadius: 10 }} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderCardComponent; 