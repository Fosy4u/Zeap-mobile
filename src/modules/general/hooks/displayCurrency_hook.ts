import { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import formatCurrency from "../../../utils/formatCurrency";
import currencies from "../../../utils/currencies.json";

const FALLBACK_CURRENCY = "NGN";

const useDisplayCurrency = () => {
    const { userData, currencyRefreshToken } = useSelector((state: RootState) => state.profileState);
    const preferredCurrency = userData?.prefferedCurrency || FALLBACK_CURRENCY;

    const resolveCurrency = useCallback(
        (payloadCurrency?: string | null): string => payloadCurrency || preferredCurrency,
        [preferredCurrency]
    );

    const currencySymbol = useCallback(
        (payloadCurrency?: string | null): string => {
            const code = resolveCurrency(payloadCurrency);
            return currencies.find((currency) => currency.code === code)?.symbol ?? code;
        },
        [resolveCurrency]
    );

    const formatPrice = useCallback(
        (amount?: number | string | null, payloadCurrency?: string | null): string =>
            formatCurrency(Number(amount) || 0, resolveCurrency(payloadCurrency)),
        [resolveCurrency]
    );

    const pickAmount = useCallback(
        <T extends { currency?: string }>(amounts?: T[] | null): T | undefined =>
            amounts?.find((amount) => amount.currency === preferredCurrency) ?? amounts?.[0],
        [preferredCurrency]
    );

    const formatAmount = useCallback(
        (amounts?: { currency?: string; value?: number }[] | null): string => {
            const amount = pickAmount(amounts);
            return formatPrice(amount?.value, amount?.currency);
        },
        [pickAmount, formatPrice]
    );

    return { preferredCurrency, currencyRefreshToken, resolveCurrency, currencySymbol, formatPrice, pickAmount, formatAmount };
};

export default useDisplayCurrency;
