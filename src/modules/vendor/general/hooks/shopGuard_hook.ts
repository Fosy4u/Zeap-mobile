import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useLazyGetAuthShopQuery } from "../apis/general_api";
import { setShop } from "../slices/general_slice";

/* Is this the backend saying "this account has no shop"? A dropped connection
   or a 500 must never be read as "your shop is gone". */
const isShopNotFound = (error: any): boolean => {
    const status = error?.status ?? error?.originalStatus;
    const message = String(
        error?.data?.error ?? error?.data?.message ?? error?.message ?? "",
    ).toLowerCase();

    if (message.includes("shop not found") || message.includes("no shop")) { return true; }

    // A bare 404 on /shop/auth means the same thing without a message.
    return status === 404;
};

const useShopGuardHook = () => {
    const dispatch = useDispatch();
    const { shop } = useSelector((state: RootState) => state.vendorGeneralState);
    const { userData } = useSelector((state: RootState) => state.profileState);

    const [getAuthShop] = useLazyGetAuthShopQuery();

    /* Two flags, because they gate different things: isResolving covers only the
       first answer, isChecking covers any request — including a modal retry. */
    const [isResolvingShop, setIsResolvingShop] = useState(true);
    const [isCheckingShop, setIsCheckingShop] = useState(true);

    /* Set only on a definitive answer from the backend, never on a failure we
       can't read — see isShopNotFound above. */
    const [hasNoShop, setHasNoShop] = useState(false);

    const recheckShop = useCallback(async () => {
        setIsCheckingShop(true);

        try {
            /* forceRefetch — this is a gate, so it must reflect the backend now
               and not a cache entry from before the shop changed. */
            const authShop = await getAuthShop(undefined, false).unwrap();

            if (authShop?.shopId) {
                dispatch(setShop(authShop));
                setHasNoShop(false);
            } else {
                // 2xx with nothing in it — no shop on record for this account.
                dispatch(setShop(null));
                setHasNoShop(true);
            }
        } catch (error) {
            /* Anything other than a definitive "no shop" keeps the existing
               store value, so a network blip doesn't strand the vendor. */
            if (isShopNotFound(error)) {
                dispatch(setShop(null));
                setHasNoShop(true);
            }
        } finally {
            setIsCheckingShop(false);
            setIsResolvingShop(false);
        }
    }, []);

    useEffect(() => {
        /* Guests never own a shop and the request would only 401 — settle
           straight away rather than claiming their shop is missing. */
        if (userData?.isGuest) {
            setIsCheckingShop(false);
            setIsResolvingShop(false);
            setHasNoShop(false);
            return;
        }

        recheckShop();
    }, [userData?.uid, userData?.isGuest]);

    return {
        shop,
        shopStatus: shop?.status,
        isResolvingShop,
        isCheckingShop,
        hasNoShop,
        recheckShop,
    };
};

export default useShopGuardHook;
