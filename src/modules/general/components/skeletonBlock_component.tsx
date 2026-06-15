import React, { useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

interface ISkeletonBlockProps {
    width: number;
    height: number;
    radius?: number;
    /** Base "filled" color of the placeholder block. */
    baseColor?: string;
    /** Color of the shimmer pass that sweeps left-to-right across the block. */
    highlightColor?: string;
    /** Sweep duration in ms (default 1500). */
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

const SkeletonBlock: React.FC<ISkeletonBlockProps> = ({
    width,
    height,
    radius = 8,
    baseColor = "#e5e7eb",
    highlightColor = "#f5f5f5",
    duration = 1500,
    style,
}) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration, easing: Easing.linear }),
            -1,
            false,
        );
    }, [duration]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: -width + progress.value * 2 * width }],
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
