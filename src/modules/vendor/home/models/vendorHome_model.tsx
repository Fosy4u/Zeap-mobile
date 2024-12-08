interface IVendorHomeState {
    overviews: IOverview[];
    weeklySalesChartData: IChartData[];
    recentPayments: IRecentPayment[];
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
}

export default IVendorHomeState;