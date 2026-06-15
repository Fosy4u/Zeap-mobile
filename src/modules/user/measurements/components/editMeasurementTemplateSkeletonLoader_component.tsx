import React from "react";
import { ScrollView, View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";

// Skeleton for the EditMeasurementTemplate body — mirrors the layout:
//   • Template name card (read-only display + gender line)
//   • A few garment-group cards, each with a title + several field rows
//     (label + input + "Show Measurement Guide" pill)
//
// Rendered while the bespoke guide is loading; the screen's header stays
// mounted above so the back button is always reachable.

const EditMeasurementTemplateSkeletonLoader = () => {
    return (
        <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={ false }
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}
        >
            {/*==== Template name card ====*/}
            <View className="px-3 py-4 rounded-xl border border-gray-200">
                <SkeletonBlock width={ 140 } height={ 14 } radius={ 4 } />
                <View style={{ marginTop: 12 }}>
                    <SkeletonBlock width={ 200 } height={ 44 } radius={ 12 } />
                </View>
                <View style={{ marginTop: 10 }}>
                    <SkeletonBlock width={ 100 } height={ 10 } radius={ 4 } />
                </View>
            </View>

            {/*==== Garment-group cards ====*/}
            { [0, 1, 2].map((groupIdx) => (
                <View
                    key={ `edit-skel-group-${groupIdx}` }
                    className="mt-5 px-3 py-4 border border-gray-200 rounded-2xl"
                >
                    <SkeletonBlock width={ 160 } height={ 16 } radius={ 4 } />

                    { [0, 1, 2, 3].map((rowIdx) => (
                        <View key={ `edit-skel-row-${groupIdx}-${rowIdx}` } style={{ marginTop: 16 }}>
                            <SkeletonBlock width={ 130 } height={ 12 } radius={ 4 } />
                            <View style={{ marginTop: 8 }}>
                                <SkeletonBlock width={ 320 } height={ 44 } radius={ 12 } />
                            </View>
                            <View style={{ marginTop: 8 }}>
                                <SkeletonBlock width={ 170 } height={ 26 } radius={ 999 } />
                            </View>
                        </View>
                    )) }
                </View>
            )) }

            {/*==== Save CTA ====*/}
            <View style={{ marginTop: 28 }}>
                <SkeletonBlock width={ 320 } height={ 55 } radius={ 12 } />
            </View>
        </ScrollView>
    );
};

export default EditMeasurementTemplateSkeletonLoader;
