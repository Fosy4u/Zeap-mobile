import { useDispatch } from "react-redux";
import { useLazyGetShopQuery } from "../../general/apis/general_api";
import { setShop } from "../../general/slices/general_slice";
import { useLazyGetAnalyticsQuery } from "../apis/home_api";
import { setAnalytics, setOverviews, setSalesCountPieData, setSalesRevenuePieData } from "../slices/vendorHome_slice";

const useVendorHomeHook = () => {
    const dispatch = useDispatch();
    
    const [getShop] = useLazyGetShopQuery();
    const [getAnalytics] = useLazyGetAnalyticsQuery();
    /* Not wired yet: getOverview, getWeeklySalesChartData, getRecentPayment,
       getProductsByCategories, getPromoProducts. */

    const handleGetShop = async (shopId: string) => {
        /* Without a shop id this hits /shop with `undefined` and comes back
           "shop not found" — the caller should be gating on the id instead. */
        if (!shopId) { return; }

        try {
            const shop = await getShop(shopId).unwrap();
            // console.log("SHOP RESPONSE::: ", shop);

            /* Only write a real shop through — a terminated shop answers 2xx with
               an empty body, and the guard hook owns the "no shop" verdict. */
            if (shop?.shopId) {
                dispatch(setShop(shop));
            }
        } catch (error) {
            console.log("ERROR::: ", error);
        };
    };

    const handleGeVendortAnalytics = async (shopId: string) => {
        try {
            const analytics = await getAnalytics(shopId).unwrap();
            // console.log("VENDOR ANALYTICS RESPONSE::: ", analytics);

            /* A tile with no number reads as broken, so every count falls back
               to 0 when the payload omits its status. */
            const orderCounts = analytics.ordersCountByStatus ?? {};
            const overviews = [
                {
                    name: "Product sold",
                    count: analytics.productSold ?? 0
                },
                {
                    name: "Placed orders",
                    count: orderCounts.placed ?? 0
                },
                {
                    name: "Confirmed orders",
                    count: orderCounts.confirmed ?? 0
                },
                {
                    name: "Processing orders",
                    count: orderCounts.processing ?? 0
                },
                {
                    name: "Quality check orders",
                    count: orderCounts["quality check"] ?? 0
                },
                {
                    name: "Ready for delivery orders",
                    count: orderCounts["ready for delivery"] ?? 0
                },
                {
                    name: "Dispatched orders",
                    count: orderCounts.dispatched ?? 0
                },
                {
                    name: "Delivered orders",
                    count: orderCounts.delivered ?? 0
                },
                {
                    name: "Cancelled orders",
                    count: orderCounts.cancelled ?? 0
                },
            ];

            const salesCount = [
                {
                    value: analytics.productGroupsCount?.["Ready-Made"]!,
                    title: "Ready to wear",
                    color: "#133522",
                },
                {
                    value: analytics.productGroupsCount?.Bespoke!,
                    title: "Bespoke",
                    color: "#D5B07B",
                },
            ];

            const salesRevenue = [
                {
                    value: analytics.shopRevenuesByPaymentStatus?.paid?.value!,
                    title: "Paid", 
                    currency: analytics.shopRevenuesByPaymentStatus?.paid?.currency!,
                    color: "#225F3D",
                },
                {
                    value: analytics.shopRevenuesByPaymentStatus?.pending?.value!,
                    title: "Pending",
                    currency: analytics.shopRevenuesByPaymentStatus?.pending?.currency!,
                    color: "#819656",
                },
            ]
            
            // Dispatch to redux store 
            dispatch(setAnalytics(analytics));
            dispatch(setOverviews(overviews));
            dispatch(setSalesCountPieData(salesCount));
            dispatch(setSalesRevenuePieData(salesRevenue));
        } catch (error) {
            console.log("ERRORING::: ", error);
        };
    };

    return {
        /* handleGetItems, handleGetMarket, */
        handleGetShop,
        handleGeVendortAnalytics,
        // handleGetNotifications,
    };
}

export default useVendorHomeHook;