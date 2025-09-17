import { useLazyGetPaymentReferenceQuery, useVerifyPaymentMutation } from "../apis/payment_api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useState } from "react";
import handleError from "../../../general/hooks/errorHandler_hook";
import { useStripe } from "@stripe/stripe-react-native";
import { setPaymentReference } from "../slices/payment_slice";

const usePaymentHook = () => {
    const { paymentReference } = useSelector((state: RootState) => state.paymentState);
    const { userData } = useSelector((state: RootState) => state.profileState );
    const { selectedDeliveryFee } = useSelector((state: RootState) => state.cartState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const [loadingMessage, setLoadingMessage] = useState("");
    const[isLoading, setIsLoading] = useState(false);

    const [getPaymentReference] = useLazyGetPaymentReferenceQuery();
    const [verifyPayment] = useVerifyPaymentMutation();


    // Handle proceed to payment
    const handleProceedToPayment = async (formData: any) => {
        setLoadingMessage("Fetching payment reference...");
        setIsLoading(true);
        
        const requestParams = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: userData.email!,
            address: formData.address,
            region: formData.region,
            country: formData.country,
            phoneNumber: formData.phoneNumber,
            method: selectedDeliveryFee?.method || "standard",
        };
        // console.log("REQUEST PARAMS::: ", requestParams);

        try {
            const paymentReferenceResponse = await getPaymentReference(requestParams).unwrap();
            console.log("PAYMENT REFERENCE RESPONSE::: ", paymentReferenceResponse);

            if (paymentReferenceResponse) {
                dispatch(setPaymentReference(paymentReferenceResponse));
                
                // Check payment currency
                const paymentCurrency = paymentReferenceResponse?.currency || "NGN";

                if (paymentCurrency === "NGN") {
                    // TODO Show Paystack bottomsheet
                    navigation.navigate("paystackPaymentScreen");
                } else {
                    // Call "handleStripePatement"
                    handleStripePatement();
                }
            }
        } catch (error) {
            handleError(error);
            console.log("ERROR::: ", error);
        } finally {
            setIsLoading(false);
            setLoadingMessage("");
        }
    };

    // Handle Stripe payment
    const handleStripePatement = async () => {
        // Initialize the payment sheet
        const stripeClientSecret = paymentReference?.stripeClientSecret!;
        const { error: paymentSheetError } = await initPaymentSheet({
            paymentIntentClientSecret: stripeClientSecret,
            merchantDisplayName: "Zeaper",
            defaultBillingDetails: {
                name: paymentReference?.fullName || "N/A",
                email: paymentReference?.email || "N/A",
                phone: "",
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

        // If everything went well, handle the successful payment
        handlePaymentSuccess(paymentReference?.reference!);
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
        isLoading, loadingMessage,
        handlePaymentSuccess, handlePaymentCancel,
        handleProceedToPayment,
    };
};

export default usePaymentHook;