import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useRef } from "react";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { getAuth, getIdToken, onAuthStateChanged, signInAnonymously } from "@react-native-firebase/auth";
import { useLazyGetUserByIdQuery, useRegisterGuestUserMutation } from "../../auths/apis/auths_api";
import { useDispatch } from "react-redux";
import { setUserData } from "../../profile/slices/profileState_slice";
import { setIsLoading, setLoadingMessage } from "../../general/slices/general_slice";
import { withTiming, withDelay } from 'react-native-reanimated';
import { readSecureItem, readSecureJSON, writeSecureItem } from "../../../utils/secureStorage";
import { storeToken } from "../../../redux/services/authorizationHeader";

const STORAGE_KEYS = {
    FIREBASE_USER: 'fb_user',
    USER_ID: 'user_id',
    USER_DATA: 'user_data',
    GUEST_UID: 'guest_uid',
    HAS_LAUNCHED: 'has_launched',
} as const;

const SPLASH_ANIMATION_DURATION_MS = 4000;

const SPLASH_WATCHDOG_MS = 10000;

const useSplashHook = (props: any) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const {
        height, zoomInValue, zoomInTwoValue, fadeOutValue, fadeOutCounterValue, slideUpValue,
        slideUpTwoValue,
    } = props;

    const [registerGuestUser] = useRegisterGuestUserMutation();
    const [getUserById] = useLazyGetUserByIdQuery();

    const authInstance = getAuth();

    const hasLeftSplashRef = useRef(false);
    const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const leaveSplash = (destination: "home" | "onboarding" = "home") => {
        if (hasLeftSplashRef.current) return;
        hasLeftSplashRef.current = true;

        if (watchdogRef.current) {
            clearTimeout(watchdogRef.current);
            watchdogRef.current = null;
        }

        clearLoading();
        if (destination === "onboarding") {
            navigation.navigate("onboardingOneScreen");
        } else {
            navigation.navigate("homeScreen", { screen: "Home" });
        }
    };

    const startSplashAnimation = () => {
        zoomInValue.value = withTiming(0, { duration: 2000 });
        zoomInTwoValue.value = withTiming(80, { duration: 2000 });
        fadeOutValue.value = withDelay(1000, withTiming(1, { duration: 1600 }));
        fadeOutCounterValue.value = withDelay(3500, withTiming(1, { duration: 2000 }));
        slideUpValue.value = withTiming(300, { duration: 2000 });
        slideUpTwoValue.value = withDelay(2000, withTiming(height / 1.5, { duration: 2000 }));
    };

    const handleCheckForFirstTimer = async () => {
        try {
            const [storedUser, hasLaunchedBefore] = await Promise.all([
                readSecureJSON<any>(STORAGE_KEYS.USER_DATA),
                readSecureJSON<boolean>(STORAGE_KEYS.HAS_LAUNCHED),
            ]);

            if (storedUser) {
                dispatch(setUserData(storedUser));
                leaveSplash("home");

                // Silently refresh user data in the background
                refreshUserDataSilently(storedUser.uid);
            } else if (hasLaunchedBefore === true) {
                await checkIsUserLoggedInAnonymously();
            } else {
                await writeSecureItem(STORAGE_KEYS.HAS_LAUNCHED, JSON.stringify(true));
                startSplashAnimation();
                checkIsUserLoggedInAnonymously({ navigateHome: false });

                setTimeout(() => leaveSplash("onboarding"), SPLASH_ANIMATION_DURATION_MS);
            }
        } catch (error) {
            console.error("[Splash] Bootstrap failed; continuing as guest.", error);
            leaveSplash("home");
        }
    };

    // Parses a displayName like "John Doe (Google)" into { firstName: "John", lastName: "Doe" }.
    const parseAuthUserName = (
        backendUser: any,
        authUser: any,
    ): { firstName: string; lastName: string } => {
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
        if (localPart) return { firstName: localPart, lastName: "" };

        if (backendUser?.firstName || backendUser?.lastName) {
            return {
                firstName: backendUser.firstName || "Customer",
                lastName: backendUser.lastName || "Guest",
            };
        }

        return { firstName: "Customer", lastName: "Guest" };
    };

    // Non-blocking background refresh — never blocks navigation
    const refreshUserDataSilently = async (uid: string) => {
        try {
            const userData = await getUserById(uid).unwrap();
            if (!userData) return;
            const currentUser = authInstance.currentUser;
            const isFirebaseAuthenticated = !!currentUser && !currentUser.isAnonymous;

            const cached = (await readSecureJSON<any>(STORAGE_KEYS.USER_DATA)) ?? {};

            let merged: any = { ...cached, ...userData };
            if (isFirebaseAuthenticated) {
                const { firstName, lastName } = parseAuthUserName(userData, currentUser);
                merged = {
                    ...merged,
                    uid: currentUser!.uid,
                    email: userData.email || currentUser!.email || "",
                    displayName: currentUser!.displayName || (userData as any).displayName || "",
                    firstName,
                    lastName,
                    photoURL: (userData as any).photoURL || currentUser!.photoURL || "",
                    isGuest: false,
                };
            }

            await writeSecureItem(STORAGE_KEYS.USER_DATA, JSON.stringify(merged));
            dispatch(setUserData(merged as any));

        } catch {
            // Silently fail — the user is already on the home screen with cached data
        }
    };

    const SETTING_UP_SESSION = "Setting up your session...";
    const FETCHING_PROFILE = "Loading your profile...";

    const clearLoading = () => {
        dispatch(setIsLoading(false));
        dispatch(setLoadingMessage(""));
    };

    // Check if user is logged in anonymously.
    const checkIsUserLoggedInAnonymously = async ({ navigateHome = true }: { navigateHome?: boolean } = {}) => {
        const unsubscribe = onAuthStateChanged(authInstance, async (user: any) => {
            unsubscribe(); // Run only once

            try {
                if (user) {
                    const uid = user.uid;
                    const token = await getIdToken(user);
                    if (!uid) return;

                    await writeSecureItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(user));
                    await writeSecureItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));
                    await storeToken(token);

                    if (user.isAnonymous) {
                        dispatch(setLoadingMessage(SETTING_UP_SESSION));
                        dispatch(setIsLoading(true));

                        await writeSecureItem(STORAGE_KEYS.GUEST_UID, JSON.stringify(uid));

                        const guestUserData = await registerGuestUser({}).unwrap();
                        if (guestUserData) {
                            await writeSecureItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUserData));
                            dispatch(setUserData(guestUserData));
                        }
                        if (navigateHome) leaveSplash("home");
                    } else {
                        dispatch(setLoadingMessage(FETCHING_PROFILE));
                        dispatch(setIsLoading(true));

                        let userData: any = await getUserById(uid).unwrap();

                        if (userData) {
                            const { firstName, lastName } = parseAuthUserName(userData, user);
                            userData = {
                                ...userData,
                                uid: user.uid,
                                email: userData.email || user.email || "",
                                displayName: user.displayName || userData.displayName || "",
                                firstName,
                                lastName,
                                photoURL: userData.photoURL || user.photoURL || "",
                                isGuest: false,
                            };

                            await writeSecureItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
                            console.log("[Splash] USER DATA (auth):", JSON.stringify(userData, null, 2));
                            dispatch(setUserData(userData));

                            if (navigateHome) leaveSplash("home");
                        }
                    }
                } else {
                    dispatch(setLoadingMessage(SETTING_UP_SESSION));
                    dispatch(setIsLoading(true));

                    const anonymousUserData = await signInAnonymously(authInstance);
                    if (!anonymousUserData) return;

                    const uid = anonymousUserData.user.uid;
                    await writeSecureItem(STORAGE_KEYS.GUEST_UID, JSON.stringify(uid));

                    let guestUserData: any = null;
                    try {
                        guestUserData = await registerGuestUser({}).unwrap();
                    } catch (createErr: any) {
                        console.warn("[Splash] registerGuestUser failed; navigating to home anyway.", createErr?.status, createErr?.data);
                    }

                    if (guestUserData) {
                        await writeSecureItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUserData));
                        dispatch(setUserData(guestUserData));
                    }
                    if (navigateHome) leaveSplash("home");
                }
            } catch (error) {
                console.error("[Splash] Auth bootstrap failed:", error);
            } finally {
                if (navigateHome) leaveSplash("home");
                clearLoading();
            }
        });
    };

    useEffect(() => {
        watchdogRef.current = setTimeout(() => {
            console.warn(`[Splash] No navigation within ${SPLASH_WATCHDOG_MS}ms; continuing as guest.`);
            leaveSplash("home");
        }, SPLASH_WATCHDOG_MS);

        handleCheckForFirstTimer();

        return () => {
            if (watchdogRef.current) clearTimeout(watchdogRef.current);
        };
    }, []);

    return {};
};

export default useSplashHook;
