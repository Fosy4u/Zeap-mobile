import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import handleError from "../../../general/hooks/errorHandler_hook";
import { useApplyVoucherMutation, useRemoveVoucherMutation } from "../../pointAndVoucher/apis/pointAndVoucher_api";
import { useLazyGetCartQuery, useLazyGetOrderSummaryQuery } from "../apis/cart_api";
import { setCart, setOrderSummary } from "../slices/cart_slice";
import normalizeDeliveryCountry from "../../../../utils/normalizeDeliveryCountry";

const useVoucherHook = () => {
    const { cart, selectedDeliveryFee } = useSelector((state: RootState) => state.cartState);
    const { selectedAddress } = useSelector((state: RootState) => state.addressState);
    const dispatch = useDispatch();

    const [voucherCode, setVoucherCode] = useState<string>("");
    const [isVoucherApplied, setIsVoucherApplied] = useState<boolean>(false);

    const [applyVoucher, { isLoading: isApplying }] = useApplyVoucherMutation();
    const [removeVoucher, { isLoading: isRemoving }] = useRemoveVoucherMutation();
    const [getCart] = useLazyGetCartQuery();
    const [getOrderSummary] = useLazyGetOrderSummaryQuery();

    const appliedCode = cart?.voucher?.code ?? "";

    useEffect(() => {
        if (appliedCode) {
            setVoucherCode(appliedCode);
            setIsVoucherApplied(true);
        }
    }, [appliedCode]);

    const refreshBasketTotals = async () => {
        const requestParams = {
            country: normalizeDeliveryCountry(selectedAddress?.country) || "Nigeria",
            method: selectedDeliveryFee?.method || "standard",
        };

        const cartResponse = await getCart().unwrap().catch(() => undefined);
        if (cartResponse) { dispatch(setCart(cartResponse)); }

        const orderSummaryResponse = await getOrderSummary(requestParams).unwrap().catch(() => undefined);
        if (orderSummaryResponse) { dispatch(setOrderSummary(orderSummaryResponse)); }
    };

    const handleApplyVoucher = async () => {
        const code = voucherCode.trim();
        if (!code) {
            Alert.alert("Error", "Please enter a voucher code.");
            return;
        }

        try {
            await applyVoucher({ code }).unwrap();
            setIsVoucherApplied(true);
            await refreshBasketTotals();
        } catch (error) {
            handleError(error);
        }
    };

    const handleRemoveVoucher = async () => {
        try {
            await removeVoucher().unwrap();
            setIsVoucherApplied(false);
            setVoucherCode("");
            await refreshBasketTotals();
        } catch (error) {
            handleError(error);
        }
    };

    return {
        voucherCode, setVoucherCode,
        isVoucherApplied,
        isVoucherLoading: isApplying || isRemoving,
        handleApplyVoucher,
        handleRemoveVoucher,
    };
};

export default useVoucherHook;
