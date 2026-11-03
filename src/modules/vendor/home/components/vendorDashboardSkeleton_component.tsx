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
            <View className="w-full px-5 pt-4 pb-5 rounded-b-3xl bg-baseGreen">
                {/* Shop name + bell */}
                <View className="flex-row items-center justify-between">
                    <SkeletonBlock width={ 190 } height={ 20 } radius={ 6 } />
                    <SkeletonBlock width={ 44 } height={ 44 } radius={ 12 } />
                </View>

                {/* Phone + status / service badges */}
                <View className="mt-4">
                    <SkeletonRow width={ 130 } height={ 12 } />
                    <View className="mt-3 flex-row" style={{ columnGap: 8 }}>
                        <SkeletonBlock width={ 58 } height={ 24 } radius={ 999 } />
                        <SkeletonBlock width={ 58 } height={ 24 } radius={ 999 } />
                        <SkeletonBlock width={ 92 } height={ 24 } radius={ 999 } />
                    </View>
                </View>

                {/* Paid revenue card */}
                <View className="mt-5 p-5 py-6 rounded-3xl bg-[#20704329]">
                    <SkeletonBlock width={ 100 } height={ 12 } radius={ 4 } />
                    <View className="mt-2">
                        <SkeletonBlock width={ 130 } height={ 22 } radius={ 4 } />
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={ false }>
                <View className="px-5">

                    {/*==== Add Product ====*/}
                    <View className="mt-5">
                        <SkeletonBlock width={ CONTENT_WIDTH } height={ 55 } radius={ 12 } />
                    </View>

                    {/*==== Overview header + tiles ====*/}
                    <View className="mt-5">
                        <View className="flex-row justify-between items-center">
                            <SkeletonBlock width={ 90 } height={ 16 } radius={ 4 } />
                            <SkeletonBlock width={ 60 } height={ 14 } radius={ 4 } />
                        </View>
                        <View className="mt-3 flex-row justify-between">
                            <SkeletonBlock width={ (CONTENT_WIDTH - 12) / 2 } height={ 85 } radius={ 12 } />
                            <SkeletonBlock width={ (CONTENT_WIDTH - 12) / 2 } height={ 85 } radius={ 12 } />
                        </View>
                    </View>

                    {/*==== Recent Payment ====*/}
                    <View className="mt-5">
                        <SkeletonBlock width={ CONTENT_WIDTH } height={ 200 } radius={ 12 } />
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
