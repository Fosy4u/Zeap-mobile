import React, { useEffect, useRef } from 'react'
import { Dimensions, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { setShowSelectGenderBottomSheet } from '../slices/measurement_slice';
import { useDispatch } from 'react-redux';

const SelectGenderBottomSheetComponent = () => {
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
    
    const handleCloseAddNewMeasurementBottomSheet = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                dispatch(setShowSelectGenderBottomSheet(false));
            });
        } else {
            dispatch(setShowSelectGenderBottomSheet(false));
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
                        <Text className="font-montserratMedium text-2xl text-gray-700">Kindly Provide Us Your Measurement</Text>

                        <TouchableOpacity 
                            onPress={ () => handleCloseAddNewMeasurementBottomSheet() }
                        >
                            <Image
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
                    <View className="flex-1 flex-col justify-between">
                        <TouchableOpacity 
                            onPress={ () => {
                            } }
                            className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-lg text-white mr-2">Add Male Template</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={ () => {
                            } }
                            className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-lg text-white mr-2">Add Female Template</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </SafeAreaView>
    );
}

export default SelectGenderBottomSheetComponent;