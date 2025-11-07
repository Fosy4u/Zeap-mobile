import { useDispatch } from "react-redux";
import { setIsLoading, setLoadingMessage, setPayments } from "../slices/payment_slice";
import { useLazyGetVendorPaymentsQuery } from "../apis/payment_api";
import handleError from "../../../general/hooks/errorHandler_hook";

const useVendorPaymentHook = () => {
    const dispatch = useDispatch()

    const [getVendorPayments] = useLazyGetVendorPaymentsQuery();

    // Handle get all payments
    const handleGetVendorPayments = async (shopID: string) => {
        dispatch(setLoadingMessage("Fetching payments..."));
        dispatch(setIsLoading(true));

        try {
            const paymentResponse = await getVendorPayments({ shopID }).unwrap();
            // console.log("PAYMENT RESPONSE::: ", paymentResponse);
            
            if (paymentResponse) {
                dispatch(setPayments(paymentResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    return {
        handleGetVendorPayments,
    };
};

export default useVendorPaymentHook;