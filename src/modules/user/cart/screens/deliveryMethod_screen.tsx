import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, Call, Location, Map, Trash, Edit2, ArrowDown2, ArrowLeft } from 'iconsax-react-native';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, StatusBar } from 'react-native';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { Controller, set } from 'react-hook-form';
import AppLoader from '../../../general/components/appLoader.tsx';
import CheckBox from '@react-native-community/checkbox';
import countries from "../../../../utils/deliveryCountries.json";
import { SelectList } from 'react-native-dropdown-select-list';
import { DeliveryFee } from '../../address/models/deliveryMethod_model.ts';
import { setSelectedAddress } from '../../address/slices/address_slice.ts';
import { setSelectedDeliveryFee } from '../slices/cart_slice.ts';

const DeliveryMethodScreen = () => {
    const { deliveryMethod, selectedDeliveryFee, isLoading, loadingMessage } = useSelector((state: RootState) => state.cartState);
    const { userData } = useSelector((state: RootState) => state.profileState );
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch<AppDispatch>();
    
    return (
        <SafeAreaView className="h-full w-full absolute flex-1 bg-lightGray">
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
            />

            {/*==== Header ====*/}
            <View className="h-auto w-full px-[20px] flex-row items-center justify-between">
                <TouchableOpacity onPress={ () => navigation.pop() }>
                    <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                    <ArrowLeft color="white" />
                    </View>
                </TouchableOpacity>
                <Text className="font-montserratSemiBold text-lg text-baseGreen">Addresses</Text>
                <View className="h-[40px] w-[40px]" />
            </View>

            <ScrollView showsVerticalScrollIndicator={ false }>
                <View className="pt-[30px] pb-5 px-[20px]">
                    <Text className="my-2 font-Montserrat font-normal text-base text-gray-700">Select delivery method</Text>

                    { deliveryMethod.deliveryFees.map((deliveryFee: DeliveryFee) => (
                        <TouchableOpacity 
                            onPress={ () => {
                                dispatch(setSelectedDeliveryFee(deliveryFee));
                            } }
                            key={ deliveryFee.label! } 
                            className={`h-auto w-full mt-4 px-5 py-5 relative border ${ deliveryFee.method! === selectedDeliveryFee?.method ? "border-[#D5B07B] bg-[#FFFAF2]" : "border-gray-200 bg-[#F8F9FE]" } rounded-xl `}
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="mt-2">
                                    <Text className="font-montserratSemiBold">{ deliveryFee.method!.charAt(0).toUpperCase() + deliveryFee.method!.slice(1) }</Text>
                                    <Text className="font-montserratMedium text-sm">{ deliveryFee.label! }</Text>
                                </View> 
                                <View className="flex-row items-center space-x-2">
                                    <TouchableOpacity>
                                        <Edit2 color="#305CDE" size={ 18 } variant="Bold" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={ () => null } >
                                        <Trash color="#AA1F1F" size={18} variant="Bold" className="ml-2" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )) }
                </View>
            </ScrollView>

            { isLoading && <AppLoader loadingAdditionalMessage={ loadingMessage } /> }
        </SafeAreaView>
    )
}

export default DeliveryMethodScreen;