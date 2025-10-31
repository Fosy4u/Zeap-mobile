
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { ArrowLeft } from 'iconsax-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { setSelectedVoucher, setSelectedVoucherType } from '../slices/pointAndVoucher_slice';
import formatCurrency from '../../../../utils/formatCurrency';
import formatDate from '../../../../utils/formatDate';

type VoucherComponentProps = {
  setShowBottomSheetModal: (value: boolean) => void;
}

const VoucherComponent: React.FC<VoucherComponentProps> = ({ setShowBottomSheetModal }) => {
    // component 
  const { activeVouchers, inactiveVouchers, selectedVoucherType } = useSelector((state: RootState) => state.pointAndVoucherState);
  const dispatch = useDispatch();
  const vouchers = selectedVoucherType === "Active" ? activeVouchers : inactiveVouchers;

  return (
    <View className="h-auto w-full flex-1 mt-5">
      {/* Voucher Type Tabs */}
      <View className="mt-3 flex-row justify-start mb-4">
          {["Active", "Inactive"].map((voucherType, index) => (
          <TouchableOpacity
              key={`${voucherType}_${index}`}
              onPress={() => dispatch(setSelectedVoucherType(voucherType))}
              className={`h-auto flex-1 mx-1 px-4 py-2 rounded-full border ${selectedVoucherType === voucherType ? 'bg-green-900' : 'border-gray-300'}`}
          >
              <Text className={`text-center font-montserratMedium ${selectedVoucherType === voucherType ? 'text-white' : 'text-black'}`}>{voucherType}</Text>
          </TouchableOpacity>
          ))}
      </View>
      { vouchers.length > 0 ? (
        vouchers.map((item, index) => (
        <View key={ index } className="mt-6 px-4 flex-row items-end">
          {/* Left colored bar */}
          <ImageBackground
            source={selectedVoucherType === "Active" ? require('../../../../../assets/images/voucher_left_active_background.png') : require('../../../../../assets/images/voucher_left_inactive_background.png')}
            resizeMode="contain"
            className="h-[155px] w-[100px] rounded-l-2xl overflow-hidden"
          />

          {/* Right content box */}
          <ImageBackground
            source={require('../../../../../assets/images/voucher_right_background.png')}
            resizeMode="stretch"
            imageStyle={{ borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
            className="h-[145px] px-8 py-6 flex-1 justify-between "
          >
            <Text className="font-montserratSemiBold text-2xl text-[#0E2B1B]">{ formatCurrency(item.amount, item.currency) }</Text>
            <Text className="mt-2 font-montserratMedium text-xs">Expiry Date:</Text>
            <Text className="font-montserratSemiBold text-sm text-gray-600">{ formatDate(item.expiryDate, true) }</Text>
            
            <TouchableOpacity
                onPress={ () => {
                  dispatch(setSelectedVoucher(item));
                  setShowBottomSheetModal(true);
                } }
                className="mt-3 flex-row items-center"
            >
              <Text className="mr-1 font-montserratMedium text-xs text-baseGreen">View Voucher Code</Text>
              <ArrowLeft className="-rotate-180" size={18} color="#0E2B1B" />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      ))) : (
        <View className="h-auto w-full items-center mt-5 py-10 bg-gray-50">
          <ImageBackground
            source={require('../../../../../assets/images/empty_box.png')}
            resizeMode="contain"
            className="h-[120px] w-[120px] p-4 items-center justify-center bg-white rounded-full"
          />
          <Text className="mt-4 font-montserratSemiBold text-center text-baseGreen">You currently have no {selectedVoucherType === "Active" ? "active" : "inactive"} vouchers.</Text>
          <Text className="mt-5 font-montserratRegular text-center">{"All your available vouchers will be\ndisplayed here."}</Text>
        </View>
      ) }
    </View>
  );
}

export default VoucherComponent;
