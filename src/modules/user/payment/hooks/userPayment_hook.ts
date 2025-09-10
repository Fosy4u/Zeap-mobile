import { useLazyGetPaymentReferenceQuery, useVerifyPaymentMutation } from "../apis/userPayment_api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useState } from "react";
import IPaymentReferenceParams from "../models/paymentReferenceParams_model";
import handleError from "../../../general/hooks/errorHandler_hook";

const useUserPaymentHook = () => {
    const { userData } = useSelector((state: RootState) => state.profileState );
    const [paymentReference, setPaymentReference] = useState<any>(null); 
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const [loadingMessage, setLoadingMessage] = useState("");
    const[isLoading, setIsLoading] = useState(false);

    const [getPaymentReference] = useLazyGetPaymentReferenceQuery();
    const [verifyPayment] = useVerifyPaymentMutation();

    // Get payment reference
    const handleGetPaymentReference = async (requestParams: IPaymentReferenceParams) => {
        setLoadingMessage("Getting payment reference...");
        setIsLoading(true);
        setPaymentReference(null); 
        // console.log("REQUEST PARAMS::: ", requestParams);
        
        try {
            const paymentReferenceResponse = await getPaymentReference(requestParams).unwrap();
            setPaymentReference(paymentReferenceResponse);
            // console.log("PAYMENT REFERENCE RESPONSE::: ", paymentReferenceResponse);
        } catch (error) {
            setPaymentReference(null);
            handleError(error);
            console.log("ERROR::: ", error);
        } finally {
            setIsLoading(false);
            setLoadingMessage("");
        }
    };

    // Handle payment success
    const handlePaymentSuccess = async (reference: string) => {
        setLoadingMessage("Verifying payment...");
        setIsLoading(true);
        // console.log("PAYMENT REFERENCE::: ", reference);

        // Verify payment
        try {
            const verifyPaymentResponse = await verifyPayment({ reference }).unwrap();
            console.log("VERIFY PAYMENT RESPONSE DATA SUCCESS::: ", verifyPaymentResponse);

            if (verifyPaymentResponse!) {
                navigation.navigate("ordersScreen");
            }
        } catch (error) {
            console.log("ERROR::: ", error);
        } finally {
            setIsLoading(false);
            setLoadingMessage("");
        }
    };

    // Handle payment cancel
    const handlePaymentCancel = () => {
        console.log("PAYMENT CANCELED.");
        navigation.navigate("checkoutScreen");
    };

    return {
        handleGetPaymentReference,
        isLoading, loadingMessage,
        handlePaymentSuccess, handlePaymentCancel,
        paymentReference,
    };
};

export default useUserPaymentHook;