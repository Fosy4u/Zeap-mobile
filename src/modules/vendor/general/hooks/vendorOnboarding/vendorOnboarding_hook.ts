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

    // Leave the onboarding stack reliably — goBack() is a no-op when this
    // screen is the root of its stack, so fall back to the app home then.
    const leaveOnboarding = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.reset({ index: 0, routes: [{ name: "homeScreen" }] });
        }
    };

    const handleClose = () => {
        Alert.alert(
            "Discard and exit?",
            "Your progress won't be saved. You'll have to start over next time.",
            [
                { text: "Continue editing", style: "cancel" },
                {
                    text: "Discard & exit",
                    style: "destructive",
                    onPress: () => {
                        dispatch(resetOnboarding());
                        leaveOnboarding();
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
