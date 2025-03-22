import { useDispatch } from "react-redux";
import { useLazyGetCartQuery, useLazyGetCartTotalQuery } from "../apis/cart_api";
import { AppDispatch } from "../../../../redux/store/store";
import { setCart } from "../slices/cart_slice";

const useCartHook = () => {
    const dispatch = useDispatch<AppDispatch>();

      const [getCart, { data: carts, isLoading: cartItemsLoading }] = useLazyGetCartQuery();
      const [getCartTotal, { data: cartTotal, isLoading: cartTotalLoading }] = useLazyGetCartTotalQuery();

      
    // Get Cart items
    const handleGetCartItems = async () => {
        try {
            const getCartResponse = await getCart().unwrap();
            dispatch(setCart(getCartResponse));
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    // Get Cart Total
    const handleGetCartTotal = async () => {
        try {
            await getCartTotal().unwrap();
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    return {
        carts, cartItemsLoading, handleGetCartItems,
        cartTotal, cartTotalLoading, handleGetCartTotal
    };
};

export default useCartHook;