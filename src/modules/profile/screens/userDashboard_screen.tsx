import { ArrowLeft } from 'iconsax-react-native';
import AuthCheck from '../../auths/components/authCheck';
import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import useFilterAndSearchHook from '../../user/products/hooks/filterAndSearch_hook';
import SkeletonBlock from '../../general/components/skeletonBlock_component';
import IProduct from '../../user/products/models/product_model';
import FastImage from 'react-native-fast-image';
import { setProductID } from '../../user/products/slices/product_slice';
import UserAvatar from '../../general/components/userAvatar_component';
import ProductCardComponent from '../../general/components/productCard_component';

const UserDashboardScreen = () => {
    const { recentlyViewedProducts, recommendedProducts, wishListProducts, recentlyViewedProductsIsLoading, recommendedProductsIsLoading } = useSelector((state: RootState) => state.productState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const recentlyViewedProductsLoading = recentlyViewedProductsIsLoading;
    const recommendedProductsLoading = recommendedProductsIsLoading;

    const { handleGetRecentlyViewedProducts, handleGetRecommendedProducts } = useFilterAndSearchHook();

    useEffect(() => {
        handleGetRecentlyViewedProducts("Recently Viewed");
        handleGetRecommendedProducts("Recommended Products");
    }, []);

    return (
        <SafeAreaView className="flex-1 h-auto w-screen bg-white">
             <StatusBar
                backgroundColor="#112F1E"
                barStyle="light-content"
            />

            {/* ==== Header (fixed — stays mounted above the ScrollView so
                    it doesn't scroll away with the content) ==== */}
            <View className="px-5 pt-5 pb-2 flex-row items-center justify-between bg-white">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                        <ArrowLeft color="white" />
                    </View>
                </TouchableOpacity>
                <View className="flex-row items-center">
                    <View className="mr-2 flex-col items-end">
                        <Text className="text-gray-400 text-base">Hi,</Text>
                        <Text className="font-medium text-base text-baseGreen">
                            { (userData.isGuest) ? (userData.lastName) && userData.lastName : userData.firstName }!
                        </Text>
                    </View>
                    <UserAvatar
                        photoURL={(userData as any).photoURL}
                        firstName={userData.firstName}
                        lastName={userData.lastName}
                        displayName={(userData as any).displayName}
                        email={userData.email}
                        isGuest={!!userData.isGuest}
                        seed={userData.uid || userData.email}
                        size={60}
                    />
                </View>
            </View>

            <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="mt-4 px-5">

                    {/*==== Recently Viewed Section ====*/}
                    <View className="mt-6">
                        <View className="flex-row justify-between items-center">
                            <Text className="font-medium text-base text-baseGreen">Recently viewed</Text>
                            <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Recently Viewed" }) }>
                            <Text className="text-sm text-baseGreen">See all</Text>
                            </TouchableOpacity>
                        </View>

                        { recommendedProducts.length === 0 && !recommendedProductsLoading && (
                            <View className="h-auto w-full mt-1 p-10 bg-gray-50">
                                <FastImage
                                    source={ require("../../../../assets/images/empty_box.png") }
                                    defaultSource={ require("../../../../assets/images/empty_box.png") }
                                    resizeMode={ FastImage.resizeMode.contain }
                                    className="h-[70px] w-full"
                                />

                                <Text className="mt-4 text-center text-gray-400">You don't have any recently viewed products.</Text>
                            </View>
                        )}
                        
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={ false }
                            className="h-auto w-full mt-2"
                        >
                            { recentlyViewedProductsLoading ? (
                            Array.from({ length: 5 }, (_, index) => (
                                <View key={ `item-${index}` } style={{ marginTop: 5, marginRight: 15 }}>
                                    <SkeletonBlock width={ 150 } height={ 220 } radius={ 16 } />
                                </View>
                            ))
                            ) : (
                            recentlyViewedProducts.slice(0, 10).map((recentlyViewedProduct: IProduct) => (
                                <ProductCardComponent
                                key={ recentlyViewedProduct.productId }
                                product={ recentlyViewedProduct }
                                handleOnPress={ () => {
                                    dispatch(setProductID(recentlyViewedProduct.productId));
                                    navigation.navigate("productDetailScreen");
                                } }
                                orientation="Vertical"
                                />
                            ))
                            ) }
                        </ScrollView>
                    </View>


                    {/*==== Wish List Section ====*/}
                    <View className="h-auto w-full mt-6">
                        <View className="flex-row justify-between items-center">
                            <Text className="font-medium text-base text-baseGreen">Wish list</Text>
                            <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Wish List" }) }>
                            <Text className="text-sm text-baseGreen">See all</Text>
                            </TouchableOpacity>
                        </View>
                        
                        { wishListProducts.length > 0 ? (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={ false }
                                className="h-auto w-full mt-2"
                            >
                                { wishListProducts.slice(0, 10).map((wishListProduct: IProduct) => (
                                    <ProductCardComponent
                                        key={ wishListProduct.productId }
                                        product={ wishListProduct }
                                        handleOnPress={ () => {
                                            dispatch(setProductID(wishListProduct.productId));
                                            navigation.navigate("productDetailScreen");
                                        } }
                                        orientation="Vertical"
                                    />
                                )) }
                            </ScrollView>
                        ) : (
                            <View className="h-auto w-full mt-1 p-10 bg-gray-50">
                                <FastImage
                                    source={ require("../../../../assets/images/empty_box.png") }
                                    defaultSource={ require("../../../../assets/images/empty_box.png") }
                                    resizeMode={ FastImage.resizeMode.contain }
                                    className="h-[70px] w-full"
                                />

                                <Text className="mt-4 text-center text-gray-400">It's like you've not added anything to your wish list. Kindly add a product.</Text>
                            </View>
                        )}
                    </View>
                    

                    {/*==== Recommended Section ====*/}
                    <View className="mt-6">
                        <View className="flex-row justify-between items-center">
                            <Text className="font-medium text-base text-baseGreen">Recommended</Text>
                            <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Recommended" }) }>
                            <Text className="text-sm text-baseGreen">See all</Text>
                            </TouchableOpacity>
                        </View>
                        
                        { recommendedProducts.length === 0 && !recommendedProductsLoading && (
                            <View className="h-auto w-full mt-1 p-10 bg-gray-50">
                                <FastImage
                                    source={ require("../../../../assets/images/empty_box.png") }
                                    defaultSource={ require("../../../../assets/images/empty_box.png") }
                                    resizeMode={ FastImage.resizeMode.contain }
                                    className="h-[70px] w-full"
                                />

                                <Text className="mt-4 text-center text-gray-400">It's like you don't have any recommended products yet.</Text>
                            </View>
                        )}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={ false }
                            className="h-auto w-full mt-2"
                        >
                            { recommendedProductsLoading ? (
                            Array.from({ length: 5 }, (_, index) => (
                                <View key={ `item-${index}` } style={{ marginTop: 5, marginRight: 15 }}>
                                    <SkeletonBlock width={ 150 } height={ 220 } radius={ 16 } />
                                </View>
                            ))
                            ) : (
                            recommendedProducts.slice(0, 10).map((recommendedProduct: IProduct, index) => (
                                <ProductCardComponent
                                key={ `item-${index}-${recommendedProduct.productId}` }
                                product={ recommendedProduct }
                                handleOnPress={ () => {
                                    dispatch(setProductID(recommendedProduct.productId));
                                    navigation.navigate("productDetailScreen");
                                } }
                                orientation="Vertical"
                                />
                            ))
                            ) }
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default AuthCheck(UserDashboardScreen);



