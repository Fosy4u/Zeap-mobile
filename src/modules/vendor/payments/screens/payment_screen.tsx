import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { RootState } from '../../../../redux/store/store';
import { setSelectedTab } from '../slices/payment_slice';
import AllPaymentsComponent from '../components/allPayments_component';
import ReceivedPaymentComponent from '../components/receivedPayment_component';
import PendingPaymentComponent from '../components/pendingPayment_component';
import AppHeaderComp from '../../general/components/appHeader_comp';

const PaymentScreen = () => {
    const { selectedTab, tabs } = useSelector((state: RootState) => state.paymentState);
    const dispatch = useDispatch();

    return (
        <SafeAreaView className="flex-1 h-auto w-screen pb-24 bg-gray-50">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />

            {/* ==== Header ==== */}
            <AppHeaderComp  title="All Payments" />

            <View className="w-full px-5">

                {/*==== Tab View ====*/}
                <View className="h-auto w-full mt-5 px-2 py-2 flex-row items-center justify-between border border-gray-400 rounded-2xl">
                    { tabs.map((tab, index) => (
                    <TouchableOpacity key={ index }
                    onPress={ () => dispatch(setSelectedTab(tab)) }>
                        <Text className={`${(selectedTab === tab) ? "px-5 py-2 text-white text-[15px] rounded-lg bg-baseGreen" : "px-5 py-2 text-gray-500"}`}>{ tab }</Text>
                    </TouchableOpacity>
                    )) }
                </View>

                {/*==== Payment List ====*/}
                <ScrollView 
                    className="mt-5"
                    showsHorizontalScrollIndicator={ false }
                >
                    { (selectedTab === "All") ? (
                        <AllPaymentsComponent />
                    ) : (selectedTab === "Received") ? (
                        <ReceivedPaymentComponent />
                    ) : (
                        <PendingPaymentComponent />
                    ) }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default PaymentScreen