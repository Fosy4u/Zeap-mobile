import IPayment from "./payment_model";

interface IPaymentState {
    payments: IPayment[];
    tabs: string[];
    selectedTab: string;

    loadingMessage: string;
    isLoading: boolean;
    hasFetched: boolean;
};

export default IPaymentState;