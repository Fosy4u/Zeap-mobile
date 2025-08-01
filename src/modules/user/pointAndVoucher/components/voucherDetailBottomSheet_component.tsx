import React, { useEffect, useRef } from "react";
import { Dimensions, SafeAreaView, ScrollView, Text,  ToastAndroid,  TouchableOpacity,  View } from "react-native";
import { RootState } from "../../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Copy } from "iconsax-react-native";
import Clipboard from '@react-native-clipboard/clipboard';
import formatDate from "../../../../utils/formatDate";
import * as Animatable from 'react-native-animatable';
import LinearGradient from "react-native-linear-gradient";
import { setShowVoucherDetailBottomSheet } from "../slices/pointAndVoucher_slice";


const VoucherDetailBottomSheetComponent = () => {
    const { selectedVoucher } = useSelector((state: RootState) => state.pointAndVoucherState);
    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight / 2.0;
    const slideAnimation = useRef<Animatable.View>(null);
    const dispatch = useDispatch();

    useEffect(() => {
            if (slideAnimation.current) {
                slideAnimation.current.animate({
                    0: { translateY: modalHeight },
                    1: { translateY: 0 }
                }, 1000);
            }
        }, [modalHeight]);
        
        const handleCloseVoucherDetailBottomSheet = () => {
            if (slideAnimation.current) {
                slideAnimation.current.animate({
                    0: { translateY: 0, opacity: 1 },
                    1: { translateY: modalHeight, opacity: 0 }
                }, 500).then(() => {
                    dispatch(setShowVoucherDetailBottomSheet(false));
                });
            } else {
                dispatch(setShowVoucherDetailBottomSheet(false));
            }
        };
    
    return (

        <SafeAreaView className="h-full w-full absolute bg-black/40">
            <Animatable.View 
                ref={slideAnimation}
                className="w-full px-5 pt-7 pb-5 absolute bottom-0 bg-white"
                style={{ 
                    height: modalHeight,
                    transform: [{ translateY: modalHeight }]
                }}
            >
                <View>
                    <View className="h-auto w-full flex-row items-start justify-between">
                        <Text className="font-montserratMedium text-2xl text-gray-700">Voucher Details</Text>

                        <TouchableOpacity 
                            onPress={ () => handleCloseVoucherDetailBottomSheet() }
                        >
                            <Animatable.Image
                                className="h-[30px] w-[30px]"
                            source={ require("../../../../../assets/images/close.png") }
                            />
                        </TouchableOpacity>
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

                <ScrollView showsVerticalScrollIndicator={ false }>
                    <View className="h-auto w-full mt-10 px-5 ">
                        <View className="h-auto w-full px-5 py-6 items-center justify-center border border-[#FFE9C9] rounded-xl bg-lightGold">
                            <Text className="text-[16px] text-gray-700 ">Your voucher code</Text>
                            <View className="h-auto w-full mt-3 flex-row items-center justify-center">
                                <Text className="mt-1 mr-3 font-montserratSemiBold text-lg text-gray-700 ">{ selectedVoucher.code }</Text>
                                <Copy
                                    size="24"
                                    color="#000000"
                                    variant="Bold"
                                    className="mt-2"
                                    onPress={() => {
                                        if (selectedVoucher?.code) {
                                            Clipboard.setString(selectedVoucher.code);
                                            ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
                                        }
                                    }}
                                />
                            </View>
                        </View>

                        <Text className="mt-5 font-montserratMedium text-center text-sm text-gray-600">Valid till { formatDate(selectedVoucher.expiryDate, true) }</Text>
                    </View>
                </ScrollView>
            </Animatable.View>
        </SafeAreaView>
    );
};

export default VoucherDetailBottomSheetComponent;