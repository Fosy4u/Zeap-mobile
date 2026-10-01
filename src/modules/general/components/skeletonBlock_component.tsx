import React, { useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
    cancelAnimation,
    Easing,
    makeMutable,
    useAnimatedStyle,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

interface ISkeletonBlockProps {
    width: number;
    height: number;
    radius?: number;
    baseColor?: string;
    highlightColor?: string;
    duration?: number;
    style?: StyleProp<ViewStyle>;
}

// Project-local skeleton primitive used by every screen-specific skeleton
// loader. A flat colored block with a LinearGradient overlay whose translateX
// is animated from -width to +width using Reanimated. Both deps
// (react-native-linear-gradient, react-native-reanimated) are already in the
// project — no third-party shimmer library is needed.
//
// Tune colors per surface (e.g. dark green header vs white body) via the
// baseColor / highlightColor props.
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const sharedProgress = makeMutable(0);
let activeBlocks = 0;

const acquireShimmer = (duration: number) => {
    activeBlocks += 1;
    if (activeBlocks === 1) {
        sharedProgress.value = withRepeat(
            withTiming(1, { duration, easing: Easing.linear }),
            -1,
            false,
        );
    }
};

const releaseShimmer = () => {
    activeBlocks -= 1;
    if (activeBlocks <= 0) {
        activeBlocks = 0;
        cancelAnimation(sharedProgress);
        sharedProgress.value = 0;
    }
};

const SkeletonBlock: React.FC<ISkeletonBlockProps> = ({
    width,
    height,
    radius = 8,
    baseColor = "#e5e7eb",
    highlightColor = "#f5f5f5",
    duration = 1500,
    style,
}) => {
    useEffect(() => {
        acquireShimmer(duration);
        return () => releaseShimmer();
    }, [duration]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: -width + sharedProgress.value * 2 * width }],
    }));

    return (
        <View
            style={[
                {
                    width,
                    height,
                    borderRadius: radius,
                    backgroundColor: baseColor,
                    overflow: "hidden",
                },
                style,
            ]}
        >
            <AnimatedLinearGradient
                colors={["transparent", highlightColor, "transparent"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[StyleSheet.absoluteFillObject, { width }, animatedStyle]}
            />
        </View>
    );
};

export default SkeletonBlock;
