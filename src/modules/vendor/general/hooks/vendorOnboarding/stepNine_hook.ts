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

    const onSubmit = async () => {
        // Auth guard: /shop/create is an authed-only endpoint, so guests +
        // anonymous Firebase sessions would 401. Fail fast with a clear
        // message instead of letting the request round-trip and surface a
        // generic backend error. Their stepper draft is preserved (we don't
        // resetOnboarding here), so they can sign in and resubmit.
        if (!userData?.uid || userData?.isGuest) {
            Alert.alert(
                "Sign in required",
                "Please sign in to your Zeaper account before registering your shop. Your details are saved — finish signing in and come back.",
            );
            return;
        }

        dispatch(setOnboardingLoadingMessage("Submitting your shop details..."));
        dispatch(setOnboardingIsSubmitting(true));

        try {
            // Payload shape matches POST /shop/create — note the backend uses
            // `bankDetails` (not `bank`), `tikTok` with a capital T, `source`
            // (not `referralSource`), and accepts a `linkedin` social we don't
            // collect in the form, so we send it as an empty string.
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

            // Pull a fresh shop record via /shop/auth so the welcome screen has
            // the canonical `status` ("new" right after creation) and any
            // server-side normalization (currency, _id, etc.).
            dispatch(setOnboardingLoadingMessage("Fetching your shop details..."));
            const authShop = await getAuthShop().unwrap().catch(() => createdShop);
            dispatch(setShop(authShop));

            // Flip the local user record so the FAB and downstream gates route
            // the user to the vendor side immediately, without waiting for a
            // profile refetch.
            if (userData) {
                dispatch(setUserData({
                    ...userData,
                    isVendor: true,
                    shopId: authShop?.shopId || createdShop?.shopId || userData.shopId,
                }));
            }

            dispatch(setOnboardingIsSubmitting(false));
            dispatch(setOnboardingLoadingMessage(""));
            dispatch(resetOnboarding());

            // Drop the user on the welcome screen instead of the dashboard —
            // shop is "new" / disabled until documents are uploaded and the
            // admin verifies. `reset` so they can't swipe back into the stepper.
            navigation.reset({
                index: 0,
                routes: [{ name: "vendorWelcomeScreen" }],
            });
        } catch (error: any) {
            dispatch(setOnboardingIsSubmitting(false));
            dispatch(setOnboardingLoadingMessage(""));

            // Dump the raw error so we can debug from Metro / `adb logcat`.
            // RTK Query's fetchBaseQuery wraps the response as
            // `{ status, data, error? }`; surface every plausible message path
            // the backend might use, so QA actually sees the rejection reason.
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

            let alertMessage: string;
            if (status === 401 || status === 403) {
                alertMessage = "Please log in or refresh your session before registering a shop.";
            } else if (status === 409) {
                alertMessage = backendMessage || "A shop already exists for this account.";
            } else if (status === "FETCH_ERROR") {
                alertMessage = "Couldn't reach Zeaper. Check your internet connection and try again.";
            } else if (backendMessage) {
                // Prefix with the status code so QA can quickly report it back.
                alertMessage = status ? `${ backendMessage } (HTTP ${ status })` : backendMessage;
            } else {
                alertMessage = status
                    ? `Could not complete your shop registration (HTTP ${ status }). Please try again.`
                    : "Could not complete your shop registration. Please try again.";
            }

            Alert.alert("Registration failed", alertMessage);
        }
    };

    return {
        formData,
        onSubmit,
        handleJumpToStep,
    };
};

export default useStepNineHook;
