import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TickCircle } from "iconsax-react-native";
import { RootState } from "../../../redux/store/store";
import { hideAppToast } from "../slices/general_slice";

const VISIBLE_DURATION_MS = 4000;

const AppToast = () => {
    const { appToast } = useSelector((state: RootState) => state.generalState);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const slide = useRef(new Animated.Value(0)).current;
    const countdown = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!appToast) return;

        slide.setValue(0);
        countdown.setValue(1);
        Animated.spring(slide, { toValue: 1, friction: 7, tension: 70, useNativeDriver: true }).start();
        const countdownAnimation = Animated.timing(countdown, { toValue: 0, duration: VISIBLE_DURATION_MS, easing: Easing.linear, useNativeDriver: false });
        countdownAnimation.start(({ finished }) => {
            if (finished) dispatch(hideAppToast());
        });

        return () => countdownAnimation.stop();
    }, [appToast?.id]);

    if (!appToast) return null;

    return (
        <View pointerEvents="box-none" className="absolute left-0 right-0 px-5" style={{ bottom: insets.bottom + 24, zIndex: 1000, elevation: 20 }}>
            <Animated.View
                className="w-full rounded-2xl overflow-hidden bg-baseGreen"
                style={{
                    opacity: slide,
                    transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
                    shadowColor: "#133522",
                    shadowOpacity: 0.35,
                    shadowRadius: 14,
                    shadowOffset: { width: 0, height: 8 },
                }}
                accessibilityRole="alert"
            >
                <View className="px-4 py-4 flex-row items-center">
                    <View className="h-[44px] w-[44px] items-center justify-center rounded-full bg-lightGreen">
                        <TickCircle size={ 26 } color="#133522" variant="Bold" />
                    </View>

                    <View className="flex-1 ml-3">
                        <Text className="font-montserratSemiBold text-base text-white">{ appToast.title }</Text>
                        <Text className="mt-0.5 font-montserratRegular text-xs text-white/70">{ appToast.message }</Text>
                    </View>

                    <TouchableOpacity
                        onPress={ () => dispatch(hideAppToast()) }
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        className="ml-3"
                        accessibilityLabel="Close"
                    >
                        <Text className="text-2xl leading-[24px] text-white/60">×</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-[3px] w-full bg-white/10">
                    <Animated.View
                        className="h-full bg-gold"
                        style={{ width: countdown.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }}
                    />
                </View>
            </Animated.View>
        </View>
    );
};

export default AppToast;
