import IPaymentReference from "./paymentReference_model";

interface IPaymentState {
    paymentReference: IPaymentReference;
    showOrderSuccessModal: boolean;
    newOrderId: string;
};

export default IPaymentState;