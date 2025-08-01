interface IDeliveryDate {
    sku: string;
    standardDeliveryDate?: IDeliveryDateType;
    expressDeliveryDate?: IDeliveryDateType;
}

interface IDeliveryDateType {
  min: number
  max: number
  method: string
  country: string
}


export type { IDeliveryDateType };
export default IDeliveryDate;