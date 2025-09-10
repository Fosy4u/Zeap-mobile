import { useDispatch } from "react-redux";
import { useLazyGetShopQuery } from "../../general/apis/general_api";
import { setShop } from "../../general/slices/general_slice";
import { useLazyGetAnalyticsQuery } from "../apis/home_api";
import { setAnalytics, setOverviews, setSalesCountPieData, setSalesRevenuePieData } from "../slices/vendorHome_slice";


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
                    name: "Placed orders",
                    count: analytics.ordersCountByStatus?.placed!
                },
                {
                    name: "Confirmed orders",
                    count: analytics.ordersCountByStatus?.confirmed!
                },
                {
                    name: "Processing orders",
                    count: analytics.ordersCountByStatus?.processing!
                },
                {
                    name: "Ready orders",
                    count: analytics.ordersCountByStatus?.ready!
                },
                {
                    name: "Dispatched orders",
                    count: analytics.ordersCountByStatus?.dispatched!
                },
                {
                    name: "Delivered orders",
                    count: analytics.ordersCountByStatus?.delivered!
                },
                {
                    name: "Cancelled orders",
                    count: analytics.ordersCountByStatus?.cancelled!
                },
            ];

            const salesCount = [
                {
                    value: analytics.productGroupsCount?.["Ready-Made"]!,
                    title: "Ready made",
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
        // handleGetItems,
        // handleGetMarket,
        handleGetShop,
        handleGeVendortAnalytics,
        // handleGetNotifications,
    };
}

export default useVendorHomeHook;