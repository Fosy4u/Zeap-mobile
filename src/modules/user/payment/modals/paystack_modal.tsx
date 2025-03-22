import React, { useRef } from 'react'
import { View } from 'react-native'
import { Paystack } from 'react-native-paystack-webview';
import IPaymentReference from '../models/paymentReference_model';

interface IProps {
    paymentReference: IPaymentReference;
    handlePaymentSuccess: (response: any) => void;
    handlePaymentCancel: () => void;
};

const PaystackModal: React.FC<IProps> = ({ paymentReference, handlePaymentSuccess, handlePaymentCancel }) => {
    const paystackWebViewRef = useRef();
    return (
        <View className="flex-1">
            <Paystack
                paystackKey={ process.env.REACT_APP_PAYSTACK_PUBLIC_KEY! }
                amount={ paymentReference?.amount! / 100 }
                currency={ paymentReference?.currency!  || "NGN" }
                refNumber={ paymentReference?.reference! }
                billingEmail={ paymentReference?.email! }
                billingName={ paymentReference?.fullName! }
                activityIndicatorColor="green"
                autoStart={ true }
                channels={['card']}
                ref={paystackWebViewRef}

                onCancel={ (args: any) => {
                    handlePaymentCancel();
                } }

                onSuccess={ (response: any) => {
                    handlePaymentSuccess(paymentReference?.reference!);
                } }
            />
        </View>
    );
}

export default PaystackModal;