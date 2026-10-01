import React from "react";
import { View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

// Skeleton for the Join Promo screen — mirrors the promo card:
//   • title + subtitle, date range, discount row
//   • description line and the allowed-product chips

const PromoSkeletonLoader = () => {
    return (
        <View>
            { [0, 1, 2].map((i) => (
                <View
                    key={ `promo-skeleton-${i}` }
                    className="my-3 px-4 py-5 border border-gray-200 rounded-xl bg-grey-50"
                >
                    <SkeletonBlock width={ 170 } height={ 16 } radius={ 4 } />
                    <View style={{ marginTop: 8 }}>
                        <SkeletonBlock width={ 80 } height={ 12 } radius={ 4 } />
                    </View>

                    <View style={{ marginTop: 16 }}>
                        <SkeletonBlock width={ 200 } height={ 14 } radius={ 4 } />
                    </View>

                    <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center" }}>
                        <SkeletonBlock width={ 80 } height={ 14 } radius={ 4 } />
                        <View style={{ marginLeft: 10 }}>
                            <SkeletonBlock width={ 50 } height={ 18 } radius={ 4 } />
                        </View>
                    </View>

                    <View style={{ marginTop: 16 }}>
                        <SkeletonBlock width={ 260 } height={ 12 } radius={ 4 } />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <SkeletonBlock width={ 120 } height={ 12 } radius={ 4 } />
                    </View>

                    <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap" }}>
                        { [130, 130, 90, 120, 100].map((width, chipIndex) => (
                            <View key={ `promo-skeleton-chip-${chipIndex}` } style={{ marginRight: 8, marginTop: 8 }}>
                                <SkeletonBlock width={ width } height={ 24 } radius={ 6 } />
                            </View>
                        )) }
                    </View>
                </View>
            )) }
        </View>
    );
};

export default PromoSkeletonLoader;
