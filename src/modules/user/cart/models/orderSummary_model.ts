interface IOrderSummary {
    currency: string;
    subTotal: string;
    deliveryFee: string;
    total: string;
    totalWithoutVoucher: any;
    voucherAmount: number;
    appliedVoucherAmount: number;
};

export default IOrderSummary;