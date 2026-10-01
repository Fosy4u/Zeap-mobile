import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { RootState } from '../../../../redux/store/store';
import { setSelectedTab } from '../slices/payment_slice';
import AppHeaderComp from '../../general/components/appHeader_comp';
import useVendorPaymentHook from '../hooks/payment_hook';
import PaymentCardComponent from '../components/paymentCard_component';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook';
import AppStatusBar from "../../../general/components/appStatusBar";

const isPaid = (status?: string) => /^(success|paid)$/i.test(status ?? "");
const isPending = (status?: string) => /^pending$/i.test(status ?? "");
const isCancelled = (status?: string) => /cancel|fail|refund/i.test(status ?? "");

const PaymentScreen = () => {
    const { selectedTab, tabs, payments, isLoading, hasFetched } = useSelector((state: RootState) => state.vendorPaymentState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const dispatch = useDispatch();

    const { handleGetVendorPayments } = useVendorPaymentHook();
    const { currencyRefreshToken } = useDisplayCurrency();

    /* Fetch this vendor's own payments. This used to pass a hard-coded shop id,
       so every vendor saw another shop's orders. */
    React.useEffect(() => {
        if (userData?.shopId) {
            handleGetVendorPayments(userData.shopId);
        }
    }, [userData?.shopId, currencyRefreshToken]);

    const paymentsForTab =
        (selectedTab === "Pending") ? payments.filter((payment) => isPending(payment.shopRevenue?.status))
        : (selectedTab === "Paid") ? payments.filter((payment) => isPaid(payment.shopRevenue?.status))
        : (selectedTab === "Cancelled") ? payments.filter((payment) => isCancelled(payment.shopRevenue?.status))
        : payments;

    return (
        <SafeAreaView className="flex-1 h-auto w-screen pb-24 bg-white">
            <AppStatusBar backgroundColor="#133522" barStyle="light-content" />

            {/* ==== Header ==== */}
            <AppHeaderComp  title="Payments" />

            <View className="flex-1 w-full px-5">

                <View className="h-auto w-full mt-5 p-1 flex-row items-center border border-gray-400 rounded-2xl">
                    { tabs.map((tab, index) => (
                        <TouchableOpacity key={ index }
                            onPress={ () => dispatch(setSelectedTab(tab)) }
                            className={ `flex-1 px-1 py-2 rounded-xl ${ (selectedTab === tab) ? "bg-baseGreen" : "" }` }
                        >
                            <Text
                                numberOfLines={ 1 }
                                className={ `text-center text-sm ${ (selectedTab === tab) ? "text-white" : "text-gray-500" }` }
                            >
                                { tab }
                            </Text>
                        </TouchableOpacity>
                    )) }
                </View>

                <View className="flex-1 mt-5">
                    <Text className="font-medium text-lg">{ selectedTab } Payments</Text>

                    <PaymentCardComponent payments={ paymentsForTab } isLoading={ isLoading || !hasFetched } />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PaymentScreen
