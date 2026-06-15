import React from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

// Skeleton for the Product Details body. Mirrors the layout produced by
// ProductImagesAndColorsComponent + the tab bar + the Similar Items rail:
//
//   • category pill + status pill row, then product title
//   • hero image card (~500h, aspect 0.68)
//   • thumbnail row (75×75 each)
//   • price line
//   • "Available Colours" label + color swatch row
//   • "Available Sizes" label + size square row
//   • Add to Cart CTA
//   • Description / Reviews / Timeline tab bar
//   • Description body (lines)
//   • Similar Items horizontal rail (vertical 150×220 cards)
//
// Rendered inside the screen's ScrollView while the product fetch is in
// flight — the back-button header stays mounted above so the user can bail
// out at any time.

const ProductDetailsSkeletonLoader = () => {
    const screenWidth = useWindowDimensions().width;
    // Hero/body lives inside px-5 (20px each side).
    const contentWidth = screenWidth - 40;

    return (
        <ScrollView showsVerticalScrollIndicator={ false } className="mt-[15px]">
            {/*==== Type pill + status pill row ====*/}
            <View className="px-5 pt-5 flex-row items-center">
                <SkeletonBlock width={ 90 } height={ 26 } radius={ 6 } />
                <View style={{ marginLeft: 12 }}>
                    <SkeletonBlock width={ 70 } height={ 24 } radius={ 6 } />
                </View>
            </View>

            {/*==== Title ====*/}
            <View className="px-5" style={{ marginTop: 12 }}>
                <SkeletonBlock width={ contentWidth - 80 } height={ 22 } radius={ 6 } />
                <View style={{ marginTop: 8 }}>
                    <SkeletonBlock width={ contentWidth - 160 } height={ 22 } radius={ 6 } />
                </View>
            </View>

            {/*==== Hero image card ====*/}
            <View className="mt-3 px-5">
                <View className="p-2 rounded-xl border border-gray-200 bg-[#EDEFF4]">
                    <SkeletonBlock width={ contentWidth - 16 } height={ 500 } radius={ 12 } />
                </View>
            </View>

            {/*==== Thumbnails ====*/}
            <View className="mt-5 px-5 flex-row">
                { [0, 1, 2, 3].map((i) => (
                    <View key={ `thumb-${i}` } style={{ marginRight: 8 }}>
                        <SkeletonBlock width={ 75 } height={ 75 } radius={ 16 } />
                    </View>
                )) }
            </View>

            {/*==== Price ====*/}
            <View className="mt-5 px-5 flex-row items-center">
                <SkeletonBlock width={ 120 } height={ 26 } radius={ 6 } />
                <View style={{ marginLeft: 12 }}>
                    <SkeletonBlock width={ 80 } height={ 18 } radius={ 4 } />
                </View>
            </View>

            {/*==== Available Colours ====*/}
            <View className="mt-7 px-5">
                <SkeletonBlock width={ 140 } height={ 14 } radius={ 4 } />
                <View style={{ marginTop: 12, flexDirection: "row" }}>
                    { [0, 1, 2, 3, 4].map((i) => (
                        <View key={ `color-${i}` } style={{ marginRight: 16 }}>
                            <SkeletonBlock width={ 28 } height={ 28 } radius={ 14 } />
                        </View>
                    )) }
                </View>
            </View>

            {/*==== Available Sizes ====*/}
            <View className="mt-7 px-5">
                <SkeletonBlock width={ 130 } height={ 14 } radius={ 4 } />
                <View style={{ marginTop: 12, flexDirection: "row" }}>
                    { [0, 1, 2, 3, 4].map((i) => (
                        <View key={ `size-${i}` } style={{ marginRight: 16 }}>
                            <SkeletonBlock width={ 50 } height={ 40 } radius={ 12 } />
                        </View>
                    )) }
                </View>
            </View>

            {/*==== Add To Cart CTA ====*/}
            <View className="mt-7 px-5">
                <SkeletonBlock width={ contentWidth } height={ 55 } radius={ 12 } />
            </View>

            {/*==== Tab bar ====*/}
            <View className="mt-8 px-5 flex-row justify-between">
                <SkeletonBlock width={ 100 } height={ 16 } radius={ 4 } />
                <SkeletonBlock width={ 80 } height={ 16 } radius={ 4 } />
                <SkeletonBlock width={ 90 } height={ 16 } radius={ 4 } />
            </View>

            {/*==== Description body lines ====*/}
            <View className="mt-4 px-5">
                <SkeletonBlock width={ contentWidth } height={ 12 } radius={ 4 } />
                <View style={{ marginTop: 8 }}>
                    <SkeletonBlock width={ contentWidth } height={ 12 } radius={ 4 } />
                </View>
                <View style={{ marginTop: 8 }}>
                    <SkeletonBlock width={ contentWidth - 60 } height={ 12 } radius={ 4 } />
                </View>
                <View style={{ marginTop: 8 }}>
                    <SkeletonBlock width={ contentWidth - 100 } height={ 12 } radius={ 4 } />
                </View>
            </View>

            {/*==== Similar Items rail ====*/}
            <View className="my-12 px-5">
                <View className="flex-row justify-between items-center">
                    <SkeletonBlock width={ 100 } height={ 16 } radius={ 4 } />
                    <SkeletonBlock width={ 50 } height={ 14 } radius={ 4 } />
                </View>

                <View className="mt-3 flex-row">
                    { [0, 1, 2, 3, 4].map((i) => (
                        <View key={ `sim-${i}` } style={{ marginRight: 12 }}>
                            <SkeletonBlock width={ 150 } height={ 220 } radius={ 16 } />
                        </View>
                    )) }
                </View>
            </View>
        </ScrollView>
    );
};

export default ProductDetailsSkeletonLoader;
