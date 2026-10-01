import React from 'react';
import { View } from 'react-native';
import SkeletonBlock from '../../../general/components/skeletonBlock_component';

// Receipt-shaped skeleton shown while the order details are being fetched —
// mirrors the real receipt card (logo, contact lines, receipt-to/order meta,
// items header + rows, totals) so the screen never flashes a stale receipt.
const ReceiptSkeletonLoader: React.FC = () => {
    return (
        <View className="mx-5 mt-3 px-5 py-5 rounded-xl bg-white">
            {/* Logo */}
            <SkeletonBlock width={ 36 } height={ 36 } radius={ 8 } />

            {/* Contact lines */}
            <View className="mt-3" style={{ gap: 6 }}>
                <SkeletonBlock width={ 160 } height={ 12 } radius={ 4 } />
                <SkeletonBlock width={ 180 } height={ 12 } radius={ 4 } />
                <SkeletonBlock width={ 170 } height={ 12 } radius={ 4 } />
            </View>

            {/* Receipt to / order meta */}
            <View className="mt-6 flex-row items-start justify-between">
                <View style={{ gap: 6 }}>
                    <SkeletonBlock width={ 90 } height={ 14 } radius={ 4 } />
                    <SkeletonBlock width={ 120 } height={ 12 } radius={ 4 } />
                    <SkeletonBlock width={ 150 } height={ 12 } radius={ 4 } />
                </View>
                <View className="items-end" style={{ gap: 6 }}>
                    <SkeletonBlock width={ 110 } height={ 12 } radius={ 4 } />
                    <SkeletonBlock width={ 90 } height={ 12 } radius={ 4 } />
                </View>
            </View>

            {/* Items header */}
            <View className="mt-6 pb-3 border-b border-gray-200">
                <SkeletonBlock width={ 80 } height={ 14 } radius={ 4 } />
            </View>

            {/* Item rows */}
            { [0, 1, 2].map((row) => (
                <View key={ row } className="py-2.5 flex-row items-center justify-between">
                    <SkeletonBlock width={ 150 } height={ 14 } radius={ 4 } />
                    <SkeletonBlock width={ 30 } height={ 14 } radius={ 4 } />
                    <SkeletonBlock width={ 70 } height={ 14 } radius={ 4 } />
                </View>
            )) }

            {/* Totals */}
            <View className="mt-4 ml-auto w-[80%]" style={{ gap: 10 }}>
                { [0, 1, 2].map((line) => (
                    <View key={ line } className="flex-row items-center justify-between">
                        <SkeletonBlock width={ 110 } height={ 12 } radius={ 4 } />
                        <SkeletonBlock width={ 70 } height={ 12 } radius={ 4 } />
                    </View>
                )) }
                <View className="mt-2 pt-3 border-t border-gray-200 flex-row items-center justify-between">
                    <SkeletonBlock width={ 60 } height={ 16 } radius={ 4 } />
                    <SkeletonBlock width={ 90 } height={ 16 } radius={ 4 } />
                </View>
            </View>
        </View>
    );
};

export default ReceiptSkeletonLoader;
