import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useLazyGetNotificationsQuery } from "../../../notifications/apis/notification_api";
import { setNotifications } from "../../../notifications/slices/notifications_slice";
import { useLazyGetProductsQuery } from "../apis/product_api";
import { useLazyGetDraftProductsQuery } from "../apis/bespokeProduct_api";
import { setDraftProducts, setProducts } from "../slices/vendorProductState_slice";

const useSuccessPopupHook = () => {
    const { userData } = useSelector((state: RootState) => state.profileState);
    const dispatch = useDispatch();

    const [getNotifications] = useLazyGetNotificationsQuery();
    const [getProducts] = useLazyGetProductsQuery();
    const [getDraftProducts] = useLazyGetDraftProductsQuery();

    const handleRefreshNotificationCount = async () => {
        try {
            const notificationsResponse = await getNotifications().unwrap();

            if (notificationsResponse) {
                dispatch(setNotifications(notificationsResponse.notifications));
            }
        } catch (error) {
        }
    };

    const handleRefreshProductList = async () => {
        try {
            const products = await getProducts({ pageNumber: 1, limit: 20 }).unwrap();

            if (products) {
                dispatch(setProducts(products));
            }
        } catch (error) {
        }

        try {
            const draftProducts = await getDraftProducts({ shopId: userData?.shopId || "" }).unwrap();

            if (draftProducts) {
                dispatch(setDraftProducts(draftProducts));
            }
        } catch (error) {
        }
    };

    return {
        handleRefreshNotificationCount,
        handleRefreshProductList,
    };
};

export default useSuccessPopupHook;
