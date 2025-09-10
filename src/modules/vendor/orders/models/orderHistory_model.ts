interface IOrderHistory {
    statusHistory?: INextStatus[];
    nextStatus?:    INextStatus;
    currentStatus?: CurrentStatus;
};


interface CurrentStatus {
    name?:  string;
    value?: string;
}

interface INextStatus {
    name?:         string;
    value?:        string;
    sellerAction?: boolean;
    percentage?:   number;
    date?:         string;
};

export type { INextStatus };
export default IOrderHistory;