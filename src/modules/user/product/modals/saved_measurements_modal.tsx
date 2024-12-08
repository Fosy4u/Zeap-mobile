import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight } from 'iconsax-react-native';
import React, { useRef, useEffect } from 'react';
import { View, Text, Dimensions, StatusBar, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { RootState } from '../../../../redux/store/store';

interface ISavedgMeasurement {
    handleShowSavedMeasurementModal: (value: boolean) => void;
}

const SavedMeasurementsModal = ({ handleShowSavedMeasurementModal }: ISavedgMeasurement) => {
    const { savedMeasurements } = useSelector((state: RootState) => state.productState);
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
                handleShowSavedMeasurementModal(false);
            });
        } else {
            handleShowSavedMeasurementModal(false);
        }
    };

    const handleGoToDeliveryAddressScreen = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                navigation.navigate("deliveryAddressScreen");
                handleShowSavedMeasurementModal(false);
            });
        } else {
            navigation.navigate("deliveryAddressScreen");
            handleShowSavedMeasurementModal(false);
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
                    <Text className="font-Montserrat font-medium text-2xl text-gray-700">Existing Measurement</Text>

                    <TouchableOpacity 
                        onPress={ () => handleCloseSavedMeasurementModal() }
                        // onPress={ () => handleShowSavedMeasurementModal(false) }
                    >
                        <Image
                            className="h-[30px] w-[30px]"
                        source={ require("../../../../assets/close.png") }
                        />
                    </TouchableOpacity>
                </View>
                <Text className="mt-2 font-Montserrat font-normal text-base text-gray-700">Select your preferred measurement</Text>

                <View className="flex-1 flex-col justify-between">
                    <View>
                        { savedMeasurements.map((savedMeasurement) => (
                            <View key={ savedMeasurement.id } className="h-auto w-full mt-6 px-5 py-5 border border-gray-200 rounded-xl bg-[#F8F9FE]">
                                <View className="flex-row items-center justify-between">
                                    <Text className="font-Montserrat font-medium text-base text-gray-700">{ savedMeasurement.title }</Text>
                                    <TouchableOpacity>
                                        <Text>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                                <View  className="mt-2 flex-row items-center flex-wrap gap-x-6">
                                    { savedMeasurement.items.map((item, index) => (
                                        <Text key={ index } className="mt-2 font-Montserrat font-normal text-base text-gray-700">{ item }</Text>
                                    )) }
                                </View>
                            </View>
                        )) }
                    </View>

                    <TouchableOpacity 
                        onPress={ () => {
                            handleShowSavedMeasurementModal(false);
                            navigation.navigate("deliveryAddressScreen");
                        } }
                        className="h-[55px] w-auto mt-7 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                        <Text className="text-lg text-white mr-2">Select Measurement</Text>
                        <ArrowRight className="text-white" />
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </SafeAreaView>
    )
}

export default SavedMeasurementsModal;