import React, { useEffect, useState } from "react";
import { Animated, View } from "react-native";

const HEADER_CORNER_RADIUS = 24;

interface IVendorHomeHeaderProps {
  scrollY: Animated.Value;
  appBarContent?: React.ReactNode;
  collapsibleContent?: React.ReactNode;
  onHeaderHeightChange?: (height: number) => void;
}

const VendorHomeHeaderComponent: React.FC<IVendorHomeHeaderProps> = ({
  scrollY,
  appBarContent,
  collapsibleContent,
  onHeaderHeightChange,
}) => {
  const [appBarHeight, setAppBarHeight] = useState(0);
  const [bandHeight, setBandHeight] = useState(0);

  const visibleBandHeight = Math.max(bandHeight - HEADER_CORNER_RADIUS, 0);

  const collapsibleTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(visibleBandHeight, 1)],
    outputRange: [0, -Math.max(bandHeight + HEADER_CORNER_RADIUS, 1)],
    extrapolate: "clamp",
  });

  const collapsibleOpacity = scrollY.interpolate({
    inputRange: [0, Math.max(visibleBandHeight * 0.6, 1)],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    const total = appBarHeight + visibleBandHeight;
    if (total > 0) {
      onHeaderHeightChange?.(total);
    }
  }, [appBarHeight, visibleBandHeight, onHeaderHeightChange]);

  return (
    <>
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: Math.max(appBarHeight - HEADER_CORNER_RADIUS, 0),
          left: 0,
          right: 0,
          transform: [{ translateY: collapsibleTranslateY }],
        }}
        className="px-5 pt-6 pb-4 rounded-b-3xl bg-baseGreen"
        onLayout={ (event) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0) { setBandHeight(height); }
        } }
      >
        <Animated.View style={ bandHeight ? { opacity: collapsibleOpacity } : undefined }>
          { collapsibleContent }
        </Animated.View>
      </Animated.View>

      <View
        onLayout={ (event) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0) { setAppBarHeight(height); }
        } }
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        className="px-5 pt-4 pb-4 rounded-b-3xl bg-baseGreen"
      >
        { appBarContent }
      </View>
    </>
  );
};

export default VendorHomeHeaderComponent;

