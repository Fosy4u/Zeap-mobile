import React from 'react'
import {Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import { Edit2, Ruler, Star1, Trash } from "iconsax-react-native";
import AppHeaderComp from "../../general/components/appHeader_comp.tsx";
import {setSelectedTab} from "../../../user/products/slices/product_slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../redux/store/store.ts";
import {useGetProductByProductIDQuery} from "../../../user/products/apis/product_api.ts";
import {useGetProductReviewsQuery} from "../../../user/products/apis/review_api.ts";
import {RouteProp} from "@react-navigation/native";
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";


interface IProps {
    route: RouteProp<RootNavigationStackModel, "vendorProductDetailsScreen">
}

const VendorProductDetailsScreen: React.FC<IProps> = ({ route }) => {
    const { selectedTab, tabs } = useSelector((state: RootState) => state.vendorProductState);
    const dispatch = useDispatch();
    const { productID } = route.params || {};

    const { data: product} = useGetProductByProductIDQuery(productID!);
    const { data: reviews} = useGetProductReviewsQuery(productID!);

    return (
        <SafeAreaView className="h-full w-full flex-1">
            <StatusBar
                backgroundColor="#133522"
                barStyle="light-content"
            />

            {/*==== Header ====*/}
            <AppHeaderComp title="Product Details" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="h-full w-full mt-2 px-5 pt-3"
            >

                {/*==== Product Name And Price ====*/}
                <View className="h-auto w-full">
                    {/*<Text className="px-[8px] py-[3px] font-montserratMedium text-xs rounded-md self-start bg-white">{ product!.categories!.productGroup!.split("-").join(" ") }</Text>*/}
                    <Text className="px-[8px] py-[3px] font-montserratMedium text-xs rounded-md self-start bg-white">Ready made</Text>
                    {/*<Text className="mt-2 font-montserratMedium text-[24px] text-baseGreen">{ product!.title }</Text>*/}
                    <Text className="mt-2 font-montserratMedium text-[24px] text-baseGreen">Louis Vuitton Men’s 3piece Suit</Text>
                    {/*<Text className="mt-2 mr-5 font-montserratMedium text-base text-baseGreen">{ product!.currency!.symbol! + product!.variations![0].price!.toLocaleString() }</Text>*/}
                    <Text className="mt-2 mr-5 font-montserratMedium text-base text-baseGreen">₦{ 5200.99.toLocaleString() }</Text>
                    <View className="mt-2.5 flex-row items-center">
                        <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                        <Text className="font-montserratMedium text-xs text-gray-600">4.3 (20 reviews)</Text>

                        <Text className="ml-5 font-montserratMedium text-green-600">
                            23
                            <Text className="text-xs text-black"> In stock</Text>
                        </Text>

                        <Text className="ml-5 font-montserratMedium text-gold">
                            48
                            <Text className="text-xs text-black"> In stock</Text>
                        </Text>
                    </View>
                </View>

                <View className="h-auto w-[200px] mt-5 p-4 rounded-xl border border-gray-200 bg-[#EDEFF4]">
                    <View className="h-auto w-auto p-0 flex items-center justify-center rounded-xl bg-[#FFFFFF]">
                        <Image
                            /*source={
                                product!.colors![0]?.images![0]?.link!
                                    ? { uri: product!.colors![0]?.images![1]?.link! }
                                    : require("../../../../../assets/images/app_logo.png")
                            }*/
                            source={
                                require("../../../../../assets/images/home/sweat_shirt.png")
                            }
                            resizeMode="contain"
                            className="h-[240px] w-auto rounded-2xl"
                        />
                    </View>
                </View>

                {/*==== Available Colors ====*/}
                <View className="mt-7">
                    <Text className="font-montserratSemiBold text-[16px] text-gray-700">Available Colors</Text>

                    <View className="h-auto w-full mt-2 flex-row items-center justify-between flex-wrap">
                        { Array.from({ length: 4 }, (_, index) => (
                            <View key={ index } className="h-[75px] w-[75px] flex items-center justify-center border border-gray-300 rounded-2xl">
                                <Image
                                    source={
                                        require("../../../../../assets/images/home/sweat_shirt.png")
                                    }
                                    resizeMode="contain"
                                    className="h-[50px] w-auto rounded-2xl"
                                />
                            </View>
                        ))}
                    </View>
                </View>

                {/*==== Available Sizes ====*/}
                <View className="mt-7">
                    <View className="h-auto w-full flex-row items-center justify-between">
                        <Text className="font-montserratSemiBold text-[16px] text-gray-700">Available Sizes</Text>

                        <TouchableOpacity
                            onPress={ () => null }
                            className="px-3 py-1.5 flex-row items-center justify-center rounded-lg bg-lightGreen"
                        >
                            <Ruler size={ 28 } className="mr-2 text-baseGreen" />
                            <Text className="font-montserratMedium text-baseGreen">Size Guide</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="h-auto w-full mt-2 flex-row items-center flex-wrap gap-x-3">
                        <View className="px-4 py-2 border border-gray-300 rounded-xl">
                            <Text className="font-montserratMedium">Small</Text>
                        </View>
                        <View className="px-4 py-2 border border-gray-300 rounded-xl">
                            <Text className="font-montserratMedium">
                                Medium <Text className="text-gold">3 left</Text>
                            </Text>
                        </View>
                        <View className="px-4 py-2 border border-gray-300 rounded-xl">
                            <Text className="font-montserratMedium">Large</Text>
                        </View>
                    </View>
                </View>


                {/*==== Tab View ====*/}
                <View className="h-auto w-full mt-10 px-0.5">
                    <View className="h-auto w-full flex-row justify-between">
                        { tabs.map((tab, index) => (
                            <TouchableOpacity key={ index }
                                              onPress={ () => dispatch(setSelectedTab(tab)) }>
                                <Text className={`${(selectedTab === tab) ? "font-semibold text-gray-700 text-[15px]" : "text-gray-500"}`}>{ tab }</Text>
                            </TouchableOpacity>
                        )) }
                    </View>
                </View>
                {/*{ (selectedTab === "Description") ? (
                    <DescriptionComponent product={ product! } />
                ) : (selectedTab === "Reviews") ? (
                    <ReviewComponent reviews={ reviews! } productID={ productID! } />
                ) : (
                    <TimelineComponent timelines={ product!.timeLine! } />
                ) }*/}


                {/* ==== Add Product ==== */}
                <View className="h-auto w-full flex-row">
                    <TouchableOpacity
                        onPress={ () => null }
                        className="h-[55px] mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-blue-100"
                    >
                        <Edit2 className="text-blue-800" variant="Bold" />
                        <View className="w-[5px]" />
                        <Text className="font-montserratMedium text-blue-800">Edit Product</Text>
                    </TouchableOpacity>
                    <View className="w-[20px]" />

                    <TouchableOpacity
                        onPress={ () => null }
                        className="h-[55px] mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-red-100"
                    >
                        <Trash className="text-red-700" variant="Bold" />
                        <View className="w-[5px]" />
                        <Text className="font-montserratMedium text-red-800">Delete Product</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-auto w-full flex-row">
                    <TouchableOpacity
                        onPress={ () => null }
                        className="h-[55px] mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-lightOrange"
                    >
                        <View className="w-[5px]" />
                        <Text className="font-montserratMedium text-amber-700">Manage Variations</Text>
                    </TouchableOpacity>
                    <View className="w-[20px]" />

                    <TouchableOpacity
                        onPress={ () => null }
                        className="h-[55px] mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-yellow-50"
                    >
                        <View className="w-[5px]" />
                        <Text className="font-montserratMedium text-amber-600">Add Promo</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-10" />

            </ScrollView>
        </SafeAreaView>
    )
}
export default VendorProductDetailsScreen;
