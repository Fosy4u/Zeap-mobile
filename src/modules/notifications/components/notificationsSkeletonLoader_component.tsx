import React from "react";
import { View } from "react-native";
import SkeletonBlock from "../../general/components/skeletonBlock_component";

// Skeleton for the Notifications inbox.
//
// Each card mirrors the real notification:
//   • left  : 45×45 icon
//   • right : title + body lines
//   • below : timestamp on the left, trash button placeholder on the right
//
// The screen's AppHeaderComp stays mounted above, so the skeleton only takes
// the body region.

const NotificationsSkeletonLoader = () => {
    return (
        <View className="px-5" style={{ marginTop: 20 }}>
            { [0, 1, 2, 3, 4].map((i) => (
                <View
                    key={ `notification-skeleton-${i}` }
                    className="w-full mt-4 p-4 rounded-xl border border-gray-200 bg-[#F8F9FE]"
                >
                    <View className="flex-row items-start">
                        <SkeletonBlock width={ 45 } height={ 45 } radius={ 12 } />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <SkeletonBlock width={ 180 } height={ 14 } radius={ 4 } />
                            <View style={{ marginTop: 8 }}>
                                <SkeletonBlock width={ 240 } height={ 10 } radius={ 4 } />
                            </View>
                            <View style={{ marginTop: 6 }}>
                                <SkeletonBlock width={ 200 } height={ 10 } radius={ 4 } />
                            </View>
                        </View>
                    </View>

                    <View className="mt-3 flex-row items-end justify-between">
                        <SkeletonBlock width={ 110 } height={ 12 } radius={ 4 } />
                        <SkeletonBlock width={ 36 } height={ 36 } radius={ 18 } />
                    </View>
                </View>
            )) }
        </View>
    );
};

export default NotificationsSkeletonLoader;
