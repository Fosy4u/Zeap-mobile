import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { ArrowLeft, DocumentDownload } from 'iconsax-react-native';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { RootState } from '../../../../redux/store/store';
import useOrderHook from '../hooks/order_hook';
import formatCurrency from '../../../../utils/formatCurrency';
import AppLoader from '../../../general/components/appLoader';
import IOrderDetails from '../models/orderDetails_model';
import ZEAPER_LOGO_BASE64 from '../utils/zeaperLogoBase64';

interface IProps {
    route: RouteProp<RootNavigationStackModel, 'receiptScreen'>;
}

const formatReceiptDate = (input?: Date | string): string => {
    if (!input) return "";
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

const buildReceiptHtml = (orderDetails: IOrderDetails): string => {
    const currency = orderDetails?.payment?.currency || "NGN";
    // Payment amounts come from the gateway in the smallest currency unit
    // (kobo for NGN, cents for USD/GBP). Divide by 100 for display.
    const itemsTotal = (orderDetails?.payment?.itemsTotal ?? 0) / 100;
    const deliveryFee = (orderDetails?.payment?.deliveryFee ?? 0) / 100;
    const appliedVoucher = (orderDetails?.payment?.appliedVoucherAmount ?? 0) / 100;
    const total = (orderDetails?.payment?.total ?? 0) / 100;
    const buyerName = `${orderDetails?.user?.firstName ?? ""} ${orderDetails?.user?.lastName ?? ""}`.trim();
    const buyerEmail = orderDetails?.user?.email ?? "";
    const orderId = orderDetails?.orderId ?? "";
    const date = formatReceiptDate(orderDetails?.createdAt);

    const itemsRows = (orderDetails?.productOrders ?? []).map((po) => {
        const title = po?.product?.title ?? "Item";
        const qty = po?.quantity ?? 1;
        const price = (po?.amount?.[0]?.value ?? 0) / 100;
        return `
            <tr>
                <td style="padding:10px 0; color:#374151;">${title}</td>
                <td style="padding:10px 0; color:#374151; text-align:center;">${qty}</td>
                <td style="padding:10px 0; color:#374151; text-align:right;">${formatCurrency(price, currency)}</td>
            </tr>
        `;
    }).join("");

    return `
        <html>
            <head>
                <meta charset="utf-8" />
                <style>
                    body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #111827; padding: 24px; }
                    .receipt-header { text-align: center; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; margin-bottom: 18px; }
                    .receipt-header img { display: block; margin: 0 auto; width: 72px; height: 72px; object-fit: contain; }
                    .receipt-header .caption { margin-top: 8px; color: #133522; font-weight: 700; letter-spacing: 3px; font-size: 18px; text-transform: uppercase; }
                    .header { display: flex; align-items: center; gap: 8px; }
                    .brand { color: #133522; font-weight: 700; letter-spacing: 4px; font-size: 26px; }
                    .muted { color: #6b7280; font-size: 12px; line-height: 18px; }
                    .row { display: flex; justify-content: space-between; margin-top: 16px; }
                    .label { color: #111827; font-weight: 600; }
                    .divider { height: 1px; background: #e5e7eb; margin: 16px 0; }
                    table { width: 100%; border-collapse: collapse; }
                    th { text-align: left; color: #111827; font-weight: 600; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
                    th.center { text-align: center; }
                    th.right { text-align: right; }
                    .totals { width: 60%; margin-left: auto; }
                    .totals .line { display: flex; justify-content: space-between; padding: 6px 0; color: #374151; }
                    .totals .grand { font-weight: 700; color: #111827; font-size: 16px; padding-top: 10px; border-top: 1px solid #e5e7eb; margin-top: 4px; }
                </style>
            </head>
            <body>
                <div class="receipt-header">
                    <img src="data:image/png;base64,${ZEAPER_LOGO_BASE64}" alt="Zeaper" />
                </div>

                <div class="muted" style="margin-top:10px;">
                    admin@zeaper.com<br/>
                    +447518465207 (United Kingdom)<br/>
                    +2347075374026 (Nigeria)
                </div>

                <div class="row">
                    <div>
                        <div class="label">Receipt to :</div>
                        <div style="margin-top:4px;">${buyerName}</div>
                        <div class="muted">${buyerEmail}</div>
                    </div>
                    <div style="text-align:right;">
                        <div><span class="label">Order ID:</span> <span style="color:#6b7280;">${orderId}</span></div>
                        <div style="margin-top:4px;"><span class="label">Date:</span> <span style="color:#6b7280;">${date}</span></div>
                    </div>
                </div>

                <div class="divider"></div>

                <table>
                    <thead>
                        <tr>
                            <th>Items</th>
                            <th class="center">Quantity</th>
                            <th class="right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsRows || `<tr><td colspan="3" style="padding:12px 0; color:#9ca3af;">No items</td></tr>`}
                    </tbody>
                </table>

                <div class="totals">
                    <div class="line"><span>Subtotal</span><span>${formatCurrency(itemsTotal, currency)}</span></div>
                    <div class="line"><span>Delivery Fee</span><span>${formatCurrency(deliveryFee, currency)}</span></div>
                    <div class="line"><span>Applied Voucher Discount</span><span>${formatCurrency(appliedVoucher, currency)}</span></div>
                    <div class="line grand"><span>Total</span><span>${formatCurrency(total, currency)}</span></div>
                </div>
            </body>
        </html>
    `;
};

const ReceiptScreen: React.FC<IProps> = ({ route }) => {
    const orderId = route.params.orderId;
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { orderDetails, isLoading, loadingMessage } = useSelector((state: RootState) => state.orderState);
    const { handleGetOrderDetails } = useOrderHook();

    useEffect(() => {
        if (orderId) handleGetOrderDetails(orderId);
    }, [orderId]);

    const buildFileName = () => `zeaper-receipt-${orderDetails?.orderId ?? "order"}`;

    // Mobile has no browser-style "download to Downloads" — the equivalent
    // is to render the file on-device and hand it to the OS share sheet,
    // which includes "Save to Files", Drive, Gmail, WhatsApp, etc. From the
    // user's perspective, picking "Save to Files" IS the download.
    //
    // Sharing a file:// URI directly fails on Android API 24+ with
    // FileUriExposedException. We hand the PDF over as a base64 data URI
    // and let react-native-share materialise the file via its bundled
    // FileProvider.
    //
    // `useInternalStorage: true` is load-bearing on Android — without it
    // the library writes the decoded bytes to getExternalCacheDir()/Download/,
    // which is NOT covered by react-native-share's bundled FileProvider
    // paths (those only cover the internal cache and the public Download
    // folder). FileProvider.getUriForFile then fails, the lib swallows the
    // exception and returns a null Uri, and ClipData.newUri later crashes
    // with "Attempt to invoke virtual method 'getScheme()' on a null
    // object reference".
    const handleSaveReceipt = async () => {
        try {
            const fileName = buildFileName();
            const html = buildReceiptHtml(orderDetails);
            const { base64 } = await generatePDF({
                html,
                fileName,
                base64: true,
            });
            if (!base64) {
                Alert.alert("Receipt", "Could not prepare the receipt. Please try again.");
                return;
            }
            await Share.open({
                url: `data:application/pdf;base64,${base64}`,
                filename: fileName,
                type: "application/pdf",
                title: "Zeaper Receipt",
                subject: "Zeaper Receipt",
                useInternalStorage: true,
                failOnCancel: false,
            });
        } catch (error: any) {
            // react-native-share throws when the user dismisses the sheet — ignore that.
            const message: string = error?.message ?? "";
            if (message.toLowerCase().includes("cancel") || message.toLowerCase().includes("dismiss")) return;
            console.log("RECEIPT SAVE ERROR::: ", error);
            Alert.alert("Receipt", "Could not open the share sheet. Please try again.");
        }
    };

    const currency = orderDetails?.payment?.currency || "NGN";
    const buyerName = `${orderDetails?.user?.firstName ?? ""} ${orderDetails?.user?.lastName ?? ""}`.trim();

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
                <View className="mx-5 mt-3 px-5 py-5 rounded-xl bg-white">
                    {/*==== Brand / contact ====*/}
                    <View className="flex-row items-center">
                        <Image
                            source={ require("../../../../../assets/images/app_logo_green.png") }
                            style={{ width: 36, height: 36, resizeMode: "contain" }}
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
                    <View className="mt-5 pb-3 border-b border-gray-200 flex-row">
                        <Text className="flex-1 font-montserratSemiBold text-gray-800">Items</Text>
                        <Text className="w-[80px] text-center font-montserratSemiBold text-gray-800">Quantity</Text>
                        <Text className="w-[100px] text-right font-montserratSemiBold text-gray-800">Price</Text>
                    </View>

                    {/*==== Items rows ====*/}
                    { (orderDetails?.productOrders ?? []).length === 0 ? (
                        <Text className="py-3 text-center text-gray-400">No items</Text>
                    ) : (
                        (orderDetails?.productOrders ?? []).map((po) => (
                            <View key={ po._id } className="py-2.5 flex-row items-center">
                                <Text className="flex-1 text-gray-700" numberOfLines={ 2 }>{ po?.product?.title ?? "Item" }</Text>
                                <Text className="w-[80px] text-center text-gray-700">{ po?.quantity ?? 1 }</Text>
                                <Text className="w-[100px] text-right text-gray-700">{ formatCurrency((po?.amount?.[0]?.value ?? 0) / 100, currency) }</Text>
                            </View>
                        ))
                    )}

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
            </ScrollView>

            {/*==== Action bar ====*/}
            {/* One button: tapping opens the OS share sheet. From there the
                user can pick "Save to Files" (the mobile equivalent of a
                browser download), or send to Drive / Gmail / WhatsApp / etc. */}
            <View className="h-auto w-full px-5 py-3 bg-white border-t border-gray-200">
                <TouchableOpacity
                    onPress={ handleSaveReceipt }
                    className="h-[48px] w-full flex-row items-center justify-center rounded-xl bg-baseGreen"
                >
                    <DocumentDownload size={ 18 } color="white" variant="Bold" />
                    <Text className="ml-2 text-white font-montserratMedium">Save or Share Receipt</Text>
                </TouchableOpacity>
            </View>

            { isLoading && <AppLoader loadingAdditionalMessage={ loadingMessage } /> }
        </SafeAreaView>
    );
};

export default ReceiptScreen;
