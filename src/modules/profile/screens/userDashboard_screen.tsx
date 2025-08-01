import { ArrowLeft, Heart, Notification, Star1 } from 'iconsax-react-native';
import React, { useEffect } from 'react'
import { Image, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import useProductsHook from '../../user/products/hooks/products_hook';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import IProduct from '../../user/products/models/product_model';
import FastImage from 'react-native-fast-image';
import FormatWords from '../../../utils/formatWords';
import { setProductID } from '../../user/products/slices/product_slice';

const UserDashboardScreen = () => {
    const { recentlyViewedProducts, recommendedProducts, wishListProducts } = useSelector((state: RootState) => state.productState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const {
        handleGetRecentlyViewedProducts, recentlyViewedProductsLoading,
        handleGetRecommendedProducts, recommendedProductsLoading,
    } = useProductsHook();

    useEffect(() => {
        handleGetRecentlyViewedProducts();
        handleGetRecommendedProducts();
    }, []);

    return (
        <SafeAreaView className="flex-1 h-auto w-screen bg-white">
             <StatusBar
                backgroundColor="#112F1E"
                barStyle="light-content"
            />

            <ScrollView className="h-full w-full pb-[120px]">

                {/* ==== Header ==== */}
                <View className="px-5 pt-5 flex-row items-center justify-between">
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
                        <Image
                            className="h-[60px] w-[60px] rounded-full"
                            resizeMode="cover"
                            source={require("../../../../assets/images/home/profile_image.png")}
                        />
                    </View>
                </View>

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
                                <ShimmerPlaceHolder
                                key={`item-${index}`}
                                // visible={!popularProductIsLoading}
                                LinearGradient={LinearGradient}
                                shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                                height={220}
                                width={150}
                                shimmerStyle={{ borderRadius: 16, marginTop: 5, marginRight: 15 }}
                                />
                            ))
                            ) : (
                            recentlyViewedProducts.slice(0, 10).map((recentlyViewedProduct: IProduct) => (
                                <ProductCardItem
                                key={ recentlyViewedProduct.productId }
                                product={ recentlyViewedProduct }
                                handleOnPress={ () => {
                                    dispatch(setProductID(recentlyViewedProduct.productId));
                                    navigation.navigate("productDetailScreen");
                                } }
                                orrientation="Vertical"
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
                                    <ProductCardItem
                                        key={ wishListProduct.productId }
                                        product={ wishListProduct }
                                        handleOnPress={ () => {
                                            dispatch(setProductID(wishListProduct.productId));
                                            navigation.navigate("productDetailScreen");
                                        } }
                                        orrientation="Vertical"
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
                                <ShimmerPlaceHolder
                                key={`item-${index}`}
                                // visible={!popularProductIsLoading}
                                LinearGradient={LinearGradient}
                                shimmerColors={['#ebebeb', '#fefefe', '#ebebeb']}
                                height={220}
                                width={150}
                                shimmerStyle={{ borderRadius: 16, marginTop: 5, marginRight: 15 }}
                                />
                            ))
                            ) : (
                            recommendedProducts.slice(0, 10).map((recommendedProduct: IProduct, index) => (
                                <ProductCardItem
                                key={ `item-${index}-${recommendedProduct.productId}` }
                                product={ recommendedProduct }
                                handleOnPress={ () => {
                                    dispatch(setProductID(recommendedProduct.productId));
                                    navigation.navigate("productDetailScreen");
                                } }
                                orrientation="Vertical"
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

export default UserDashboardScreen;



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Product Card Item
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface IProductCardItemProps {
  product: IProduct;
  handleOnPress: () => void;
  orrientation: "Horizontal" | "Vertical";
}

const ProductCardItem = (props: IProductCardItemProps) => {
  const { product, handleOnPress, orrientation } = props;

  return (
    <TouchableOpacity
      onPress={ handleOnPress }
      className={`h-auto mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE] ${ orrientation === "Horizontal" ? "w-[340px] flex-row justify-start" : "w-[170px]" }`}
    >
      <View className={`relative p-2 flex rounded-xl bg-white ${ orrientation === "Horizontal" ? "h-[150px] w-[130px] mr-4 justify-center" : "items-center" }`}>
        <FastImage
          source={{
              uri: product?.colors?.[0]?.images?.[0]?.link!,
              priority: FastImage.priority.normal
          }}
          defaultSource={ require("../../../../assets/images/app_logo.png") }
          resizeMode={ FastImage.resizeMode.cover }
          className="h-[120px] w-[100px] rounded-lg"
          fallback
        />
        <View className="h-[35px] w-[35px] absolute top-2 right-2 flex items-center justify-center rounded-xl bg-gray-200">
          <Heart color="gray" />
        </View>
      </View>
      <View className={`mt-3 ${ orrientation === "Horizontal" ? "w-[160px]" : "" }`}>
        <Text className={`text-gray-800 ${ orrientation === "Horizontal" ? "text-base" : "text-sm" }`}>{ FormatWords.truncateWords(product.title, 25) }</Text>
        <View className="mt-1.5 flex-row items-center justify-between">
          <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ product.categories.productGroup.split("-").join(" ") }</Text>

          <View className="flex-row">
            <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
            <Text>4.3</Text>
          </View>
        </View>
        <Text className="mt-2.5 text-base font-medium text-gray-900">₦{ product.variations[0].price.toLocaleString() }</Text>
      </View>
    </TouchableOpacity>
  );
};