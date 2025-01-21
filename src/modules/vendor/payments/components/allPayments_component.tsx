import React from 'react';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ArrowDown } from 'iconsax-react-native';


const AllPaymentsComponent = () => {
    const { payments } = useSelector((state: RootState) => state.paymentState);
    
    return (
        <View>
            <Text className="font-medium text-lg">All Payments</Text>

            { (payments.length > 0) 
                ? (payments.map((payment) => (
                    <View key={ payment.id } className="mt-3 mb-1 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <Image
                                    source={ payment.productImage }
                                    resizeMode="contain"
                                    className="h-[60px] w-[40px] rounded-xl"
                                />
                                <View className="ml-2.5">
                                    <Text className="text-base">{ payment.productName }</Text>
                                    <Text className="text-xs">Purchase date: { payment.date }</Text>
                                </View>
                            </View>
                            <View className={`h-9 w-9 ${ payment.status == "Success" ? "bg-lightGreen/70" : "bg-orange/10" } flex items-center justify-center rounded-full`}>
                                { (payment.status === "Success")
                                    ? <ArrowDown color="green" size={ 20 } className="rotate-[30deg]" />
                                    : <Text className="text-2xl text-orange">!</Text>
                                }
                            </View>
                        </View>
                        <View className="mt-2 flex-row justify-between">
                            <Text className="text-xs">Amount paid: ₦{ payment.amount }</Text>
                            <Text className="text-xs">Amount received: ₦{ payment.amount }</Text>
                        </View>
                    </View>
                ))) 
                : (
                    <Text className="text-base text-gray-500">No payments found</Text>
                )
            }
        </View>
    );
};

export default AllPaymentsComponent;