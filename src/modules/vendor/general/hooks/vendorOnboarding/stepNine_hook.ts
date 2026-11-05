import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootState } from "../../../../../redux/store/store";
import RootNavigationStackModel from "../../../../../routes/model/routes_model";
import {
    resetOnboarding,
    setOnboardingIsSubmitting,
    setOnboardingLoadingMessage,
    setSelectedOnboardingStep,
} from "../../slices/vendorOnboardingState_slice";
import { useLazyGetAuthShopQuery, useRegisterVendorMutation } from "../../apis/general_api";
import { setUserData } from "../../../../profile/slices/profileState_slice";
import { setPendingDestination } from "../../../../auths/slices/authState_slice";
import { setShop } from "../../slices/general_slice";

const useStepNineHook = () => {
    const { formData } = useSelector((state: RootState) => state.vendorOnboardingState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const [registerVendor] = useRegisterVendorMutation();
    const [getAuthShop] = useLazyGetAuthShopQuery();

    const handleJumpToStep = (step: number) => {
        if (step >= 1 && step <= 8) {
            dispatch(setSelectedOnboardingStep(step));
        }
    };

    const finishOnboarding = async (createdShop?: any) => {
        dispatch(setOnboardingLoadingMessage("Fetching your shop details..."));
        const authShop = await getAuthShop().unwrap().catch(() => createdShop);
        dispatch(setShop(authShop));

        if (userData) {
            dispatch(setUserData({
                ...userData,
                isVendor: true,
                shopId: authShop?.shopId || createdShop?.shopId || userData.shopId,
            }));
        }

        dispatch(resetOnboarding());

        navigation.reset({
            index: 0,
            routes: [{ name: "vendorWelcomeScreen" }],
        });
    };

    const onSubmit = async () => {
        if (!userData?.uid || userData?.isGuest) {
            Alert.alert(
                "Sign in required",
                "Please sign in to your Zeaper account before registering your shop. Your details are saved — you'll come straight back here after signing in.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Sign In",
                        onPress: () => {
                            dispatch(setPendingDestination({ name: "vendorRegistrationScreen" }));
                            navigation.navigate("loginScreen");
                        },
                    },
                ],
            );
            return;
        }

        dispatch(setOnboardingLoadingMessage("Submitting your shop details..."));
        dispatch(setOnboardingIsSubmitting(true));

        try {
            const payload = {
                shopName: formData.businessName,
                email: formData.businessEmail,
                phoneNumber: `${ formData.businessPhoneCode }${ formData.businessPhone }`,
                address: formData.address,
                region: formData.region,
                country: formData.country,
                social: {
                    website: formData.website || "",
                    facebook: formData.facebook || "",
                    instagram: formData.instagram || "",
                    twitter: formData.twitter || "",
                    linkedin: formData.linkedin || "",
                    tikTok: formData.tiktok || "",
                },
                isTailor: !!formData.isTailor,
                isShoeMaker: !!formData.isShoeMaker,
                bankDetails: {
                    accountNumber: formData.accountNumber,
                    bankName: formData.bankName,
                    accountName: formData.accountName,
                },
                source: formData.referralSource,
            };

            const createdShop = await registerVendor(payload).unwrap();
            await finishOnboarding(createdShop);
        } catch (error: any) {
            console.log("[stepNine] registerVendor failed::: ", JSON.stringify(error, null, 2));

            const status = error?.status;
            const data = error?.data;
            const backendMessage =
                (typeof data === "string" && data) ||
                data?.message ||
                data?.error ||
                (Array.isArray(data?.errors) ? data.errors[0]?.message || data.errors[0] : undefined) ||
                (Array.isArray(error?.errors) ? error.errors[0] : undefined) ||
                error?.error ||
                error?.message;

            const alreadyHasShop =
                status === 409 ||
                /already has a shop|shop already exists|already a vendor/i.test(String(backendMessage ?? ""));
            if (alreadyHasShop) {
                try {
                    await finishOnboarding();
                    return;
                } catch (recoverError) {
                    console.log("[stepNine] already-has-shop recovery failed::: ", JSON.stringify(recoverError, null, 2));
                }
            }

            let alertMessage: string;
            if (status === 401 || status === 403) {
                alertMessage = "Please log in or refresh your session before registering a shop.";
            } else if (status === "FETCH_ERROR") {
                alertMessage = "Couldn't reach Zeaper. Check your internet connection and try again.";
            } else if (backendMessage) {
                alertMessage = status ? `${ backendMessage } (HTTP ${ status })` : backendMessage;
            } else {
                alertMessage = status
                    ? `Could not complete your shop registration (HTTP ${ status }). Please try again.`
                    : "Could not complete your shop registration. Please try again.";
            }

            Alert.alert("Registration failed", alertMessage);
        } finally {
            dispatch(setOnboardingIsSubmitting(false));
            dispatch(setOnboardingLoadingMessage(""));
        }
    };

    return {
        formData,
        onSubmit,
        handleJumpToStep,
    };
};

export default useStepNineHook;
