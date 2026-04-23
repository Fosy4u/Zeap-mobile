import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";
import RootNavigationStackModel from "../../../routes/model/routes_model";
import { getAuth, onAuthStateChanged, signInAnonymously } from "@react-native-firebase/auth";
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
    GUEST_UID: 'guest_uid'
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
            const rawUserData = await EncryptedStorage.getItem(STORAGE_KEYS.USER_DATA);

            if (rawUserData) {
                const parsedUserData = JSON.parse(rawUserData);

                // Navigate immediately with cached data — no API wait
                dispatch(setUserData(parsedUserData));
                const isVendor = parsedUserData.isVendor;
                if (isVendor) {
                    navigation.navigate("vendorHomeScreen", { screen: "Dashboard" });
                } else {
                    navigation.navigate("homeScreen", { screen: "Dashboard" });
                }

                // Silently refresh user data in the background
                refreshUserDataSilently(parsedUserData.uid);
            } else {
                // New user — show animation while auth & API calls run in parallel
                startSplashAnimation();
                await checkIsUserLoggedInAnonymously();
            }
        } catch (error) {
            startSplashAnimation();
        }
    };

    // Non-blocking background refresh — never blocks navigation
    const refreshUserDataSilently = async (uid: string) => {
        try {
            const userData = await getUserById(uid).unwrap();
            if (userData) {
                await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
                dispatch(setUserData(userData));
            }
        } catch {
            // Silently fail — the user is already on the home screen with cached data
        }
    };

    // Check if user is logged in anonymously
    const checkIsUserLoggedInAnonymously = async () => {
        try {
            onAuthStateChanged(authInstance, async (user: any) => {
                if (user) {
                    const uid = user.uid;
                    const token = await user.getIdToken();

                    if (uid) {
                        await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(user));
                        await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));
                        await storeToken(token);

                        const isAnonymousUser = user.isAnonymous;

                        if (isAnonymousUser) {
                            dispatch(setLoadingMessage("Zipping through aisles just for you…"));
                            dispatch(setIsLoading(true));

                            await EncryptedStorage.setItem(STORAGE_KEYS.GUEST_UID, JSON.stringify(uid));

                            const guestUserData = await registerGuestUser({}).unwrap();

                            if (guestUserData) {
                                dispatch(setIsLoading(false));
                                dispatch(setLoadingMessage(""));

                                await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUserData));
                                dispatch(setUserData(guestUserData));
                                navigation.navigate("homeScreen", { screen: "Dashboard" });
                            }
                        } else {
                            dispatch(setLoadingMessage("Fetching auth user..."));
                            dispatch(setIsLoading(true));

                            const userData = await getUserById(uid).unwrap();

                            if (userData) {
                                dispatch(setIsLoading(false));
                                dispatch(setLoadingMessage(""));

                                await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
                                dispatch(setUserData(userData));

                                const isVendor = userData.isVendor;
                                if (isVendor) {
                                    navigation.navigate("vendorHomeScreen", { screen: "Dashboard" });
                                } else {
                                    navigation.navigate("homeScreen", { screen: "Dashboard" });
                                }
                            }
                        }
                    }
                } else {
                    dispatch(setLoadingMessage("Zipping through aisles just for you…"));
                    dispatch(setIsLoading(true));

                    const anonymousUserData = await signInAnonymously(authInstance);

                    if (anonymousUserData) {
                        const uid = anonymousUserData.user.uid;

                        await EncryptedStorage.setItem(STORAGE_KEYS.GUEST_UID, JSON.stringify(uid));

                        const guestUserData = await registerGuestUser({}).unwrap();

                        if (guestUserData) {
                            dispatch(setIsLoading(false));
                            dispatch(setLoadingMessage(""));

                            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUserData));
                            dispatch(setUserData(guestUserData));
                            navigation.navigate("homeScreen", { screen: "Dashboard" });
                        }
                    }
                }
            });
        } catch (error) {
            // Handle error silently
        }
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
