import React from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import formatDate from '../../../../utils/formatDate';
import formatCurrency from '../../../../utils/formatCurrency';
import EmptyListComponent from '../../../general/components/emptyList_component';
import SkeletonBlock from '../../../general/components/skeletonBlock_component';
import FastImage from 'react-native-fast-image';
import IPayment from '../models/payment_model';

interface IProps {
    payments: IPayment[];
    isLoading: boolean;
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
            keyExtractor={ (item) => item.productOrder_id! }
            showsVerticalScrollIndicator={ false }
            ListEmptyComponent={ <EmptyListComponent message={ "payments at the moment." } /> }
            contentContainerStyle={{ flexGrow: 1, marginTop: 10 }}
            renderItem={({ item: payment }) => (
                <View key={ payment.productOrder_id } className="h-auto mt-3 mb-1 px-3 py-4 border border-gray-200 rounded-xl bg-lightGray">
                    <View className="flex-row items-center justify-start flex-1">
                        <View className="h-[60px] w-[60px] rounded-lg overflow-hidden">
                            <FastImage
                                source={ { uri: payment.purchasedProduct!.images![0]!.link! } }
                                defaultSource={require("../../../../../assets/images/image_placeholder.png")}
                                resizeMode={FastImage.resizeMode.cover}
                                className="h-[60px] w-[60px]"
                            />
                        </View>
                        <View className="ml-2 flex-1">
                            <Text className="text-base leading-5" numberOfLines={2}>{ payment.purchasedProduct?.title ?? '' }</Text>
                            <Text className="mt-1 text-sm">Purchase date: { formatDate(payment.purchaseDate ?? '', true) }</Text>
                        </View>
                    </View>
                    {/* Labels mirror the web card. flex-1 on each side so the
                        two amounts wrap independently instead of colliding. */}
                    <View className="mt-2 flex-row justify-between">
                        <Text className="flex-1 mr-2 text-xs">
                            Customer Paid: { formatCurrency(payment.buyerPaid!.value!, payment.buyerPaid!.currency!) }
                        </Text>
                        <Text className="text-xs">
                            Vendor Revenue: <Text className="text-green-600">{ formatCurrency(payment.shopRevenue!.value!, payment.shopRevenue!.currency!) }</Text>
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
            )}
        />
    );
};

export default PaymentCardComponent;