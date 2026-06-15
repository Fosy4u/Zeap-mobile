import React from "react";
import { View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

// Skeleton for the Measurement screen's saved-templates list.
//
// Mirrors MeasurementCard's redesigned layout:
//   • header row: template name + "Edit"
//   • 2-column tabular preview (2 rows × 2 columns of label/value pairs)
//   • "+N more" line
//
// Rendered while the saved-measurement templates fetch is in flight.

const MeasurementSkeletonLoader = () => {
    return (
        <View>
            { [0, 1, 2].map((cardIdx) => (
                <View
                    key={ `measurement-skeleton-${cardIdx}` }
                    className="w-full mt-4 px-5 py-5 border border-gray-200 rounded-xl bg-[#F8F9FE]"
                >
                    <View className="flex-row items-center justify-between">
                        <SkeletonBlock width={ 200 } height={ 18 } radius={ 4 } />
                        <SkeletonBlock width={ 36 } height={ 16 } radius={ 4 } />
                    </View>

                    {/* 2x2 grid of field/value placeholders. */}
                    <View className="mt-3 flex-row flex-wrap">
                        { [0, 1, 2, 3].map((i) => (
                            <View key={ `mskel-${cardIdx}-${i}` } className="w-1/2 mt-2 pr-3">
                                <SkeletonBlock width={ 110 } height={ 10 } radius={ 4 } />
                                <View style={{ marginTop: 6 }}>
                                    <SkeletonBlock width={ 60 } height={ 14 } radius={ 4 } />
                                </View>
                            </View>
                        )) }
                    </View>

                    <View style={{ marginTop: 14 }}>
                        <SkeletonBlock width={ 70 } height={ 10 } radius={ 4 } />
                    </View>
                </View>
            )) }
        </View>
    );
};

export default MeasurementSkeletonLoader;
