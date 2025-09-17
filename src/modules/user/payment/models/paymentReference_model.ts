import { Currency } from "react-native-paystack-webview/production/lib/types";

interface IPaymentReference {
    reference?: string;
    amount?: number;
    currency?: Currency;
    fullName?: string;
    email?: string;
    paymentStatus?: string;
    orderId?: any;
    stripeClientSecret?: string;
};

export default IPaymentReference;