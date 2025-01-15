import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import AppHeaderComp from "../../general/components/appHeader_comp";
import StepOneComponent from "../components/addReadyMadeClothes/stepOne_component";
import {ArrowLeft, ArrowRight} from "iconsax-react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";
import StepTwoComponent from "../components/addReadyMadeClothes/stepTwo_component.tsx";
import StepThreeComponent from "../components/addReadyMadeClothes/stepThree_component.tsx";
import StepFourComponent from "../components/addReadyMadeClothes/stepFour_component.tsx";
import StepFiveComponent from "../components/addReadyMadeClothes/stepFive_component.tsx";
import StepSixComponent from "../components/addReadyMadeClothes/stepSix_component.tsx";
import WarningPopupModal from "../modals/warningPopup_modal.tsx";

const AddReadyMadeClothesScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const [selectedStep, setSelectedStep] = useState(1);
    const [showWarningModal, setShowWarningModal] = useState(false);

    const handleSaveAndContinue = () => {
        (selectedStep <= 5) && setSelectedStep(selectedStep + 1);
    };

    const handleGoBack = () => {
        (selectedStep >= 1) && setSelectedStep(selectedStep - 1);
    };

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-white">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />

            {/*==== Header ====*/}
            <AppHeaderComp title={`Add Readymade\nClothes`} />

            {/*==== Step Indicators ====*/}
            <View className="h-auto w-full px-5 pt-4 pb-2 flex-row gap-x-2">
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 1 ? "border-baseGreen bg-gray-50" : selectedStep > 1 ? "border-baseGreen bg-baseGreen" : "border-gray-100 bg-gray-50"}`} />
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 2 ? "border-baseGreen bg-gray-50" : selectedStep > 2 ? "border-baseGreen bg-baseGreen" : "border-gray-100 bg-gray-50"}`} />
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 3 ? "border-baseGreen bg-gray-50" : selectedStep > 3 ? "border-baseGreen bg-baseGreen" : "border-gray-100 bg-gray-50"}`} />
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 4 ? "border-baseGreen bg-gray-50" : selectedStep > 4 ? "border-baseGreen bg-baseGreen" : "border-gray-100 bg-gray-50"}`} />
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 5 ? "border-baseGreen bg-gray-50" : selectedStep > 5 ? "border-baseGreen bg-baseGreen" : "border-gray-100 bg-gray-50"}`} />
            </View>

            <ScrollView showsVerticalScrollIndicator={ false } className="h-full w-full px-5">

                { selectedStep === 1 ? (
                    <StepOneComponent />
                ) : (selectedStep === 2) ? (
                    <StepTwoComponent />
                ) : (selectedStep === 3) ? (
                    <StepThreeComponent />
                ) : (selectedStep === 4) ? (
                    <StepFourComponent />
                ) : (selectedStep === 5) ? (
                    <StepFiveComponent />
                ) : (
                    <StepSixComponent />
                ) }

                {/* ==== Cancel and Save & Continue ==== */}
                { selectedStep <= 5 ? (
                    <View className="h-auto w-full mt-8 flex-row">
                        <TouchableOpacity
                            onPress={ () => navigation.goBack() }
                            className="h-[55px] w-[35%] flex-row items-center justify-center rounded-xl bg-red-50"
                        >
                            <Text className="font-montserratMedium text-base text-red-700">Cancel</Text>
                        </TouchableOpacity>
                        <View className="w-[20px]" />

                        <TouchableOpacity
                            onPress={ () => handleSaveAndContinue() }
                            className="h-[55px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="mr-2 font-montserratRegular text-base text-white">Save & Continue</Text>
                            <ArrowRight size={ 18 } className="text-white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowWarningModal(true) }
                        className="h-[55px] flex-1 mt-8 flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                        <Text className="mr-2 font-montserratRegular text-base text-white">Submit</Text>
                        <ArrowRight size={ 18 } className="text-white" />
                    </TouchableOpacity>
                ) }

                { selectedStep > 1 && selectedStep <= 5 && (
                    <TouchableOpacity
                        onPress={ () => handleGoBack() }
                        className="h-[55px] w-full mt-5 flex-row items-center justify-center rounded-xl bg-lightGreen"
                    >
                        <ArrowLeft size={ 18 } className="text-baseGreen" />
                        <Text className="ml-2 font-montserratMedium text-base text-baseGreen">Go Back</Text>
                    </TouchableOpacity>
                ) }

                <View className="h-10" />
            </ScrollView>

            { showWarningModal &&
                <WarningPopupModal
                    bodyText="You have successfully created your account. Kindly proceed to setting up your account."
                    screenURL="profileSetupScreen"
                    setShowWarningModal={ setShowWarningModal }
                />
            }
        </SafeAreaView>
    )
}
export default AddReadyMadeClothesScreen;
