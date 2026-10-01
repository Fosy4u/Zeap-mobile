import React from "react";
import { Dimensions, SafeAreaView, ScrollView, StatusBar, View } from "react-native";
import SkeletonBlock from "../../../general/components/skeletonBlock_component";
import AppStatusBar from "../../../general/components/appStatusBar";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CONTENT_WIDTH = SCREEN_WIDTH - 40; // matches the dashboard's px-5 inset

interface ISkeletonRowProps {
    width: number;
    height: number;
    radius?: number;
    marginTop?: number;
}

const SkeletonRow: React.FC<ISkeletonRowProps> = ({ width, height, radius = 6, marginTop = 0 }) => (
    <View style={{ marginTop }}>
        <SkeletonBlock width={ width } height={ height } radius={ radius } />
    </View>
);

const VendorDashboardSkeletonComponent: React.FC = () => {
    return (
        <SafeAreaView className="h-full w-screen flex-1 pb-[1px] bg-gray-50">
            <AppStatusBar backgroundColor="#133522" barStyle="light-content" />

            {/*==== Hero ====*/}
            <View className="h-[290px] w-full px-5 pt-2 rounded-b-3xl bg-baseGreen">
                {/* Top row: logo + actions */}
                <View className="flex-row items-center justify-between">
                    <SkeletonBlock width={ 90 } height={ 60 } radius={ 6 } />
                    <View className="flex-row items-center">
                        <SkeletonBlock width={ 110 } height={ 34 } radius={ 999 } />
                        <View className="w-2" />
                        <SkeletonBlock width={ 44 } height={ 44 } radius={ 12 } />
                    </View>
                </View>

                {/* Shop name + greeting + tagline */}
                <View className="mt-3">
                    <SkeletonRow width={ 160 } height={ 14 } />
                    <SkeletonRow width={ 200 } height={ 16 } marginTop={ 8 } />
                    <SkeletonRow width={ 140 } height={ 12 } marginTop={ 6 } />
                </View>

                {/* Revenue card */}
                <View className="mt-5 p-5 py-6 rounded-3xl flex-row justify-between items-center bg-[#20704329]">
                    <View>
                        <SkeletonBlock width={ 100 } height={ 12 } radius={ 4 } />
                        <View className="mt-2">
                            <SkeletonBlock width={ 130 } height={ 22 } radius={ 4 } />
                        </View>
                        <View className="mt-2">
                            <SkeletonBlock width={ 160 } height={ 10 } radius={ 4 } />
                        </View>
                    </View>
                    <SkeletonBlock width={ 44 } height={ 14 } radius={ 4 } />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={ false }>
                <View className="px-5">

                    {/*==== Add Product / Available Promo ====*/}
                    <View className="mt-5 flex-row">
                        <View style={{ flex: 1 }}>
                            <SkeletonBlock width={ (CONTENT_WIDTH - 20) / 2 } height={ 55 } radius={ 12 } />
                        </View>
                        <View className="w-5" />
                        <View style={{ flex: 1 }}>
                            <SkeletonBlock width={ (CONTENT_WIDTH - 20) / 2 } height={ 55 } radius={ 12 } />
                        </View>
                    </View>

                    {/*==== Overview header + tiles ====*/}
                    <View className="mt-4">
                        <View className="flex-row justify-between items-center">
                            <SkeletonBlock width={ 90 } height={ 16 } radius={ 4 } />
                            <SkeletonBlock width={ 60 } height={ 14 } radius={ 4 } />
                        </View>
                        <View className="mt-2 flex-row">
                            <SkeletonBlock width={ 170 } height={ 70 } radius={ 12 } />
                            <View className="w-3" />
                            <SkeletonBlock width={ 170 } height={ 70 } radius={ 12 } />
                        </View>
                    </View>

                    {/*==== Weekly Sales Chart ====*/}
                    <View className="mt-5">
                        <SkeletonBlock width={ CONTENT_WIDTH } height={ 220 } radius={ 12 } />
                    </View>

                    {/*==== Recent Payment ====*/}
                    <View className="mt-5">
                        <SkeletonBlock width={ CONTENT_WIDTH } height={ 130 } radius={ 12 } />
                    </View>

                    {/*==== Product List ====*/}
                    <View className="mt-5 mb-4">
                        <SkeletonBlock width={ CONTENT_WIDTH } height={ 330 } radius={ 16 } />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default VendorDashboardSkeletonComponent;
