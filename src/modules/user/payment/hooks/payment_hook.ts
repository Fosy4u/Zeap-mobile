import { useLazyGetPaymentReferenceQuery, useVerifyPaymentMutation } from "../apis/payment_api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useState } from "react";
import handleError from "../../../general/hooks/errorHandler_hook";
import { useStripe } from "@stripe/stripe-react-native";
import { setNewOrderId, setPaymentReference, setShowOrderSuccessModal } from "../slices/payment_slice";
import IPaymentReference from "../models/paymentReference_model";
import { setCart } from "../../cart/slices/cart_slice";

const usePaymentHook = () => {
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

        // Progressive loading messages — the Render-hosted backend can cold
        // start in 30-60s, so update the message after 10s/25s instead of
        // leaving the user staring at a static spinner.
        const slowMessageTimer = setTimeout(() => {
            setLoadingMessage("Backend is waking up, please hold on…");
        }, 10000);
        const verySlowMessageTimer = setTimeout(() => {
            setLoadingMessage("Still waiting on the server… almost there.");
        }, 25000);

        // Hard timeout — RTK Query has no built-in request timeout, and the
        // server-side payment-reference call must not be retried (it creates
        // a Paystack reference each call). Abort after 45s and surface a
        // real error rather than appearing to hang indefinitely.
        let aborted = false;
        const promise = getPaymentReference(requestParams);
        const hardTimeout = setTimeout(() => {
            aborted = true;
            promise.abort();
        }, 45000);

        try {
            const paymentReferenceResponse = await promise.unwrap();
            console.log("PAYMENT REFERENCE RESPONSE::: ", paymentReferenceResponse);

            if (paymentReferenceResponse) {
                dispatch(setPaymentReference(paymentReferenceResponse));

                const paymentCurrency = paymentReferenceResponse?.currency || "NGN";
                console.log("PAYMENT CURRENCY::: ", paymentCurrency);

                if (paymentCurrency === "NGN") {
                    navigation.navigate("paystackPaymentScreen");
                } else {
                    await handleStripePayment(paymentReferenceResponse, paymentReferenceResponse?.stripeClientSecret);
                }
            }
        } catch (error) {
            console.log("ERROR::: ", error);
            if (aborted) {
                handleError(new Error(
                    "The payment server is taking too long to respond. Please check your connection and try again in a moment.",
                ));
            } else {
                handleError(error);
            }
        } finally {
            clearTimeout(slowMessageTimer);
            clearTimeout(verySlowMessageTimer);
            clearTimeout(hardTimeout);
            setIsLoading(false);
            setLoadingMessage("");
        }
    };

    // Handle Stripe payment
    const handleStripePayment = async (paymentReference?: IPaymentReference, clientSecret?: string) => {
        // Initialize the payment sheet. Prefer the provided clientSecret (fresh), otherwise fallback to selector.
        const stripeClientSecret = clientSecret ?? paymentReference?.stripeClientSecret!;
        console.log("STRIPE CLIENT SECRET::: ", stripeClientSecret);
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
        console.log("PAYMENT REFERENCE::: ", reference);

        // Verify payment
        try {
            const verifyPaymentResponse = await verifyPayment({ reference }).unwrap();
            console.log("VERIFY PAYMENT RESPONSE DATA SUCCESS::: ", verifyPaymentResponse);

            if (verifyPaymentResponse!) {
                // Mirror the backend's cleared basket locally. The backend
                // returns 404 "Basket not found" when the basket is empty,
                // so fetching here would just produce a noisy error log/alert.
                dispatch(setCart({
                    _id: "",
                    user: "",
                    basketId: "",
                    basketItems: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));

                // Surface the order-success modal. Receipt / View Order navigation
                // is owned by the modal's CTAs so the user controls where they land.
                const newOrderId = verifyPaymentResponse?.orderId ?? verifyPaymentResponse?.order?.orderId ?? "";
                if (newOrderId) {
                    dispatch(setNewOrderId(newOrderId));
                }
                dispatch(setShowOrderSuccessModal(true));
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