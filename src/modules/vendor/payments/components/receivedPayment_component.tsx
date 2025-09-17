import React from 'react';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ArrowDown } from 'iconsax-react-native';

const ReceivedPaymentComponent = () => {
  const { payments } = useSelector((state: RootState) => state.vendorPaymentState);
  const receivedPayments = payments.filter((payment) => payment.status === "Success");
  
  return (
    <View>
        <Text className="font-medium text-lg">All Payments</Text>

        { (payments.length > 0) 
            ? (receivedPayments.map((receivedPayment) => (
                <View key={ receivedPayment.id } className="mt-3 mb-1 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Image
                                source={ receivedPayment.productImage }
                                resizeMode="contain"
                                className="h-[60px] w-[40px] rounded-xl"
                            />
                            <View className="ml-2.5">
                                <Text className="text-base">{ receivedPayment.productName }</Text>
                                <Text className="text-xs">Purchase date: { receivedPayment.date }</Text>
                            </View>
                        </View>
                        <View className={`h-9 w-9 ${ receivedPayment.status == "Success" ? "bg-lightGreen/70" : "bg-orange/10" } flex items-center justify-center rounded-full`}>
                            { (receivedPayment.status === "Success")
                                ? <ArrowDown color="green" size={ 20 } className="rotate-[30deg]" />
                                : <Text className="text-2xl text-orange">!</Text>
                            }
                        </View>
                    </View>
                    <View className="mt-2 flex-row justify-between">
                        <Text className="text-xs">Amount paid: ₦{ receivedPayment.amount }</Text>
                        <Text className="text-xs">Amount received: ₦{ receivedPayment.amount }</Text>
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

export default ReceivedPaymentComponent;