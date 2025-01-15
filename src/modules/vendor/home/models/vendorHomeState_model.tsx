import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

interface IVendorHomeState {
    overviews: IOverview[];
    weeklySalesChartData: IChartData[];
    salesCountPieData: IPieData[];
    salesRevenuePieData: IPieData[];
};

interface IOverview {
    name: string;
    count: number;
};

interface IChartData {
    label: string;
    value: number;
};

interface IRecentPayment {
    id: string;
    amount: number;
    productName: string;
    status: string;
    date: string;
};
interface IPieData {
    value: number;
    color: string;
    title: string;
};

export type { IPieData };
export default IVendorHomeState;