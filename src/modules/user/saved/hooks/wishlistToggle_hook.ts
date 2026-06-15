import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store/store";
import handleError from "../../../general/hooks/errorHandler_hook";
import IProduct from "../../products/models/product_model";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "../apis/saved_api";
import { addSavedProductId, removeSavedProductId } from "../slices/saved_slice";

// Lightweight wishlist controller for product cards: reads the optimistic
// saved-id mirror and toggles it, WITHOUT subscribing to the wishlist query
// (so a screen full of cards doesn't spawn a fetch each). The list query +
// reconciliation lives in useSavedHook, used by the Saved screen.
const useWishlistToggle = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { savedProductIds } = useSelector((state: RootState) => state.savedState);

    const [addToWishlist] = useAddToWishlistMutation();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();

    const isSaved = (productId?: string) => !!productId && savedProductIds.includes(productId);

    // /wish/add needs a colour. Bespoke saves as "Bespoke"; ready-made falls
    // back to the product's default/first colour.
    const resolveColor = (product?: IProduct): string => {
        if (product?.productType === "bespokeCloth" || product?.productType === "bespokeShoe") return "Bespoke";
        return product?.colors?.[0]?.value || product?.variations?.[0]?.colorValue || "Default";
    };

    // Optimistic toggle with revert-on-failure.
    const toggleSave = async (product?: IProduct) => {
        const productId = product?.productId;
        if (!productId) return;

        if (savedProductIds.includes(productId)) {
            dispatch(removeSavedProductId(productId));
            try {
                await removeFromWishlist({ productId }).unwrap();
            } catch (error) {
                dispatch(addSavedProductId(productId));
                handleError(error);
            }
        } else {
            dispatch(addSavedProductId(productId));
            try {
                await addToWishlist({ productId, color: resolveColor(product) }).unwrap();
            } catch (error) {
                dispatch(removeSavedProductId(productId));
                handleError(error);
            }
        }
    };

    return { isSaved, toggleSave };
};

export default useWishlistToggle;
