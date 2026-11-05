import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store/store";
import { useGetWishlistQuery } from "../apis/saved_api";
import { setSavedWishEntries } from "../slices/saved_slice";
import useWishlistToggle from "./wishlistToggle_hook";

const useSavedHook = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isSaved, toggleSave } = useWishlistToggle();

    const { data: wishItems = [], isLoading: isWishlistLoading, isFetching: isWishlistFetching, refetch } = useGetWishlistQuery();

    useEffect(() => {
        dispatch(setSavedWishEntries(
            wishItems
                .filter((item) => !!item.product?.productId)
                .map((item) => ({ productId: item.product!.productId, wishId: item._id })),
        ));
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
