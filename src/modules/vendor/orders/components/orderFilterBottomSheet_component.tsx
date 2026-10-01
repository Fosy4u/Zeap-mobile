import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Add, ArrowDown2, ArrowRight, ArrowRight2} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import DatePicker from 'react-native-date-picker';
import { useDispatch } from 'react-redux';
import { setShowOrderFilterBottomSheet } from '../../home/slices/vendorHome_slice.tsx';
import useOrderHook from '../hooks/order_hook.ts';

// Date pickers hand back a Date; the API and the local filter both want yyyy-mm-dd.
const toIsoDate = (date: Date): string => date.toISOString().split('T')[0];

const OrderFilterBottomSheetComponent = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 1.3;
  const slideAnimation = useRef<Animatable.View>(null);

  const { filters, statusOptions, handleApplyOrderFilters, handleClearOrderFilters } = useOrderHook();

  /* Draft state — the sheet edits a copy and only commits on "Filter Result",
     seeded from the filters already applied so reopening shows the current set. */
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(filters.status ?? []);
  const [itemName, setItemName] = useState(filters.itemName ?? "");
  const [orderNumber, setOrderNumber] = useState(filters.orderId ?? "");

  const [showStatusType, setShowStatusType] = useState((filters.status?.length ?? 0) > 0);
  const [showDate, setShowDate] = useState(!!filters.fromDate || !!filters.toDate);
  const [fromDate, setFromDate] = useState(filters.fromDate ? new Date(filters.fromDate) : new Date());
  const [toDate, setToDate] = useState(filters.toDate ? new Date(filters.toDate) : new Date());
  /* A date only filters once picked — otherwise today's default would silently
     narrow the list to a single day. */
  const [isFromDateSet, setIsFromDateSet] = useState(!!filters.fromDate);
  const [isToDateSet, setIsToDateSet] = useState(!!filters.toDate);
  const [isFromDatePickerOpen, setFromDatePickerOpen] = useState(false);
  const [isToDatePickerOpen, setToDatePickerOpen] = useState(false);

  const toggleStatus = (statusName: string) => {
    setSelectedStatuses((current) =>
      current.includes(statusName)
        ? current.filter((value) => value !== statusName)
        : [...current, statusName],
    );
  };

  const handleFilterResult = () => {
    handleApplyOrderFilters({
      status: selectedStatuses,
      itemName: itemName.trim(),
      orderId: orderNumber.trim(),
      fromDate: isFromDateSet ? toIsoDate(fromDate) : "",
      toDate: isToDateSet ? toIsoDate(toDate) : "",
    });
  };

  const handleClearAll = () => {
    setSelectedStatuses([]);
    setItemName("");
    setOrderNumber("");
    setIsFromDateSet(false);
    setIsToDateSet(false);
    handleClearOrderFilters();
  };

  useEffect(() => {
    if (slideAnimation.current) {
      slideAnimation.current.animate(
        {
          0: {translateY: modalHeight},
          1: {translateY: 0},
        },
        1000,
      );
    }
  }, [modalHeight]);

  const handleCloseOrderFilterBottomSheet = () => {
    if (slideAnimation.current) {
      slideAnimation.current
        .animate(
          {
            0: {translateY: 0, opacity: 1},
            1: {translateY: modalHeight, opacity: 0},
          },
          500,
        )
        .then(() => {
          dispatch(setShowOrderFilterBottomSheet(false));
        });
    } else {
      dispatch(setShowOrderFilterBottomSheet(false));
    }
  };

  return (
    <SafeAreaView className="h-full w-full absolute bg-black/70">
      <Animatable.View
        ref={slideAnimation}
        className="w-full absolute bottom-0 rounded-t-xl bg-white"
        style={{
          height: modalHeight,
          transform: [{translateY: modalHeight}],
        }}>
        {/*==== Header ====*/}
        <View className="h-[110px] w-full px-5 pb-4 flex-row items-center justify-between rounded-t-xl rounded-b-3xl bg-baseGreen">
          <View className="px-5" />

          <Text className="font-montserratMedium text-xl text-white">
            Filter Order Request
          </Text>

          <TouchableOpacity
            onPress={() => handleCloseOrderFilterBottomSheet()}
            className="bg-[#20704329] p-1 rounded-xl">
            <Add color="#D5B07B" size={36} className="rotate-45" />
          </TouchableOpacity>
        </View>

        <View className="h-[calc(78%)] w-full px-5 flex-col justify-between">
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            stickyHeaderHiddenOnScroll={true}
            contentContainerStyle={{paddingHorizontal: 0, paddingBottom: 180}}>
              
            <Text className="font-montserratMedium mt-7 text-base text-gray-700">
              Filter order request by:
            </Text>

            {/*==== STATUS DROPDOWN ====*/}
            <View className="mt-6">
              <TouchableOpacity
                onPress={() => setShowStatusType(!showStatusType)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Status
                  </Text>
                  {showStatusType ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showStatusType && (
                <View className="mb-2 flex-row  flex-wrap gap-4">
                  {statusOptions.map((statusName) => {
                    const isSelected = selectedStatuses.includes(statusName);
                    return (
                      <TouchableOpacity
                        key={statusName}
                        onPress={() => toggleStatus(statusName)}
                        className={`p-[11px_16px] rounded-[8px] border-[1px] border-solid ${
                          isSelected ? "border-baseGreen bg-baseGreen" : "border-[#e0e2e8] bg-[#f8f9fe]"
                        }`}>
                        <Text className={`text-[12px] ${ isSelected ? "text-white" : "text-gray-700" }`}>
                          {statusName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/*==== DATE ====*/}
            <View className="mt-4">
              <TouchableOpacity onPress={() => setShowDate(!showDate)}>
                <View className="h-auto w-full mb-4 flex-row items-center justify-between">
                  <Text className="font-medium text-[14px] text-gray-700">
                    Date
                  </Text>
                  {showDate ? (
                    <ArrowDown2 size={24} className="text-gray-700" />
                  ) : (
                    <ArrowRight2 size={24} className="text-gray-700" />
                  )}
                </View>
              </TouchableOpacity>
              {showDate && (
                <View className="flex-row justify-between items-center space-x-4">
                  {/* From Date */}
                  <View className="flex-1">
                    <Text className="text-gray-700 mb-2">From</Text>
                    <TouchableOpacity
                      onPress={() => setFromDatePickerOpen(true)}
                      className="flex-row items-center px-3 py-4 border border-gray-300 rounded-lg bg-gray-100">
                      <Text className={`flex-1 ${ isFromDateSet ? "text-gray-800" : "text-[#9ca3af]" }`}>
                        {isFromDateSet ? fromDate.toDateString() : "Any date"}
                      </Text>
                      <ArrowDown2 size={20} className="text-[#9ca3af]" />
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      open={isFromDatePickerOpen}
                      date={fromDate}
                      mode="date"
                      onConfirm={date => {
                        setFromDate(date);
                        setIsFromDateSet(true);
                        setFromDatePickerOpen(false);
                      }}
                      onCancel={() => setFromDatePickerOpen(false)}
                    />
                  </View>

                  {/* To Date */}
                  <View className="flex-1">
                    <Text className="text-gray-700 mb-2">To</Text>
                    <TouchableOpacity
                      onPress={() => setToDatePickerOpen(true)}
                      className="flex-row items-center px-3 py-4 border border-gray-300 rounded-xl bg-gray-100">
                      <Text className={`flex-1 ${ isToDateSet ? "text-gray-800" : "text-[#9ca3af]" }`}>
                        {isToDateSet ? toDate.toDateString() : "Any date"}
                      </Text>
                      <ArrowDown2 size={20} className="text-[#9ca3af]" />
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      open={isToDatePickerOpen}
                      date={toDate}
                      mode="date"
                      onConfirm={date => {
                        setToDate(date);
                        setIsToDateSet(true);
                        setToDatePickerOpen(false);
                      }}
                      onCancel={() => setToDatePickerOpen(false)}
                    />
                  </View>
                </View>
              )}
            </View>

            <View>
              <Text
                aria-label="ItemName"
                nativeID="itemName"
                className="mt-6">
                Item name
              </Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                <TextInput
                  aria-label="ItemName"
                  aria-labelledby="itemName"
                  keyboardType="default"
                  placeholder="Enter name"
                  placeholderTextColor="#9ca3af"
                  className="h-[44px] text-base"
                  value={itemName}
                  onChangeText={setItemName}
                />
              </View>

              <Text
                aria-label="OrderNumber"
                nativeID="orderNumber"
                className="mt-6">
                Order number
              </Text>
              <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                <TextInput
                  aria-label="OrderNumber"
                  aria-labelledby="orderNumber"
                  keyboardType="default"
                  placeholder="Enter number"
                  placeholderTextColor="#9ca3af"
                  className="h-[44px] text-base"
                  value={orderNumber}
                  onChangeText={setOrderNumber}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleFilterResult()}
              className="h-[55px] w-auto mt-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen">
              <Text className="text-lg text-white mr-2">Filter Result</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleClearAll()}
              className="h-[50px] w-auto mt-3 flex flex-row items-center justify-center rounded-xl bg-gray-100">
              <Text className="text-base text-gray-700">Clear all filters</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
};
export default OrderFilterBottomSheetComponent;
