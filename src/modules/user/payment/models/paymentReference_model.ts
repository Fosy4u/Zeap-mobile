interface IPaymentReference {
    amount?:        number;
    currency?:      Currency;
    email?:         string;
    fullName?:      string;
    orderId?:       null;
    paymentStatus?: string;
    reference?:     string;
};

type Currency = 'NGN' | 'GHS' | 'USD' | 'ZAR' | 'KES';

export default IPaymentReference;