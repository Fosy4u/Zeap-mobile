import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import IPoint from '../models/point_model';
import FastImage from 'react-native-fast-image';
import { ArrowRight } from 'iconsax-react-native';
import usePointAndVoucherHook from '../hooks/pointAndVoucher_hook';

interface IProps {
    points: IPoint;
};

const PointsComponent: React.FC<IProps> = (props: IProps) => {
    const { points } = props;
    const [state, setState] = React.useState({
        isShowConvertInput: false,
        pointsToConvert: 0,
    });

    const handleShowConvertInput = () => {
        setState((prevState) => ({
            ...prevState,
            isShowConvertInput: !prevState.isShowConvertInput,
        }));
    };
    const handleUpdatePointsToConvert = (value: string) => {
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue)) {
            setState((prevState) => ({
                ...prevState,
                pointsToConvert: numericValue,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                pointsToConvert: 0,
            }));
        }
    };

    const { handleConvertPoints } = usePointAndVoucherHook();

    return (
        points.availablePoints > 0 ? (
            <ScrollView
                showsHorizontalScrollIndicator={ false }
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={{ paddingTop: 20 }}
                className="mt-5 flex-1 bg-white"
            >
                <View className="h-auto flex-row items-center justify-center rounded-xl bg-[#FBF7F2]">
                    <View className="h-[100px] w-[80px] relative items-center justify-center rounded-xl bg-gold">
                        <Text className="font-montserratMedium -rotate-90">Points</Text>
                        <View className="h-6 w-6 absolute -left-3 rounded-full bg-white"></View>
                    </View>
                    <View className="h-auto w-full px-5 py-4 flex-1 items-start">
                        <Text className="font-montserratNormal text-base text-gray-600">Total Points</Text>
                        <Text className="font-montserratSemiBold text-2xl text-gray-600">{ new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(points.totalPoints) }</Text>
                    </View>
                </View>

                <View className="h-auto mt-5 flex-row items-center justify-center rounded-xl bg-green-50">
                    <View className="h-[100px] w-[80px] relative items-center justify-center rounded-xl bg-green-600">
                        <Text className="font-montserratMedium text-white -rotate-90">Points</Text>
                        <View className="h-6 w-6 absolute -left-3 rounded-full bg-white"></View>
                    </View>
                    <View className="h-auto w-full px-5 py-4 flex-1 items-start">
                        <Text className="font-montserratNormal text-base text-gray-600">Available Points</Text>
                        <Text className="font-montserratSemiBold text-2xl text-gray-600">{ new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(points.availablePoints) }</Text>
                    </View>
                </View>

                <View className="h-auto mt-5 flex-row items-center justify-center rounded-xl bg-[#FFF9F8]">
                    <View className="h-[100px] w-[80px] relative items-center justify-center rounded-xl bg-[#FF5734]">
                        <Text className="font-montserratMedium text-white -rotate-90">Points</Text>
                        <View className="h-6 w-6 absolute -left-3 rounded-full bg-white"></View>
                    </View>
                    <View className="h-auto w-full px-5 py-4 flex-1 items-start">
                        <Text className="font-montserratNormal text-base text-gray-600">Redeemed Points</Text>
                        <Text className="font-montserratSemiBold text-2xl text-gray-600">{ new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(points.redeemedPoints) }</Text>
                    </View>
                </View>

                <View className="h-auto my-10 px-5 py-5 rounded-xl bg-lightGray">
                    <Text className="font-montserratSemiBold text-base text-baseGreen">Total Points to Vouchers</Text>
                    <Text className="font-montserratRegular text-xs">You can convert your points into vouchers and redeem them for discounts on your next purchase.</Text>

                    { state.isShowConvertInput && (
                        <View className="mt-5">
                            <Text aria-label="Points" nativeID="points">Enter Points to Convert</Text>
                            <View className="h-auto w-full mt-1.5 px-3 py-1 border border-gray-300 rounded-xl bg-gray-100">
                                <TextInput
                                    aria-label="Points"
                                    aria-labelledby="points"
                                    keyboardType="numeric"
                                    placeholder="Enter points"
                                    placeholderTextColor="#9ca3af"
                                    className="text-base"
                                    onChangeText={(value) => handleUpdatePointsToConvert(value)}
                                    value={ state.pointsToConvert.toString() }
                                />
                            </View>
                        </View>
                    ) }

                
                    <View className="mt-5 flex-row items-center justify-between gap-x-3">
                        { state.isShowConvertInput && (
                            <TouchableOpacity
                                onPress={ () => handleShowConvertInput() }
                                className="h-[55px] w-[40%] mt-5 flex flex-row items-center justify-center rounded-xl bg-lightGreen"
                            >
                                <Text className="text-lg text-baseGreen">Cancel</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            onPress={ () => state.isShowConvertInput ? handleConvertPoints(state.pointsToConvert) : handleShowConvertInput() }
                            className="h-[55px] flex-1 mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                            >
                            <Text className="text-lg text-white mr-2">{ (state.isShowConvertInput) ? "Convert" : "Enter Points to Convert" }</Text>
                            <ArrowRight className="text-white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        ) : (
            <View>
                <View className="h-auto w-full items-center mt-5 py-10 bg-gray-50">
                    <View className="h-[120px] w-[120px] p-4 items-center justify-center bg-white rounded-full">
                        <FastImage
                            source={ require("../../../../../assets/images/empty_point.png") }
                            defaultSource={ require("../../../../../assets/images/empty_point.png") }
                            resizeMode={ FastImage.resizeMode.contain }
                            className="h-[50px] w-full"
                        />
                    </View>

                    <Text className="mt-4 font-montserratSemiBold text-center text-baseGreen">You currently have no available voucher</Text>
                    <Text className="mt-5 font-montserratRegular text-center">{"All your available vouchers will be\ndisplayed here."}</Text>
                </View>

                <TouchableOpacity 
                    onPress={ () => null }
                    className="h-[55px] w-auto mt-8 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                >
                    <Text className="text-lg text-white mr-2">Continue Shopping</Text>
                    <ArrowRight className="text-white" />
                </TouchableOpacity>
            </View>
        )
    );
};

export default PointsComponent;