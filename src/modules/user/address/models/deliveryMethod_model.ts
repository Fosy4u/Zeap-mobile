interface IDeliveryMethod {
    currency: string;
    country: string;
    deliveryFees: DeliveryFee[];
  };
  
interface DeliveryFee {
    label: string;
    fee: string;
    method: string;
};

export type { DeliveryFee };
export default IDeliveryMethod;