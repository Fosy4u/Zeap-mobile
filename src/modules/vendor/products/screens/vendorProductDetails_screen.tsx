import React, { useEffect } from 'react'
import {Dimensions, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import { Edit2, Star1, Trash } from "iconsax-react-native";
import AppHeaderComp from "../../general/components/appHeader_comp.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../redux/store/store.ts";
import {RouteProp, useNavigation} from "@react-navigation/native";
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";
import AppLoader from '../../../general/components/appLoader.tsx';
import useProductHook from '../hooks/vendorProduct_hook.ts';
import FastImage from 'react-native-fast-image';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from "react-native-linear-gradient";
import VendorProductDescriptionComponent from '../components/vendorProductDescription_component.tsx';
import ReviewComponent from '../../../general/components/review_component.tsx';
import VendorProductTimelineComponent from '../components/vendorProductTimeline_component.tsx';
import { setProduct, setProductMode, setSelectedStep, setSelectedTab } from '../slices/vendorProductState_slice.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DeleteProducWarningPopupModal from '../modals/deleteProductWarningPopup_modal.tsx';


interface IProps {
    route: RouteProp<RootNavigationStackModel, "vendorProductDetailsScreen">
}

const VendorProductDetailsScreen: React.FC<IProps> = ({ route }) => {
    const { product, productPromotion, selectedTab, tabs } = useSelector((state: RootState) => state.vendorProductState);
    const { isLoading, loadingMessage } = useSelector((state: RootState) => state.generalState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const { productID } = route.params!;
    // console.log("PROMOTION: ", productPromotion);
    
    const { 
        featuredImage, setFeaturedImage,
        defaultFeaturedImageAndThumbnails,
        handleGetProductByProductID,
        showDeleteProductWarningModal, setShowDeleteProductWarningModal,
        handleDeleteProduct,
        reviewData,
        featuredColors,
        handleFormatDate,
    } = useProductHook();
    // const isLoading = isLoadingReviews || isLoadingDeleteProduct;
    

    useEffect(() => {
        if (productID) {
            handleGetProductByProductID(productID);
        }
    }, [productID]);
    

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
                    <View className="h-auto w-full flex-row items-center justify-start space-x-3">
                        <Text className="px-[8px] py-1.5 font-montserratMedium text-xs rounded-md self-start bg-white">{product?.categories?.productGroup?.split("-").join(" ")}</Text>
                        <View className={`px-3 py-1 flex items-center justify-center rounded-md border backdrop-blur-lg ${
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
                                {product?.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "N/A"}
                            </Text>
                        </View>
                    </View>
                    <Text className="mt-2 font-montserratMedium text-[23px] text-baseGreen">{ product?.title! }</Text>    
                </View>

                <View className="mt-2">
                    <View className="h-auto flex-row items-end space-x-3">
                        <Text className="font-montserratSemiBold text-xl text-baseGreen">
                            ₦{ productPromotion?.discount?.fixedPercentage! ? product?.variations?.[0].discount?.toLocaleString() : product?.variations?.[0].price!.toLocaleString() }
                        </Text>
                        <Text className={`font-montserratNormal text-sm text-gray-400 line-through ${ productPromotion?.discount?.fixedPercentage! ? "flex" : "hidden" }`}>
                            ₦{ product?.variations?.[0].price!.toLocaleString() }
                        </Text>
                    </View>
                    <View className="mt-2.5 flex-row items-center space-x-3">
                        <View className="flex-row items-center">
                            <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                            <Text className="font-montserratMedium text-blue-600">
                                { reviewData?.averageRating! ? reviewData?.averageRating!.toFixed(1) : 0.0 }
                            </Text>
                            <Text className="ml-1 font-montserratMedium text-xs text-black">({ reviewData?.reviews?.length! } { reviewData?.reviews?.length! > 1 ? "reviews" : "review" })</Text>
                        </View>

                        <View className="flex-row items-center">
                            <Text className={`font-montserratMedium ${ product?.variations?.[0].quantity! >= 10 ? "text-green-600" : "text-red-600" }`}>{ product?.variations?.[0].quantity! }</Text>
                            <Text className="ml-1 font-montserratMedium text-xs text-black">In stock</Text>
                        </View>

                        <View className="flex-row items-center">
                            <Text className="font-montserratMedium text-gold">{ 0 }</Text>
                            <Text className="ml-1 font-montserratMedium text-xs text-black">Sold</Text>
                        </View>

                        <View className="flex-row items-center">
                            <Text className="font-montserratMedium text-green-600">{ productPromotion?.discount?.fixedPercentage! ? productPromotion?.discount?.fixedPercentage! : 0 }</Text>
                            <Text className="ml-[1px] font-montserratMedium text-xs text-black">% Discount</Text>
                        </View>
                    </View>
                </View>

                <View className="h-auto w-full mt-3 p-2 rounded-xl border border-gray-200 bg-[#EDEFF4]">
                    <View className="h-auto w-auto p-0 flex items-center justify-center rounded-xl bg-transparent">
                        { !isLoading && featuredImage?.link ? (
                            <FastImage
                                source={{
                                    uri: featuredImage?.link!,
                                    priority: FastImage.priority.normal
                                }}
                                defaultSource={ require("../../../../../assets/images/app_logo.png") }
                                resizeMode={ FastImage.resizeMode.cover }
                                className="h-[500px] w-full rounded-lg"
                                style={{ aspectRatio: 0.68 }}
                                fallback
                            />
                        ) : (
                            <ShimmerPlaceHolder
                                // visible={!isLoadingProducts}
                                LinearGradient={LinearGradient}
                                shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                                height={350}
                                width={Dimensions.get('window').width - 40}
                                shimmerStyle={{ borderRadius: 16, marginTop: 20 }}
                            />
                        ) } 
                    </View>
                </View>

                {/*==== Thumbnails ====*/}
                <View className="mt-5">
                    {/* <Text className="font-montserratSemiBold text-[16px] text-gray-700">Available Colors</Text> */}
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        className="h-auto w-full"
                    >
                        <View className="h-auto w-full mt-2 flex-row items-center justify-start space-x-4">
                            { defaultFeaturedImageAndThumbnails?.images?.map((eachImage, index) => (
                                <TouchableOpacity  key={ eachImage._id } 
                                    onPress={ () => setFeaturedImage(eachImage) }
                                    className={`h-[78px] w-[70px] rounded-2xl border ${ (eachImage._id! === featuredImage?._id!) ? "border-baseGreen" : "border-gray-300" } bg-[#F8F9FE]`}
                                >
                                    <Image
                                        source={
                                            defaultFeaturedImageAndThumbnails?.images![index]?.link!
                                            ? { uri: defaultFeaturedImageAndThumbnails?.images![index]?.link! }
                                            : require("../../../../../assets/images/app_logo.png")
                                        }
                                        resizeMode="cover"
                                        className="h-[76px] w-[68px] rounded-2xl"
                                    />
                                </TouchableOpacity>
                            )) }
                        </View>
                    </ScrollView>
                </View>

                {/*==== Available Sizes ====*/}
                <View className="mt-7">
                    <View className="h-auto w-full ">
                        <Text className="font-montserratSemiBold text-[16px] text-gray-700">Available Sizes</Text>

                        <View className="h-auto w-full mt-2 flex-row items-center flex-wrap gap-x-3">
                            { product.sizes?.map((eachSize: string) => (
                                <View key={ eachSize } className="px-4 py-2 border border-gray-300 rounded-xl">
                                    <Text className="font-montserratMedium">{ eachSize }</Text>
                                </View>
                            )) }
                        </View>
                    </View>
                </View>


                {/*==== Available Colors ====*/}
                { featuredColors.length !== 0 && (
                    <View className="mt-7">
                        <View className="h-auto w-full ">
                            <Text className="font-montserratSemiBold text-[16px] text-gray-700">Available Colors</Text>

                            <View className="h-auto w-full mt-2 flex-row items-center flex-wrap gap-x-3">
                                { featuredColors.map((eachColor) => (
                                    <View key={ eachColor.hex }
                                        className="h-10 w-10 flex items-center justify-center border rounded-full"
                                        style={ { borderColor: eachColor.hex! } }
                                    >
                                        <View className="h-8 w-8 rounded-full" style={ { backgroundColor: eachColor.hex! } } />
                                    </View>
                                )) }
                            </View>
                        </View>
                    </View>
                ) }

                <View className="h-[1.5px] w-full mt-5 bg-gray-200" />

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
                { (selectedTab === "Description") ? (
                    <VendorProductDescriptionComponent product={ product! } />
                ) : (selectedTab === "Reviews") ? (
                    <ReviewComponent reviews={ reviewData?.reviews! } productID={ product!.productId! } loadingMessage={ loadingMessage } />
                ) : (
                    <VendorProductTimelineComponent timelines={ product!.timeLine! } handleFormatDate={ handleFormatDate } />
                ) }

                <View className="h-[1.5px] w-full mt-5 bg-gray-200" />

                {/* ==== Add Product ==== */}
                <View className="h-auto w-full mt-6 flex-row">
                    <TouchableOpacity
                        onPress={ () => {
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
                        className="h-[55px] mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-blue-100"
                    >
                        <Edit2 className="text-blue-800" variant="Bold" />
                        <View className="w-[5px]" />
                        <Text className="font-montserratMedium text-blue-800">Edit Product</Text>
                    </TouchableOpacity>
                    <View className="w-[20px]" />

                    <TouchableOpacity
                        onPress={ () => setShowDeleteProductWarningModal(true) }
                        className="h-[55px] mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-red-100"
                    >
                        <Trash className="text-red-700" variant="Bold" />
                        <View className="w-[5px]" />
                        <Text className="font-montserratMedium text-red-800">Delete Product</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={ () => navigation.navigate("promoScreen") }
                    className="h-[55px] mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-yellow-50"
                >
                    <View className="w-[5px]" />
                    <Text className="font-montserratMedium text-amber-600">Add Promo</Text>
                </TouchableOpacity>

                <View className="h-10" />

            </ScrollView>

            {/* ==== Show Delete Product Warning Popup ==== */}
            { showDeleteProductWarningModal &&
                <DeleteProducWarningPopupModal
                    productID={ product?.productId! }
                    setShowDeleteProductWarningModal={ setShowDeleteProductWarningModal }
                    handleDeleteProduct={ handleDeleteProduct }
                />
            }
            
            { isLoading && 
                <AppLoader loadingAdditionalMessage={ loadingMessage } />
            }
        </SafeAreaView>
    )
}
export default VendorProductDetailsScreen;
