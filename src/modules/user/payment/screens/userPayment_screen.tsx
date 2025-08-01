import React, { useEffect } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import usePaymentHook from '../hooks/userPayment_hook';
import AppLoader from '../../../general/components/appLoader';
import { Paystack } from 'react-native-paystack-webview';
import { RouteProp, useRoute } from '@react-navigation/native';
import RootNavigationStackModel from '../../../../routes/model/routes_model';

const UserPaymentScreen = () => {
    const route = useRoute<RouteProp<RootNavigationStackModel, 'userPaymentScreen'>>();
    const requestParams = route.params?.data!;
    
    const {
        handleGetPaymentReference,
        isLoading, loadingMessage,
        handlePaymentSuccess, handlePaymentCancel,
        paymentReference,
    } = usePaymentHook();

    useEffect(() => {
        if (requestParams) {
            handleGetPaymentReference(requestParams);
        }
    }, [requestParams]);

    if (isLoading) {
        return <AppLoader loadingAdditionalMessage={ loadingMessage } />;
    }
    
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
        </SafeAreaView>
    );
};

export default UserPaymentScreen;