import { useDispatch } from "react-redux";
import { setActiveVouchers, setInactiveVouchers, setIsLoading, setLoadingMessage, setPoints, setSelectedTab, setSelectedVoucher } from "../slices/pointAndVoucher_slice";
import { useConvertPointsMutation, useLazyGetActiveVouchersQuery, useLazyGetInactiveVouchersQuery, useLazyGetPointsQuery, useLazyGetVoucherByCodeQuery } from "../apis/pointAndVoucher_api";
import handleError from "../../../general/hooks/errorHandler_hook";

const usePointAndVoucherHook = () => {
    const dispatch = useDispatch();

    const [getPoints] = useLazyGetPointsQuery();
    const [getActiveVouchers] = useLazyGetActiveVouchersQuery();
    const [getInactiveVouchers] = useLazyGetInactiveVouchersQuery();
    const [getVoucherByCode] = useLazyGetVoucherByCodeQuery();
    const [convertPoints] = useConvertPointsMutation();

    // Handle Get Points
    const handleGetPoints = async () => {
        dispatch(setLoadingMessage("Getting points..."));
        dispatch(setIsLoading(true));

        try {
            const pointsResponse = await getPoints().unwrap();
            // console.log("POINTS RESPONSE", pointsResponse);
            
            if (pointsResponse) {
                dispatch(setPoints(pointsResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle Get Active Vouchers
    const handleGetActiveVouchers = async () => {
        dispatch(setLoadingMessage("Getting active vouchers..."));
        dispatch(setIsLoading(true));

        try {
            const vouchersResponse = await getActiveVouchers().unwrap();
            // console.log("ACTIVE VOUCHERS RESPONSE", vouchersResponse);
            
            if (vouchersResponse) {
                // Assuming you have a setActiveVouchers action to handle the response
                dispatch(setActiveVouchers(vouchersResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle Get Inactive Vouchers
    const handleGetInactiveVouchers = async () => {
        dispatch(setLoadingMessage("Getting inactive vouchers..."));
        dispatch(setIsLoading(true));

        try {
            const vouchersResponse = await getInactiveVouchers().unwrap();
            // console.log("INACTIVE VOUCHERS RESPONSE", vouchersResponse);
            
            if (vouchersResponse) {
                // Assuming you have a setInactiveVouchers action to handle the response
                dispatch(setInactiveVouchers(vouchersResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle Get Voucher by Code
    const handleGetVoucherByCode = async (code: string, setShowBottomSheetModal: (value: boolean) => void) => {
        dispatch(setLoadingMessage("Getting voucher by code..."));
        dispatch(setIsLoading(true));

        try {
            const voucherResponse = await getVoucherByCode({ code }).unwrap();
            console.log("VOUCHER RESPONSE", voucherResponse);

            if (voucherResponse) {
                dispatch(setSelectedVoucher(voucherResponse));
                setShowBottomSheetModal(true);
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle Convert Points to Vouchers
    const handleConvertPoints = async (points: number) => {
        dispatch(setLoadingMessage("Converting points..."));
        dispatch(setIsLoading(true));

        if (points <= 0) {
            handleError(new Error("Points to convert must be greater than zero."));
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            return;
        }

        try {
            const vouchersResponse = await convertPoints({points}).unwrap();
            // console.log("VOUCHER RESPONSE", vouchersResponse);
            
            if (vouchersResponse) {
                handleGetActiveVouchers();
                handleGetInactiveVouchers();
                dispatch(setSelectedTab("Vouchers"));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };
    
    return {
        handleGetPoints,
        handleGetActiveVouchers,
        handleGetInactiveVouchers,
        handleGetVoucherByCode,
        handleConvertPoints,
    };
};

export default usePointAndVoucherHook;