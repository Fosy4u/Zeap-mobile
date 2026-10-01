import React from "react";
import { SafeAreaView, ScrollView, StatusBar, useWindowDimensions, View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";
import AppStatusBar from "../../../general/components/appStatusBar";

// Skeleton loader for the Home tab (DashboardWrapper + MainDashboard).
// Renders an at-a-glance shell that matches the production layout so the
// transition from skeleton → real content is visually stable (no jump).
//
// Two color palettes are used:
//   • body   — light gray on white (matches the rest of the app's surfaces)
//   • header — darker green tones, readable against the baseGreen header
//
// The header band, search-box outline and section "chrome" stay as their real
// shapes/colors; only the data-driven blocks (avatar, name, promo carousel,
// product cards, banners) shimmer. That's the standard skeleton pattern — the
// page chrome reads as "already arrived" while the dynamic content "loads in".
//
// Uses the project's own SkeletonBlock primitive (Reanimated + LinearGradient).

const BODY_BASE = "#e5e7eb";
const BODY_HIGHLIGHT = "#f5f5f5";
const HEADER_BASE = "#1c4a30";
const HEADER_HIGHLIGHT = "#266d44";

interface IShimmerBlockProps {
    width: number;
    height: number;
    radius?: number;
    onHeader?: boolean;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
}

const ShimmerBlock: React.FC<IShimmerBlockProps> = ({
    width,
    height,
    radius = 8,
    onHeader = false,
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
}) => (
    <SkeletonBlock
        width={ width }
        height={ height }
        radius={ radius }
        baseColor={ onHeader ? HEADER_BASE : BODY_BASE }
        highlightColor={ onHeader ? HEADER_HIGHLIGHT : BODY_HIGHLIGHT }
        style={{ marginTop, marginRight, marginBottom }}
    />
);

const HomeSkeletonLoader = () => {
    const screenWidth = useWindowDimensions().width;
    // MainDashboard uses (screenWidth - 40) for the promo + banner widths so
    // the carousel sits inside the px-5 wrapper; mirror that exactly so the
    // skeleton-to-content swap doesn't cause a layout reflow.
    const contentWidth = screenWidth - 40;

    return (
        <SafeAreaView className="flex-1 h-auto w-screen pb-20 bg-white">
            <AppStatusBar backgroundColor="#112F1E" barStyle="light-content" />

            {/*==== Header band — real baseGreen, shimmer the data parts ====*/}
            <View className="px-5 py-6 bg-baseGreen">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <ShimmerBlock width={ 60 } height={ 60 } radius={ 30 } onHeader />
                        <View className="ml-2">
                            <ShimmerBlock width={ 120 } height={ 14 } radius={ 4 } onHeader />
                            <ShimmerBlock width={ 90 } height={ 16 } radius={ 4 } onHeader marginTop={ 8 } />
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <ShimmerBlock width={ 44 } height={ 44 } radius={ 22 } onHeader marginRight={ 12 } />
                        <ShimmerBlock width={ 44 } height={ 44 } radius={ 22 } onHeader />
                    </View>
                </View>

                {/*==== Search box shimmer ====*/}
                <View className="mt-8">
                    <ShimmerBlock width={ contentWidth } height={ 48 } radius={ 12 } onHeader />
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <View className="px-5 py-6">
                    {/*==== Promo hero carousel ====*/}
                    <ShimmerBlock width={ contentWidth } height={ 420 } radius={ 16 } />

                    {/*==== Categories — label row + chips + hero card ====*/}
                    <View className="mt-6">
                        <View className="flex-row items-center justify-between">
                            <ShimmerBlock width={ 80 } height={ 16 } radius={ 4 } />
                            <ShimmerBlock width={ 50 } height={ 14 } radius={ 4 } />
                        </View>

                        <View className="mt-3 flex-row">
                            { [0, 1, 2, 3, 4].map((i) => (
                                <ShimmerBlock key={ `cat-${i}` } width={ 80 } height={ 36 } radius={ 8 } marginRight={ 12 } />
                            )) }
                        </View>

                        <ShimmerBlock width={ contentWidth } height={ 400 } radius={ 12 } marginTop={ 16 } />
                    </View>

                    {/*==== Popular items — horizontal row of vertical cards ====*/}
                    <View className="mt-6">
                        <View className="flex-row items-center justify-between">
                            <ShimmerBlock width={ 110 } height={ 16 } radius={ 4 } />
                            <ShimmerBlock width={ 50 } height={ 14 } radius={ 4 } />
                        </View>

                        <View className="mt-3 flex-row">
                            { [0, 1, 2, 3, 4].map((i) => (
                                <ShimmerBlock key={ `pop-${i}` } width={ 150 } height={ 220 } radius={ 16 } marginRight={ 12 } />
                            )) }
                        </View>
                    </View>

                    {/*==== Bespoke promo banner ====*/}
                    <ShimmerBlock width={ contentWidth } height={ 160 } radius={ 16 } marginTop={ 24 } />

                    {/*==== Newest arrivals — horizontal row of horizontal cards ====*/}
                    <View className="mt-6">
                        <View className="flex-row items-center justify-between">
                            <ShimmerBlock width={ 120 } height={ 16 } radius={ 4 } />
                            <ShimmerBlock width={ 50 } height={ 14 } radius={ 4 } />
                        </View>

                        <View className="mt-3 flex-row">
                            { [0, 1, 2].map((i) => (
                                <ShimmerBlock key={ `new-${i}` } width={ 300 } height={ 150 } radius={ 16 } marginRight={ 12 } />
                            )) }
                        </View>
                    </View>

                    {/*==== Signup banner ====*/}
                    <ShimmerBlock width={ contentWidth } height={ 160 } radius={ 16 } marginTop={ 24 } />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeSkeletonLoader;
