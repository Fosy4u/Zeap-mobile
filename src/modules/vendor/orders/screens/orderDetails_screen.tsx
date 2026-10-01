import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import AppHeaderComp from '../../general/components/appHeader_comp.tsx';
import {RouteProp} from '@react-navigation/native';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import formatDate from '../../../../utils/formatDate.ts';
import FastImage from 'react-native-fast-image';
import useOrderHook from '../hooks/order_hook.ts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store.ts';
import { setShowConfirmOrderModal, setShowRejectOrderModal } from '../slices/orderState_slice.ts';
import FormatWords from '../../../../utils/formatWords.ts';
import ConfirmOrderStatusPopupModal from '../modals/confirmOrderStatusPopup_modal.tsx';
import RejectOrderPopupModal from '../modals/rejectOrderPopup_modal.tsx';
import StatusUpdateSuccessPopupModal from '../modals/statusUpdateSuccessPopup_modal.tsx';
import OrderStatusHistoryBottomSheetComponent from '../components/orderStatusHistoryBottomSheet_component.tsx';
import OrderStatusPillComponent from '../components/orderStatusPill_component.tsx';
import { canRejectOrderStatus } from '../models/orderFilter_model.ts';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook.ts';

interface IProps {
  route: RouteProp<RootNavigationStackModel, 'vendorOrderDetailsScreen'>;
}

const VendorOrderDetailsScreen: React.FC<IProps> = ({route}) => {
  const {
    order, orderHistory, historyIsLoading,
    showConfirmOrderModal, showRejectOrderModal, showStatusSuccessModal,
  } = useSelector((state: RootState) => state.vendorOrderState);
  const from = route.params?.from;
  const orderID = route.params?.orderId;
  const dispatch = useDispatch();

  const { handleGetOrderDetails, handleGetOrderHistory } = useOrderHook();
  const { currencyRefreshToken } = useDisplayCurrency();

  const [selectedImage, setSelectedImage] = useState<{ link?: string; _id?: string } | null>(null);
  const featuredImage = selectedImage ?? order.images?.[0];

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
    if (from === "Orders Screen" || from === "Notification Screen") {
      handleGetOrderDetails(orderID!);
      // The history drives the action buttons, so it loads with the details.
      handleGetOrderHistory(orderID!);
    }
    setSelectedImage(null);
  }, [orderID, currencyRefreshToken]);

  const nextStatus = orderHistory?.nextStatus;
  const nextStatusValue = nextStatus?.value ?? "";
  const nextStatusName = nextStatus?.name ?? "";
  /* Button shows whenever a next status exists; locked while the step isn't
     the seller's (sellerAction false) — e.g. awaiting quality check. */
  const canAdvanceStatus = !!nextStatusValue;
  const advanceIsLocked = nextStatus?.sellerAction === false;
  const isAwaitingConfirmation = nextStatusValue.toLowerCase() === "order confirmed";
  const canRejectOrder = !order?.cancel?.isCancelled && canRejectOrderStatus(order?.status);
  const isProcessingNext = (nextStatusName || nextStatusValue).toLowerCase().includes("processing");
  const confirmLabel = isAwaitingConfirmation
    ? "Confirm Order"
    : isProcessingNext
      ? "Start Processing"
      : `Update to ${ FormatWords.capitalizeWords(nextStatusName || nextStatusValue) }`;

  // "N/P" matches the web placeholder for a field the buyer never filled in.
  const deliveryDetails = order?.deliveryDetails;
  const notProvided = "N/P";
  const deliveryRows = [
    { label: "Method", value: FormatWords.capitalizeWord(order?.deliveryMethod) || notProvided },
    { label: "Address", value: deliveryDetails?.address || notProvided },
    { label: "Region", value: deliveryDetails?.region || notProvided },
    { label: "Post Code", value: deliveryDetails?.postCode || notProvided },
    { label: "Country", value: deliveryDetails?.country || notProvided },
    { label: "Contact No", value: deliveryDetails?.phoneNumber || notProvided },
  ];

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1">
          {/*==== Status Bar ====*/}
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />

          {/*==== Header ====*/}
          <AppHeaderComp title="Order Request" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 w-full mt-2 px-5 pt-3">

            {/*==== Product Image ====*/}
            <FastImage
              source={{uri: featuredImage?.link!}}
              defaultSource={require('../../../../../assets/images/image_placeholder.png')}
              resizeMode="cover"
              className="h-[385px] w-full mb-3 rounded-xl"
            />

            {/*==== Thumbnails ====*/}
            { (order.images && order.images.length > 0) && (
              <View className="mb-3 flex-row items-center justify-start flex-wrap gap-x-2">
                { order.images.map((eachImage) => (
                  <TouchableOpacity key={ eachImage._id }
                    onPress={ () => setSelectedImage(eachImage) }
                    className={`h-[75px] w-[75px] rounded-2xl border ${ (eachImage._id === featuredImage?._id) ? "border-baseGreen" : "border-gray-300" } bg-[#F8F9FE]`}
                  >
                    <FastImage
                      source={{ uri: eachImage.link! }}
                      defaultSource={ require('../../../../../assets/images/image_placeholder.png') }
                      resizeMode="cover"
                      className="h-[73px] w-[73px] rounded-2xl"
                    />
                  </TouchableOpacity>
                )) }
              </View>
            ) }

            {/*==== Product Name ====*/}
            <Text className="mb-5 font-montserratSemiBold text-lg text-gray-900">{ order.product?.title }</Text>

            {/* Items details */}
            <View className="mb-4 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
              <Text className="font-montserratSemiBold text-lg text-baseGreen">Item Details</Text>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <View className="flex-row items-center gap-x-2">
                  <Text className="font-montserratRegular text-gray-700">Order#:</Text>
                  <Text className="font-montserratSemiBold text-baseGreen">{order.orderId}</Text>
                </View>

                <OrderStatusPillComponent statusName={ order.status?.name } />
              </View>
              <View className="h-auto w-full mt-5 flex-row items-center justify-between">
                <Text className="font-montserratRegular text-gray-700">SKU:</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{ order.sku! }</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row items-center justify-between">
                <Text className="font-montserratRegular text-gray-700">Order date:</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{ formatDate(order.createdAt!, false) }</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="font-montserratRegular text-gray-700">Product type</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{order.product?.categories?.main![0]}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="font-montserratRegular text-gray-700">Product group</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{ FormatWords.productGroupLabel(order.product?.categories?.productGroup, order.product?.productType) }</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="font-montserratRegular text-gray-700">Size</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{order.size}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="font-montserratRegular text-gray-700">Quantity</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{order.quantity}</Text>
              </View>
              <View className="h-auto w-full mt-5 flex-row justify-between">
                <Text className="font-montserratRegular text-gray-700">Colour</Text>
                <Text className="font-montserratMedium text-sm text-gray-800">{order.color}</Text>
              </View>

              <View className="h-auto w-full mt-5">
                <Text className="font-montserratRegular text-gray-700">Expected Vendor Completion Date</Text>
                <Text className="mt-1 font-montserratSemiBold text-sm text-gray-800">{ formatDate(order.expectedVendorCompletionDate?.min!, true) } - { formatDate(order.expectedVendorCompletionDate?.max!, true) }</Text>
              </View>
              <View className="h-auto w-full mt-5">
                <Text className="font-montserratRegular text-gray-700">Expected Delivery Date</Text>
                <Text className="mt-1 font-montserratSemiBold text-sm text-gray-800">{ formatDate(order.expectedDeliveryDate?.min!, true) } - { formatDate(order.expectedDeliveryDate?.max!, true) }</Text>
              </View>
            </View>

            {/* Buyer instruction — what the buyer asked for at checkout. Shown
                only when they wrote one, so it can't render an empty card. */}
            { !!order?.bespokeInstruction?.trim() && (
              <View className="mb-4 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
                <Text className="font-montserratSemiBold text-lg text-baseGreen">Buyer Instruction</Text>
                <Text className="mt-3 font-montserratRegular text-sm leading-5 text-gray-800">
                  { order.bespokeInstruction!.trim() }
                </Text>
              </View>
            ) }

            { (order.bodyMeasurements?.length ?? 0) > 0 && (
              <View className="mb-4 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
                <Text className="font-montserratSemiBold text-lg text-baseGreen">Measurement</Text>

                { order.bodyMeasurements!.map((group, groupIndex) => (
                  <View key={ group?._id ?? groupIndex } className="mt-4">
                    { !!group?.name && (
                      <Text className="font-montserratSemiBold text-sm text-baseGreen">
                        { FormatWords.capitalizeWords(group.name) }
                      </Text>
                    ) }

                    { (group?.measurements ?? []).map((measurement, index) => (
                      <View
                        key={ measurement?._id ?? index }
                        className="h-auto w-full mt-3 flex-row justify-between"
                      >
                        <Text className="flex-1 mr-3 font-montserratRegular text-gray-700">
                          { FormatWords.capitalizeWords(measurement?.field ?? "") }
                        </Text>
                        <Text className="font-montserratMedium text-sm text-gray-800">
                          { measurement?.value ?? 0 }{ measurement?.unit ?? "" }
                        </Text>
                      </View>
                    )) }

                    { (group?.measurements?.length ?? 0) === 0 && (
                      <Text className="mt-2 font-montserratRegular text-xs text-gray-400">
                        No measurements submitted for this section.
                      </Text>
                    ) }
                  </View>
                )) }
              </View>
            ) }

            {/* Delivery Details */}
            <View className="mb-10 px-3.5 py-4 border border-gray-200 rounded-xl bg-lightGray">
              <Text className="font-montserratSemiBold text-lg text-baseGreen">Delivery Details</Text>

              { deliveryRows.map((row) => (
                <View key={ row.label } className="h-auto w-full mt-5 flex-row justify-between">
                  <Text className="font-montserratRegular text-gray-700">{ row.label }</Text>
                  <Text className="flex-1 ml-4 font-montserratMedium text-sm text-right text-gray-800">{ row.value }</Text>
                </View>
              )) }
            </View>

          </ScrollView>

          {/*==== Order actions ====*/}
          <View className="h-auto w-full px-5 pt-4 pb-5 border-t border-gray-200 bg-white">
            { (canAdvanceStatus || canRejectOrder) && (
              <View className="h-auto w-full mb-3 flex-row">
                { canRejectOrder && (
                  <TouchableOpacity
                    onPress={ () => dispatch(setShowRejectOrderModal(true)) }
                    style={{ flex: canAdvanceStatus ? 0.4 : 1 }}
                    className="h-[50px] flex-row items-center justify-center rounded-xl bg-red-50"
                  >
                    <Text className="font-montserratMedium text-red-700">Reject Order</Text>
                  </TouchableOpacity>
                ) }

                { (canAdvanceStatus && canRejectOrder) && <View className="w-[10px]" /> }

                { canAdvanceStatus && (
                  <TouchableOpacity
                    onPress={ () => dispatch(setShowConfirmOrderModal(true)) }
                    disabled={ advanceIsLocked }
                    style={{ flex: canRejectOrder ? 0.6 : 1 }}
                    className={ `h-[50px] flex-row items-center justify-center rounded-xl bg-baseGreen ${ advanceIsLocked ? "opacity-50" : "" }` }
                  >
                    <Text className="font-montserratRegular text-white">{ confirmLabel }</Text>
                  </TouchableOpacity>
                ) }
              </View>
            ) }

            <TouchableOpacity
              onPress={ () => setShowBottomSheetModal(true) }
              className="h-[50px] w-full flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
              <Text className="font-montserratMedium text-baseGreen">
                { historyIsLoading ? "Loading..." : "View Status History" }
              </Text>
            </TouchableOpacity>
          </View>

          {/*==== Status history bottom sheet ====*/}
          <OrderStatusHistoryBottomSheetComponent
            bottomSheetModalRef={ bottomSheetModalRef }
            snapPoints={ snapPoints }
            setShowBottomSheetModal={ setShowBottomSheetModal }
          />

          {/*==== Confirmation dialogs ====*/}
          { showConfirmOrderModal && (
            <ConfirmOrderStatusPopupModal
              statusValue={ nextStatusValue }
              statusName={ nextStatusName || nextStatusValue }
              title={ confirmLabel }
            />
          ) }

          { showRejectOrderModal && (
            <RejectOrderPopupModal />
          ) }

          {/*==== Status update success ====*/}
          { showStatusSuccessModal && (
            <StatusUpdateSuccessPopupModal />
          ) }
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default VendorOrderDetailsScreen;
