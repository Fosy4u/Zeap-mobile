import React, { useEffect } from 'react';
import {Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {Add, ArrowLeft, ArrowRight, Edit2} from "iconsax-react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { setShowProductFilterBottomSheet } from '../../home/slices/vendorHome_slice.tsx';
import useVendorProductHook from '../hooks/vendorProduct_hook.ts';
import FastImage from 'react-native-fast-image';
import { RootState } from '../../../../redux/store/store.ts';
import { setProduct, setProductMode, setSelectedStep } from '../slices/vendorProductState_slice.ts';
import IVendorProductDetails from '../models/vendorProductDetails_model.ts';



const VendorProductsScreen = () => {
    const { products } = useSelector((state: RootState) => state.vendorProductState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const {
        handleFetchFilteredProducts,
        selectedPageNumber, setSelectedPageNumber,
        requestParams, setRequestParams,
    } = useVendorProductHook();

    useEffect(() => {
        handleFetchFilteredProducts();
    }, [selectedPageNumber]);



    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <SafeAreaView className="h-auto w-full flex-1 pb-[1px] bg-lightGray">
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
                                onPress={ () => dispatch(setShowProductFilterBottomSheet(true)) }
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
                        <View className="mb-5">
                            { products && products.map((product: IVendorProductDetails) => (
                                <TouchableOpacity
                                    key={product._id}
                                    onPress={ () => navigation.navigate("vendorProductDetailsScreen", { productID: product?.productId! }) }
                                >
                                    <View className="h-auto w-full mt-5 mb-4 px-3 pt-1 pb-4 border border-gray-200 rounded-xl bg-lightGray">
                                        <View className="relative mt-2 flex items-center justify-center">
                                            <FastImage
                                                source={{
                                                    uri: product?.colors?.[0]?.images?.[0]?.link!,
                                                    priority: FastImage.priority.normal
                                                }}
                                                defaultSource={ require("../../../../../assets/images/app_logo.png") }
                                                resizeMode={ FastImage.resizeMode.cover }
                                                className="h-[270px] w-[180px] rounded-lg"
                                                fallback
                                            />

                                            <View className="absolute top-5 left-2 right-2 flex-row justify-between">
                                                {/* <View className="w-[110px] px-2 py-1 rounded-lg border border-white/60 backdrop-blur-lg bg-white/50">
                                                    <View className="flex-row items-center">
                                                    <Star1 color="#E4A01C" size={14} variant="Bold" className="mr-1" />
                                                    <Text className="text-xs">{ `${reviewData ? reviewData?.averageRating!.toFixed(1) : 0}.0` }</Text>
                                                    </View>
                                                    <Text className="text-[11px]">
                                                        { reviewData ? `${reviewData?.reviews?.length} ${ reviewData?.reviews?.length! > 1 ? "reviews" : "review" }` : "0 review" }
                                                    </Text>
                                                </View> */}
                                                <View />

                                                <View className="flex-row items-center gap-2">
                                                    <View className={`p-2 flex items-center justify-center rounded-lg border backdrop-blur-lg ${
                                                            product.status === "live" 
                                                            ? "border-green-300 bg-green-50" 
                                                            : product.status === "draft"
                                                            ? "border-blue-300 bg-blue-50"
                                                            : product.status === "under review"
                                                            ? "border-orange/30 bg-orange/10"
                                                            : "border-red-300 bg-red-50"
                                                        }`}>
                                                        <Text className={`font-montserratMedium text-xs ${
                                                            product.status === "live" 
                                                            ? "text-green-600" 
                                                            : product.status === "draft"
                                                            ? "text-blue-600"
                                                            : product.status === "under review"
                                                            ? "text-orange-800"
                                                            : "text-red-600"
                                                        }`}>
                                                            {product.status!.charAt(0).toUpperCase() + product.status!.slice(1)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View className="h-auto w-full mt-4 flex-row items-center justify-between">
                                                <View className="h-auto flex-row items-center">
                                                    <View className="mr-1.5 px-2 py-1 flex-row items-center border border-[#9EBDF8] rounded-md bg-[#E3ECFF]">
                                                        <Text className="font-montserratMedium text-xs text-[#3461B9] ">{ product.categories?.gender! }'s wear</Text>
                                                    </View>
                                                    <View className="px-2 py-1 flex-row items-center border border-[#9EBDF8] rounded-md bg-[#E3ECFF]">
                                                        <Text className="font-montserratMedium text-xs text-[#3461B9] ">{ product.categories?.age?.ageGroup! }</Text>
                                                    </View>
                                                </View>
                            
                                                <TouchableOpacity onPress={ () => {
                                                    dispatch(setProduct(product!));
                                                    dispatch(setProductMode("Draft"));
                                                    dispatch(setSelectedStep(1));
                                                    navigation.navigate(
                                                        product.productType === "bespokeCloth" ? "addBespokeClothesScreen" :
                                                        product.productType === "readyMadeCloth" ? "addReadyMadeClothesScreen" :
                                                        product.productType === "bespokeShoe" ? "addBespokeShoesScreen" :
                                                        product.productType === "readyMadeShoe" ? "addReadyMadeShoesScreen" :
                                                        "addAccessoriesScreen"
                                                    );
                                                } }  
                                                    className="p-2 rounded-lg border border-gray-200/70 backdrop-blur-lg bg-white/40"
                                                >
                                                    <Edit2 color="#3461B9" size={18} variant="Bold" className="mr-1" /> 
                                                </TouchableOpacity>
                                                </View>

                                            <View className="h-auto w-full mt-1">
                                                <View className="h-auto w-full flex-row items-end justify-between">
                                                    <Text className="flex-1 font-montserratMedium text-base">{ product.title }</Text>
                                                    <Text className={`font-montserratMedium text-xs ${product.variations?.[0]?.quantity! >= 10 ? "text-green-600" : "text-red-600"}`}>{ product.variations?.[0]?.quantity! } in stock</Text>
                                                </View>
                                                <View className="flex-row items-end gap-x-2 text-gray-200">
                                                    <Text className="font-montserratSemiBold text-base text-green-700">
                                                        ₦{ (product.variations?.[0]?.discount) ? product?.variations?.[0].discount?.toLocaleString() : product?.variations?.[0].price!.toLocaleString() }
                                                    </Text>
                                                    <Text className={`font-montserratNormal text-sm text-gray-400 line-through ${ (product.variations?.[0]?.discount) ? "flex" : "hidden" }`}>
                                                        ₦{ product?.variations?.[0].price!.toLocaleString() }
                                                    </Text>
                                                   
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )) }

                             <View className="h-auto w-full my-5 flex-row items-center space-x-4">
                                <TouchableOpacity
                                    onPress={ () => {
                                        setSelectedPageNumber(selectedPageNumber - 1);
                                        setRequestParams({ ...requestParams, "pageNumber": selectedPageNumber - 1 });
                                    } }
                                    disabled={ selectedPageNumber === 1 }
                                    className={`h-[45px] flex-1 flex-row items-center justify-center rounded-lg ${ selectedPageNumber === 1 ? "bg-gray-200" : "bg-lightGreen"}`}
                                >
                                    <ArrowLeft size={ 18 } className={ selectedPageNumber === 1 ? "text-gray-400" : "text-baseGreen"} />
                                    <Text className={`ml-2 font-montserratMedium text-base ${ selectedPageNumber === 1 ? "text-gray-400" : "text-baseGreen"}`}>Previous</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={ () => {
                                        setSelectedPageNumber(selectedPageNumber + 1);
                                        setRequestParams({ ...requestParams, "pageNumber": selectedPageNumber + 1 });
                                    } }
                                    className="h-[45px] flex-1 flex-row items-center justify-center rounded-lg bg-baseGreen"
                                >
                                    <Text className="mr-2 font-montserratRegular text-base text-white">Next</Text>
                                    <ArrowRight size={ 18 } className="text-white" />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </ScrollView>

                    {/* { isLoadingProducts &&
                        <AppLoader loadingAdditionalMessage={ loadingMessage } />
                    } */}
                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default VendorProductsScreen;
