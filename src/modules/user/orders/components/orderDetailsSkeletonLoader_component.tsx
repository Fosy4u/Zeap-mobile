import React from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

// Skeleton for the Order Details body — mirrors the four-card layout:
//   1. Order summary (id / item count / placed-on / total + progress bar)
//   2. Items in your order (horizontal scroll of product order cards)
//   3. Payment information (status pill + 4 rows)
//   4. Delivery address (title + address + phone + name + region)
//   plus the View Receipt CTA at the bottom.
//
// Rendered inside the screen's ScrollView while orderDetails is fetching,
// so the header (back button + title + divider) stays clickable.

const OrderDetailsSkeletonLoader = () => {
    const screenWidth = useWindowDimensions().width;
    // Order details body lives inside px-5 (20px each side).
    const cardWidth = screenWidth - 40;
    const innerWidth = cardWidth - 32; // minus card's own p-4 padding

    const Row = ({ marginTop = 12 }: { marginTop?: number }) => (
        <View style={{ marginTop }}>
            <SkeletonBlock width={ innerWidth } height={ 12 } radius={ 4 } />
        </View>
    );

    return (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={ false }>
            {/*==== Order summary card ====*/}
            <View className="mt-5 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                <SkeletonBlock width={ 200 } height={ 14 } radius={ 4 } />
                <View style={{ marginTop: 8 }}>
                    <SkeletonBlock width={ 60 } height={ 12 } radius={ 4 } />
                </View>
                <View style={{ marginTop: 6 }}>
                    <SkeletonBlock width={ 140 } height={ 12 } radius={ 4 } />
                </View>
                <View style={{ marginTop: 6 }}>
                    <SkeletonBlock width={ 100 } height={ 12 } radius={ 4 } />
                </View>

                <View style={{ marginTop: 16 }}>
                    <SkeletonBlock width={ 130 } height={ 10 } radius={ 4 } />
                    <View style={{ marginTop: 6 }}>
                        <SkeletonBlock width={ innerWidth } height={ 8 } radius={ 10 } />
                    </View>
                </View>
            </View>

            {/*==== Items in your order — horizontal cards ====*/}
            <View style={{ marginTop: 28 }}>
                <SkeletonBlock width={ 200 } height={ 14 } radius={ 4 } />
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={ false }
                style={{ marginTop: 8 }}
            >
                { [0, 1].map((i) => (
                    <View key={ `item-${i}` } style={{ marginRight: 8 }}>
                        <View className="p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]" style={{ width: 320 }}>
                            <SkeletonBlock width={ 70 } height={ 20 } radius={ 4 } />
                            <View style={{ marginTop: 12 }} className="flex-row">
                                <SkeletonBlock width={ 80 } height={ 115 } radius={ 8 } />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <SkeletonBlock width={ 180 } height={ 14 } radius={ 4 } />
                                    <View style={{ marginTop: 8 }}>
                                        <SkeletonBlock width={ 100 } height={ 10 } radius={ 4 } />
                                    </View>
                                    <View style={{ marginTop: 6 }}>
                                        <SkeletonBlock width={ 60 } height={ 10 } radius={ 4 } />
                                    </View>
                                    <View style={{ marginTop: 8 }}>
                                        <SkeletonBlock width={ 80 } height={ 12 } radius={ 4 } />
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: 16 }}>
                                <SkeletonBlock width={ 320 - 32 } height={ 55 } radius={ 12 } />
                            </View>
                        </View>
                    </View>
                )) }
            </ScrollView>

            {/*==== Payment information ====*/}
            <View style={{ marginTop: 28 }}>
                <SkeletonBlock width={ 170 } height={ 14 } radius={ 4 } />
            </View>
            <View className="mt-2 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                <SkeletonBlock width={ 80 } height={ 22 } radius={ 4 } />
                <Row />
                <Row />
                <Row />
                <Row marginTop={ 16 } />
            </View>

            {/*==== Delivery address ====*/}
            <View className="mt-5 p-4 rounded-xl border border-gray-200 bg-[#F7F8FC]">
                <SkeletonBlock width={ 140 } height={ 14 } radius={ 4 } />
                <Row marginTop={ 16 } />
                <Row />
                <Row />
                <Row />
            </View>

            {/*==== View Receipt CTA ====*/}
            <View style={{ marginTop: 24, marginBottom: 16 }}>
                <SkeletonBlock width={ cardWidth } height={ 55 } radius={ 12 } />
            </View>
        </ScrollView>
    );
};

export default OrderDetailsSkeletonLoader;
