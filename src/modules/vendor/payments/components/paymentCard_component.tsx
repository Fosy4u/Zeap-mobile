import React from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import formatDate from '../../../../utils/formatDate';
import formatCurrency from '../../../../utils/formatCurrency';
import EmptyListComponent from '../../../general/components/emptyList_component';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import IPayment from '../models/payment_model';

interface IProps {
    payments: IPayment[];
    isLoading: boolean;
};

const PaymentCardComponent: React.FC<IProps> = ({ payments, isLoading }) => {
    
    return (
        <FlatList
            data={ payments }
            keyExtractor={ (item) => item.productOrder_id! }
            showsVerticalScrollIndicator={ false }
            ListEmptyComponent={ <EmptyListComponent message={ "payments at the moment." } /> }
            contentContainerStyle={{ flexGrow: 1, marginTop: 10 }}
            renderItem={({ item: payment }) => (!isLoading) ? (
                <View key={ payment.productOrder_id } className="h-auto mt-3 mb-1 px-3 py-4 border border-gray-200 rounded-xl bg-lightGray">
                    <View className="flex-row items-center justify-start flex-1">
                        <View className="h-[60px] w-[60px] rounded-lg overflow-hidden">
                            <FastImage
                                source={ { uri: payment.purchasedProduct!.images![0]!.link! } }
                                defaultSource={require("../../../../../assets/images/app_logo.png")}
                                resizeMode={FastImage.resizeMode.cover}
                                className="h-[60px] w-[60px]"
                            />
                        </View>
                        <View className="ml-2 flex-1">
                            <Text className="text-base leading-5" numberOfLines={2}>{ payment.purchasedProduct?.title ?? '' }</Text>
                            <Text className="mt-1 text-sm">Purchase date: { formatDate(payment.purchaseDate ?? '', true) }</Text>
                        </View>
                    </View>
                    <View className="mt-2 flex-row justify-between">
                        <Text className="text-xs">Amount paid: { formatCurrency(payment.buyerPaid!.value!, payment.buyerPaid!.currency!) }</Text>
                        <Text className="text-xs">Amount received: { formatCurrency(payment.shopRevenue!.value!, payment.shopRevenue!.currency!) }</Text>
                    </View>
                </View>
            ) : (
                <ShimmerPlaceHolder
                    // visible={!productIsLoading}
                    LinearGradient={LinearGradient}
                    shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                    height={80}
                    width={Dimensions.get('window').width - 40}
                    shimmerStyle={{ borderRadius: 10, marginTop: 15 }}
                />
            )}
        />
    );
};

export default PaymentCardComponent;