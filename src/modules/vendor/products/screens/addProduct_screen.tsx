import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Image} from 'react-native';
import AppHeaderComp from "../../general/components/appHeader_comp.tsx";
import {ArrowRight} from "iconsax-react-native";
import ClotheTypeBottomSheetComponent from "../components/clotheTypeBottomSheet_component.tsx";
import useAddBespokeClothesHook from '../hooks/bespokeClothes/addBespokeClothes_hook.ts';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { RootState } from '../../../../redux/store/store.ts';
import { setProductMode, setSelectedDraftProduct, setSelectedStep } from '../slices/vendorProductState_slice.ts';
import IDraftProduct from '../models/vendorDraftProducts_model.ts';

const AddProductScreen = () => {
    const { draftProducts } = useSelector((state: RootState) => state.vendorProductState);
    const [showClotheTypeBottomSheet, setShowClotheTypeBottomSheet] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const handleShowClotheTypeBottomSheet = (value: boolean) => {
        setShowClotheTypeBottomSheet(value);
    };

    const { handleResetProductMode, handleGetDraftProducts, isLoadingDraftProducts } = useAddBespokeClothesHook();

    useEffect(() => {
        handleResetProductMode();
        handleGetDraftProducts();
    }, [])
    

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
                { !isLoadingDraftProducts ? (
                    draftProducts?.length !== 0 ? (
                        draftProducts?.map((product: IDraftProduct) => (
                            <TouchableOpacity key={ product._id } onPress={ () => null }
                                className="h-auto w-full mt-3 p-4 rounded-xl border border-gray-200 bg-lightGray">
                                <Text className="font-montserratMedium text-lg text-gray-700">{ product.title }</Text>
                                <View className="mt-3 flex-row items-center justify-between">
                                    <Text className="mt-1 font-montserratMedium text-sm">{
                                        product.productType === "bespokeCloth" ? "Bespoke Clothes" :
                                        product.productType === "readyMadeCloth" ? "Readymade Clothes" : 
                                        product.productType === "bespokeFootwear" ? "Bespoke Footwear" :
                                        product.productType === "readyMadeFootwear" ? "Readymade Footwear" : 
                                        "Accessories"
                                    }</Text>

                                    <TouchableOpacity
                                        onPress={ () => {
                                            dispatch(setSelectedDraftProduct(product));
                                            dispatch(setProductMode("Draft"));
                                            // dispatch(setSelectedStep(product.currentStep! + 1));
                                            dispatch(setSelectedStep(3 + 1));
                                            navigation.navigate("addBespokeClothesScreen");
                                        } }
                                        className="h-[35px] w-auto px-2 flex flex-row items-center justify-center rounded-md bg-baseGreen"
                                    >
                                        <Text className="font-montserratMedium text-xs text-white mr-2">Continue</Text>
                                        <ArrowRight size={ 18 } className="text-white" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View className="h-auto w-full mt-3 p-5 rounded-xl border border-gray-200 bg-lightGray">
                            <Text className="font-montserratMedium text-lg text-gray-700">No products in draft</Text>
                        </View>
                    )
                ) : (
                    <ShimmerPlaceHolder
                        visible={ isLoadingDraftProducts }
                        LinearGradient={ LinearGradient }
                        style={ { height: 100, with: "100%", borderRadius: 10, backgroundColor: "#fbfbfb" } }
                    />
                ) }

                <Text className="my-5 font-montserratMedium text-gray-700">OR</Text>

                {/*==== Add a New Product ====*/}
                <Text className="font-montserratMedium text-lg text-gray-700">Add a new product</Text>
                <Text className="mt-1 font-montserratMedium text-sm">Select the product type you want to add</Text>


                <View className="h-auto w-full mt-5 flex-row">
                    {/* ==== Clothes ==== */}
                    <TouchableOpacity
                        onPress={ () => {
                            dispatch(setSelectedStep(1));
                            handleShowClotheTypeBottomSheet(true);
                        } }
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

                    {/* ==== Footwears ==== */}
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
                    {/* ==== Accessories ==== */}
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
