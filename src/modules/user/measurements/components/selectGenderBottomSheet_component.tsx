import React from 'react'
import { Dimensions, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { setSelectedGender, setShowAddNewMeasurementBottomSheet, setShowSelectGenderBottomSheet } from '../slices/measurement_slice';
import { useDispatch } from 'react-redux';
import useMeasurementHook from '../hooks/measurement_hook';

const SelectGenderBottomSheetComponent = () => {
    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight / 2.0;
    const dispatch = useDispatch();
    const { handleGetBodyMeasurementGuides, handleGetRequiredMeasurementFormFields } = useMeasurementHook();

    const handleCloseAddNewMeasurementBottomSheet = () => {
        dispatch(setShowSelectGenderBottomSheet(false));
    };

    const handleSelectGender = async (gender: "male" | "female") => {
        // Persist the selected gender so the save-template payload can include
        // it. The backend rejects the template create call without it.
        dispatch(setSelectedGender(gender));

        // Close the gender sheet immediately — the fetch hooks set isLoading
        // so the screen-level AppLoader becomes visible right away while the
        // guide + form fields are fetched in parallel.
        dispatch(setShowSelectGenderBottomSheet(false));
        await Promise.all([
            handleGetBodyMeasurementGuides(gender),
            handleGetRequiredMeasurementFormFields(),
        ]);
        dispatch(setShowAddNewMeasurementBottomSheet(true));
    };
    
    return (
        <SafeAreaView className="h-full w-full absolute bg-black/40">

           <View
                className="w-full px-5 pt-7 pb-5 absolute bottom-0 bg-white"
                style={{ height: modalHeight }}
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
                            onPress={ () => handleSelectGender("male") }
                            className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-lg text-white mr-2">Add Male Template</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={ () => handleSelectGender("female") }
                            className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="text-lg text-white mr-2">Add Female Template</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default SelectGenderBottomSheetComponent;