import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Image} from 'react-native';
import AppHeaderComp from "../../general/components/appHeader_comp.tsx";
import {ArrowRight} from "iconsax-react-native";
import SavedMeasurementsBottomSheet from "../../../user/products/components/savedMeasurementsBottomSheet_component.tsx";
import ClotheTypeBottomSheetComponent from "../components/clotheTypeBottomSheet_component.tsx";

const AddProductScreen = () => {
    const [showClotheTypeBottomSheet, setShowClotheTypeBottomSheet] = useState(false);

    const handleShowClotheTypeBottomSheet = (value: boolean) => {
        setShowClotheTypeBottomSheet(value);
    };

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-white">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />


            {/*==== Header ====*/}
            <AppHeaderComp title="Add Product" />

            <ScrollView showsVerticalScrollIndicator={false} className="h-full w-full px-5 py-5">

                {/*==== Draft Section ====*/}
                <Text className="mt-2 font-montserratMedium text-lg text-gray-700">Products in draft</Text>
                <Text className="mt-1 font-montserratMedium text-sm">Continue with product in draft</Text>
                <TouchableOpacity onPress={ () => null }
                    className="h-auto w-full mt-3 p-5 rounded-xl border border-gray-200 bg-lightGray">
                    <Text className="font-montserratMedium text-lg text-gray-700">Louis Vuitton Men...</Text>
                    <Text className="mt-1 font-montserratMedium text-sm">Readymade</Text>
                </TouchableOpacity>

                <Text className="my-5 font-montserratMedium text-gray-700">OR</Text>

                {/*==== Add a New Product ====*/}
                <Text className="font-montserratMedium text-lg text-gray-700">Add a new product</Text>
                <Text className="mt-1 font-montserratMedium text-sm">Select the product type you want to add</Text>


                <View className="h-auto w-full mt-5 flex-row">
                    <TouchableOpacity
                        onPress={ () => handleShowClotheTypeBottomSheet(true) }
                        className="h-auto w-full px-5 py-5 flex-1 rounded-xl border border-gray-100 bg-gray-50"
                    >
                        <View className="w-[50px] h-[50px] flex-row items-center justify-center rounded-xl bg-gray-100">
                            <Image
                                source={
                                    require("../../../../../assets/images/clothe.png")
                                }
                                resizeMode="contain"
                                className="h-[25px] w-auto rounded-2xl"
                            />
                        </View>
                        <Text className="mt-2 font-montserratMedium text-sm text-gray-700">Clothes</Text>
                    </TouchableOpacity>
                    <View className="w-[20px]" />

                    <TouchableOpacity
                        onPress={ () => null }
                        className="h-auto w-full px-5 py-5 flex-1 rounded-xl border border-gray-100 bg-gray-50"
                    >
                        <View className="w-[50px] h-[50px] flex-row items-center justify-center rounded-xl bg-gray-100">
                            <Image
                                source={
                                    require("../../../../../assets/images/shoe.png")
                                }
                                resizeMode="contain"
                                className="h-[25px] w-auto rounded-2xl"
                            />
                        </View>
                        <Text className="mt-2 font-montserratMedium text-sm text-gray-700">Footwears</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-auto w-full mt-5 flex-row">
                    <TouchableOpacity
                        onPress={ () => null }
                        className="h-auto w-full px-5 py-5 flex-1 rounded-xl border border-gray-100 bg-gray-50"
                    >
                        <View className="w-[50px] h-[50px] flex-row items-center justify-center rounded-xl bg-gray-100">
                            <Image
                                source={
                                    require("../../../../../assets/images/watch.png")
                                }
                                resizeMode="contain"
                                className="h-[25px] w-auto rounded-2xl"
                            />
                        </View>
                        <Text className="mt-2 font-montserratMedium text-sm text-gray-700">Accessories</Text>
                    </TouchableOpacity>
                    <View className="w-[20px]" />

                    <View className="px-5 flex-1" />
                </View>


                {/*==== Proceed Button ====*/}
                <TouchableOpacity
                    onPress={ () => null }
                    className="h-[55px] w-auto my-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                >
                    <Text className="font-montserratMedium text-lg text-white mr-2">Proceed</Text>
                    <ArrowRight className="text-white" />
                </TouchableOpacity>
            </ScrollView>

            { showClotheTypeBottomSheet && (
                <ClotheTypeBottomSheetComponent handleShowClotheTypeBottomSheet={ handleShowClotheTypeBottomSheet } />
            ) }
        </SafeAreaView>
    );
};
export default AddProductScreen;
