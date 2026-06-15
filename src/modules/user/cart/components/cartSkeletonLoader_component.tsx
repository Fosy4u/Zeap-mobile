import React from "react";
import { useWindowDimensions, View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

// Skeleton for the Cart screen body. Mirrors the actual layout:
//   • 3 basket-item rows (image 80×120 + title + color/size meta + qty stepper
//     + price + trash)
//   • Subtotal row
//   • Checkout + Continue Shopping CTAs
//   • Similar items horizontal rail (vertical 150×220 cards)
//
// Rendered inside the cart screen's ScrollView while the initial cart fetch
// is in flight, replacing the previous full-screen AppLoader overlay. The
// screen's header (notification button) stays interactive.

const CartSkeletonLoader = () => {
    const screenWidth = useWindowDimensions().width;
    // Cart screen uses px-5 (20px each side).
    const contentWidth = screenWidth - 40;

    return (
        <View>
            { [0, 1, 2].map((i) => (
                <View key={ `cart-row-${i}` } className="w-full">
                    <View className="w-full pt-5 pb-1 flex-row items-center">
                        <SkeletonBlock width={ 80 } height={ 120 } radius={ 8 } />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <SkeletonBlock width={ contentWidth - 100 } height={ 14 } radius={ 4 } />

                            <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                                <SkeletonBlock width={ 70 } height={ 12 } radius={ 4 } />
                                <View style={{ width: 1, height: 16, marginHorizontal: 16, backgroundColor: "#e5e7eb" }} />
                                <SkeletonBlock width={ 50 } height={ 12 } radius={ 4 } />
                            </View>

                            <View style={{ marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <SkeletonBlock width={ 30 } height={ 30 } radius={ 8 } />
                                    <View style={{ marginHorizontal: 10 }}>
                                        <SkeletonBlock width={ 20 } height={ 20 } radius={ 4 } />
                                    </View>
                                    <SkeletonBlock width={ 30 } height={ 30 } radius={ 8 } />
                                </View>
                                <SkeletonBlock width={ 80 } height={ 18 } radius={ 4 } />
                                <SkeletonBlock width={ 20 } height={ 20 } radius={ 4 } />
                            </View>
                        </View>
                    </View>
                    <View className="h-[1px] w-full mt-2 bg-gray-200" />
                </View>
            )) }

            {/*==== Subtotal ====*/}
            <View className="mt-5 flex-row justify-between items-center">
                <SkeletonBlock width={ 80 } height={ 16 } radius={ 4 } />
                <SkeletonBlock width={ 110 } height={ 18 } radius={ 4 } />
            </View>
            <View style={{ marginTop: 6 }}>
                <SkeletonBlock width={ 180 } height={ 10 } radius={ 4 } />
            </View>

            {/*==== CTAs ====*/}
            <View style={{ marginTop: 30 }}>
                <SkeletonBlock width={ contentWidth } height={ 55 } radius={ 12 } />
            </View>
            <View style={{ marginTop: 12 }}>
                <SkeletonBlock width={ contentWidth } height={ 55 } radius={ 12 } />
            </View>

            {/*==== Similar items rail ====*/}
            <View style={{ marginTop: 40 }}>
                <View className="flex-row justify-between items-center">
                    <SkeletonBlock width={ 100 } height={ 16 } radius={ 4 } />
                    <SkeletonBlock width={ 50 } height={ 14 } radius={ 4 } />
                </View>
                <View style={{ marginTop: 12, flexDirection: "row" }}>
                    { [0, 1, 2, 3].map((i) => (
                        <View key={ `cart-sim-${i}` } style={{ marginRight: 12 }}>
                            <SkeletonBlock width={ 150 } height={ 220 } radius={ 16 } />
                        </View>
                    )) }
                </View>
            </View>
        </View>
    );
};

export default CartSkeletonLoader;
