import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Image, Alert, Platform, PermissionsAndroid } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, DocumentDownload, Share as ShareIcon } from 'iconsax-react-native';
import Share from 'react-native-share';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { RootState } from '../../../../redux/store/store';
import useOrderHook from '../hooks/order_hook';
import formatCurrency from '../../../../utils/formatCurrency';
import ReceiptSkeletonLoader from '../components/receiptSkeletonLoader_component';
import IOrderDetails from '../models/orderDetails_model';
import { setOrderDetails } from '../slices/order_slice';
import buildReceiptPdfBase64 from '../utils/receiptPdf';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook';

interface IProps {
    route: RouteProp<RootNavigationStackModel, 'receiptScreen'>;
}

const formatReceiptDate = (input?: Date | string): string => {
    if (!input) return "";
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

const ReceiptScreen: React.FC<IProps> = ({ route }) => {
    const orderId = route.params.orderId;
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const { orderDetails, isLoading } = useSelector((state: RootState) => state.orderState);
    const { handleGetOrderDetails } = useOrderHook();
    const { resolveCurrency } = useDisplayCurrency();
    const [isPreparingReceipt, setIsPreparingReceipt] = useState(false);
    // The receipt card itself — what Download rasterises to a PNG.
    const receiptCardRef = useRef<View>(null);

    useEffect(() => {
        if (!orderId) return;
        // Clear any previously viewed order so the receipt never flashes stale
        // data on entry — the skeleton shows until THIS order is fetched.
        dispatch(setOrderDetails({} as IOrderDetails));
        handleGetOrderDetails(orderId);
    }, [orderId]);

    // The receipt is ready only once the fetched order matches the requested id.
    const isReceiptReady = !isLoading && orderDetails?.orderId === orderId;

    const currency = resolveCurrency(orderDetails?.payment?.currency);
    const buyerName = `${orderDetails?.user?.firstName ?? ""} ${orderDetails?.user?.lastName ?? ""}`.trim();

    // Per-item amount is already in major units (naira); pick the entry matching
    // the receipt currency. (Dividing by 100 here was the summing bug.)
    const getLineAmount = (po: { amount?: { currency?: string; value?: number }[] }) =>
        po?.amount?.find((a) => a.currency === currency)?.value ?? po?.amount?.[0]?.value ?? 0;

    const buildFileName = () => `zeaper-receipt-${orderDetails?.orderId ?? "order"}`;

    const buildReceiptPdf = async (): Promise<string | null> =>
        (await buildReceiptPdfBase64(orderDetails, currency)) || null;

    const openShareSheet = async (base64: string, saveToFiles: boolean) => {
        /* Pass the name WITHOUT ".pdf" — the library appends the extension from
           the data URI's mime type, so adding it here produced "…​.pdf.pdf". */
        await Share.open({
            url: `data:application/pdf;base64,${base64}`,
            filename: buildFileName(),
            type: "application/pdf",
            title: "Zeaper Receipt",
            subject: "Zeaper Receipt",
            useInternalStorage: true,
            failOnCancel: false,
            ...(saveToFiles ? { saveToFiles: true } : {}),
        });
    };

    // Dismissing the sheet/picker rejects in react-native-share — not an error.
    const wasDismissed = (error: any): boolean => {
        const message: string = (error?.message ?? "").toLowerCase();
        return message.includes("cancel") || message.includes("dismiss");
    };

    /* Saving to the gallery needs WRITE_EXTERNAL_STORAGE only up to API 28 —
       from API 29 MediaStore handles the insert without a runtime grant. */
    const ensureAndroidSavePermission = async (): Promise<boolean> => {
        if (Platform.OS !== "android" || Number(Platform.Version) >= 29) { return true; }

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "Save receipt",
                message: "Zeaper needs access to your storage to save this receipt.",
                buttonNegative: "Cancel",
                buttonPositive: "OK",
            },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    };

    const handleDownloadReceipt = async () => {
        setIsPreparingReceipt(true);
        try {
            if (!(await ensureAndroidSavePermission())) {
                Alert.alert("Receipt", "Storage permission is needed to save the receipt.");
                return;
            }

            const uri = await captureRef(receiptCardRef, {
                format: "png",
                quality: 1,
                // A tmpfile is what CameraRoll wants; base64 would need re-encoding.
                result: "tmpfile",
                fileName: buildFileName(),
            });

            await CameraRoll.saveAsset(uri, { type: "photo", album: "Zeaper" });

            Alert.alert(
                "Receipt saved",
                Platform.OS === "ios"
                    ? "The receipt image is in your Photos, in the Zeaper album."
                    : "The receipt image is in your Gallery, in the Zeaper album.",
            );
        } catch (error: any) {
            if (wasDismissed(error)) { return; }
            console.log("RECEIPT DOWNLOAD ERROR::: ", error);
            Alert.alert("Receipt", "Could not save the receipt. Please try again.");
        } finally {
            setIsPreparingReceipt(false);
        }
    };

    // Share: always the OS share sheet (WhatsApp, Gmail, Drive, …).
    const handleShareReceipt = async () => {
        setIsPreparingReceipt(true);
        try {
            const base64 = await buildReceiptPdf();
            if (!base64) {
                Alert.alert("Receipt", "Could not prepare the receipt. Please try again.");
                return;
            }
            await openShareSheet(base64, false);
        } catch (error: any) {
            if (wasDismissed(error)) { return; }
            console.log("RECEIPT SHARE ERROR::: ", error);
            Alert.alert("Receipt", "Could not open the share sheet. Please try again.");
        } finally {
            setIsPreparingReceipt(false);
        }
    };

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-lightGray">
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />

            {/*==== Header ====*/}
            <View className="h-auto w-full px-[20px] pt-3 pb-2 flex-row items-center justify-between">
                <TouchableOpacity onPress={ () => navigation.pop() }>
                    <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                        <ArrowLeft color="white" />
                    </View>
                </TouchableOpacity>
                <Text className="font-montserratSemiBold text-lg text-baseGreen">Receipt</Text>
                <View className="h-[40px] w-[40px]" />
            </View>

            <ScrollView showsVerticalScrollIndicator={ false } contentContainerStyle={{ paddingBottom: 24 }}>
                { !isReceiptReady ? (
                    <ReceiptSkeletonLoader />
                ) : (
                <View
                    ref={ receiptCardRef }
                    collapsable={ false }
                    className="mx-5 mt-3 px-5 py-5 rounded-xl bg-white"
                >
                    {/*==== Brand / contact ====*/}
                    <View className="flex-row items-center">
                        <Image
                            source={ require("../../../../../assets/images/app_logo_green.png") }
                            style={{ width: 56, height: 56, resizeMode: "contain" }}
                        />
                    </View>
                    <View className="mt-2">
                        <Text className="text-xs text-gray-500">admin@zeaper.com</Text>
                        <Text className="mt-0.5 text-xs text-gray-500">+447518465207 (United Kingdom)</Text>
                        <Text className="mt-0.5 text-xs text-gray-500">+2347075374026 (Nigeria)</Text>
                    </View>

                    {/*==== Receipt to / Order meta ====*/}
                    <View className="mt-5 flex-row items-start justify-between">
                        <View className="flex-1">
                            <Text className="font-montserratSemiBold text-gray-800">Receipt to :</Text>
                            <Text className="mt-1 text-gray-800">{ buyerName || "—" }</Text>
                            <Text className="text-xs text-gray-500">{ orderDetails?.user?.email ?? "" }</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-gray-800">
                                <Text className="font-montserratSemiBold">Order ID:</Text>
                                <Text className="text-gray-500"> { orderDetails?.orderId ?? "" }</Text>
                            </Text>
                            <Text className="mt-1 text-gray-800">
                                <Text className="font-montserratSemiBold">Date:</Text>
                                <Text className="text-gray-500"> { formatReceiptDate(orderDetails?.createdAt) }</Text>
                            </Text>
                        </View>
                    </View>

                    {/*==== Items header ====*/}
                    <View className="mt-8 pb-3 border-b border-gray-200 flex-row items-center">
                        <Text className="flex-1 font-montserratSemiBold text-xs text-gray-800">Items</Text>
                        <View className="flex-row items-center justify-end">
                            <Text className="w-[60px] text-right font-montserratSemiBold text-xs text-gray-800">Quantity</Text>
                            <Text className="w-[60px] ml-4 text-right font-montserratSemiBold text-xs text-gray-800">Price</Text>
                        </View>
                    </View>

                    {/*==== Items rows ====*/}
                    { (orderDetails?.productOrders ?? []).length === 0 ? (
                        <Text className="py-3 text-center text-gray-400">No items</Text>
                    ) : (
                        (orderDetails?.productOrders ?? []).map((po) => (
                            <View key={ po._id } className="py-2.5 flex-row items-center">
                                <Text className="flex-1 mr-4 text-gray-700" numberOfLines={ 2 }>{ po?.product?.title ?? "Item" }</Text>
                                <View className="flex-row items-center justify-end">
                                    <Text className="w-[55px] text-center text-gray-700">{ po?.quantity ?? 1 }</Text>
                                    <Text className="w-[60px] ml-4 text-right text-gray-700">{ formatCurrency(getLineAmount(po), currency) }</Text>
                                </View>
                            </View>
                        ))
                    )}

                    {/*==== Divider between the items and the totals ====*/}
                    <View className="mt-2 h-[1px] w-full bg-gray-200" />

                    {/*==== Totals ====*/}
                    <View className="mt-4 ml-auto w-[80%]">
                        <View className="flex-row items-center justify-between py-1">
                            <Text className="text-gray-600">Subtotal</Text>
                            <Text className="text-gray-700">{ formatCurrency((orderDetails?.payment?.itemsTotal ?? 0) / 100, currency) }</Text>
                        </View>
                        <View className="flex-row items-center justify-between py-1">
                            <Text className="text-gray-600">Delivery Fee</Text>
                            <Text className="text-gray-700">{ formatCurrency((orderDetails?.payment?.deliveryFee ?? 0) / 100, currency) }</Text>
                        </View>
                        <View className="flex-row items-center justify-between py-1">
                            <Text className="text-gray-600">Applied Voucher Discount</Text>
                            <Text className="text-gray-700">{ formatCurrency((orderDetails?.payment?.appliedVoucherAmount ?? 0) / 100, currency) }</Text>
                        </View>
                        <View className="mt-2 pt-2 border-t border-gray-200 flex-row items-center justify-between">
                            <Text className="font-montserratSemiBold text-gray-800">Total</Text>
                            <Text className="font-montserratSemiBold text-gray-800">{ formatCurrency((orderDetails?.payment?.total ?? 0) / 100, currency) }</Text>
                        </View>
                    </View>
                </View>
                ) }
            </ScrollView>

            {/*==== Action bar ====*/}
            {/* Hidden until the receipt is loaded — nothing to save yet. */}
            { isReceiptReady && (
                <View className="h-auto w-full px-5 py-3 flex-row items-center gap-x-3 bg-white border-t border-gray-200">
                    <TouchableOpacity
                        onPress={ handleDownloadReceipt }
                        disabled={ isPreparingReceipt }
                        className={`h-[48px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen ${ isPreparingReceipt ? "opacity-60" : "" }`}
                    >
                        <DocumentDownload size={ 18 } color="white" variant="Bold" />
                        <Text className="ml-2 text-white font-montserratMedium">Download</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={ handleShareReceipt }
                        disabled={ isPreparingReceipt }
                        className={`h-[48px] flex-1 flex-row items-center justify-center rounded-xl border border-baseGreen bg-lightGreen ${ isPreparingReceipt ? "opacity-60" : "" }`}
                    >
                        <ShareIcon size={ 18 } color="#133522" variant="Bold" />
                        <Text className="ml-2 text-baseGreen font-montserratMedium">Share</Text>
                    </TouchableOpacity>
                </View>
            ) }
        </SafeAreaView>
    );
};

export default ReceiptScreen;
