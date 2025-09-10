import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import AppHeaderComp from '../../general/components/appHeader_comp';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ArrowRight, Calendar } from 'iconsax-react-native';
import { PieChart } from 'react-native-gifted-charts';
import formatCurrency from '../../../../utils/formatCurrency';

const OverviewScreen = () => {
    const { overviews, salesCountPieData, salesRevenuePieData } = useSelector((state: RootState) => state.vendorHomeState);
    const totalCount = salesCountPieData.reduce((acc, item) => acc + item.value, 0);
    const totalRevenue = salesRevenuePieData.reduce((acc, item) => acc + item.value, 0);

    return (
        <SafeAreaView className="flex-1 h-auto w-screen pb-2 bg-gray-50">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />

            {/* ==== Header ==== */}
            <AppHeaderComp title="Overview" />

            {/*==== Payment List ====*/}
            <ScrollView 
                className="w-full mt-1 px-3"
                showsHorizontalScrollIndicator={ false }
            >
                <View className="w-full mt-2 flex-row flex-wrap">
                    { overviews.map((overview) => (
                        <View
                            key={ overview.name } 
                            className="w-1/2 p-2"
                        >
                            <View className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-lightGray">
                                <Text className="font-montserratMedium text-lg">{ overview.count }</Text>
                                <Text className="mt-1.5 font-montserratMedium text-sm">{ overview.name }</Text>
                            </View>
                        </View>
                    )) }
                </View>

                {/* ==== Sales Count Chart ==== */}
                <View className="h-auto w-auto mt-3 mx-2 px-2.5 py-3.5 border border-gray-200 rounded-xl bg-lightGray">
                    <View className="flex-row items-center justify-between">
                        <Text className="font-montserratNormal text-base text-baseGreen">Sales Count</Text>
                        <View className="px-2 py-1.5 flex-row items-center border border-gray-200 rounded-lg bg-gray-50">
                            <Text className="mr-2 text-xs text-gray-600">12-18, Aug</Text>
                            <Calendar color="#6b7280" size={ 14 } />
                        </View>
                    </View>

                    <View className="h-auto w-full mt-4 flex-row items-center justify-center flex-wrap gap-x-4">
                        { (salesCountPieData.length > 0) && salesCountPieData.map((eachData) => (
                            <View key={ eachData.title }
                                className="mt-2 flex-row items-center"
                            >
                                <View className="h-4 w-4  mr-1 rounded-[4px]" style={ { backgroundColor: eachData.color } } />
                                <Text className="text-xs">{ eachData.title } = { eachData.value }</Text>
                            </View>
                        ))}
                    </View>

                    <View className="h-auto w-full mt-2 py-5 flex-row items-center justify-center overflow-hidden">
                        { (salesCountPieData.length > 0) && (
                            <PieChart
                                data={salesCountPieData}
                                donut
                                focusOnPress
                                textColor="black"
                                centerLabelComponent={() => (
                                    <View>
                                        <Text className="font-medium text-baseGreen text-xl text-center">{ totalCount }</Text>
                                        <Text className="text-xs text-center">Total Sales</Text>
                                    </View>
                                )}
                                radius={120}
                                innerRadius={60}
                                // onPress={ (item: any) => setFocusedItem(item) }
                            />
                        )}
                    </View>
                </View>

                {/* ==== Sales Revenue Chart ==== */}
                <View className="h-auto w-auto mt-5 mx-2 px-2.5 py-3.5 border border-gray-200 rounded-xl bg-lightGray">
                    <View className="flex-row items-center justify-between">
                        <Text className="font-normal text-base text-baseGreen">Sales Revenue</Text>
                        <View className="px-2 py-1.5 flex-row items-center border border-gray-200 rounded-lg bg-gray-50">
                            <Text className="mr-2 text-xs text-gray-600">12-18, Aug</Text>
                            <Calendar color="#6b7280" size={ 14 } />
                        </View>
                    </View>

                    <View className="h-auto w-full mt-4 flex-row items-center justify-center flex-wrap gap-x-4">
                        { (salesRevenuePieData.length > 0) && salesRevenuePieData.map((eachData) => (
                            <View key={ eachData.title }
                                className="mt-2 flex-row items-center"
                            >
                                <View className="h-4 w-4  mr-1 rounded-[4px]" style={ { backgroundColor: eachData.color } } />
                                <Text className="text-xs">{ eachData.title } = { formatCurrency(eachData.value, eachData.currency!) }</Text>
                            </View>
                        ))}
                    </View>

                    <View className="h-auto w-full mt-2 py-5 flex-row items-center justify-center overflow-hidden">
                        { (salesRevenuePieData.length > 0) && (
                            <PieChart
                                data={salesRevenuePieData}
                                donut
                                focusOnPress
                                textColor="black"
                                centerLabelComponent={() => (
                                    <View>
                                        <Text className="font-medium text-baseGreen text-xl text-center">{ formatCurrency(totalRevenue, salesRevenuePieData[0].currency!) }</Text>
                                        <Text className="text-xs text-center">Revenue</Text>
                                    </View>
                                )}
                                radius={120}
                                innerRadius={70}
                                // onPress={ (item: any) => setFocusedItem(item) }
                            />
                        )}
                    </View>
                </View>

                <TouchableOpacity 
                    onPress={ () => null }
                    className="h-[55px] w-auto mx-2 my-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                    <Text className="text-lg text-white mr-2">Generate Report</Text>
                    <ArrowRight className="text-white" />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default OverviewScreen;