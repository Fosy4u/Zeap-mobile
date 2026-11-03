import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppLoader from '../../../general/components/appLoader';
import { usePaystack } from 'react-native-paystack-webview';
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

    const [paymentCompleted, setPaymentCompleted] = useState(false);

    const [gatewayError, setGatewayError] = useState<string | null>(null);

    const status = paymentReference?.paymentStatus?.toLowerCase();
    const referenceCode = paymentReference?.reference;
    useEffect(() => {
        if (status === "success" && referenceCode && !paymentCompleted) {
            setPaymentCompleted(true);
            handlePaymentSuccess(referenceCode);
        }
    }, [status, referenceCode, paymentCompleted]);

    const { popup } = usePaystack();
    const checkoutStartedRef = useRef(false);

    const paystackKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
    const amountInMajorUnit = (paymentReference?.amount ?? 0) / 100;
    const isAmountValid = Number.isFinite(amountInMajorUnit) && amountInMajorUnit > 0;
    const hasReference = Boolean(paymentReference?.reference);
    const hasKey = Boolean(paystackKey && paystackKey.trim().length > 0);

    useEffect(() => {
        if (checkoutStartedRef.current || paymentCompleted) { return; }
        if (!hasKey || !isAmountValid || !hasReference) { return; }
        if (status === "success") { return; }

        checkoutStartedRef.current = true;
        popup.checkout({
            email: paymentReference?.email!,
            amount: amountInMajorUnit,
            reference: paymentReference?.reference!,
            onSuccess: () => {
                if (paymentCompleted) { return; }
                setPaymentCompleted(true);
                handlePaymentSuccess(paymentReference?.reference!);
            },
            onCancel: () => {
                if (paymentCompleted) { return; }
                handlePaymentCancel();
            },
            onError: (err: any) => {
                const detail = typeof err?.message === "string" ? err.message : "";
                setGatewayError(
                    detail.toLowerCase().includes("duplicate")
                        ? "This payment was already started once and cannot be reopened. Go back to checkout and start the payment again to get a new reference."
                        : detail || "The payment gateway returned an error. Please try again.",
                );
            },
        });
    }, [hasKey, isAmountValid, hasReference, status, paymentCompleted]);

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

    if (!hasKey || !isAmountValid || gatewayError) {
        const reason = gatewayError
            ? gatewayError
            : !hasKey
            ? "Paystack publishable key is missing from the build. Add REACT_APP_PAYSTACK_PUBLIC_KEY to .env and rebuild (Metro: --reset-cache)."
            : `Paystack amount is invalid (${amountInMajorUnit}). Check the backend payment-reference response.`;
        console.log("PAYSTACK CONFIG ERROR::: ", {
            hasKey,
            keyPreview: paystackKey ? `${paystackKey.slice(0, 6)}…` : null,
            amountInMajorUnit,
            paymentReference,
        });
        return (
            <SafeAreaView className="flex-1 justify-center bg-lightGray">
                <View className="px-5">
                <Text className="text-center text-base text-red-600 mb-3">Payment cannot start</Text>
                <Text className="text-center text-sm text-gray-700 mb-6">{ reason }</Text>
                <TouchableOpacity
                    onPress={ () => navigation.navigate("checkoutScreen") }
                    className="h-[48px] px-6 mx-auto items-center justify-center rounded-xl bg-baseGreen"
                >
                    <Text className="text-white">Back to Checkout</Text>
                </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-lightGray">
            <AppLoader loadingAdditionalMessage="Opening secure checkout..." />
        </SafeAreaView>
    );
};

export default PaystackPaymentScreen;
