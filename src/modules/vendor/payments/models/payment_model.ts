import { ImageSourcePropType } from "react-native";

interface IPaymentState {
    payments: IPayment[];
    tabs: string[];
    selectedTab: string;
};

interface IPayment {
    id: string;
    title: string;
    description: string;
    date: string;
    status: string;
    amount: number;
    productName: string;
    productImage: ImageSourcePropType | undefined,

};

export type { IPayment };
export default IPaymentState;