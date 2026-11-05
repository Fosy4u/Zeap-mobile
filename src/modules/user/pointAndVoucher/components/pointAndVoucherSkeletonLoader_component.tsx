import React from "react";
import { View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

const PointAndVoucherSkeletonLoader = () => {
    return (
        <View>
            {/*==== Headline card (balance / hero) ====*/}
            <View style={{ marginTop: 20 }}>
                <SkeletonBlock width={ 320 } height={ 140 } radius={ 16 } />
            </View>

            {/*==== Section header ====*/}
            <View style={{ marginTop: 28 }}>
                <SkeletonBlock width={ 160 } height={ 16 } radius={ 4 } />
            </View>

            {/*==== List rows ====*/}
            { [0, 1, 2].map((i) => (
                <View
                    key={ `pv-skel-${i}` }
                    className="w-full mt-4 p-4 rounded-xl border border-gray-200 bg-[#F8F9FE]"
                >
                    <View className="flex-row items-center">
                        <SkeletonBlock width={ 48 } height={ 48 } radius={ 12 } />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <SkeletonBlock width={ 180 } height={ 14 } radius={ 4 } />
                            <View style={{ marginTop: 8 }}>
                                <SkeletonBlock width={ 120 } height={ 12 } radius={ 4 } />
                            </View>
                        </View>
                        <SkeletonBlock width={ 70 } height={ 32 } radius={ 8 } />
                    </View>
                </View>
            )) }
        </View>
    );
};

export default PointAndVoucherSkeletonLoader;
