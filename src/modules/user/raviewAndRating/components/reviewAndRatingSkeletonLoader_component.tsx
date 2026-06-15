import React from "react";
import { View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

// Skeleton for the Reviews & Ratings tab content. Approximates 3 review
// rows — image thumbnail + title + 5-star strip + body lines — used by
// both Pending and Given tabs while their initial fetch is in flight.

const ReviewAndRatingSkeletonLoader = () => {
    return (
        <View style={{ marginTop: 20 }}>
            { [0, 1, 2].map((i) => (
                <View
                    key={ `review-skel-${i}` }
                    className="w-full mt-4 p-4 rounded-xl border border-gray-200 bg-[#F8F9FE]"
                >
                    <View className="flex-row items-start">
                        <SkeletonBlock width={ 60 } height={ 80 } radius={ 8 } />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <SkeletonBlock width={ 180 } height={ 14 } radius={ 4 } />
                            <View style={{ marginTop: 8, flexDirection: "row" }}>
                                { [0, 1, 2, 3, 4].map((s) => (
                                    <View key={ `star-${i}-${s}` } style={{ marginRight: 4 }}>
                                        <SkeletonBlock width={ 16 } height={ 16 } radius={ 4 } />
                                    </View>
                                )) }
                            </View>
                            <View style={{ marginTop: 12 }}>
                                <SkeletonBlock width={ 220 } height={ 10 } radius={ 4 } />
                            </View>
                            <View style={{ marginTop: 6 }}>
                                <SkeletonBlock width={ 180 } height={ 10 } radius={ 4 } />
                            </View>
                        </View>
                    </View>
                </View>
            )) }
        </View>
    );
};

export default ReviewAndRatingSkeletonLoader;
