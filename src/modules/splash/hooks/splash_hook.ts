import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { getAuth, getIdToken, onAuthStateChanged, signInAnonymously } from "@react-native-firebase/auth";
import { useLazyGetUserByIdQuery, useRegisterGuestUserMutation } from "../../auths/apis/auths_api";
import { useDispatch } from "react-redux";
import { setUserData } from "../../profile/slices/profileState_slice";
import { setIsLoading, setLoadingMessage } from "../../general/slices/general_slice";
import { withTiming, withDelay, withSequence, runOnJS } from 'react-native-reanimated';
import EncryptedStorage from 'react-native-encrypted-storage';
import { storeToken } from "../../../redux/services/authorizationHeader";

const STORAGE_KEYS = {
    FIREBASE_USER: 'fb_user',
    USER_ID: 'user_id',
    USER_DATA: 'user_data',
    GUEST_UID: 'guest_uid',
    // Set once when the user sees the onboarding splash for the first time. Persists
    // across logout / sign-in. Only cleared by uninstall or "Clear app data", which is
    // exactly when we want to re-show the onboarding flow.
    HAS_LAUNCHED: 'has_launched',
} as const;

const useSplashHook = (props: any) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const {
        counters, height, zoomInValue, zoomInTwoValue, fadeOutValue, fadeOutCounterValue, slideUpValue,
        slideUpTwoValue, currentIndex, slideAnim, animationStarted, setAnimationStarted, setCurrentIndex
    } = props;

    const [registerGuestUser] = useRegisterGuestUserMutation();
    const [getUserById] = useLazyGetUserByIdQuery();

    const authInstance = getAuth();

    const startSplashAnimation = () => {
        zoomInValue.value = withTiming(0, { duration: 2000 });
        zoomInTwoValue.value = withTiming(80, { duration: 2000 });
        fadeOutValue.value = withDelay(1000, withTiming(1, { duration: 1600 }));
        fadeOutCounterValue.value = withDelay(3500, withTiming(1, { duration: 2000 }));
        slideUpValue.value = withTiming(300, { duration: 2000 });
        slideUpTwoValue.value = withDelay(2000, withTiming(height / 1.5, { duration: 2000 }));

        setTimeout(() => {
            setAnimationStarted(true);
        }, 5500);
    };

    const handleCheckForFirstTimer = async () => {
        try {
            const [rawUserData, hasLaunchedRaw] = await Promise.all([
                EncryptedStorage.getItem(STORAGE_KEYS.USER_DATA),
                EncryptedStorage.getItem(STORAGE_KEYS.HAS_LAUNCHED),
            ]);
            const hasLaunchedBefore = hasLaunchedRaw ? JSON.parse(hasLaunchedRaw) === true : false;

            if (rawUserData) {
                const parsedUserData = JSON.parse(rawUserData);

                // Navigate immediately with cached data — no API wait.
                // Default landing is the User Home Screen for every role; vendors
                // open their dashboard manually.
                dispatch(setUserData(parsedUserData));
                navigation.navigate("homeScreen", { screen: "Home" });

                // Silently refresh user data in the background
                refreshUserDataSilently(parsedUserData.uid);
            } else if (hasLaunchedBefore) {
                // Returning user with no cached profile (e.g. just logged out, or backend
                // wiped). Skip the onboarding splash animation entirely and run the
                // anonymous-bootstrap path — it handles navigation to home itself.
                await checkIsUserLoggedInAnonymously();
            } else {
                // True first launch on this install — mark it now so any future logout
                // or storage wipe of user data doesn't drop the user back here.
                await EncryptedStorage.setItem(STORAGE_KEYS.HAS_LAUNCHED, JSON.stringify(true));
                startSplashAnimation();
                await checkIsUserLoggedInAnonymously();
            }
        } catch (error) {
            startSplashAnimation();
        }
    };

    // Name resolution rules (in priority order) — must match login_hook / register_hook:
    //   1. authUser.displayName  (strip bracketed content like "(handle)", split on whitespace)
    //   2. email local-part      (e.g. "tman44wiz@gmail.com" → "tman44wiz")
    //   3. backend firstName/lastName (only useful for non-Google paths)
    //   4. literal "Customer" / "Guest" as last-resort fallback
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
            // console.log("USER BY UID::: ", JSON.stringify(userData, null, 2));

            // The backend `/user/guest/create` endpoint stores `isGuest: true` even for
            // authenticated (Google/email) users. Treat the current Firebase user's
            // `isAnonymous` flag as the source of truth; otherwise a successful Google
            // login on a previous session would flip the dashboard back to "Guest" here.
            const currentUser = authInstance.currentUser;
            const isFirebaseAuthenticated = !!currentUser && !currentUser.isAnonymous;
            // console.log("CURRENT USER::: ", JSON.stringify(currentUser, null, 2));

            let merged: any = userData;
            if (isFirebaseAuthenticated) {
                const { firstName, lastName } = parseAuthUserName(userData, currentUser);
                merged = {
                    ...userData,
                    uid: currentUser!.uid,
                    email: userData.email || currentUser!.email || "",
                    displayName: currentUser!.displayName || (userData as any).displayName || "",
                    firstName,
                    lastName,
                    photoURL: (userData as any).photoURL || currentUser!.photoURL || "",
                    isGuest: false,
                };
            }

            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(merged));
            // console.log("[Splash] Refreshed USER DATA:", JSON.stringify(merged, null, 2));
            dispatch(setUserData(merged as any));

            // Shop-status routing for cached vendors lives on the dashboard
            // itself (it renders a skeleton until /shop/auth resolves), so we
            // intentionally don't redirect from here — doing so used to yank
            // the user off a partially-loaded dashboard mid-interaction.
        } catch {
            // Silently fail — the user is already on the home screen with cached data
        }
    };

    // Single source of truth for splash loading text — used in both the "first launch
    // creates a guest session" branch and the "existing Firebase session, hydrate from
    // backend" branch. Was previously the cryptic "Zipping through aisles just for you…".
    const SETTING_UP_SESSION = "Setting up your session...";
    const FETCHING_PROFILE = "Loading your profile...";

    const clearLoading = () => {
        dispatch(setIsLoading(false));
        dispatch(setLoadingMessage(""));
    };

    // Check if user is logged in anonymously
    const checkIsUserLoggedInAnonymously = async () => {
        const unsubscribe = onAuthStateChanged(authInstance, async (user: any) => {
            unsubscribe(); // Run only once

            try {
                if (user) {
                    const uid = user.uid;
                    const token = await getIdToken(user);
                    if (!uid) return;

                    await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(user));
                    await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));
                    await storeToken(token);

                    if (user.isAnonymous) {
                        dispatch(setLoadingMessage(SETTING_UP_SESSION));
                        dispatch(setIsLoading(true));

                        await EncryptedStorage.setItem(STORAGE_KEYS.GUEST_UID, JSON.stringify(uid));

                        const guestUserData = await registerGuestUser({}).unwrap();
                        if (guestUserData) {
                            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUserData));
                            dispatch(setUserData(guestUserData));
                        }
                        // Navigate even if backend failed — user has a Firebase guest session
                        // and shouldn't be marooned on the splash loader.
                        navigation.navigate("homeScreen", { screen: "Home" });
                    } else {
                        dispatch(setLoadingMessage(FETCHING_PROFILE));
                        dispatch(setIsLoading(true));

                        let userData: any = await getUserById(uid).unwrap();

                        if (userData) {
                            // Authenticated (non-anonymous) Firebase users should never
                            // render as a guest — backend may still flag them as such if
                            // they were created via /user/guest/create. Also re-parse the
                            // name from Firebase displayName, since backend seeds
                            // "Customer"/"Guest" for those records.
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

                            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
                            console.log("[Splash] USER DATA (auth):", JSON.stringify(userData, null, 2));
                            dispatch(setUserData(userData));

                            // Session restoration lands every role on the User Home
                            // Screen. No role-based auto-redirect to the vendor
                            // dashboard or vendor welcome screen.
                            navigation.navigate("homeScreen", { screen: "Home" });
                        }
                    }
                } else {
                    dispatch(setLoadingMessage(SETTING_UP_SESSION));
                    dispatch(setIsLoading(true));

                    const anonymousUserData = await signInAnonymously(authInstance);
                    if (!anonymousUserData) return;

                    const uid = anonymousUserData.user.uid;
                    await EncryptedStorage.setItem(STORAGE_KEYS.GUEST_UID, JSON.stringify(uid));

                    let guestUserData: any = null;
                    try {
                        guestUserData = await registerGuestUser({}).unwrap();
                    } catch (createErr: any) {
                        console.warn("[Splash] registerGuestUser failed; navigating to home anyway.", createErr?.status, createErr?.data);
                    }

                    if (guestUserData) {
                        await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUserData));
                        dispatch(setUserData(guestUserData));
                    }
                    navigation.navigate("homeScreen", { screen: "Home" });
                }
            } catch (error) {
                console.error("[Splash] Auth bootstrap failed:", error);
                // Don't strand the user on the splash loader. Drop into the home screen
                // (will render as guest) so they can at least browse / retry login.
                navigation.navigate("homeScreen", { screen: "Home" });
            } finally {
                clearLoading();
            }
        });
    };

    useEffect(() => {
        if (animationStarted && currentIndex >= 0 && currentIndex < counters.length) {
            slideAnim.value = withSequence(
                withTiming(0, { duration: 200 }),
                withTiming(20, { duration: 0 }, (finished) => {
                    if (finished) {
                        runOnJS(setCurrentIndex)(currentIndex + 1);
                    }
                })
            );
        } else if (currentIndex >= counters.length) {
            navigation.navigate("onboardingOneScreen");
        }
    }, [currentIndex, animationStarted, navigation]);

    useEffect(() => {
        handleCheckForFirstTimer();
    }, []);

    return {};
};

export default useSplashHook;
