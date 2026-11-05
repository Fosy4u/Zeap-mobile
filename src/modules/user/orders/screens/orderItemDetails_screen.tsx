import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, CloseCircle } from 'iconsax-react-native';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { useGetProductOrderQuery } from '../apis/order_api';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook';
import formatDate from '../../../../utils/formatDate';
import { IDateRange } from '../models/productOrderDetails_model';
import useScreenProtection from '../../../general/hooks/screenProtection_hook';

const Row: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <View className="py-3 flex-row items-start justify-between border-b border-gray-100">
    <Text className="font-montserratMedium text-sm text-gray-500 flex-1 pr-3">{ label }</Text>
    <Text className="font-montserratSemiBold text-sm text-gray-800 flex-[1.4] text-right">
      { value === null || value === undefined || value === "" ? "N/A" : String(value) }
    </Text>
  </View>
);

const rangeText = (range?: IDateRange): string => {
  if (!range?.min && !range?.max) { return "N/A"; }
  const min = range?.min ? formatDate(range.min, false, true) : "";
  const max = range?.max ? formatDate(range.max, false, true) : "";
  if (min && max) { return min === max ? min : `${ min } - ${ max }`; }
  return min || max;
};

const OrderItemDetailsScreen = () => {
  useScreenProtection();
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const { productOrderId } = (useRoute().params as { productOrderId: string });
  const { formatAmount } = useDisplayCurrency();
  const [showImagePreview, setShowImagePreview] = useState(false);

  const { data: item, isFetching, isError, refetch } = useGetProductOrderQuery(
    { productOrderId },
    { skip: !productOrderId },
  );

  const image = item?.images?.[0]?.link ?? item?.product?.colors?.[0]?.images?.[0]?.link;
  const delivery = item?.deliveryDetails ?? item?.order?.deliveryDetails;
  const statusName = item?.status?.name ?? "";
  const isDelivered = statusName.toLowerCase() === "delivered";

  return (
    <SafeAreaView className="h-full w-full flex-1 bg-white">
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View className="h-auto w-full px-5 pt-3 pb-2 flex-row items-center justify-between">
        <TouchableOpacity onPress={ () => navigation.goBack() }>
          <View className="h-[40px] w-[40px] items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" size={ 20 } />
          </View>
        </TouchableOpacity>
        <Text className="font-montserratSemiBold text-lg text-baseGreen">Item Details</Text>
        <View className="h-[40px] w-[40px]" />
      </View>

      { isFetching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#133522" />
          <Text className="mt-3 font-montserratMedium text-sm text-gray-500">Loading item details...</Text>
        </View>
      ) : isError || !item ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="font-montserratMedium text-sm text-gray-500 text-center">
            We couldn't load this item right now.
          </Text>
          <TouchableOpacity onPress={ () => refetch() } className="mt-4 px-6 py-3 rounded-xl bg-baseGreen">
            <Text className="font-montserratMedium text-sm text-white">Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={ false } contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="font-montserratSemiBold text-base text-gray-800">
              Order: { item.orderId }{ item.itemNo ? `/${ item.itemNo }` : "" }
            </Text>
            <View className={ `px-3 py-1 rounded ${ isDelivered ? "bg-green-600" : "bg-yellow-600" }` }>
              <Text className="font-montserratMedium text-xs text-white capitalize">{ statusName || "N/A" }</Text>
            </View>
          </View>

          { !!image && (
            <TouchableOpacity activeOpacity={ 0.9 } onPress={ () => setShowImagePreview(true) }>
              <Image
                source={{ uri: image }}
                style={{ width: "100%", aspectRatio: 3 / 4 }}
                className="mt-4 rounded-2xl"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) }

          <Text className="mt-4 font-montserratSemiBold text-base text-baseGreen">
            { item.product?.title ?? "N/A" }
          </Text>

          <View className="mt-5 p-4 rounded-2xl bg-[#F7F8FC]">
            <Row label="SKU" value={ item.sku } />
            <Row label="Colour" value={ item.color } />
            <Row label="Size" value={ item.size } />
            <Row label="Size standard" value={ item.product?.sizeStandard } />
            <Row label="Quantity" value={ item.quantity } />
            <Row label="Unit price" value={ item.amount?.length ? formatAmount(item.amount) : null } />
            <Row label="Ordered on" value={ item.createdAt ? formatDate(item.createdAt) : null } />
            <Row label="Last updated on" value={ item.updatedAt ? formatDate(item.updatedAt) : null } />
            <Row label="Expected order completion" value={ rangeText(item.expectedBuyerCompletionDate) } />
            <Row label="Expected delivery" value={ rangeText(item.expectedDeliveryDate) } />
          </View>

          <Text className="mt-6 font-montserratSemiBold text-base text-baseGreen">Delivery Details</Text>
          <View className="mt-2 p-4 rounded-2xl bg-[#F7F8FC]">
            <Row label="Method" value={ item.deliveryMethod } />
            <Row label="Address" value={ delivery?.address } />
            <Row label="Region" value={ delivery?.region } />
            <Row label="Post code" value={ delivery?.postCode } />
            <Row label="Country" value={ delivery?.country } />
            <Row label="Contact no" value={ delivery?.phoneNumber } />
            <Row label="Delivery note" value={ delivery?.deliveryNote } />
          </View>
        </ScrollView>
      ) }

      <Modal
        visible={ showImagePreview && !!image }
        transparent
        animationType="fade"
        onRequestClose={ () => setShowImagePreview(false) }
      >
        <View className="flex-1 bg-black/95">
          <SafeAreaView className="flex-1">
            <View className="h-auto w-full px-5 pt-3 flex-row items-center justify-end">
              <TouchableOpacity onPress={ () => setShowImagePreview(false) } hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <CloseCircle size={ 32 } color="#ffffff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={ 1 }
              onPress={ () => setShowImagePreview(false) }
              className="flex-1 items-center justify-center px-4"
            >
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OrderItemDetailsScreen;
