import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import AppHeaderComp from '../../../vendor/general/components/appHeader_comp';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import PointsComponent from '../components/points_component';
import VoucherComponent from '../components/voucher_component';
import { setSelectedTab } from '../slices/pointAndVoucher_slice';
import usePointAndVoucherHook from '../hooks/pointAndVoucher_hook';
import VoucherDetailBottomSheetComponent from '../components/voucherDetailBottomSheet_component';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppLoader from '../../../general/components/appLoader';
import { RouteProp } from '@react-navigation/native';
import RootNavigationStackModel from '../../../../routes/model/routes_model';

interface IProps {
    route: RouteProp<RootNavigationStackModel, "pointAndVoucherScreen">;
};

const PointAndVoucherScreen: React.FC<IProps> = ({ route }) => {
    const { tabs, selectedTab, points, loadingMessage, isLoading } = useSelector((state: RootState) => state.pointAndVoucherState);
    const dispatch = useDispatch();
    const from = route.params?.from;
    const code = route.params?.code;

    // Call Point and Voucher Hook
    const { handleGetPoints, handleGetActiveVouchers, handleGetInactiveVouchers, handleGetVoucherByCode } = usePointAndVoucherHook();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['60%', '70%'], []);

    const setShowBottomSheetModal = useCallback((value: boolean) => {
        if (value) {
            bottomSheetModalRef.current?.present();
        } else {
            bottomSheetModalRef.current?.close();
        }
    }, []);

    useEffect(() => {

        // Fetch according to where we came from
        if (from === "Notification Screen") {
            dispatch(setSelectedTab("Vouchers"));
            if (code && code !== "") {
                handleGetVoucherByCode(code, setShowBottomSheetModal);
            }
        } else {
            dispatch(setSelectedTab("Points"));
        }
    }, []);

    useEffect(() => {
        handleGetPoints();
        handleGetActiveVouchers();
        handleGetInactiveVouchers();
    }, []);
    
    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <SafeAreaView className="h-full w-full flex-1 bg-white">
                    <StatusBar
                        backgroundColor="transparent"
                        barStyle="dark-content"
                    />

                    {/*==== Header ====*/}
                    <AppHeaderComp title="Points & Vouchers" />

                    {/*==== Tab View ====*/}
                    <View className="h-auto w-full flex-1 mt-8 px-5">
                        <View className="h-auto w-full flex-row justify-between">
                            { tabs.map((tab, index) => (
                            <TouchableOpacity key={ index }
                                onPress={ () => dispatch(setSelectedTab(tab)) }
                                className={`h-auto pb-1 flex-1 justify-center`}
                            >
                                <Text className={`text-center font-montserratMedium ${(selectedTab === tab) ? "text-gray-700 text-[15px]" : "text-gray-500"}`}>{ tab }</Text>
                                <View className={`mt-1 ${(selectedTab === tab) ? "h-1.5 bg-gold rounded-full" : "h-[1px] bg-gray-200"}`} />
                            </TouchableOpacity>
                            )) }
                        </View>

                        { (selectedTab === "Points") ? (
                            <PointsComponent points={ points } />
                        ) : (
                            <VoucherComponent setShowBottomSheetModal={ setShowBottomSheetModal } />
                        ) }
                    </View>

                    {/* { showVoucherDetailBottomSheet && (
                        <VoucherDetailBottomSheetComponent />
                    )} */}

                    <VoucherDetailBottomSheetComponent
                        bottomSheetModalRef={ bottomSheetModalRef }
                        snapPoints={ snapPoints }
                        setShowBottomSheetModal={ setShowBottomSheetModal }
                    />

                    {(isLoading) && <AppLoader loadingAdditionalMessage={loadingMessage} />}
                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

export default PointAndVoucherScreen;