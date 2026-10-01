import { useDispatch } from "react-redux";
import { setHasFetched, setIsLoading, setLoadingMessage, setPayments } from "../slices/payment_slice";
import { useLazyGetVendorPaymentsQuery } from "../apis/payment_api";
import handleError from "../../../general/hooks/errorHandler_hook";

const useVendorPaymentHook = () => {
    const dispatch = useDispatch()

    const [getVendorPayments] = useLazyGetVendorPaymentsQuery();

    // Handle get all payments
    const handleGetVendorPayments = async (shopID: string) => {
        dispatch(setLoadingMessage("Fetching payments..."));
        dispatch(setIsLoading(true));

        dispatch(setPayments([]));

        try {
            /* forceRefetch so the screen always reflects the backend rather
               than an RTK Query cache entry from earlier in the session. */
            const paymentResponse = await getVendorPayments({ shopID }, false).unwrap();

            /* Always write the response through — including an empty list, so
               "no payments" is shown as an empty state instead of stale rows. */
            dispatch(setPayments(paymentResponse ?? []));
        } catch (error) {
            /* Leave the list empty rather than showing data we can't trust. */
            dispatch(setPayments([]));
            handleError(error);
        } finally {
            dispatch(setHasFetched(true));
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    return {
        handleGetVendorPayments,
    };
};

export default useVendorPaymentHook;