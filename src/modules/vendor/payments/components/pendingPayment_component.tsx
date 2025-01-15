import React from 'react';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ArrowDown } from 'iconsax-react-native';

const PendingPaymentComponent = () => {
  const { payments } = useSelector((state: RootState) => state.paymentState);
  const pendingPayments = payments.filter((payment) => payment.status === "Pending");
  
  return (
    <View>
        <Text className="font-medium text-lg">All Payments</Text>

        { (payments.length > 0) 
            ? (pendingPayments.map((pendingPayment) => (
                <View key={ pendingPayment.id } className="mt-3 mb-1 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Image
                                source={ pendingPayment.productImage }
                                resizeMode="contain"
                                className="h-[60px] w-[40px] rounded-xl"
                            />
                            <View className="ml-2.5">
                                <Text className="text-base">{ pendingPayment.productName }</Text>
                                <Text className="text-xs">Purchase date: { pendingPayment.date }</Text>
                            </View>
                        </View>
                        <View className={`h-9 w-9 ${ pendingPayment.status == "Success" ? "bg-lightGreen/70" : "bg-orange/10" } flex items-center justify-center rounded-full`}>
                            { (pendingPayment.status === "Success")
                                ? <ArrowDown color="green" size={ 20 } className="rotate-[30deg]" />
                                : <Text className="text-2xl text-orange">!</Text>
                            }
                        </View>
                    </View>
                    <View className="mt-2 flex-row justify-between">
                        <Text className="text-xs">Amount paid: ₦{ pendingPayment.amount }</Text>
                        <Text className="text-xs">Amount received: ₦{ pendingPayment.amount }</Text>
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

export default PendingPaymentComponent;