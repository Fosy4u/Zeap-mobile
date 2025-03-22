import { useDispatch } from "react-redux";
import { useLazyGetShopQuery } from "../../general/apis/general_api";
import { setShop } from "../../general/slices/general_slice";
import { useLazyGetAnalyticsQuery } from "../apis/home_api";
import { setAnalytics, setOverviews } from "../slices/vendorHome_slice";


/**
 * The useGeneralHook
 * @returns { handleGetShop }
 */
const useVendorHomeHook = () => {
    const dispatch = useDispatch();
    
    const [getShop] = useLazyGetShopQuery();
    const [getAnalytics] = useLazyGetAnalyticsQuery();
    // const [getOverview] = useLazyGetOverviewQuery();
    // const [getWeeklySalesChartData] = useLazyGetWeeklySalesChartDataQuery();
    // const [getRecentPayment] = useLazyGetRecentPaymentQuery();
    // const [getProductsByCategories] = useLazyGetProductsByCategoriesQuery();
    // const [getPromoProducts] = useLazyGetPromoProductsQuery();

    const handleGetShop = async (shopId: string) => {        
        try {
            const shop = await getShop(shopId).unwrap();
            // console.log("SHOP RESPONSE::: ", shop);
    
            // Dispatch to redux store
            dispatch(setShop(shop));
        } catch (error) {
            console.log("ERROR::: ", error);
        };
    };

    const handleGeVendortAnalytics = async (shopId: string) => {
        try {
            const analytics = await getAnalytics(shopId).unwrap();
            // console.log("VENDOR ANALYTICS RESPONSE::: ", analytics);

            const overviews = [
                {
                    name: "Product sold",
                    count: analytics.productSold!
                },
                {
                    name: "Orders placed",
                    count: analytics.ordersCountByStatus?.placed!
                },
                {
                    name: "Orders confirmed",
                    count: analytics.ordersCountByStatus?.confirmed!
                },
                {
                    name: "Orders processing",
                    count: analytics.ordersCountByStatus?.processing!
                },
                {
                    name: "Orders dispatched",
                    count: analytics.ordersCountByStatus?.dispatched!
                },
                {
                    name: "Orders delivered",
                    count: analytics.ordersCountByStatus?.delivered!
                },
                {
                    name: "Orders cancelled",
                    count: analytics.ordersCountByStatus?.cancelled!
                },
            ];
            // Dispatch to redux store 
            dispatch(setAnalytics(analytics));
            dispatch(setOverviews(overviews));
        } catch (error) {
            console.log("ERRORING::: ", error);
        };
    };

    return {
        // handleGetItems,
        // handleGetMarket,
        handleGetShop,
        handleGeVendortAnalytics,
        // handleGetNotifications,
    };
}

export default useVendorHomeHook;