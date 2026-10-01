import { useLazyGetPaymentReferenceQuery, useVerifyPaymentMutation } from "../apis/payment_api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useState } from "react";
import handleError from "../../../general/hooks/errorHandler_hook";
import { useStripe } from "@stripe/stripe-react-native";
import { setGainedPoints, setNewOrderId, setPaymentReference, setShowOrderSuccessModal } from "../slices/payment_slice";
import IPaymentReference from "../models/paymentReference_model";
import IVerifyPaymentResponse from "../models/verifyPaymentResponse_model";
import { setCart } from "../../cart/slices/cart_slice";
import normalizeDeliveryCountry from "../../../../utils/normalizeDeliveryCountry";

const usePaymentHook = () => {
    const { userData } = useSelector((state: RootState) => state.profileState );
    const { selectedDeliveryFee } = useSelector((state: RootState) => state.cartState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const { initPaymentSheet, presentPaymentSheet, retrievePaymentIntent } = useStripe();

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
            // SelectList returns keys such as "UK"/"USA", but the payment API
            // accepts canonical names such as "United Kingdom"/"United States".
            country: normalizeDeliveryCountry(formData.country),
            phoneNumber: formData.phoneNumber,
            method: selectedDeliveryFee?.method || "standard",
        };

        const slowMessageTimer = setTimeout(() => {
            setLoadingMessage("Backend is waking up, please hold on…");
        }, 10000);
        const verySlowMessageTimer = setTimeout(() => {
            setLoadingMessage("Still waiting on the server… almost there.");
        }, 25000);

        let aborted = false;
        const promise = getPaymentReference(requestParams);
        const hardTimeout = setTimeout(() => {
            aborted = true;
            promise.abort();
        }, 45000);

        try {
            const paymentReferenceResponse = await promise.unwrap();
            console.log("PAYMENT REFERENCE::: ", paymentReferenceResponse?.reference, "status:", paymentReferenceResponse?.paymentStatus);

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
        const stripeClientSecret = clientSecret ?? paymentReference?.stripeClientSecret!;
        console.log("STRIPE PAYMENT INTENT::: ", stripeClientSecret?.split("_secret_")[0]);
        const { error: paymentSheetError } = await initPaymentSheet({
            paymentIntentClientSecret: stripeClientSecret,
            merchantDisplayName: "Zeaper",
            returnURL: "zeaper://stripe-redirect",
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

        // PaymentSheet returning without an error normally means confirmation
        // completed. Retrieve the intent as an additional guard before asking
        // our server to fulfil the order.
        const { paymentIntent, error: retrieveError } = await retrievePaymentIntent(stripeClientSecret);
        if (retrieveError) {
            handleError(retrieveError);
            return;
        }

        const stripeStatus = paymentIntent?.status;
        console.log("STRIPE PAYMENT INTENT STATUS::: ", stripeStatus);
        if (stripeStatus !== "Succeeded" && stripeStatus !== "Processing") {
            handleError(new Error(`Stripe payment is not complete (status: ${ stripeStatus || "unknown" }).`));
            return;
        }

        await handlePaymentSuccess(paymentReference?.reference!, true);
    };

    // Handle payment success
    const handlePaymentSuccess = async (reference: string, retryPendingStripePayment = false) => {
        setLoadingMessage("Verifying payment...");
        setIsLoading(true);
        console.log("PAYMENT REFERENCE::: ", reference);

        // Verify payment
        try {
            const retryDelays = retryPendingStripePayment
                ? [0, 1500, 3000, 6000, 10000]
                : [0];
            let verifyPaymentResponse: IVerifyPaymentResponse | undefined;

            for (let attempt = 0; attempt < retryDelays.length; attempt += 1) {
                if (retryDelays[attempt] > 0) {
                    setLoadingMessage("Confirming your Stripe payment...");
                    await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]));
                }

                try {
                    verifyPaymentResponse = await verifyPayment({ reference }).unwrap();
                    break;
                } catch (error: any) {
                    const message = error?.data?.error ?? error?.data?.message ?? "";
                    const isPendingStripeSync =
                        error?.status === 500 &&
                        String(message).toLowerCase().includes("payment not successful");
                    const hasAnotherAttempt = attempt < retryDelays.length - 1;

                    if (!retryPendingStripePayment || !isPendingStripeSync || !hasAnotherAttempt) {
                        throw error;
                    }
                }
            }

            console.log("VERIFY PAYMENT RESPONSE DATA SUCCESS::: ", verifyPaymentResponse);

            if (verifyPaymentResponse!) {
                dispatch(setCart({
                    _id: "",
                    user: "",
                    basketId: "",
                    basketItems: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));

                const newOrderId = verifyPaymentResponse?.order?.orderId ?? "";
                if (newOrderId) {
                    dispatch(setNewOrderId(newOrderId));
                }
                const gainedPoints = verifyPaymentResponse?.addedPoints ?? verifyPaymentResponse?.order?.gainedPoints ?? 0;
                dispatch(setGainedPoints(gainedPoints));
                dispatch(setShowOrderSuccessModal(true));
            }
        } catch (error) {
            console.log("ERROR::: ", error);
            /* Reaching here means the gateway already confirmed the charge, so
               staying silent leaves the user paid with no order and no notice. */
            handleError(new Error(
                `We could not confirm your payment (ref: ${reference}). If you were charged, please contact support with this reference rather than paying again.`,
            ));
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
