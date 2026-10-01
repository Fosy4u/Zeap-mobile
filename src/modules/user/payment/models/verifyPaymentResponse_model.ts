
interface IVerifyPaymentDeliveryDetails {
    address?:     string;
    region?:      string;
    country?:     string;
    phoneNumber?: string;
    firstName?:   string;
    lastName?:    string;
    postCode?:    string;
    _id?:         string;
}

interface IVerifyPaymentPayment {
    _id?:        string;
    user?:       string;
    status?:     string;
    gateway?:    string;
    amount?:     number;
    itemsTotal?: number;
    deliveryFee?: number;
    currency?:   string;
    reference?:  string;
    total?:      number;
    [key: string]: unknown;
}

interface IVerifyPaymentOrder {
    _id?:             string;
    orderId?:         string;
    user?:            string;
    channel?:         string;
    productOrders?:   string[];
    payment?:         string;
    deliveryDetails?: IVerifyPaymentDeliveryDetails;
    gainedPoints?:    number;
    storeLocation?:   string;
    [key: string]:    unknown;
}

interface IVerifyPaymentResponse {
    payment?:     IVerifyPaymentPayment;
    order?:       IVerifyPaymentOrder;
    addedPoints?: number;
}

export default IVerifyPaymentResponse;
