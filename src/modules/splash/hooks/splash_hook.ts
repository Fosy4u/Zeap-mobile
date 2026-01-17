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
import handleError from "../../general/hooks/errorHandler_hook";

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
        // Start all animations in parallel
        zoomInValue.value = withTiming(0, { duration: 2000 });
        zoomInTwoValue.value = withTiming(80, { duration: 2000 });
        fadeOutValue.value = withDelay(1000, withTiming(1, { duration: 1600 }));
        fadeOutCounterValue.value = withDelay(3500, withTiming(1, { duration: 2000 }));
        slideUpValue.value = withTiming(300, { duration: 2000 });
        slideUpTwoValue.value = withDelay(2000, withTiming(height / 1.5, { duration: 2000 }));
        
        // Set animation started after all animations complete
        setTimeout(() => {
            setAnimationStarted(true);
        }, 5500); // Total duration of all animations
    };

    const handleCheckForFirstTimer = async () => {
        try {
            const userData = await EncryptedStorage.getItem(STORAGE_KEYS.USER_DATA);
            if (userData) {
                const parsedUserData = JSON.parse(userData);
                // console.log("PARSED USER DATA::: ", parsedUserData);
                
                // Refetch user data by UID
                await refetchUserData(parsedUserData.uid);
            } else {
                await checkIsUserLoggedInAnonymously();
            }
        } catch (error) {
            startSplashAnimation();
        }
    };

    // Refetch the logged-in user data by UID
    const refetchUserData = async (uid: string) => {
        dispatch(setLoadingMessage("Fetching user data..."));
        dispatch(setIsLoading(true));

        try {
            const userData = await getUserById(uid).unwrap();
            // console.log("USER DATA::: ", userData);

            if (userData) {
                // Save user data to secure storage
                await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

                // Dispatch to Redux Store
                dispatch(setUserData(userData));
                const isVendor = userData.isVendor;
                if (isVendor) {
                    navigation.navigate("vendorHomeScreen", { screen: "Dashboard" });
                } else {
                    navigation.navigate("homeScreen", { screen: "Dashboard" });
                }
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
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
                        // Save user data to secure storage
                        await EncryptedStorage.setItem(STORAGE_KEYS.FIREBASE_USER, JSON.stringify(user));
                        await EncryptedStorage.setItem(STORAGE_KEYS.USER_ID, JSON.stringify(uid));
                        await storeToken(token);

                        // Check if user is anonymous
                        const isAnonymousUser = user.isAnonymous;
                        
                        if (isAnonymousUser) {
                            dispatch(setLoadingMessage("Zipping through aisles just for you…"));
                            dispatch(setIsLoading(true));

                            // Save guest UID to secure storage
                            await EncryptedStorage.setItem(STORAGE_KEYS.GUEST_UID, JSON.stringify(uid));

                            // Register as a guest user
                            const guestUserData = await registerGuestUser({}).unwrap();
                            
                            if (guestUserData) {
                                dispatch(setIsLoading(false));
                                dispatch(setLoadingMessage(""));

                                // Save guest user data
                                await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUserData));

                                // Dispatch to Redux Store
                                dispatch(setUserData(guestUserData));
                                navigation.navigate("homeScreen", { screen: "Dashboard" });
                            }
                        } else {
                            dispatch(setLoadingMessage("Fetching auth user..."));
                            dispatch(setIsLoading(true));

                            // Get Auth user data
                            const userData = await getUserById(uid).unwrap();

                            if (userData) {
                                dispatch(setIsLoading(false));
                                dispatch(setLoadingMessage(""));

                                // Save user data
                                await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

                                // Dispatch to Redux Store
                                dispatch(setUserData(userData));

                                // Check if user is a vendor
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

                    // If user is "null", proceed with anonymous login
                    const anonymousUserData = await signInAnonymously(authInstance);

                    if (anonymousUserData) {
                        const uid = anonymousUserData.user.uid;

                        // Save guest UID to secure storage
                        await EncryptedStorage.setItem(STORAGE_KEYS.GUEST_UID, JSON.stringify(uid));

                        // Register as a guest user
                        const guestUserData = await registerGuestUser({}).unwrap();
                        
                        if (guestUserData) {
                            dispatch(setIsLoading(false));
                            dispatch(setLoadingMessage(""));
                            
                            // Save guest user data
                            await EncryptedStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(guestUserData));
                            
                            // Dispatch to Redux Store
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
                    // Wrap the state update in runOnJS
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