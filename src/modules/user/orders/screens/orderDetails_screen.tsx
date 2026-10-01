import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ArrowLeft, ArrowRight, Call, Location, Receipt21, Sms } from 'iconsax-react-native';
import { timeAgo } from '../../../../utils/formatTime';
import useGeneralHook from '../../../general/hooks/general_hook';
import { setSelectedOrderStatus, setSelectedProductOrderID } from '../slices/order_slice';
import useOrderHook from '../hooks/order_hook';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import OrderStatusHistoryBottomSheetComponent from '../components/orderStatusHistoryBottomSheet_component';
import OrderDetailsSkeletonLoader from '../components/orderDetailsSkeletonLoader_component';
import CancelOrderPopupModal from '../modals/cancelOrderPopup_modal';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook';
import ColorSwatchComponent from '../../../general/components/colorSwatch_component';
import AppStatusBar from "../../../general/components/appStatusBar";

interface IProps {
    route: RouteProp<RootNavigationStackModel, 'orderDetailsScreen'>;
};

const OrderDetailsScreen: React.FC<IProps> = ({ route }) => {
    const { orderDetails, isLoading, showCancelOrderModal } = useSelector((state: RootState) => state.orderState);
    const { formatPrice, pickAmount, formatAmount, currencyRefreshToken } = useDisplayCurrency();
    const productOrders = orderDetails?.productOrders ?? [];
    const from = route.params?.from;
    const orderID = route.params?.orderId;
    const itemNumber = route.params?.itemNumber;
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const { handleGetOrderDetails, handleGetOrderHistory, historyIsLoading } = useOrderHook();
    const { getColorCode } = useGeneralHook();

    // ==== Horizontal "items in your order" carousel sizing ====
    // Each card spans ~80% of the available width so the next item peeks ~20%,
    // making it obvious the row scrolls horizontally. The active card index
    // drives the dot indicator below the list.
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const screenWidth = Dimensions.get("window").width;
    const SCREEN_HORIZONTAL_PADDING = 40; // px-5 on each side of the screen
    const ITEM_GAP = 12;
    const AVAILABLE_WIDTH = screenWidth - SCREEN_HORIZONTAL_PADDING;
    const ITEM_WIDTH = Math.round(AVAILABLE_WIDTH * 0.8);

    const handleItemsScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        setActiveItemIndex(Math.round(offsetX / (ITEM_WIDTH + ITEM_GAP)));
    }, [ITEM_WIDTH]);

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
    }, [orderID, currencyRefreshToken]);

    // Show the skeleton (instead of an early-returned AppLoader) while the
    // order is being fetched OR while orderDetails is still an empty object —
    // header chrome stays interactive during the wait.
    const isOrderDetailsEmpty = !orderDetails || Object.keys(orderDetails).length === 0;
    const showSkeleton = isLoading || isOrderDetailsEmpty;

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                {/* Horizontal padding lives on the inner sections, not here — iOS
                    SafeAreaView overwrites its own padding with the safe-area insets. */}
                <SafeAreaView className="h-auto w-full flex-1 pb-2 pt-2 bg-lightGray">
                    <AppStatusBar backgroundColor="#133522" barStyle="light-content" />

                    {/* ==== Header ==== */}
                    <View className="h-auto w-full pt-5 px-5">
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

                    { showSkeleton ? (
                        <View className="flex-1 px-5">
                            <OrderDetailsSkeletonLoader />
                        </View>
                    ) : (
                    <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>

                        {/* ==== Order Summary ==== */}
                        <View className="mt-5 p-4 bg-[#F7F8FC] rounded-xl border border-gray-200">
                            <Text className="mb-1 font-montserratMedium text-base text-gray-700">Order ID: {orderDetails.orderId}</Text>
                            <Text className="font-montserratMedium text-sm text-gray-500">{productOrders.length} item{productOrders.length > 1 ? "s" : ""}</Text>
                            <Text className="mt-1 font-montserratMedium text-sm text-gray-500">Placed on { timeAgo(orderDetails?.createdAt!) }</Text>
                            <Text className="mt-1.5 font-montserratMedium text-gray-500">{ formatPrice((orderDetails.payment?.total ?? 0) / 100, orderDetails.payment?.currency) }</Text>

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
                            <>
                            <FlatList
                                data={productOrders}
                                horizontal
                                snapToInterval={ ITEM_WIDTH + ITEM_GAP }
                                snapToAlignment="start"
                                decelerationRate="fast"
                                onMomentumScrollEnd={ handleItemsScrollEnd }
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => (item._id ?? String(index))}
                                renderItem={({ item: productOrder, index }) => {
                                    const amount = pickAmount(productOrder.amount);
                                    const isSingle = productOrders.length === 1;

                                    return (
                                        <View
                                            style={{
                                                width: isSingle ? AVAILABLE_WIDTH : ITEM_WIDTH,
                                                marginRight: isSingle || index === productOrders.length - 1 ? 0 : ITEM_GAP,
                                            }}
                                            className="mt-2 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]"
                                        >
                                            <View className="flex-row justify-between mb-2">
                                                <View className={ `px-3 py-1 rounded ${ productOrder.status?.name === "delivered" ? "bg-green-600" : "bg-yellow-600" }` }>
                                                    <Text className="font-montserratMedium text-white text-xs">{(productOrder.status?.name?.charAt(0)?.toUpperCase() ?? "") + (productOrder.status?.name?.slice(1) ?? "")}</Text>
                                                </View>
                                            </View>
                                            <View className="flex-row items-center">
                                                <FastImage
                                                    source={{ uri: productOrder.images?.[0]?.link ?? undefined, priority: FastImage.priority.normal }}
                                                    defaultSource={ require("../../../../../assets/images/image_placeholder.png") }
                                                    resizeMode={ FastImage.resizeMode.cover }
                                                    className="h-[80px] w-[80px] mr-3 rounded-lg"
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
                                                        <ColorSwatchComponent value={ productOrder.color } hex={ getColorCode(productOrder.color ?? "") } size={ 10 } style={{ marginLeft: 4 }} />
                                                    </View>
                                                    <Text className="mt-1 font-montserratMedium text-xs text-gray-500">QTY: { productOrder.quantity }</Text>
                                                    <Text className="mt-1.5 font-montserratMedium text-gray-500">{ formatPrice(amount?.value, amount?.currency) }</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity 
                                                onPress={() => {
                                                    dispatch(setSelectedOrderStatus(productOrder.status!))
                                                    dispatch(setSelectedProductOrderID(productOrder._id!))
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

                            {/* ==== Carousel dot indicator (one dot per item) ==== */}
                            { productOrders.length > 1 && (
                                <View className="mt-3 flex-row items-center justify-center">
                                    { productOrders.map((_, index) => (
                                        <View
                                            key={ index }
                                            className={ `h-2 mx-1 rounded-full ${ index === activeItemIndex ? "w-4 bg-baseGreen" : "w-2 bg-gray-300" }` }
                                        />
                                    )) }
                                </View>
                            ) }
                            </>
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
                                                defaultSource={ require("../../../../../assets/images/image_placeholder.png") }
                                                resizeMode={ FastImage.resizeMode.cover }
                                                className="h-[115px] w-[80px] mr-3 rounded-lg"
                                            />
                                            <View className="flex-1">
                                                <Text className="font-montserratSemiBold text-gray-700">{ productOrder.product?.title }</Text>
                                                <View className="flex-row items-center mt-1">
                                                    <Text className="font-montserratMedium text-xs text-gray-500">Color: { (productOrder.color ?? "").charAt(0).toUpperCase() + (productOrder.color ?? "").slice(1) }</Text>
                                                    <ColorSwatchComponent value={ productOrder.color } hex={ getColorCode(productOrder.color ?? "") } size={ 10 } style={{ marginLeft: 4 }} />
                                                </View>
                                                <Text className="mt-1 font-montserratMedium text-xs text-gray-500">QTY: { productOrder.quantity }</Text>
                                                <Text className="mt-1.5 font-montserratMedium text-gray-500">{ formatAmount(productOrder.amount) }</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity 
                                            onPress={() => {
                                                dispatch(setSelectedOrderStatus(productOrder.status!))
                                                dispatch(setSelectedProductOrderID(productOrder._id!))
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
                                <Text className="font-montserratMedium text-gray-500">{ formatPrice((orderDetails.payment?.itemsTotal ?? 0) / 100, orderDetails.payment?.currency) }</Text>
                            </View>
                            <View className="flex-row justify-between mt-3">
                                <Text className="font-montserratMedium text-gray-500">Delivery fee</Text>
                                <Text className="font-montserratMedium text-gray-500">{ formatPrice((orderDetails.payment?.deliveryFee ?? 0) / 100, orderDetails.payment?.currency) }</Text>
                            </View>
                            <View className="flex-row justify-between mt-4">
                                <Text className="font-montserratSemiBold text-base text-gray-700">Total</Text>
                                    <Text className="font-montserratSemiBold text-base text-gray-700">{ formatPrice((orderDetails.payment?.total ?? 0) / 100, orderDetails.payment?.currency) }</Text>
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

                        {/* ==== View Receipt CTA ==== */}
                        { orderDetails?.orderId && (
                            <TouchableOpacity
                                onPress={ () => navigation.navigate("receiptScreen", { orderId: orderDetails.orderId! }) }
                                className="h-[55px] w-full mt-6 mb-4 flex-row items-center justify-center rounded-xl bg-baseGreen"
                            >
                                <Receipt21 size={ 18 } color="white" variant="Bold" />
                                <Text className="ml-2 font-montserratMedium text-base text-white">View Receipt</Text>
                            </TouchableOpacity>
                        ) }
                    </ScrollView>
                    ) }

                    <OrderStatusHistoryBottomSheetComponent
                        bottomSheetModalRef={bottomSheetModalRef}
                        snapPoints={snapPoints}
                        setShowBottomSheetModal={setShowBottomSheetModal}
                    />

                    { showCancelOrderModal && <CancelOrderPopupModal /> }
                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default OrderDetailsScreen;
