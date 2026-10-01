import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useLazyGetNotificationsQuery } from "../../../notifications/apis/notification_api";
import { setNotifications } from "../../../notifications/slices/notifications_slice";
import { useLazyGetProductsQuery } from "../apis/product_api";
import { useLazyGetDraftProductsQuery } from "../apis/bespokeProduct_api";
import { setDraftProducts, setProducts } from "../slices/vendorProductState_slice";

// Controller for the product-creation success modal. Submitting a product both
// creates a server-side notification (the "under review" alert) and changes the
// shop's product lists (a new product appears; the draft it came from leaves the
// draft list). The Products screen only fetches on mount/page-change and React
// Navigation keeps it mounted, so neither the bell badge nor the listing would
// refresh until the app is reopened. Either modal button refetches all three and
// writes them into the slices the dashboard/listing read from, so everything is
// up to date the moment the user lands.
const useSuccessPopupHook = () => {
    const { userData } = useSelector((state: RootState) => state.profileState);
    const dispatch = useDispatch();

    const [getNotifications] = useLazyGetNotificationsQuery();
    const [getProducts] = useLazyGetProductsQuery();
    const [getDraftProducts] = useLazyGetDraftProductsQuery();

    // Refresh the dashboard bell badge.
    const handleRefreshNotificationCount = async () => {
        try {
            const notificationsResponse = await getNotifications().unwrap();

            if (notificationsResponse) {
                dispatch(setNotifications(notificationsResponse.notifications));
            }
        } catch (error) {
            // Silently ignore — refreshing the badge must never block the
            // navigation that the success-modal buttons perform.
        }
    };

    // Refresh the product listing and the draft-products section so the freshly
    // submitted product shows up (and its old draft disappears) without a manual
    // pull-to-refresh. Mirrors the default first-page params the listing uses.
    const handleRefreshProductList = async () => {
        try {
            const products = await getProducts({ pageNumber: 1, limit: 20 }).unwrap();

            if (products) {
                dispatch(setProducts(products));
            }
        } catch (error) {
            // Silently ignore — see note above.
        }

        try {
            const draftProducts = await getDraftProducts({ shopId: userData?.shopId || "" }).unwrap();

            if (draftProducts) {
                dispatch(setDraftProducts(draftProducts));
            }
        } catch (error) {
            // Silently ignore — see note above.
        }
    };

    return {
        handleRefreshNotificationCount,
        handleRefreshProductList,
    };
};

export default useSuccessPopupHook;
