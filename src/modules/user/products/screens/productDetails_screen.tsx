import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ShoppingBag } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import DescriptionComponent from '../components/description_component';
import ReviewComponent from '../../../general/components/review_component';
import TimelineComponent from '../components/timeline_component';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store/store';
import { setProductID, setSelectedTab } from '../slices/product_slice';
import ProductImagesAndColorsComponent from '../components/productImagesAndColors_component';
import ProductDetailsSkeletonLoader from '../components/productDetailsSkeletonLoader_component';
import SizeGuideBottomSheet from '../components/sizeGuideBottomSheet_component';
import useProductsHook from '../hooks/products_hook';
import FastImage from 'react-native-fast-image';
import ProductCardComponent from '../../../general/components/productCard_component';
import IProduct from '../models/product_model';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook';


const ProductDetailScreen = () => {
  const { product, productID, reviewAndRating, selectedTab, tabs, popularProducts, showSizedGuideBottomSheet } = useSelector((state: RootState) => state.productState);
  const cartCount = useSelector((state: RootState) => state.cartState?.cart?.basketItems?.length ?? 0);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch<AppDispatch>();
  
  
  // Call the product hook
  const {
    defaultFeaturedImageAndThumbnails,
    featuredImage, setFeaturedImage,
    featuredColors,
    handleUpdateDefaultFeaturedImageAndThumbnails,
    handleSizeSelection,
    handleColorSelection,
    handleGetProductByProductID,
    handleAddProductToCart,
  } = useProductsHook();
  const { currencyRefreshToken } = useDisplayCurrency();


  useEffect(() => {        
      handleGetProductByProductID(productID);
  }, [productID, currencyRefreshToken]);
  
  return (
    <GestureHandlerRootView>
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
          <TouchableOpacity onPress={ () => navigation.navigate("homeScreen", { screen: "Cart" }) } accessibilityLabel="Cart">
            <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
              <ShoppingBag size={ 20 } color="white" variant="Linear" />
              { cartCount > 0 && (
                <View
                  className="absolute -top-1 -right-1 px-1 items-center justify-center rounded-full bg-red-500 border border-white"
                  style={{ minWidth: 18, height: 18 }}
                >
                  <Text className="font-montserratSemiBold text-[10px] text-white">
                    { cartCount > 9 ? "9+" : cartCount }
                  </Text>
                </View>
              ) }
            </View>
          </TouchableOpacity>
        </View>


        { (product?.productId !== productID) ? (
          <ProductDetailsSkeletonLoader />
        ) : (
        <ScrollView
          showsVerticalScrollIndicator={ false }
            className="mt-[15px]"
        >
          <FastImage
            source={require("../../../../../assets/images/product_detail_top_background.png")}
            className="h-[400px] w-full absolute top-0 left-0 z-0"
            resizeMode={FastImage.resizeMode.stretch}
          />

          {/*==== Product Image And Color Palete ====*/}
          <ProductImagesAndColorsComponent
            defaultFeaturedImageAndThumbnails={ defaultFeaturedImageAndThumbnails }
            featuredImage={ featuredImage }
            setFeaturedImage={ setFeaturedImage }
            featuredColors={ featuredColors }
            handleUpdateDefaultFeaturedImageAndThumbnails={ handleUpdateDefaultFeaturedImageAndThumbnails }
            handleSizeSelection={ handleSizeSelection }
            handleColorSelection={ handleColorSelection }
            handleAddProductToCart={ handleAddProductToCart }
          />


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

            { (selectedTab === "Details") ? (
              <DescriptionComponent product={ product! } />
            ) : (selectedTab === "Reviews") ? (
              <ReviewComponent reviewAndRating={reviewAndRating!} productID={productID!} loadingMessage={"Getting product reviews..."} />
              // <></>
            ) : (
              <TimelineComponent productType={ product?.productType! } />
            ) }
          </View>


          {/*==== Similar Items Section ====*/}
          <View className="my-12 px-5">
            <View className="flex-row justify-between items-center">
              <Text className="font-medium text-base text-baseGreen">Similar items</Text>
              <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Similar Products" }) }>
                <Text className="text-sm text-baseGreen">See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={ false }
              className="h-auto w-full mt-3"
            >
              { popularProducts.slice(0, 10).map((popularProduct: IProduct) => (
                  <ProductCardComponent
                    key={ popularProduct.productId }
                    product={ popularProduct }
                    handleOnPress={ () => {
                      dispatch(setProductID(popularProduct.productId));
                      navigation.navigate("productDetailScreen");
                    } }
                    orientation="Vertical"
                  />
                )) }
            </ScrollView>
          </View>
        </ScrollView>
        ) }


        { showSizedGuideBottomSheet && (
          <SizeGuideBottomSheet />
        ) }

      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default ProductDetailScreen;