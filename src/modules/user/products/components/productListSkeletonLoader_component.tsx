import React from "react";
import { View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

// Skeleton for the Product list / Search results body.
//
// Each row mirrors ProductListCard:
//   • left  : 160×130 image card with a small heart-icon placeholder top-right
//   • right : title (2 lines) + category pill + price line
//
// Used by both productListScreen and searchResultsScreen — they share the
// same FlatList of ProductListCard rows, so they share the same skeleton.

interface IProps {
    rows?: number;
}

const ProductListSkeletonLoader: React.FC<IProps> = ({ rows = 5 }) => {
    return (
        <View>
            { Array.from({ length: rows }, (_, i) => (
                <View
                    key={ `product-list-skeleton-${i}` }
                    className="w-full mt-4 px-4 py-3 flex-row rounded-xl bg-[#F8F9FE]"
                >
                    <View className="relative mr-4">
                        <SkeletonBlock width={ 130 } height={ 150 } radius={ 12 } />
                        <View style={{ position: "absolute", top: 0, right: 0 }}>
                            <SkeletonBlock width={ 35 } height={ 35 } radius={ 12 } baseColor="#d6d6d6" />
                        </View>
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <SkeletonBlock width={ 180 } height={ 14 } radius={ 4 } />
                        <View style={{ marginTop: 6 }}>
                            <SkeletonBlock width={ 140 } height={ 14 } radius={ 4 } />
                        </View>
                        <View style={{ marginTop: 14 }}>
                            <SkeletonBlock width={ 90 } height={ 24 } radius={ 8 } />
                        </View>
                        <View style={{ marginTop: 14, flexDirection: "row", alignItems: "center" }}>
                            <SkeletonBlock width={ 80 } height={ 16 } radius={ 4 } />
                            <View style={{ marginLeft: 10 }}>
                                <SkeletonBlock width={ 60 } height={ 12 } radius={ 4 } />
                            </View>
                        </View>
                    </View>
                </View>
            )) }
        </View>
    );
};

export default ProductListSkeletonLoader;
