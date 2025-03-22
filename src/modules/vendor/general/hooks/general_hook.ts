import { useDispatch } from "react-redux";
import { setShop } from "../slices/general_slice";
import { useLazyGetShopQuery } from "../apis/general_api";

/**
 * The useGeneralHook
 * @returns {  }
 */
const useVendorGeneralHook = () => {
    const dispatch = useDispatch();
    const [getShop] = useLazyGetShopQuery();

    const handleGetShop = async (shopId: string) => {
        try {
            const shop = await getShop(shopId).unwrap();
    
            // Dispatch to Redux Store
            dispatch(setShop(shop));
        } catch (error) {
            console.log("ERROR::: ", error);
        };
    };

    return {};
};

export default useVendorGeneralHook;