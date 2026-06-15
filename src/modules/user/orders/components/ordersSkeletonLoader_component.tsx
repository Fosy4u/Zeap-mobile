import React from "react";
import { useWindowDimensions, View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

// Skeleton for the Orders list — mirrors OrderCardComponent's layout:
//   • left  : 60×60 count box
//   • right : Order ID label + value, Placed-on label + value
//   • below : small label + 8px progress bar
//
// Rendered in place of the FlatList while the orders fetch is in flight, so
// the screen's header / search / filter chrome stays interactive and the
// transition into real cards is layout-stable.

const OrdersSkeletonLoader = () => {
    const screenWidth = useWindowDimensions().width;
    // Orders list lives inside px-5 (20px each side).
    const cardWidth = screenWidth - 40;

    return (
        <View className="px-5" style={{ marginTop: 16 }}>
            { [0, 1, 2, 3, 4].map((i) => (
                <View
                    key={ `order-skeleton-${i}` }
                    className="w-full mt-4 p-4 rounded-xl border border-gray-200 bg-[#F8F9FE]"
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <SkeletonBlock width={ 60 } height={ 60 } radius={ 8 } />
                            <View style={{ marginLeft: 12 }}>
                                <SkeletonBlock width={ 70 } height={ 10 } radius={ 4 } />
                                <View style={{ marginTop: 6 }}>
                                    <SkeletonBlock width={ 110 } height={ 14 } radius={ 4 } />
                                </View>
                            </View>
                        </View>
                        <View className="items-end">
                            <SkeletonBlock width={ 70 } height={ 10 } radius={ 4 } />
                            <View style={{ marginTop: 6 }}>
                                <SkeletonBlock width={ 90 } height={ 14 } radius={ 4 } />
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 16 }}>
                        <SkeletonBlock width={ 130 } height={ 10 } radius={ 4 } />
                        <View style={{ marginTop: 6 }}>
                            <SkeletonBlock width={ cardWidth - 32 } height={ 8 } radius={ 10 } />
                        </View>
                    </View>
                </View>
            )) }
        </View>
    );
};

export default OrdersSkeletonLoader;
