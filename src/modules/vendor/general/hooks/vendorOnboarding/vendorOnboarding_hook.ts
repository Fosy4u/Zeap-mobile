import { useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootState } from "../../../../../redux/store/store";
import RootNavigationStackModel from "../../../../../routes/model/routes_model";
import {
    resetOnboarding,
    setSelectedOnboardingStep,
} from "../../slices/vendorOnboardingState_slice";

export const TOTAL_ONBOARDING_STEPS = 9;
export type PickerType = "phoneCode" | "country" | "region" | "referral";

const useVendorOnboardingHook = () => {
    const { selectedStep, isSubmitting, loadingMessage } = useSelector((state: RootState) => state.vendorOnboardingState);
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const [activePicker, setActivePicker] = useState<PickerType | null>(null);

    const handleGoBack = () => {
        if (selectedStep > 1) {
            dispatch(setSelectedOnboardingStep(selectedStep - 1));
        }
    };

    const handleClose = () => {
        Alert.alert(
            "Exit onboarding?",
            "Your progress will be kept and you can resume from where you left off.",
            [
                { text: "Continue editing", style: "cancel" },
                {
                    text: "Exit",
                    style: "destructive",
                    onPress: () => navigation.goBack(),
                },
                {
                    text: "Discard & exit",
                    style: "destructive",
                    onPress: () => {
                        dispatch(resetOnboarding());
                        navigation.goBack();
                    },
                },
            ],
        );
    };

    const openPicker = (type: PickerType) => setActivePicker(type);
    const closePicker = () => setActivePicker(null);

    return {
        selectedStep,
        isSubmitting,
        loadingMessage,
        activePicker,
        openPicker,
        closePicker,
        handleGoBack,
        handleClose,
    };
};

export default useVendorOnboardingHook;
