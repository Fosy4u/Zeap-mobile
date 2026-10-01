import React, { useMemo } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ArrowLeft, ArrowRight } from "iconsax-react-native";
import AppLoader from "../../../general/components/appLoader";
// `phoneCodes` still drives the dial-code picker on step 3; the country picker
// on step 4 now derives its options from country-state-city via stepFour hook.

import useVendorOnboardingHook, { TOTAL_ONBOARDING_STEPS } from "../hooks/vendorOnboarding/vendorOnboarding_hook";
import useStepOneHook from "../hooks/vendorOnboarding/stepOne_hook";
import useStepTwoHook from "../hooks/vendorOnboarding/stepTwo_hook";
import useStepThreeHook from "../hooks/vendorOnboarding/stepThree_hook";
import useStepFourHook from "../hooks/vendorOnboarding/stepFour_hook";
import useStepFiveHook from "../hooks/vendorOnboarding/stepFive_hook";
import useStepSixHook from "../hooks/vendorOnboarding/stepSix_hook";
import useStepSevenHook from "../hooks/vendorOnboarding/stepSeven_hook";
import useStepEightHook from "../hooks/vendorOnboarding/stepEight_hook";
import useStepNineHook from "../hooks/vendorOnboarding/stepNine_hook";

import StepOneComponent from "../components/vendorOnboarding/stepOne_component";
import StepTwoComponent from "../components/vendorOnboarding/stepTwo_component";
import StepThreeComponent from "../components/vendorOnboarding/stepThree_component";
import StepFourComponent from "../components/vendorOnboarding/stepFour_component";
import StepFiveComponent from "../components/vendorOnboarding/stepFive_component";
import StepSixComponent from "../components/vendorOnboarding/stepSix_component";
import StepSevenComponent from "../components/vendorOnboarding/stepSeven_component";
import StepEightComponent from "../components/vendorOnboarding/stepEight_component";
import StepNineComponent from "../components/vendorOnboarding/stepNine_component";

import OnboardingPickerModal, { IPickerOption } from "../components/vendorOnboarding/onboardingPicker_modal";
import phoneCodes from "../../../../utils/countriesPhoneCodes.json";

interface IPhoneCode {
    name: string;
    dial_code: string;
    code: string;
    emoji?: string;
}

const REFERRAL_OPTIONS: IPickerOption[] = [
    { label: "Google",            value: "google" },
    { label: "Facebook",          value: "facebook" },
    { label: "Instagram",         value: "instagram" },
    { label: "Twitter",           value: "twitter" },
    { label: "LinkedIn",          value: "linkedin" },
    { label: "TikTok",            value: "tiktok" },
    { label: "Friend or Family",  value: "friend_or_family" },
    { label: "Other",             value: "other" },
];

const VendorRegistrationScreen = () => {
    const {
        selectedStep,
        isSubmitting,
        loadingMessage,
        activePicker,
        openPicker,
        closePicker,
        handleGoBack,
        handleClose,
    } = useVendorOnboardingHook();

    // All step hooks are instantiated up-front so form state survives Back/Next
    // navigation and the orchestrator can drive setValue from picker modals.
    const stepOne   = useStepOneHook();
    const stepTwo   = useStepTwoHook();
    const stepThree = useStepThreeHook();
    const stepFour  = useStepFourHook();
    const stepFive  = useStepFiveHook();
    const stepSix   = useStepSixHook();
    const stepSeven = useStepSevenHook();
    const stepEight = useStepEightHook();
    const stepNine  = useStepNineHook();

    const phoneCodeOptions = useMemo<IPickerOption[]>(
        () => (phoneCodes as IPhoneCode[]).map((c) => ({
            label: `${ c.emoji ?? "🏳" }  ${ c.name }`,
            value: c.dial_code,
            sublabel: c.dial_code,
        })),
        [],
    );

    // Per-step gate for the Continue button. A step's own react-hook-form
    // `isValid` (all use mode: "onChange" + a yup resolver) tells us whether
    // every required field is filled and valid:
    //   • Steps 1–5: all fields required → disabled until valid.
    //   • Step 6 (socials): every field optional → isValid is true when empty
    //     (acts as "skip"), but flips false the moment an entry breaks format.
    //   • Step 7: disabled until the terms checkbox is ticked.
    //   • Step 8: disabled until a referral source is selected.
    //   • Step 9 (review): always enabled — it's the submit screen.
    const stepValidity: Record<number, boolean> = {
        1: stepOne.isValid,
        2: stepTwo.isValid,
        3: stepThree.isValid,
        4: stepFour.isValid,
        5: stepFive.isValid,
        6: stepSix.isValid,
        7: stepSeven.isValid,
        8: stepEight.isValid,
        9: true,
    };
    const canProceed = stepValidity[selectedStep] ?? true;

    const handleNext = () => {
        switch (selectedStep) {
            case 1: stepOne.handleSubmit(stepOne.onSubmit)(); break;
            case 2: stepTwo.handleSubmit(stepTwo.onSubmit)(); break;
            case 3: stepThree.handleSubmit(stepThree.onSubmit)(); break;
            case 4: stepFour.handleSubmit(stepFour.onSubmit)(); break;
            case 5: stepFive.handleSubmit(stepFive.onSubmit)(); break;
            case 6: stepSix.handleSubmit(stepSix.onSubmit)(); break;
            case 7: stepSeven.handleSubmit(stepSeven.onSubmit)(); break;
            case 8: stepEight.handleSubmit(stepEight.onSubmit)(); break;
            case 9: stepNine.onSubmit(); break;
        }
    };

    const handlePickerSelect = (option: IPickerOption) => {
        const setOpts = { shouldValidate: true, shouldDirty: true, shouldTouch: true };
        if (activePicker === "phoneCode") {
            stepThree.setValue("businessPhoneCode", option.value, setOpts);
        }
        if (activePicker === "country") {
            // Picking a new country invalidates the previously-chosen region,
            // so we clear it to force the user back through the region picker.
            stepFour.setValue("country", option.value, setOpts);
            stepFour.setValue("region", "", setOpts);
        }
        if (activePicker === "region") {
            stepFour.setValue("region", option.value, setOpts);
        }
        if (activePicker === "referral") {
            stepEight.setValue("referralSource", option.value, setOpts);
        }
    };

    const renderStep = () => {
        switch (selectedStep) {
            case 1: return <StepOneComponent   control={ stepOne.control }   errors={ stepOne.errors } />;
            case 2: return <StepTwoComponent   control={ stepTwo.control }   errors={ stepTwo.errors } />;
            case 3: return <StepThreeComponent control={ stepThree.control } errors={ stepThree.errors } onOpenPhoneCodePicker={ () => openPicker("phoneCode") } />;
            case 4: return (
                <StepFourComponent
                    control={ stepFour.control }
                    errors={ stepFour.errors }
                    onOpenCountryPicker={ () => openPicker("country") }
                    onOpenRegionPicker={ () => openPicker("region") }
                    hasCountrySelected={ !!stepFour.selectedCountry }
                />
            );
            case 5: return <StepFiveComponent  control={ stepFive.control }  errors={ stepFive.errors } />;
            case 6: return <StepSixComponent   control={ stepSix.control }   errors={ stepSix.errors } />;
            case 7: return <StepSevenComponent control={ stepSeven.control } errors={ stepSeven.errors } policies={ stepSeven.policies } isLoadingPolicies={ stepSeven.isLoadingPolicies } />;
            case 8: return <StepEightComponent control={ stepEight.control } errors={ stepEight.errors } onOpenReferralPicker={ () => openPicker("referral") } />;
            case 9: return <StepNineComponent  formData={ stepNine.formData } onJumpToStep={ stepNine.handleJumpToStep } />;
            default: return null;
        }
    };

    const pickerProps = (() => {
        if (activePicker === "phoneCode") {
            return { title: "Select dial code", options: phoneCodeOptions, selectedValue: stepThree.control._formValues?.businessPhoneCode };
        }
        if (activePicker === "country") {
            return { title: "Select country", options: stepFour.countryOptions, selectedValue: stepFour.control._formValues?.country };
        }
        if (activePicker === "region") {
            return { title: "Select region / state", options: stepFour.regionOptions, selectedValue: stepFour.control._formValues?.region };
        }
        if (activePicker === "referral") {
            return { title: "How did you hear about us?", options: REFERRAL_OPTIONS, selectedValue: stepEight.control._formValues?.referralSource };
        }
        return null;
    })();

    return (
        <View className="flex-1 bg-white">
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

            <SafeAreaView className="flex-1">
                {/*==== Top chrome ====*/}
                <View className="px-5 pt-3">
                    <View className="h-10 flex-row items-center justify-between">
                        <View className="h-10 w-10" />

                        <View className="px-3 py-1.5 rounded-full bg-gray-100">
                            <Text className="font-montserratSemiBold text-[11px] text-gray-700">
                                Step { selectedStep } of { TOTAL_ONBOARDING_STEPS }
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={ handleClose }
                            className="h-10 w-10 items-center justify-center rounded-full bg-baseGreen"
                        >
                            <Text className="font-montserratBold text-base text-white">✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/*==== Segmented progress bar ====*/}
                    <View className="mt-6 flex-row gap-x-1.5">
                        { Array.from({ length: TOTAL_ONBOARDING_STEPS }).map((_, i) => (
                            <View
                                key={ i }
                                className={ `flex-1 h-1.5 rounded-full ${ i + 1 <= selectedStep ? "bg-gold" : "bg-gray-200" }` }
                            />
                        )) }
                    </View>
                </View>

                {/*==== Step body ====*/}
                <KeyboardAvoidingView
                    behavior={ Platform.OS === "ios" ? "padding" : undefined }
                    className="flex-1"
                >
                    <ScrollView
                        showsVerticalScrollIndicator={ false }
                        contentContainerStyle={{ paddingTop: 20, paddingBottom: 140 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        { renderStep() }
                    </ScrollView>
                </KeyboardAvoidingView>

                {/*==== Sticky action bar ====*/}
                <View
                    className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-6 bg-white border-t border-gray-100"
                    style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: -2 }, elevation: 8 }}
                >
                    {/* Socials (step 6) are optional — let the vendor skip straight ahead. */}
                    { selectedStep === 6 && (
                        <TouchableOpacity
                            onPress={ stepSix.handleSkip }
                            disabled={ isSubmitting }
                            className="mb-3 h-11 flex-row items-center justify-center rounded-2xl"
                        >
                            <Text className="font-montserratSemiBold text-base text-gray-500 underline">Skip for now</Text>
                        </TouchableOpacity>
                    ) }

                    <View className="flex-row gap-x-3">
                        { selectedStep > 1 && (
                            <TouchableOpacity
                                onPress={ handleGoBack }
                                disabled={ isSubmitting }
                                className="px-6 h-14 flex-row items-center justify-center rounded-2xl bg-gray-50 border border-gray-100"
                            >
                                <ArrowLeft size={ 16 } color="#133522" />
                                <Text className="ml-2 font-montserratSemiBold text-base text-baseGreen">Back</Text>
                            </TouchableOpacity>
                        ) }

                        <TouchableOpacity
                            onPress={ handleNext }
                            disabled={ isSubmitting || !canProceed }
                            activeOpacity={ 0.85 }
                            className={ `flex-1 h-14 flex-row items-center justify-center rounded-2xl bg-baseGreen ${ (isSubmitting || !canProceed) ? "opacity-60" : "" }` }
                        >
                            { isSubmitting ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <>
                                    <Text className="font-montserratBold text-base text-white">
                                        { selectedStep === TOTAL_ONBOARDING_STEPS ? "Submit" : "Continue" }
                                    </Text>
                                    <View className="w-2" />
                                    <ArrowRight size={ 16 } color="#ffffff" />
                                </>
                            ) }
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/*==== Pickers ====*/}
            { pickerProps && (
                <OnboardingPickerModal
                    visible
                    title={ pickerProps.title }
                    options={ pickerProps.options }
                    selectedValue={ pickerProps.selectedValue }
                    searchable={ activePicker !== "referral" }
                    onSelect={ handlePickerSelect }
                    onClose={ closePicker }
                />
            ) }

            {/*==== Full-screen loading overlay during submission ====*/}
            { isSubmitting && (
                <AppLoader loadingAdditionalMessage={ loadingMessage || "Submitting your shop details..." } />
            ) }
        </View>
    );
};

export default VendorRegistrationScreen;
