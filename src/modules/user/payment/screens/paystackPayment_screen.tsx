import React, { useEffect, useState } from 'react'
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppLoader from '../../../general/components/appLoader';
import { Paystack } from 'react-native-paystack-webview';
import usePaymentHook from '../hooks/payment_hook';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import OrderSuccessPopupModal from '../modals/orderSuccessPopup_modal';
import RootNavigationStackModel from '../../../../routes/model/routes_model';


const PaystackPaymentScreen = () => {
    const { paymentReference, showOrderSuccessModal } = useSelector((state: RootState) => state.paymentState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const {
        isLoading, loadingMessage,
        handlePaymentSuccess, handlePaymentCancel,
    } = usePaymentHook();

    // Once verify has been kicked off (or completed), never re-mount Paystack.
    // A ref wouldn't work here because it doesn't drive renders — the screen
    // would briefly re-render `<Paystack autoStart>` while isLoading flips
    // back to false, causing Paystack to start a second transaction with the
    // same reference and throw "Duplicate transaction reference".
    const [paymentCompleted, setPaymentCompleted] = useState(false);

    // If the backend reports the reference is already paid, jump straight to
    // the verify flow instead of leaving the user on a dead-end page.
    const status = paymentReference?.paymentStatus?.toLowerCase();
    const referenceCode = paymentReference?.reference;
    useEffect(() => {
        if (status === "success" && referenceCode && !paymentCompleted) {
            setPaymentCompleted(true);
            handlePaymentSuccess(referenceCode);
        }
    }, [status, referenceCode, paymentCompleted]);

    // Resolve config up-front so we can guard against the "indicator hangs
    // forever" failure mode — that happens when the inline JS inside the
    // Paystack WebView never finishes initializing (almost always because the
    // publishable key is empty, the amount is NaN, or the reference is
    // missing). Without these guards the WebView's onLoadEnd never fires, so
    // the activity indicator spins indefinitely with no error surfaced.
    const paystackKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
    const amountInMajorUnit = (paymentReference?.amount ?? 0) / 100;
    const isAmountValid = Number.isFinite(amountInMajorUnit) && amountInMajorUnit > 0;
    const hasReference = Boolean(paymentReference?.reference);
    const hasKey = Boolean(paystackKey && paystackKey.trim().length > 0);

    if (isLoading) {
        return <AppLoader loadingAdditionalMessage={ loadingMessage } />;
    }

    // After success, the screen is owned by the modal — Paystack must stay unmounted.
    if (paymentCompleted || showOrderSuccessModal) {
        return (
            <View className="flex-1 bg-lightGray">
                { showOrderSuccessModal && <OrderSuccessPopupModal /> }
            </View>
        );
    }

    if (!hasReference) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Preparing your payment…</Text>
            </View>
        );
    }

    if (!hasKey || !isAmountValid) {
        const reason = !hasKey
            ? "Paystack publishable key is missing from the build. Add REACT_APP_PAYSTACK_PUBLIC_KEY to .env and rebuild (Metro: --reset-cache)."
            : `Paystack amount is invalid (${amountInMajorUnit}). Check the backend payment-reference response.`;
        console.log("PAYSTACK CONFIG ERROR::: ", {
            hasKey,
            keyPreview: paystackKey ? `${paystackKey.slice(0, 6)}…` : null,
            amountInMajorUnit,
            paymentReference,
        });
        return (
            <SafeAreaView className="flex-1 px-5 justify-center bg-lightGray">
                <Text className="text-center text-base text-red-600 mb-3">Payment cannot start</Text>
                <Text className="text-center text-sm text-gray-700 mb-6">{ reason }</Text>
                <TouchableOpacity
                    onPress={ () => navigation.navigate("checkoutScreen") }
                    className="h-[48px] px-6 mx-auto items-center justify-center rounded-xl bg-baseGreen"
                >
                    <Text className="text-white">Back to Checkout</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-lightGray">
            <Paystack
                paystackKey={ paystackKey! }
                amount={ amountInMajorUnit }
                currency={ paymentReference?.currency!  || "NGN" }
                refNumber={ paymentReference?.reference! }
                billingEmail={ paymentReference?.email! }
                billingName={ paymentReference?.fullName! }
                activityIndicatorColor="green"
                autoStart={ true }
                channels={['card']}

                // Forward any error message the WebView reports up to logcat
                // so the next hang surfaces a reason instead of being silent.
                handleWebViewMessage={ (event: any) => {
                    console.log("PAYSTACK WEBVIEW MESSAGE::: ", event);
                    if (event?.status === "error") {
                        Alert.alert(
                            "Payment error",
                            typeof event?.data === "string" ? event.data : "The payment gateway returned an error. Please try again.",
                        );
                    }
                } }

                onCancel={ () => {
                    // Paystack's webview also fires onCancel after a successful
                    // charge when it closes itself — skip the cancel path if
                    // success has already been handled.
                    if (paymentCompleted) return;
                    handlePaymentCancel();
                } }

                onSuccess={ () => {
                    if (paymentCompleted) return;
                    setPaymentCompleted(true);
                    handlePaymentSuccess(paymentReference?.reference!);
                } }
            />
        </SafeAreaView>
    );
};

export default PaystackPaymentScreen;
