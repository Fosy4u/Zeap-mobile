interface IPaymentReference {
    reference: string;
    amount: number;
    currency: string;
    fullName: string;
    email: string;
    paymentStatus: string;
    orderId: any;
}

export default IPaymentReference;