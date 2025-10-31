import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { RootState } from '../../../../redux/store/store';
import { setSelectedTab } from '../slices/payment_slice';
import AppHeaderComp from '../../general/components/appHeader_comp';
import useVendorPaymentHook from '../hooks/payment_hook';
import PaymentCardComponent from '../components/paymentCard_component';

const PaymentScreen = () => {
    const { selectedTab, tabs, payments, isLoading } = useSelector((state: RootState) => state.vendorPaymentState);
    const dispatch = useDispatch();
    const receivedPayments = payments.filter((payment) => payment.shopRevenue!.status  === "success");
    const pendingPayments = payments.filter((payment) => payment.shopRevenue!.status === "pending");

    const { handleGetVendorPayments } = useVendorPaymentHook();

    React.useEffect(() => {
        if (payments.length === 0) {
            handleGetVendorPayments("7601605");
        }
    }, []);

    return (
        <SafeAreaView className="flex-1 h-auto w-screen pb-24 bg-white">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />

            {/* ==== Header ==== */}
            <AppHeaderComp  title="Payments" />

            <View className="w-full px-5">

                {/*==== Tab View ====*/}
                <View className="h-auto w-full mt-5 px-2 py-2 flex-row items-center justify-between border border-gray-400 rounded-2xl">
                    { tabs.map((tab, index) => (
                    <TouchableOpacity key={ index }
                        onPress={ () => dispatch(setSelectedTab(tab)) }
                        className="w-[33.3%]"
                    >
                        <Text className={`text-center text-[16px] ${(selectedTab === tab) ? "py-2 text-white rounded-lg bg-baseGreen" : "px-5 py-2 text-gray-500"}`}>{ tab }</Text>
                    </TouchableOpacity>
                    )) }
                </View>

                {/*==== Payment List ====*/}
                <ScrollView 
                    className="mt-5"
                    showsHorizontalScrollIndicator={ false }
                >
                    { (selectedTab === "All") ? (
                        <View>
                            <Text className="font-medium text-lg">All Payments</Text>

                            <PaymentCardComponent payments={payments} isLoading={isLoading} />
                        </View>
                    ) : (selectedTab === "Received") ? (
                        <View>
                            <Text className="font-medium text-lg">Received Payments</Text>

                            <PaymentCardComponent payments={receivedPayments} isLoading={isLoading} />
                        </View>
                    ) : (
                        <View>
                            <Text className="font-medium text-lg">Pending Payments</Text>

                            <PaymentCardComponent payments={pendingPayments} isLoading={isLoading} />
                        </View>
                    ) }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default PaymentScreen