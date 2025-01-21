import React from 'react';
import {Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {Add, Edit2, Star1} from "iconsax-react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";


const VendorProductsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    return (
        <SafeAreaView className="h-auto w-full flex-1 bg-lightGray">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />

            {/* ==== Header ==== */}
            <View className="h-[120px] w-full pt-4 px-5 rounded-b-3xl bg-baseGreen">
                <View className="h-auto w-full flex-row items-center justify-between ">

                    <View className="px-6" />

                    <Text className="font-montserratMedium text-xl text-white">All Products</Text>

                    <TouchableOpacity
                        className="bg-[#20704329] p-2.5 rounded-xl"
                        onPress={ () => null }
                    >
                        <Image
                            source={ require("../../../../../assets/images/filter_gold.png") }
                            className="h-[25px] w-[25px]"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="h-auto w-full flex-1 px-[20px] pt-5"
            >
                <TouchableOpacity
                    onPress={ () => navigation.navigate("addProductScreen") }
                    className="h-[55px] flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
                >
                    <Add className="text-baseGreen" />
                    <View className="w-[5px]" />
                    <Text className="font-montserratMedium text-base text-baseGreen">Add New Product</Text>
                </TouchableOpacity>
                <View className="w-[20px]" />

                {/* ==== Product List ==== */}
                <TouchableOpacity onPress={ () => navigation.navigate("vendorProductDetailsScreen", { productID: "productId" }) }>
                    <View className="h-auto w-full mt-5 mb-4 p-3 pb-4 border border-gray-200 rounded-xl bg-lightGray">
                        <View className="relative mt-2 flex items-center justify-center">

                            <Image
                                source={ require("../../../../../assets/images/home/sweat_shirt.png") }
                                resizeMode="contain"
                                className="h-[250px] w-full"
                            />

                            <View className="absolute top-5 left-4 right-4 flex-row justify-between">
                                <View className="w-[110px] px-2 py-1 rounded-lg border border-white/60 backdrop-blur-lg bg-white/50">
                                    <View className="flex-row items-center">
                                        <Star1 color="#E4A01C" size={14} variant="Bold" className="mr-1" />
                                        <Text className="font-montserratMedium text-xs">4.3</Text>
                                    </View>
                                    <Text className="font-montserratMedium text-[11px]">200 reviews</Text>
                                </View>

                                <View className="flex-row items-center gap-2">
                                    <View className="p-2 flex items-center justify-center rounded-lg border border-orange/30 backdrop-blur-lg bg-orange/20">
                                        <Text className="font-montserratMedium text-xs text-orange/90">Pending Review</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="absolute bottom-24 right-4 p-2 flex items-center justify-center rounded-lg border border-gray-200/70 backdrop-blur-lg bg-white/40">
                                <Edit2 color="#3461B9" size={18} variant="Bold" className="mr-1" />
                            </View>

                            <View className="h-auto w-full mt-4 flex-row items-center">
                                <View className="mr-1.5 px-2 py-1 flex-row items-center border border-[#9EBDF8] rounded-md bg-[#E3ECFF]">
                                    <Text className="font-montserratMedium text-xs text-[#3461B9] ">Men's wear</Text>
                                </View>
                                <View className="px-2 py-1 flex-row items-center border border-[#9EBDF8] rounded-md bg-[#E3ECFF]">
                                    <Text className="font-montserratMedium text-xs text-[#3461B9] ">Adult</Text>
                                </View>
                            </View>

                            <View>
                                <View className="h-auto w-full mt-1 flex-row items-center justify-between">
                                    <Text className="font-montserratMedium text-base">Men's Vintage Shirt</Text>
                                    <Text className="font-montserratMedium text-xs text-green-600">20 in stock</Text>
                                </View>
                                <Text className="font-montserratMedium text-base">{ `₦5400.90`}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>
    );
};

export default VendorProductsScreen;
