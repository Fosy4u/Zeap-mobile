import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import SkeletonBlock from '../../../general/components/skeletonBlock_component';

// Loading placeholder for the Vendor Product Details screen. Mirrors the real
// layout — status/group pills, title, price + rating row, the large hero image,
// the thumbnail strip, the tab row and a few description lines — so the screen
// keeps its shape while /product fetches, instead of a blocking full-screen
// spinner.
const VendorProductDetailsSkeletonComponent: React.FC = () => {
    const contentWidth = Dimensions.get('window').width - 40; // px-5 each side

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            className="h-full w-full mt-2 px-5 pt-3"
        >
            {/*==== Group label + status pills ====*/}
            <View className="flex-row items-center" style={{ gap: 12 }}>
                <SkeletonBlock width={ 90 } height={ 26 } radius={ 6 } />
                <SkeletonBlock width={ 70 } height={ 26 } radius={ 6 } />
            </View>

            {/*==== Title ====*/}
            <View className="mt-3">
                <SkeletonBlock width={ contentWidth * 0.7 } height={ 26 } radius={ 6 } />
            </View>

            {/*==== Price + rating/stock ====*/}
            <View className="mt-3 flex-row items-center" style={{ gap: 12 }}>
                <SkeletonBlock width={ 110 } height={ 20 } radius={ 6 } />
                <SkeletonBlock width={ 70 } height={ 16 } radius={ 6 } />
            </View>
            <View className="mt-2.5 flex-row items-center" style={{ gap: 12 }}>
                <SkeletonBlock width={ 80 } height={ 16 } radius={ 6 } />
                <SkeletonBlock width={ 80 } height={ 16 } radius={ 6 } />
            </View>

            {/*==== Hero image ====*/}
            <View className="mt-4">
                <SkeletonBlock width={ contentWidth } height={ 420 } radius={ 16 } />
            </View>

            {/*==== Thumbnails ====*/}
            <View className="mt-5 flex-row" style={{ gap: 12 }}>
                { [0, 1, 2, 3].map((i) => (
                    <SkeletonBlock key={ i } width={ 64 } height={ 64 } radius={ 10 } />
                )) }
            </View>

            {/*==== Tabs ====*/}
            <View className="mt-6 flex-row" style={{ gap: 16 }}>
                <SkeletonBlock width={ 90 } height={ 18 } radius={ 6 } />
                <SkeletonBlock width={ 70 } height={ 18 } radius={ 6 } />
                <SkeletonBlock width={ 80 } height={ 18 } radius={ 6 } />
            </View>

            {/*==== Description lines ====*/}
            <View className="mt-5" style={{ gap: 12 }}>
                <SkeletonBlock width={ contentWidth } height={ 14 } radius={ 6 } />
                <SkeletonBlock width={ contentWidth } height={ 14 } radius={ 6 } />
                <SkeletonBlock width={ contentWidth * 0.85 } height={ 14 } radius={ 6 } />
                <SkeletonBlock width={ contentWidth * 0.6 } height={ 14 } radius={ 6 } />
            </View>
        </ScrollView>
    );
};

export default VendorProductDetailsSkeletonComponent;
