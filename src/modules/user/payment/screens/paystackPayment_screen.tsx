import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import AppLoader from '../../../general/components/appLoader';
import { Paystack } from 'react-native-paystack-webview';
import usePaymentHook from '../hooks/payment_hook';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';


const PaystackPaymentScreen = () => {
    const { paymentReference } = useSelector((state: RootState) => state.paymentState);
    
    const {
        isLoading, loadingMessage,
        handlePaymentSuccess, handlePaymentCancel,
    } = usePaymentHook();
    console.log("PAYMENT REFERENCE::: ", paymentReference);
    

    if (isLoading) {
        return <AppLoader loadingAdditionalMessage={ loadingMessage } />;
    }

    if (!paymentReference || paymentReference?.paymentStatus !== "pending") {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Transaction was successfully.</Text>
            </View>
        );
    }
    return (
        <SafeAreaView className="h-full w-full flex-1 bg-lightGray">
            <Paystack
                paystackKey={ process.env.REACT_APP_PAYSTACK_PUBLIC_KEY! }
                amount={ paymentReference?.amount! / 100 }
                currency={ paymentReference?.currency!  || "NGN" }
                refNumber={ paymentReference?.reference! }
                billingEmail={ paymentReference?.email! }
                billingName={ paymentReference?.fullName! }
                activityIndicatorColor="green"
                autoStart={ true }
                channels={['card']}

                onCancel={ (args: any) => {
                    handlePaymentCancel();
                } }

                onSuccess={ (response: any) => {
                    handlePaymentSuccess(paymentReference?.reference!);
                } }
            />
        </SafeAreaView>
    );
};

export default PaystackPaymentScreen;