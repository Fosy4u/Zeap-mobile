import React, { useEffect } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import { useSelector } from 'react-redux';
import usePaymentHook from '../hooks/userPayment_hook';
import { RootState } from '../../../../redux/store/store';
import AppLoader from '../../../general/components/appLoader';
import PaystackModal from '../modals/paystack_modal';
import { Paystack } from 'react-native-paystack-webview';
// import { Paystack } from 'react-native-paystack-webview';

const UserPaymentScreen = () => {
    const { cart } = useSelector((state: RootState) => state.cartState);
    const { selectedAddress } = useSelector((state: RootState) => state.addressState);
    // console.log("CART::: ", cart);
    
    const {
        paymentReference, getPaymentReferenceLoading, handleGetPaymentReference,
        isVerifyPaymentLoading,
        handlePaymentSuccess, handlePaymentCancel,
    } = usePaymentHook();
    console.log("PAYMENT REFERENCE::: ", paymentReference);


    useEffect(() => {
        handleGetPaymentReference(selectedAddress?._id!);
    }, []);

    
    return (
        <SafeAreaView className="h-full, w-full flex-1 bg-lightGray">
            { (paymentReference && paymentReference?.paymentStatus === "pending") ? (
                <View className="flex-1 justify-center items-center">
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
                </View>
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Text>Transaction was successfully.</Text>
                </View>
            )}

            { (getPaymentReferenceLoading) && <AppLoader loadingAdditionalMessage="Loading payment reference." /> }
            { (isVerifyPaymentLoading) && <AppLoader loadingAdditionalMessage="Verifying payment." /> }

        </SafeAreaView>
    );
}

export default UserPaymentScreen;