import React from "react";
import { View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

// Skeleton for the Address screen — mirrors the saved-address card:
//   • top row: name + edit/delete icons
//   • phone, address, region rows
//   • set-as-default chip at the bottom right

const AddressSkeletonLoader = () => {
    return (
        <View>
            { [0, 1, 2].map((i) => (
                <View
                    key={ `address-skeleton-${i}` }
                    className="w-full mt-4 px-[15px] py-5 relative border border-gray-200 rounded-xl bg-[#F8F9FE]"
                >
                    <View className="flex-row items-center justify-between">
                        <SkeletonBlock width={ 160 } height={ 16 } radius={ 4 } />
                        <View style={{ flexDirection: "row" }}>
                            <SkeletonBlock width={ 22 } height={ 22 } radius={ 6 } />
                            <View style={{ width: 10 }} />
                            <SkeletonBlock width={ 22 } height={ 22 } radius={ 6 } />
                        </View>
                    </View>

                    <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center" }}>
                        <SkeletonBlock width={ 16 } height={ 16 } radius={ 4 } />
                        <View style={{ marginLeft: 10 }}>
                            <SkeletonBlock width={ 130 } height={ 12 } radius={ 4 } />
                        </View>
                    </View>

                    <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center" }}>
                        <SkeletonBlock width={ 16 } height={ 16 } radius={ 4 } />
                        <View style={{ marginLeft: 10 }}>
                            <SkeletonBlock width={ 220 } height={ 12 } radius={ 4 } />
                        </View>
                    </View>

                    <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center" }}>
                        <SkeletonBlock width={ 16 } height={ 16 } radius={ 4 } />
                        <View style={{ marginLeft: 10 }}>
                            <SkeletonBlock width={ 110 } height={ 12 } radius={ 4 } />
                        </View>
                    </View>

                    <View style={{ position: "absolute", bottom: 12, right: 16 }}>
                        <SkeletonBlock width={ 100 } height={ 28 } radius={ 8 } />
                    </View>
                </View>
            )) }
        </View>
    );
};

export default AddressSkeletonLoader;
