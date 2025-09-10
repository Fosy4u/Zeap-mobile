import React, { useEffect, useState } from 'react'
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import usePaymentHook from '../hooks/userPayment_hook';
import AppLoader from '../../../general/components/appLoader';
import { Paystack } from 'react-native-paystack-webview';
import { RouteProp, useRoute } from '@react-navigation/native';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { CardField, useConfirmPayment, useStripe } from '@stripe/stripe-react-native';
import handleError from '../../../general/hooks/errorHandler_hook';
import formatCurrency from '../../../../utils/formatCurrency';
import { el } from 'intl-tel-input/i18n';


const UserPaymentScreen = () => {
    const route = useRoute<RouteProp<RootNavigationStackModel, 'userPaymentScreen'>>();
const {requestData} = route.params!;
    
    const {
        handleGetPaymentReference,
        isLoading, loadingMessage,
        handlePaymentSuccess, handlePaymentCancel,
        paymentReference,
    } = usePaymentHook();
    // console.log("PAYMENT REFERENCE: ", paymentReference);

    const { confirmPayment, initPaymentSheet, presentPaymentSheet } = useStripe();
    const setup = async (stripeClientSecret: string) => {
        // Initialize the payment sheet
        const { error: paymentSheetError } = await initPaymentSheet({
            paymentIntentClientSecret: stripeClientSecret,
            merchantDisplayName: "Zeaper",
            defaultBillingDetails: {
                email: paymentReference?.email,
                name: paymentReference?.fullName,
            },
        });
        if (paymentSheetError) {
            handleError(paymentSheetError);
            console.error('Error initializing payment sheet:', paymentSheetError.message);
            return;
        }

        // Now that the payment sheet is initialized, you can present it to the user
        const { error: presentError } = await presentPaymentSheet();
        if (presentError) {
            handleError(presentError);
            console.error('Error presenting payment sheet:', presentError.message);
            return;
        }

        // Confirm the payment
        const { error: confirmError, paymentIntent } = await confirmPayment(stripeClientSecret, {
            paymentMethodType: 'Card',
        });
        if (confirmError) {
            handleError(confirmError);
            console.error('Error confirming payment:', confirmError.message);
            return;
        } else if (paymentIntent) {
            console.log('Payment successful:', paymentIntent);

            // If everything went well, handle the successful payment
            handlePaymentSuccess(paymentReference?.reference!);
        }

    }

    useEffect(() => {
        if (requestData) {
            handleGetPaymentReference(requestData);
        }
    }, [requestData]);
    useEffect(() => {
        if (paymentReference?.stripeClientSecret) {
            setup(paymentReference?.stripeClientSecret);
        }
    }, [paymentReference]);

    if (isLoading) {
        return <AppLoader loadingAdditionalMessage={ loadingMessage } />;
    }

    const renderPaymentOptionComponent = () => {
        if (!paymentReference || paymentReference?.paymentStatus !== "pending") {
            return (
                <View className="flex-1 justify-center items-center">
                    <Text>Transaction was successfully.</Text>
                </View>
            );
        }

        const paymentCurrency = paymentReference?.currency || "NGN";
        if (paymentCurrency === "NGN") {
            return (
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
            );
        }
    };
    
    return (
        <SafeAreaView className="h-full, w-full flex-1 bg-lightGray">
            { renderPaymentOptionComponent() }
        </SafeAreaView>
    );
};

export default UserPaymentScreen;