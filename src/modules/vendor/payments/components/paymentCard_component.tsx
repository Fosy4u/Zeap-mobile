import React from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import formatDate from '../../../../utils/formatDate';
import formatCurrency from '../../../../utils/formatCurrency';
import EmptyListComponent from '../../../general/components/emptyList_component';
import SkeletonBlock from '../../../general/components/skeletonBlock_component';
import FastImage from 'react-native-fast-image';
import IPayment from '../models/payment_model';

const THUMBNAIL_SIZE = 60;
const PLACEHOLDER = require("../../../../../assets/images/image_placeholder.png");

interface IProps {
    payments: IPayment[];
    isLoading: boolean;
};

const formatMoney = (money?: { value?: number; currency?: string }) => {
    if (typeof money?.value !== "number" || isNaN(money.value)) { return "--"; }
    return formatCurrency(money.value, money.currency ?? "NGN");
};

const PaymentCardComponent: React.FC<IProps> = ({ payments, isLoading }) => {

    if (isLoading) {
        return (
            <View className="mt-3">
                <SkeletonBlock
                    width={ Dimensions.get('window').width - 40 }
                    height={ 260 }
                    radius={ 12 }
                />
            </View>
        );
    }

    return (
        <FlatList
            data={ payments }
            keyExtractor={ (item, index) => item?.productOrder_id ?? `payment-${ index }` }
            showsVerticalScrollIndicator={ false }
            ListEmptyComponent={ <EmptyListComponent message={ "payments at the moment." } /> }
            contentContainerStyle={{ flexGrow: 1, marginTop: 10 }}
            renderItem={({ item: payment }) => {
                const imageLink = payment.purchasedProduct?.images?.find((image) => image?.link)?.link;
                const purchaseDate = payment.purchaseDate ? formatDate(payment.purchaseDate, true) : "";

                return (
                    <View className="h-auto mt-3 mb-1 px-3 py-4 overflow-hidden border border-gray-200 rounded-xl bg-lightGray">
                        <View
                            style={{ minHeight: THUMBNAIL_SIZE }}
                            className="flex-row items-center justify-start"
                        >
                            <View
                                style={{ height: THUMBNAIL_SIZE, width: THUMBNAIL_SIZE }}
                                className="overflow-hidden rounded-lg bg-gray-200"
                            >
                                <FastImage
                                    source={ imageLink ? { uri: imageLink } : PLACEHOLDER }
                                    defaultSource={ PLACEHOLDER }
                                    resizeMode={ FastImage.resizeMode.cover }
                                    style={{ height: THUMBNAIL_SIZE, width: THUMBNAIL_SIZE }}
                                />
                            </View>
                            <View className="ml-2 flex-1">
                                <Text className="text-base leading-5" numberOfLines={ 2 }>{ payment.purchasedProduct?.title ?? '' }</Text>
                                { !!purchaseDate && (
                                    <Text className="mt-1 text-sm">Purchase date: { purchaseDate }</Text>
                                ) }
                            </View>
                        </View>

                        <View className="mt-2 flex-row justify-between">
                            <Text className="flex-1 mr-2 text-xs">
                                Customer Paid: { formatMoney(payment.buyerPaid) }
                            </Text>
                            <Text className="text-xs">
                                Vendor Revenue: <Text className="text-green-600">{ formatMoney(payment.shopRevenue) }</Text>
                            </Text>
                        </View>

                        {/*==== Status badge (matches the web card) ====*/}
                        { !!payment.shopRevenue?.status && (
                            <View className="mt-2 flex-row justify-end">
                                <View className={ `px-3 py-1 rounded-md ${
                                    /^(success|paid)$/i.test(payment.shopRevenue.status) ? "bg-green-50"
                                    : /^pending$/i.test(payment.shopRevenue.status) ? "bg-yellow-100"
                                    : "bg-red-50"
                                }` }>
                                    <Text className={ `font-montserratMedium text-xs ${
                                        /^(success|paid)$/i.test(payment.shopRevenue.status) ? "text-green-700"
                                        : /^pending$/i.test(payment.shopRevenue.status) ? "text-yellow-800"
                                        : "text-red-700"
                                    }` }>
                                        { payment.shopRevenue.status.charAt(0).toUpperCase() + payment.shopRevenue.status.slice(1) }
                                    </Text>
                                </View>
                            </View>
                        ) }
                    </View>
                );
            }}
        />
    );
};

export default PaymentCardComponent;
