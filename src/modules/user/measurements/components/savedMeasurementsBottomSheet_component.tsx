import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight } from 'iconsax-react-native';
import React, { useRef, useEffect } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { setSelectedMeasurementTemplate, setShowSavedMeasurementBottomSheet } from '../slices/measurement_slice.ts';
import useMeasurementHook from '../hooks/measurement_hook.ts';


const SavedMeasurementsBottomSheet = () => {
    const { allBodyMeasurementTemplates, selectedMeasurementTemplate } = useSelector((state: RootState) => state.measurementState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight / 1.15;
    const slideAnimation = useRef<Animatable.View>(null);
    const dispatch = useDispatch<AppDispatch>();

    const { onSubmitFromSavedMeasurementTemplate } = useMeasurementHook();
    

    useEffect(() => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: modalHeight },
                1: { translateY: 0 }
            }, 1000);
        }
    }, [modalHeight]);

    const handleCloseSavedMeasurementBottomSheet = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                dispatch(setShowSavedMeasurementBottomSheet(false));
            });
        } else {
            dispatch(setShowSavedMeasurementBottomSheet(false));
        }
    };

    const handleGoToDeliveryAddressScreen = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                navigation.navigate("deliveryAddressScreen");
                dispatch(setShowSavedMeasurementBottomSheet(false));
            });
        } else {
            navigation.navigate("deliveryAddressScreen");
            dispatch(setShowSavedMeasurementBottomSheet(false));
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
                    <Text className="font-Montserrat font-medium text-2xl text-gray-700">Existing Measurement</Text>

                    <TouchableOpacity 
                        onPress={ () => handleCloseSavedMeasurementBottomSheet() }
                        // onPress={ () => handleShowSavedMeasurementBottomSheet(false) }
                    >
                        <Image
                            className="h-[30px] w-[30px]"
                        source={ require("../../../../../assets/images/close.png") }
                        />
                    </TouchableOpacity>
                </View>
                <Text className="my-2 font-Montserrat font-normal text-base text-gray-700">Select your preferred measurement</Text>

                <ScrollView showsVerticalScrollIndicator={ false }>
                    <View className="flex-1 flex-col justify-between">
                        <View>
                            { allBodyMeasurementTemplates?.map((measurementTemplate, index) => (
                                <TouchableOpacity 
                                    onPress={ () => dispatch(setSelectedMeasurementTemplate(measurementTemplate)) }
                                    key={ measurementTemplate._id! } 
                                    className={`h-auto w-full mt-4 px-5 py-5 border ${ measurementTemplate._id! === selectedMeasurementTemplate._id! ? "border-[#D5B07B] bg-[#FFFAF2]" : "border-gray-200 bg-[#F8F9FE]" } rounded-xl`}>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="font-montserratSemiBold text-lg text-gray-700">{ measurementTemplate.templateName! }</Text>
                                        <TouchableOpacity>
                                            <Text>Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View  className="mt-2">
                                        { allBodyMeasurementTemplates?.[index].measurements!.map((measurement) => (
                                            <View key={ measurement._id! } className="h-auto w-full mt-2">
                                                <Text className="mt-2 font-montserratSemiBold text-base text-gray-700">
                                                    { measurement.name!.charAt(0).toUpperCase() + measurement.name!.slice(1) }
                                                </Text>


                                                <View className="h-auto w-full flex-row flex-wrap items-center gap-x-8">
                                                    { measurement.measurements!.map((measurementItem) => (
                                                        <Text key={ measurementItem._id! }
                                                            className="my-1 font-Montserrat font-normal text-base text-gray-700"
                                                        >
                                                            { `${measurementItem?.field!.charAt(0).toUpperCase() + measurementItem.field!.slice(1)}: ${measurementItem?.value}` }
                                                        </Text>
                                                    )) }
                                                </View>
                                            </View>
                                        )) }
                                    </View>
                                </TouchableOpacity>
                            )) }
                        </View>

                        <TouchableOpacity 
                            onPress={ () => {
                                dispatch(setShowSavedMeasurementBottomSheet(false));
                                onSubmitFromSavedMeasurementTemplate();
                            } }
                            className="h-[55px] w-auto mt-7 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-lg text-white mr-2">Proceed</Text>
                            <ArrowRight className="text-white" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </SafeAreaView>
    )
}

export default SavedMeasurementsBottomSheet;