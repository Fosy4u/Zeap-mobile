import { useState } from "react";
import { useLazyGetPaymentReferenceQuery, useVerifyPaymentMutation } from "../apis/userPayment_api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";


const useUserPaymentHook = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const [getPaymentReference, { data: paymentReference, isLoading: getPaymentReferenceLoading }] = useLazyGetPaymentReferenceQuery();
    const [verifyPayment, { isLoading: isVerifyPaymentLoading }] = useVerifyPaymentMutation();

    // Get payment reference
    const handleGetPaymentReference = async (deliveryAddress_id: string) => {
        try {
            await getPaymentReference({ deliveryAddress_id }).unwrap();
            // console.log("RESPONSE DATA::: ", getPaymentReferenceResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    // Handle payment success
    const handlePaymentSuccess = async (reference: string) => {
        console.log("PAYMENT REFERENCE::: ", reference);

        // Verify payment
        try {
            const verifyPaymentResponse = await verifyPayment({ reference }).unwrap();
            console.log("VERIFY PAYMENT RESPONSE DATA SUCCESS::: ", verifyPaymentResponse);

            if (verifyPaymentResponse!) {
                navigation.navigate("deliveryAddressScreen");
            }
        } catch (error) {
            console.log("ERROR::: ", error);
            navigation.navigate("deliveryAddressScreen");
        }
    };

    // Handle payment cancel
    const handlePaymentCancel = () => {
        console.log("PAYMENT CANCELED.");
        navigation.navigate("deliveryAddressScreen");
    };


    return {
        paymentReference, getPaymentReferenceLoading, handleGetPaymentReference,
        isVerifyPaymentLoading,
        handlePaymentSuccess, handlePaymentCancel,
    };
};

export default useUserPaymentHook;  //JP-9224287-1739224028430