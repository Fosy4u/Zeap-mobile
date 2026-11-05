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
            const paymentResponse = await getVendorPayments({ shopID }, false).unwrap();

            dispatch(setPayments(paymentResponse ?? []));
        } catch (error) {
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