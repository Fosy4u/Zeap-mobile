import React, { useEffect } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight, Heart, Star1 } from 'iconsax-react-native';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import DescriptionComponent from '../components/description_component';
import ReviewComponent from '../components/review_component';
import TimelineComponent from '../components/timeline_component';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store/store';
import { setProduct, setProductID, setSelectedTab } from '../slices/product_slice';
import { useGetProductByProductIDQuery } from '../apis/product_api';
import { useGetProductReviewsQuery } from '../apis/review_api';
import AppLoader from '../../../general/components/appLoader';
import ProductImagesAndColorsComponent from '../components/productImagesAndColors_component';
import SizeGuideBottomSheet from '../components/sizeGuideBottomSheet_component';

interface IProps {
  route: RouteProp<RootNavigationStackModel, "productDetailScreen">
}

const ProductDetailScreen: React.FC<IProps> = ({ route }) => {
  const { selectedTab, tabs, popularProducts, featuredPrice, showSizedGuideBottomSheet } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch<AppDispatch>();
  const { productID } = route.params || {};


  // Get product details
  const { data: product, isLoading: productsLoading } = useGetProductByProductIDQuery(productID!);
  const { data: reviews, isLoading: reviewsLoading } = useGetProductReviewsQuery(productID!);

  useEffect(() => {
    dispatch(setProductID(productID!));
    if (product) {
      dispatch(setProduct(product!));
    }
  }, [product])


  
  return (
    <SafeAreaView className="h-full w-full relative flex-1 pt-[20px] bg-lightGray">
      <StatusBar
        backgroundColor="#d5f4e3"
        barStyle="dark-content"
      />

      {/*==== Header ====*/}
      <View className="h-auto w-full px-[25px] flex-row items-center justify-between z-10">
        <TouchableOpacity onPress={ () => navigation.pop() }>
          <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" />
          </View>
        </TouchableOpacity>
        <Text className="font-semibold text-lg text-baseGreen">Product Details</Text>
        <View className="h-[40px] w-[40px]" />
      </View>


      {/*==== Top Skewed Light Green Background ====*/}
      <Image
        source={require("../../../../../assets/images/product_detail_top_background.png")}
        className="h-[400px] w-full absolute top-0 left-0 z-0"
        resizeMode="stretch"
      />

      {(!productsLoading) ? (
        <>

          <ScrollView
              showsVerticalScrollIndicator={ false }
              className="mt-[30px]"
          >

            {/*==== Product Name And Price ====*/}
            <View className="h-auto w-full px-5 flex-row items-start justify-between">
              <View className="h-auto w-[220px]">
                <Text className="px-[8px] py-[3px] font-montserratMedium text-xs rounded-md self-start bg-white">
                  {product?.categories?.productGroup?.split("-").join(" ") || 'N/A'}
                </Text>
                <Text className="mt-2 font-montserratMedium text-[20px] text-baseGreen">
                  {product?.title || 'No Title'}
                </Text>
                <View className="mt-2.5 flex-row items-center">
                  <Text className="mr-5 font-montserratMedium text-baseGreen">
                    {/* {product?.shop?.currency?.symbol!}{product?.variations?.[0]?.price?.toLocaleString()} */}
                    {product?.shop?.currency?.symbol!}
                    { featuredPrice.toLocaleString() || "N/A" }
                  </Text>
                  <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                  <Text className="font-montserratMedium text-xs">4.3</Text>
                </View>
              </View>

              <View>
                <View className="h-[40px] w-[40px] flex items-center justify-center border border-baseGreen rounded-full">
                  <Heart size={ 18 } className="text-baseGreen" />
                </View>
                {/* <View className="h-[40px] w-[40px] mt-6 flex items-center justify-center border border-baseGreen rounded-full">
                  <ShoppingBag size={ 18 } className="text-baseGreen" />
                </View> */}
              </View>
            </View>

            {/*==== Product Image And Color Palete ====*/}
            <ProductImagesAndColorsComponent product={ product! } />


            {/*==== Tab View ====*/}
            <View className="h-auto w-full mt-8 px-5">
              <View className="h-auto w-full flex-row justify-between">
                { tabs.map((tab, index) => (
                  <TouchableOpacity key={ index }
                  onPress={ () => dispatch(setSelectedTab(tab)) }>
                    <Text className={`${(selectedTab === tab) ? "font-semibold text-gray-700 text-[15px]" : "text-gray-500"}`}>{ tab }</Text>
                  </TouchableOpacity>
                )) }
              </View>

              { (selectedTab === "Description") ? (
                <DescriptionComponent product={ product! } />
              ) : (selectedTab === "Reviews") ? (
                <ReviewComponent reviews={ reviews! } productID={ productID! } />
              ) : (
                <TimelineComponent timelines={ product!.timeLine! } />
              ) }
            </View>


            {/*==== Sellers' Information Section ====*/}
            { (product?.productType === "readyMadeCloth" || product?.productType === "readyMadeShoe" || product?.productType === "accessory") && (
              <View className="mt-12 px-5">
                <View className="flex-row justify-between items-center">
                  <Text className="font-montserratSemiBold text-base text-baseGreen">Sellers' Information</Text>
                  <TouchableOpacity 
                    className="flex-row items-center justify-center"
                    onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Popular Products" }) }
                  >
                    <Text className="mr-1 text-sm text-baseGreen">See more</Text>
                    <ArrowRight size={20} className="text-baseGreen" />
                  </TouchableOpacity>
                </View>

                <Text className="mt-5 font-montserratMedium text-base text-baseGreen">Zona Fashion Store</Text>
                <Text className="mt-2 font-montserratMedium text-sm text-baseGreen">90% seller score</Text>
                <Text className="mt-2 font-montserratMedium text-sm text-baseGreen">200 complete deliveries</Text>
              </View>
            )}

            {/*==== Similar Items Section ====*/}
            <View className="my-12 px-5">
              <Text className="font-montserratSemiBold text-base text-baseGreen">Similar items</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={ false }
                className="h-auto w-full mt-3"
              >
                { popularProducts.map((popularProduct) => (
                  <TouchableOpacity key={ popularProduct.productId }
                    onPress={ () => {
                      navigation.navigate("productDetailScreen", { productID: popularProduct.productId });
                    } }
                    className="h-auto w-[170px] mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE]"
                  >
                    <View className="h-auto w-full relative py-1 rounded-xl bg-white">
                      <Image
                        className="h-[100px] w-full rounded-t-2xl"
                        resizeMode="contain"
                        source={
                          popularProduct.colors[0]?.images[1]?.link
                          ? { uri: popularProduct.colors[0]?.images[1]?.link }
                          : require("../../../../../assets/images/app_logo.png")
                        }
                      />
                      <View className="h-[35px] w-[35px] absolute top-1 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                        <Heart color="gray" />
                      </View>
                    </View>
                    <View className="mt-3">
                      <Text className="text-sm text-gray-800">{ popularProduct.title }</Text>
                      <View className="mt-1.5 flex-row items-center justify-between">
                        <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ popularProduct.categories.productGroup.split("-").join(" ") }</Text>

                        <View className="flex-row">
                          <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                          <Text>4.3</Text>
                        </View>
                      </View>
                      <Text className="mt-2.5 text-base font-medium text-gray-900">{ product?.shop?.currency?.symbol! }{ popularProduct.variations[0].price.toLocaleString() }</Text>
                    </View>
                  </TouchableOpacity>
                )) }
              </ScrollView>
            </View>
          </ScrollView>

          { showSizedGuideBottomSheet && (
            <SizeGuideBottomSheet />
          ) }
        </>
      ) : (
        // Render loading indicator
        <AppLoader />
      )}

    </SafeAreaView>
  )
}

export default ProductDetailScreen;