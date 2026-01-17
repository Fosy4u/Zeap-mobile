import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, FlatList } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ArrowLeft, ArrowRight, Call, Location, Sms } from 'iconsax-react-native';
import formatCurrency from '../../../../utils/formatCurrency';
import { timeAgo } from '../../../../utils/formatTime';
import useGeneralHook from '../../../general/hooks/general_hook';
import { setSelectedOrderStatus } from '../slices/order_slice';
import useOrderHook from '../hooks/order_hook';
import FastImage from 'react-native-fast-image';
import AppLoader from '../../../general/components/appLoader';
import LinearGradient from 'react-native-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { setShowBottomSheetModal } from '../../../auths/slices/authState_slice';
import OrderStatusHistoryBottomSheetComponent from '../components/orderStatusHistoryBottomSheet_component';

interface IProps {
    route: RouteProp<RootNavigationStackModel, 'orderDetailsScreen'>;
};

const OrderDetailsScreen: React.FC<IProps> = ({ route }) => {
    const { orderDetails, isLoading, loadingMessage } = useSelector((state: RootState) => state.orderState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const productOrders = orderDetails?.productOrders ?? [];
    const from = route.params?.from;
    const orderID = route.params?.orderId;
    const itemNumber = route.params?.itemNumber;
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const { handleGetOrderDetails, handleGetOrderHistory, historyIsLoading } = useOrderHook();
    const { getColorCode } = useGeneralHook();  

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
        if (from === "Orders Screen" || from === "Notification Screen") {
            handleGetOrderDetails(orderID!);
        }
    }, [orderID]);

    // Consider orderDetails empty if it's an empty object - in that case show loader
    const isOrderDetailsEmpty = !orderDetails || Object.keys(orderDetails).length === 0;
    if (isLoading || isOrderDetailsEmpty) {
        return <AppLoader loadingAdditionalMessage={ loadingMessage } />;
    }

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <SafeAreaView className="h-auto w-full flex-1 pb-2 px-5 pt-2 bg-lightGray">
                    <StatusBar
                        backgroundColor="#133522"
                        barStyle="light-content"
                    />

                    {/* ==== Header ==== */}
                    <View className="h-auto w-full pt-5">
                        <View className="h-auto w-full flex-row items-center justify-between">
                            <TouchableOpacity
                                onPress={ () => navigation.navigate("ordersScreen") }
                                className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen"
                            >
                                <ArrowLeft color="white" size={24} />
                            </TouchableOpacity>

                            <Text className="font-montserratSemiBold text-xl text-baseGreen">Order Details</Text>

                            <View className="h-[40px] w-[40px]" />
                        </View>
                        
                        <LinearGradient
                            colors={[
                                "rgba(229, 231, 235, 0)",
                                "#e5e7eb",
                                "#9ca3af",
                                "#e5e7eb",
                                "rgba(229, 231, 235, 0)"
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="h-[1px] w-full mt-3 rounded"
                        />
                    </View>

                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        
                        {/* ==== Order Summary ==== */}
                        <View className="mt-5 p-4 bg-[#F7F8FC] rounded-xl border border-gray-200">
                            <Text className="mb-1 font-montserratMedium text-base text-gray-700">Order ID: {orderDetails.orderId}</Text>
                            <Text className="font-montserratMedium text-sm text-gray-500">{productOrders.length} item{productOrders.length > 1 ? "s" : ""}</Text>
                            <Text className="mt-1 font-montserratMedium text-sm text-gray-500">Placed on { timeAgo(orderDetails?.createdAt!) }</Text>
                            <Text className="mt-1.5 font-montserratMedium text-gray-500">{ formatCurrency((orderDetails.payment?.total!/100), orderDetails.payment?.currency) }</Text>

                            <View className="h-auto w-full mt-4">
                                <Text className="font-montserratMedium text-xs text-gray-500">
                                    Order Progress: { orderDetails?.progress?.value ?? 0 }%
                                </Text>
                                <View className="h-[8px] w-full mt-1 bg-gray-200 rounded-lg">
                                    <View style={{ height: 8, width: `${ orderDetails?.progress?.value ?? 0 }%`, backgroundColor: "#133522", borderRadius: 10 }} />
                                </View>
                            </View>
                        </View>

                        {/* ==== Items in  your Order ==== */}
                        <Text className="mt-7 font-montserratSemiBold text-base text-gray-700">Items in your order - ({ productOrders.length })</Text>
                        {productOrders.length === 0 ? (
                            <View className="mt-4 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC] items-center">
                                <View className="h-24 w-full rounded-lg bg-gray-200 mb-3" />
                                <View className="h-4 w-3/4 rounded bg-gray-200 mb-2" />
                                <View className="h-4 w-1/2 rounded bg-gray-200" />
                                <Text className="mt-3 text-sm text-gray-500">No items found for this order.</Text>
                            </View>
                        ) : from === 'Orders Screen' ? (
                            <FlatList
                                data={productOrders}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => (item._id ?? String(index))}
                                renderItem={({ item: productOrder }) => {
                                    const amount = productOrder.amount?.find(amt => amt.currency === userData?.prefferedCurrency);
                                    
                                    return (
                                        <View className={`mt-2 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC] ${ productOrders.length === 1 ? "w-[350px]" : "w-[320px] mr-2" }`}>
                                            <View className="flex-row justify-between mb-2">
                                                <View className={ `px-3 py-1 rounded ${ productOrder.status?.name === "delivered" ? "bg-green-600" : "bg-yellow-600" }` }>
                                                    <Text className="font-montserratMedium text-white text-xs">{(productOrder.status?.name?.charAt(0)?.toUpperCase() ?? "") + (productOrder.status?.name?.slice(1) ?? "")}</Text>
                                                </View>
                                            </View>
                                            <View className="flex-row items-center">
                                                <FastImage
                                                    source={{ uri: productOrder.images?.[0]?.link ?? undefined, priority: FastImage.priority.normal }}
                                                    defaultSource={ require("../../../../../assets/images/app_logo.png") }
                                                    resizeMode={ FastImage.resizeMode.cover }
                                                    className="h-[115px] w-[80px] mr-3 rounded-lg"
                                                />
                                                <View className="flex-1">
                                                    <Text className="font-montserratSemiBold text-gray-700">
                                                        {productOrder.product?.title
                                                            ? (productOrder.product.title.length > 30
                                                                ? `${productOrder.product.title.slice(0, 30)}...`
                                                                : productOrder.product.title)
                                                            : ""}
                                                    </Text>
                                                    <View className="flex-row items-center mt-1">
                                                        <Text className="font-montserratMedium text-xs text-gray-500">Color: { (productOrder.color ?? "").charAt(0).toUpperCase() + (productOrder.color ?? "").slice(1) }</Text>
                                                        <View className="h-2.5 w-2.5 ml-1 rounded-full" style={ { backgroundColor: getColorCode(productOrder.color ?? "") } } />
                                                    </View>
                                                    <Text className="mt-1 font-montserratMedium text-xs text-gray-500">QTY: { productOrder.quantity }</Text>
                                                    <Text className="mt-1.5 font-montserratMedium text-gray-500">{ formatCurrency(amount?.value ?? 0, amount?.currency ?? "") }</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity 
                                                onPress={() => {
                                                    dispatch(setSelectedOrderStatus(productOrder.status!))
                                                    setShowBottomSheetModal(true);
                                                    handleGetOrderHistory(productOrder._id!);
                                                }}
                                                className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGold"
                                            >
                                                <Text className="font-montserratMedium text-base text-green-800">{historyIsLoading ? "Loading..." : "Show Status History"}</Text>
                                                { !historyIsLoading && <ArrowRight size={ 18 } className="ml-2 text-green-800" /> }
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }}
                            />
                        ) : (
                            // Notification Screen - show single item determined by itemIndex
                            (() => {
                                // Get the specific product order based on the itemNumber
                                const productOrder = productOrders.find((productOrder) => productOrder.itemNo === itemNumber);
                                if (!productOrder) return (
                                    <View className="mt-4 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC] items-center">
                                        <Text className="text-sm text-gray-500">Item not found.</Text>
                                    </View>
                                );
                                return (
                                    <View key={ productOrder._id } className="mt-2 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                                        <View className="flex-row justify-between mb-2">
                                            <View className={ `px-3 py-1 rounded ${ productOrder.status?.name === "delivered" ? "bg-green-600" : "bg-yellow-600" }` }>
                                                <Text className="font-montserratMedium text-white text-xs">{(productOrder.status?.name?.charAt(0)?.toUpperCase() ?? "") + (productOrder.status?.name?.slice(1) ?? "")}</Text>
                                            </View>
                                        </View>
                                        <View className="flex-row items-center">
                                            <FastImage
                                                source={{ uri: productOrder.images?.[0]?.link ?? undefined, priority: FastImage.priority.normal }}
                                                defaultSource={ require("../../../../../assets/images/app_logo.png") }
                                                resizeMode={ FastImage.resizeMode.cover }
                                                className="h-[115px] w-[80px] mr-3 rounded-lg"
                                            />
                                            <View className="flex-1">
                                                <Text className="font-montserratSemiBold text-gray-700">{ productOrder.product?.title }</Text>
                                                <View className="flex-row items-center mt-1">
                                                    <Text className="font-montserratMedium text-xs text-gray-500">Color: { (productOrder.color ?? "").charAt(0).toUpperCase() + (productOrder.color ?? "").slice(1) }</Text>
                                                    <View className="h-2.5 w-2.5 ml-1 rounded-full" style={ { backgroundColor: getColorCode(productOrder.color ?? "") } } />
                                                </View>
                                                <Text className="mt-1 font-montserratMedium text-xs text-gray-500">QTY: { productOrder.quantity }</Text>
                                                <Text className="mt-1.5 font-montserratMedium text-gray-500">{ formatCurrency(productOrder.amount?.[0]?.value ?? 0, productOrder.amount?.[0]?.currency ?? "") }</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity 
                                            onPress={() => {
                                                dispatch(setSelectedOrderStatus(productOrder.status!))
                                                setShowBottomSheetModal(true);
                                                handleGetOrderHistory(productOrder._id!);
                                            }}
                                            className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGold"
                                        >
                                            <Text className="font-montserratMedium text-base text-green-800">{historyIsLoading ? "Loading..." : "Show Status History"}</Text>
                                            { !historyIsLoading && <ArrowRight size={ 18 } className="ml-2 text-green-800" /> }
                                        </TouchableOpacity>
                                    </View>
                                );
                            })()
                        )}

                        {/* ==== Payment Information ==== */}
                        <Text className="mt-7 font-montserratSemiBold text-base text-gray-700">Payment information</Text>
                        <View className="mt-2 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                            <View className="flex-row justify-start">
                                <View className={ `px-3 py-1 rounded ${ orderDetails?.payment?.status === "success" ? "bg-green-600" : "bg-yellow-600" }` }>
                                    <Text className="font-montserratMedium text-white text-xs">{(orderDetails.payment?.status?.charAt(0)?.toUpperCase() ?? "") + (orderDetails.payment?.status?.slice(1) ?? "")}</Text>
                                </View>
                            </View>
                            <View className="flex-row justify-between mt-3">
                                <Text className="font-montserratMedium text-gray-500">Payment ref</Text>
                                <Text className="font-montserratMedium text-gray-500">{orderDetails?.payment?.reference}</Text>
                            </View>
                            <View className="flex-row justify-between mt-3">
                                <Text className="font-montserratMedium text-gray-500">Items total</Text>
                                <Text className="font-montserratMedium text-gray-500">{ formatCurrency((orderDetails.payment?.itemsTotal ?? 0)/100, orderDetails.payment?.currency ?? "") }</Text>
                            </View>
                            <View className="flex-row justify-between mt-3">
                                <Text className="font-montserratMedium text-gray-500">Delivery fee</Text>
                                <Text className="font-montserratMedium text-gray-500">{ formatCurrency((orderDetails.payment?.deliveryFee ?? 0)/100, orderDetails.payment?.currency ?? "") }</Text>
                            </View>
                            <View className="flex-row justify-between mt-4">
                                <Text className="font-montserratSemiBold text-base text-gray-700">Total</Text>
                                    <Text className="font-montserratSemiBold text-base text-gray-700">{ formatCurrency((orderDetails.payment?.total ?? 0)/100, orderDetails.payment?.currency ?? "") }</Text>
                            </View>
                        </View>

                        {/* ==== Delivery Address ==== */}
                        <View className="mt-5 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                            <Text className="font-montserratSemiBold text-base text-gray-700">Delivery address</Text>

                            <Text className="mt-4 font-montserratMedium text-base text-gray-700">{ orderDetails.deliveryDetails?.address }</Text>
                            <View className="mt-4 flex-row items-center">
                                <Call size={18} color="#222" className="mr-2" />
                                <Text className="ml-2 font-montserratMedium">{ orderDetails.deliveryDetails?.phoneNumber }</Text>
                            </View>
                            <View className="mt-4 flex-row items-center">
                                <Sms size={18} color="#222" className="mr-2" />
                                <Text className="ml-2 font-montserratMedium">{ orderDetails.deliveryDetails?.firstName } { orderDetails.deliveryDetails?.lastName }</Text>
                            </View>
                            <View className="mt-4 flex-row items-center">
                                <Location size={18} color="#222" className="mr-2" />
                                <Text className="ml-2 font-montserratMedium">{ orderDetails.deliveryDetails?.region }, { orderDetails.deliveryDetails?.country }</Text>
                            </View>
                        </View>
                    </ScrollView>

                    <OrderStatusHistoryBottomSheetComponent
                        bottomSheetModalRef={bottomSheetModalRef}
                        snapPoints={snapPoints}
                        setShowBottomSheetModal={setShowBottomSheetModal}
                    />
                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default OrderDetailsScreen;
