import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useLazyGetAuthShopQuery } from "../apis/general_api";
import { setShop } from "../slices/general_slice";

const isShopNotFound = (error: any): boolean => {
    const status = error?.status ?? error?.originalStatus;
    const message = String(
        error?.data?.error ?? error?.data?.message ?? error?.message ?? "",
    ).toLowerCase();

    if (message.includes("shop not found") || message.includes("no shop")) { return true; }

    return status === 404;
};

const useShopGuardHook = () => {
    const dispatch = useDispatch();
    const { shop } = useSelector((state: RootState) => state.vendorGeneralState);
    const { userData } = useSelector((state: RootState) => state.profileState);

    const [getAuthShop] = useLazyGetAuthShopQuery();

    const [isResolvingShop, setIsResolvingShop] = useState(true);
    const [isCheckingShop, setIsCheckingShop] = useState(true);

    const [hasNoShop, setHasNoShop] = useState(false);

    const recheckShop = useCallback(async () => {
        setIsCheckingShop(true);

        try {
            const authShop = await getAuthShop(undefined, false).unwrap();

            if (authShop?.shopId) {
                dispatch(setShop(authShop));
                setHasNoShop(false);
            } else {
                dispatch(setShop(null));
                setHasNoShop(true);
            }
        } catch (error) {
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
