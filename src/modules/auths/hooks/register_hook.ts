import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuth, getIdToken, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import EncryptedStorage from "../../../utils/sessionStorage";
import { forgetSecureItem } from "../../../utils/secureStorage";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { IRegisterUser, registerUserSchema } from "../validations/auths_validation";
import { clearPendingDestination, setShowSuccessModal } from "../slices/authState_slice";
import { setIsLoading, setLoadingMessage } from "../../general/slices/general_slice";
import { setUserData } from "../../profile/slices/profileState_slice";
import { useConvertGuestToPasswordUserMutation, useLazyCheckUserEmailQuery, useLazyGetUserByIdQuery, useMergeUserDataMutation, useRegisterGuestUserMutation } from "../apis/auths_api";
import encryptPassword from "../../../utils/encryptPassword";
import { phoneCodeForCurrency } from "../../../utils/currencyToPhoneCode";
import { storeToken } from "../../../redux/services/authorizationHeader";
import handleError from "../../general/hooks/errorHandler_hook";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { RootState } from "../../../redux/store/store";

const STORAGE_KEYS = {
    FIREBASE_USER: 'fb_user',
    USER_ID: 'user_id',
    USER_DATA: 'user_data',
    GUEST_UID: 'guest_uid'
} as const;

const useRegisterHook = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const pendingDestination = useSelector((state: RootState) => state.authState.pendingDestination);
    const [registerGuestUser] = useRegisterGuestUserMutation();
    const [getUserById] = useLazyGetUserByIdQuery();
    const [mergeUserData] = useMergeUserDataMutation();
    const [checkUserEmail] = useLazyCheckUserEmailQuery();
    const [convertGuestToPasswordUser] = useConvertGuestToPasswordUserMutation();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const preferredCurrency = useSelector((state: RootState) => state.profileState.userData?.prefferedCurrency);
    const [dialCode, setDialCode] = useState(() => phoneCodeForCurrency(preferredCurrency).dial_code);
    const [step, setStep] = useState<"email" | "login" | "details">("email");
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [existingFirstName, setExistingFirstName] = useState("");
    const authInstance = getAuth();

    const redirectAfterAuth = () => {
        if (pendingDestination) {
            navigation.reset({
                index: 0,
                routes: [{ name: pendingDestination.name as keyof RootNavigationStackModel, params: pendingDestination.params } as any],
            });
            dispatch(clearPendingDestination());
            return;
        }
        navigation.navigate("homeScreen", { screen: "Home" });
    };

    const { control, handleSubmit, formState: { errors }, trigger, getValues, clearErrors } = useForm<IRegisterUser>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
        },
        resolver: yupResolver(registerUserSchema)
    });

    const handleContinueWithEmail = async () => {
        if (!(await trigger("email"))) return;

        setIsCheckingEmail(true);
        try {
            const guestUser = authInstance.currentUser;
            if (guestUser) await storeToken(await getIdToken(guestUser));
            const existingUser = await checkUserEmail(getValues("email").trim().toLowerCase()).unwrap().catch(() => null);
            clearErrors();
            if (existingUser?.firstName) {
                setExistingFirstName(existingUser.firstName);
                setStep("login");
                return;
            }
            setStep("details");
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const handleUseDifferentEmail = () => {
        clearErrors();
        setExistingFirstName("");
        setStep("email");
    };

    const onSubmit: SubmitHandler<IRegisterUser> = async (data) => {
        dispatch(setLoadingMessage("Creating account..."));
        dispatch(setIsLoading(true));

        const email = data.email.trim().toLowerCase();

        try {
            const guestUser = authInstance.currentUser;
            if (!guestUser) throw new Error("Your session has expired. Please restart the app and try again.");
            await storeToken(await getIdToken(guestUser, true));

            const existingUser = await checkUserEmail(email).unwrap().catch(() => null);
            if (existingUser?.firstName) {
                throw new Error("An account with this email already exists. Please log in instead.");
            }

            await convertGuestToPasswordUser({
                email,
                password: encryptPassword(data.password),
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                phoneNumber: `${ dialCode }${ data.phoneNumber.replace(/^0+/, "") }`,
            }).unwrap();

            const { user: authUser } = await signInWithEmailAndPassword(authInstance, email, data.password);
            const token = await getIdToken(authUser, true);
            await storeToken(token);

            const firebaseUserData = { uid: authUser.uid, email: authUser.email, displayName: authUser.displayName, photoURL: authUser.photoURL };
            await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(firebaseUserData));
            await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(authUser.uid));

            const userData: any = { ...(await getUserById(authUser.uid).unwrap()), isGuest: false };
            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
            dispatch(setUserData(userData));
            await forgetSecureItem(STORAGE_KEYS.GUEST_UID);

            dispatch(setShowSuccessModal(true));
        } catch (error: any) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    const getGoogleTokens = async (signInResponse: any) => {
        let idToken: string | undefined =
            signInResponse?.data?.idToken ?? signInResponse?.idToken ?? signInResponse?.user?.idToken;
        let accessToken: string | undefined =
            signInResponse?.data?.accessToken ?? signInResponse?.accessToken ?? signInResponse?.user?.accessToken;

        if (!idToken || !accessToken) {
            const tokens = await GoogleSignin.getTokens();
            idToken = idToken ?? tokens?.idToken;
            accessToken = accessToken ?? tokens?.accessToken;
        }

        return { idToken, accessToken };
    };

    const parseGoogleName = (authUser: any): { firstName: string; lastName: string } => {
        const rawDisplayName: string = authUser?.displayName ?? "";
        const cleanedDisplayName = rawDisplayName.replace(/\s*\([^)]*\)\s*/g, " ").trim();

        if (cleanedDisplayName) {
            const parts = cleanedDisplayName.split(/\s+/).filter(Boolean);
            return {
                firstName: parts[0] || "Customer",
                lastName: parts.slice(1).join(" ") || "Guest",
            };
        }

        const email: string = authUser?.email ?? "";
        const localPart = email.split("@")[0]?.trim();
        if (localPart) {
            return { firstName: localPart, lastName: "" };
        }

        return { firstName: "Customer", lastName: "Guest" };
    };

    const normalizeGoogleUserData = (userData: any, authUser: any) => {
        if (!userData || !authUser) return userData;

        const displayName = authUser.displayName ?? userData.displayName ?? "";
        const { firstName, lastName } = parseGoogleName(authUser);

        return {
            ...userData,
            uid: authUser.uid,
            email: userData.email || authUser.email || "",
            displayName,
            firstName,
            lastName,
            photoURL: userData.photoURL || authUser.photoURL || "",
            isGuest: false,
        };
    };

    const clearGoogleSessionIfNeeded = async () => {
        try {
            const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
            if (hasPreviousSignIn) {
                await GoogleSignin.signOut();
            }
        } catch (error) {

        }
    };

    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        dispatch(setLoadingMessage("Signing up with Google..."));
        dispatch(setIsLoading(true));

        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            await clearGoogleSessionIfNeeded();

            const signInResponse: any = await GoogleSignin.signIn();
            if (signInResponse?.type === "cancelled") return;

            const { idToken, accessToken } = await getGoogleTokens(signInResponse);
            if (!idToken) throw new Error("Failed to retrieve Google ID token.");

            const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
            const { user: authUser } = await signInWithCredential(authInstance, googleCredential);

            const uid = authUser.uid;
            const token = await getIdToken(authUser, true);

            const firebaseUserData = {
                uid: authUser.uid,
                email: authUser.email,
                displayName: authUser.displayName,
                photoURL: authUser.photoURL
            };
            await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(firebaseUserData));
            await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));
            await storeToken(token);

            let userData;
            try {
                userData = await getUserById(uid).unwrap();
            } catch (getUserError: any) {
                try {
                    await registerGuestUser({}).unwrap();
                } catch (createErr: any) {

                }
                userData = await getUserById(uid).unwrap();
            }

            if (!userData) throw new Error("Failed to load user profile.");

            const guestUID = await EncryptedStorage.getItem(STORAGE_KEYS.GUEST_UID);
            const parsedGuestUID = guestUID ? JSON.parse(guestUID) : null;

            if (parsedGuestUID && parsedGuestUID !== uid) {
                try {
                    const mergedUserData = await mergeUserData({ guestUid: parsedGuestUID }).unwrap();
                    if (mergedUserData) userData = mergedUserData;
                } catch {
                }
                await forgetSecureItem(STORAGE_KEYS.GUEST_UID);
            }

            userData = normalizeGoogleUserData(userData, authUser);

            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

            dispatch(setUserData(userData));

            redirectAfterAuth();
        } catch (error: any) {
            const code = error?.code;
            if (code === statusCodes.SIGN_IN_CANCELLED || code === statusCodes.IN_PROGRESS) {
                return;
            }

            handleError(error);
        } finally {
            setIsGoogleLoading(false);
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    return {
        control, handleSubmit, onSubmit, handleGoogleSignUp, isGoogleLoading, errors, dialCode, setDialCode, redirectAfterAuth,
        step, handleContinueWithEmail, handleUseDifferentEmail, isCheckingEmail, existingFirstName, getValues,
    };
};

export default useRegisterHook;
