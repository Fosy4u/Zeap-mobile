import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store/store";
import { useGetWishlistQuery } from "../apis/saved_api";
import { setSavedProductIds } from "../slices/saved_slice";
import useWishlistToggle from "./wishlistToggle_hook";

// Full wishlist controller for the Saved screen (and anywhere that needs to
// seed/refresh the list): fetches GET /wish/auth/user, reconciles the optimistic
// saved-id mirror, and re-exposes isSaved/toggleSave from the toggle hook.
const useSavedHook = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isSaved, toggleSave } = useWishlistToggle();

    const { data: wishItems = [], isLoading: isWishlistLoading, isFetching: isWishlistFetching, refetch } = useGetWishlistQuery();

    // Reconcile the local saved-id mirror whenever the server list changes, so
    // hearts reflect the true wishlist after a fresh fetch / app restart.
    useEffect(() => {
        dispatch(setSavedProductIds(wishItems.map((item) => item.product?.productId).filter(Boolean) as string[]));
    }, [wishItems]);

    return {
        wishItems,
        isWishlistLoading,
        isWishlistFetching,
        refetch,
        isSaved,
        toggleSave,
    };
};

export default useSavedHook;
