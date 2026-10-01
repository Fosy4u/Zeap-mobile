import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store.ts';
import { setShowConfirmOrderModal } from '../slices/orderState_slice.ts';
import useOrderHook from '../hooks/order_hook.ts';
import AppLoader from '../../../general/components/appLoader.tsx';

interface IProps {
  // Sent as-is to PUT /order/status, e.g. "order confirmed".
  statusValue: string;
  // Readable name of that status, e.g. "confirmed".
  statusName: string;
  // Mirrors the action button that opened the dialog, e.g. "Start Processing".
  title?: string;
};

const ConfirmOrderStatusPopupModal: React.FC<IProps> = ({ statusValue, statusName, title }) => {
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.vendorOrderState);
  const dispatch = useDispatch();

  const { handleConfirmOrderStatus } = useOrderHook();

  return (
    <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
      <StatusBar
        backgroundColor="gray"
        barStyle="dark-content"
      />

      <View className="h-full w-full absolute inset-0 bg-black opacity-60" />

      <View className="h-auto w-[320px] pb-5 rounded-2xl bg-white">
        {/*==== Header ====*/}
        <ImageBackground
          source={ require("../../../../../assets/images/warning_modal_image.png") }
          resizeMode="contain"
          className="h-[120px] w-full p-3 flex items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-baseGreen"
          imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        />

        <View className="px-4 pt-5 pb-2 items-center justify-center">
          <Text className="font-montserratSemiBold text-xl text-gold">{ title || "Confirm Order" }</Text>
          <Text className="h-auto w-full mt-2.5 font-montserratMedium text-sm text-center leading-5">
            Are you sure you want to update status to { statusName }? This will notify the customer.
          </Text>

          {/*==== Footer ====*/}
          <View className="h-auto w-full mt-5 flex-row">
            <TouchableOpacity
              disabled={ isLoading }
              onPress={ () => dispatch(setShowConfirmOrderModal(false)) }
              className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-red-50"
            >
              <Text className="font-montserratMedium text-red-700">No, Cancel</Text>
            </TouchableOpacity>
            <View className="w-[10px]" />

            <TouchableOpacity
              disabled={ isLoading }
              onPress={ () => handleConfirmOrderStatus(statusValue) }
              className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="font-montserratRegular text-white">Yes, I'm sure</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      { isLoading &&
        <AppLoader loadingAdditionalMessage={ loadingMessage } />
      }
    </SafeAreaView>
  );
};

export default ConfirmOrderStatusPopupModal;
