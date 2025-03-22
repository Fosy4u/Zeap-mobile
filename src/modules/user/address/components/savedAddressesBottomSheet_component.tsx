import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, Call, Location, Map, Sms } from 'iconsax-react-native';
import React, { useRef, useEffect } from 'react';
import { View, Text, Dimensions, StatusBar, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { setSelectedAddress, setShowSavedAddressesBottomSheet } from '../slices/address_slice.ts';


const SavedAddressesBottomSheet = () => {
    const { allSavedAddresses, selectedAddress } = useSelector((state: RootState) => state.addressState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight / 1.15;
    const slideAnimation = useRef<Animatable.View>(null);
    const dispatch = useDispatch<AppDispatch>();
    
    

    useEffect(() => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: modalHeight },
                1: { translateY: 0 }
            }, 1000);
        }
    }, [modalHeight]);

    const handleCloseSavedMAddressBottomSheet = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                dispatch(setShowSavedAddressesBottomSheet(false));
            });
        } else {
            dispatch(setShowSavedAddressesBottomSheet(false));
        }
    };

    const handleGoToDeliveryAddressScreen = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                navigation.navigate("deliveryAddressScreen");
                dispatch(setShowSavedAddressesBottomSheet(false));
            });
        } else {
            navigation.navigate("deliveryAddressScreen");
            dispatch(setShowSavedAddressesBottomSheet(false));
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
                <View className="h-auto w-full flex-row items-center justify-between">
                    <Text className="font-Montserrat font-medium text-2xl text-gray-700">Existing Addresses</Text>

                    <TouchableOpacity 
                        onPress={ () => handleCloseSavedMAddressBottomSheet() }
                    >
                        <Image
                            className="h-[30px] w-[30px]"
                        source={ require("../../../../../assets/images/close.png") }
                        />
                    </TouchableOpacity>
                </View>
                <Text className="my-2 font-Montserrat font-normal text-base text-gray-700">Select existing delivery address</Text>

                <ScrollView showsVerticalScrollIndicator={ false }>
                    <View className="flex-1 flex-col justify-between">
                        <View>
                            { allSavedAddresses.map((savedAddress) => (
                                <TouchableOpacity 
                                    onPress={ () => dispatch(setSelectedAddress(savedAddress)) }
                                    key={ savedAddress._id! } 
                                    className={`h-auto w-full mt-4 px-5 py-5 border ${ savedAddress._id! === selectedAddress._id! ? "border-[#D5B07B] bg-[#FFFAF2]" : "border-gray-200 bg-[#F8F9FE]" } rounded-xl `}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <Text className="font-Montserrat font-medium text-base text-gray-700">{ savedAddress.user! }</Text>
                                        <TouchableOpacity>
                                            <Text>Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                        
                                    <View className="mt-4 flex-row items-center">
                                        <Call size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                        <Text>{ savedAddress.phoneNumber! }</Text>
                                    </View>
                        
                                    <View className="mt-4 flex-row items-center">
                                        <Location size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                        <Text>{ savedAddress.address! }</Text>
                                    </View>
                        
                                    <View className="mt-4 flex-row items-center">
                                        <Map size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                        <Text>{ savedAddress.region! }</Text>
                                    </View>
                                </TouchableOpacity>
                            )) }
                        </View>

                        <TouchableOpacity 
                            onPress={ () => {
                                dispatch(setShowSavedAddressesBottomSheet(false));
                                navigation.navigate("userPaymentScreen");
                            } }
                            className="h-[55px] w-auto mt-7 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-lg text-white mr-2">Select Address</Text>
                            <ArrowRight className="text-white" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </SafeAreaView>
    )
}

export default SavedAddressesBottomSheet;