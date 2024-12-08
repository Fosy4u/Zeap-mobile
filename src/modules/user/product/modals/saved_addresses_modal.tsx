import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, Call, Location, Sms } from 'iconsax-react-native';
import React, { useRef, useEffect } from 'react';
import { View, Text, Dimensions, StatusBar, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { RootState } from '../../../../redux/store/store';

interface ISavedgAddresses {
    handleShowSavedAddressesModal: (value: boolean) => void;
}

const SavedAddressesModal = ({ handleShowSavedAddressesModal }: ISavedgAddresses) => {
    const { savedAddresses } = useSelector((state: RootState) => state.productState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight / 1.15;
    const slideAnimation = useRef<Animatable.View>(null);
    

    useEffect(() => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: modalHeight },
                1: { translateY: 0 }
            }, 1000);
        }
    }, [modalHeight]);

    const handleCloseSavedMeasurementModal = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                handleShowSavedAddressesModal(false);
            });
        } else {
            handleShowSavedAddressesModal(false);
        }
    };

    const handleGoToDeliveryAddressScreen = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                navigation.navigate("deliveryAddressScreen");
                handleShowSavedAddressesModal(false);
            });
        } else {
            navigation.navigate("deliveryAddressScreen");
            handleShowSavedAddressesModal(false);
        }
    };
    
    return (
        <SafeAreaView className="h-full w-full absolute bg-black/40">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />
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
                        onPress={ () => handleCloseSavedMeasurementModal() }
                        // onPress={ () => handleShowSavedAddressesModal(false) }
                    >
                        <Image
                            className="h-[30px] w-[30px]"
                        source={ require("../../../../assets/close.png") }
                        />
                    </TouchableOpacity>
                </View>
                <Text className="mt-2 font-Montserrat font-normal text-base text-gray-700">Select existing delivery address</Text>

                <View className="flex-1 flex-col justify-between">
                    <View>
                        { savedAddresses.map((savedAddress) => (
                            <View key={ savedAddress.id } className={`h-auto w-full mt-6 px-5 py-5 border ${ savedAddress.id === "01" ? "border-[#D5B07B] bg-[#FFFAF2]" : "border-gray-200 bg-[#F8F9FE]" } rounded-xl `}>
                                <View className="flex-row items-center justify-between">
                                    <Text className="font-Montserrat font-medium text-base text-gray-700">{ savedAddress.title }</Text>
                                    <TouchableOpacity>
                                        <Text>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                    
                                <View className="mt-4 flex-row items-center">
                                    <Call size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                    <Text>{ savedAddress.phone }</Text>
                                </View>
                    
                                <View className="mt-4 flex-row items-center">
                                    <Sms size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                    <Text>{ savedAddress.email }</Text>
                                </View>
                    
                                <View className="mt-4 flex-row items-center">
                                    <Location size={ 16 } variant="Bold" className="mr-2 text-baseGreen" />
                                    <Text>{ savedAddress.streetAddress }</Text>
                                </View>
                            </View>
                        )) }
                    </View>

                    <TouchableOpacity 
                        onPress={ () => {
                            handleShowSavedAddressesModal(false);
                            navigation.navigate("paymentMethodScreen");
                        } }
                        className="h-[55px] w-auto mt-7 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                        <Text className="text-lg text-white mr-2">Select Address</Text>
                        <ArrowRight className="text-white" />
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </SafeAreaView>
    )
}

export default SavedAddressesModal;