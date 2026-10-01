import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store.ts';
import { setShowRejectOrderModal } from '../slices/orderState_slice.ts';
import useOrderHook from '../hooks/order_hook.ts';
import AppLoader from '../../../general/components/appLoader.tsx';

const RejectOrderPopupModal = () => {
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.vendorOrderState);
  const dispatch = useDispatch();

  const { rejectionReason, setRejectionReason, handleRejectOrder } = useOrderHook();

  const hasReason = rejectionReason.trim().length > 0;

  const handleClose = () => {
    setRejectionReason("");
    dispatch(setShowRejectOrderModal(false));
  };

  return (
    <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
      <StatusBar
        backgroundColor="gray"
        barStyle="dark-content"
      />

      <View className="h-full w-full absolute inset-0 bg-black opacity-60" />

      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : undefined }
        className="w-[330px]"
      >
        <View className="h-auto w-full max-h-[88%] rounded-2xl bg-white overflow-hidden">
          {/*==== Header ====*/}
          <ImageBackground
            source={ require("../../../../../assets/images/warning_modal_image.png") }
            resizeMode="contain"
            className="h-[120px] w-full p-3 flex items-center justify-center bg-baseGreen"
          />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={ false }
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 }}
          >
            <Text className="w-full font-montserratSemiBold text-xl text-center text-gold">Reject Order</Text>
            <Text className="h-auto w-full mt-2.5 font-montserratMedium text-sm text-center leading-5">
              Are you sure you want to reject this order? Once rejected, this cannot be reversed.
            </Text>

            {/*==== Suspension note ====*/}
            <View className="w-full mt-4 p-3.5 rounded-2xl border border-yellow-200 bg-lightGold">
              <Text className="font-montserratSemiBold text-xs text-baseGreen">Please note</Text>
              <Text className="mt-1.5 font-montserratMedium text-xs text-gray-700 leading-5">
                Rejecting orders above the minimum acceptable threshold would lead to your account being suspended.
              </Text>
            </View>

            <Text className="w-full mt-5 font-montserratSemiBold text-sm text-baseGreen">
              Please provide a reason for rejection
            </Text>
            <TextInput
              value={ rejectionReason }
              onChangeText={ setRejectionReason }
              editable={ !isLoading }
              multiline
              textAlignVertical="top"
              placeholder="Reason for rejection"
              placeholderTextColor="#9ca3af"
              className="mt-2 h-24 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-montserratMedium text-base text-black"
            />

            {/*==== Footer ====*/}
            <View className="h-auto w-full mt-5 flex-row">
              <TouchableOpacity
                disabled={ !hasReason || isLoading }
                onPress={ () => handleRejectOrder() }
                className={ `h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-red-50 ${ (!hasReason || isLoading) ? "opacity-60" : "" }` }
              >
                <Text className="font-montserratMedium text-red-700">Yes, Reject</Text>
              </TouchableOpacity>
              <View className="w-[10px]" />

              <TouchableOpacity
                disabled={ isLoading }
                onPress={ handleClose }
                className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
              >
                <Text className="font-montserratRegular text-white">No, Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      { isLoading &&
        <AppLoader loadingAdditionalMessage={ loadingMessage } />
      }
    </SafeAreaView>
  );
};

export default RejectOrderPopupModal;
