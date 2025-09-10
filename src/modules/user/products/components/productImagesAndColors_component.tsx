import React, { useRef, useState } from 'react'
import { Animated, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'
import { IColor, IImage } from '../models/productDetails_model';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { ArrowRight, Ruler, Star1 } from 'iconsax-react-native';
import { setShowSizedGuideBottomSheet } from '../slices/product_slice';
import { IColorEnum } from '../../../general/models/productOptions_model';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import formatCurrency from '../../../../utils/formatCurrency';

interface IProps {
  defaultFeaturedImageAndThumbnails: IColor;
  featuredImage: IImage;
  setFeaturedImage: (image: IImage) => void;
  featuredColors: IColorEnum[];
  handleUpdateDefaultFeaturedImageAndThumbnails: (color: string) => void;
  handleSizeSelection: (size: string) => void;
  handleColorSelection: (color: IColorEnum) => void;
  handleAddProductToCart: (productType: string) => void;
};

const ProductImagesAndColorsComponent: React.FC<IProps> = (props) => {
  const {
    defaultFeaturedImageAndThumbnails,
    featuredImage,
    setFeaturedImage,
    featuredColors,
    handleUpdateDefaultFeaturedImageAndThumbnails,
    handleSizeSelection,
    handleColorSelection,
    handleAddProductToCart,
  } = props;

  const { product, reviewAndRating, productPromotion, selectedColor, selectedSize, isLoading } = useSelector((state: RootState) => state.productState);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  // console.log("SELECTED COLOR::: ", selectedColor);

  // Color Palette Toggle Slide Animation.
  const slideAnim = useRef(new Animated.Value(300)).current;
  const toggleSlide = () => {
    Animated.timing(slideAnim, {
      toValue: visible ? 300 : 0, // Slide in (toValue=0) or slide out (toValue=300)
      duration: 500, // Duration in milliseconds
      useNativeDriver: true,
    }).start(() => setVisible(!visible)); // Toggle visibility after animation
  };

  return (
    <View className="">
      { (product?.productType === "readyMadeCloth" || product?.productType === "readyMadeShoe" || product?.productType === "accessory") ? (
        <View>
          {/*==== Product Type, Status & Title ====*/}
          <View className="h-auto w-full px-5">
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

          {/*==== Product Review, Stocks, Sold & Discount Count ====*/}
          <View className="mt-2 px-5">
            <View className="mt-2.5 flex-row items-center space-x-3">
              <View className="flex-row items-center">
                <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                <Text className="font-montserratMedium text-blue-600">
                  { reviewAndRating?.averageRating?.toFixed(1) ?? '0.0' }
                </Text>
                <Text className="ml-1 font-montserratMedium text-xs text-black">({ reviewAndRating?.reviews!.length } { reviewAndRating?.reviews!.length > 1 ? "reviews" : "review" })</Text>
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
          
          {/* ==== Hero Image ==== */}
          <View className="mt-3 px-5">
            <View className="h-auto w-full p-2 rounded-xl border border-gray-200 bg-[#EDEFF4]">
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
                  <ShimmerPlaceholder
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
          </View>

          {/*==== Thumbnails ====*/}
          <View className="mt-5 px-5 flex-row items-center justify-start flex-wrap gap-x-2">
            {defaultFeaturedImageAndThumbnails && (defaultFeaturedImageAndThumbnails?.images?.map((eachImage, index) => (
              <TouchableOpacity  key={ eachImage._id } 
                onPress={ () => setFeaturedImage(eachImage) }
                className={`h-[75px] w-[75px] rounded-2xl border ${ (eachImage._id! === featuredImage?._id!) ? "border-baseGreen" : "border-gray-300" } bg-[#F8F9FE]`}
              >
                <FastImage
                  source={{
                    uri: eachImage.link!,
                    priority: FastImage.priority.normal
                  }}
                  defaultSource={ require("../../../../../assets/images/app_logo.png") }
                  resizeMode={ FastImage.resizeMode.cover }
                  className="h-[73px] w-[73px] rounded-2xl"
                />
              </TouchableOpacity>
            ))) }
          </View>

          {/*==== Product Price ====*/}
          <View className="h-auto w-full mt-5 px-5 flex-row items-center justify-between">
            <View className="h-auto w-auto flex items-start justify-center">
              <View className="flex-row items-center">
                    <Text className="mt-2.5 text-2xl font-medium text-gray-900">{ product.variations![0].discount ? formatCurrency(product?.variations![0].discount || "0", product?.variations![0].currency || "NGN", true) : formatCurrency(product?.variations![0].price || "0", product?.variations![0].currency || "NGN", true) }</Text>
                    <Text className="mt-2.5 ml-3 text-lg font-medium text-gray-400 line-through">{ product.variations![0].discount && formatCurrency(product?.variations![0].price || "0",  product?.variations![0].currency || "NGN", true) }</Text>
                </View>
            </View>
          </View>

          {/*==== Available Colours ====*/}
          { featuredColors.length !== 0 && (
            <View className="h-auto w-full mt-7 px-5">
              <Text className="font-montserratSemiBold text-gray-700 text-[15px]">Available Colours</Text>
              <View className="h-auto w-full mt-3 flex-row gap-x-4 items-center justify-start flex-wrap">
                { featuredColors.map((eachColor) => (
                  <TouchableOpacity key={ eachColor.name! }
                    onPress={ () => {
                      handleColorSelection(eachColor);
                      handleUpdateDefaultFeaturedImageAndThumbnails(eachColor.name!);
                    } }
                    className="h-7 w-7 flex items-center justify-center rounded-full"
                    style={ {  borderWidth: 1, borderColor: selectedColor.hex === eachColor.hex ? eachColor.hex : "transparent" } }
                  >
                    <View className="h-5 w-5 rounded-full" style={ { backgroundColor: eachColor.hex! } } />
                  </TouchableOpacity>
                )) }
              </View>
            </View>
          ) }

          {/*==== Available Sizes ====*/}
          { product.sizes?.length !== 0 && (
            <View className="h-auto w-full mt-7 px-5">
              <View className="h-auto w-full flex-row items-center justify-between">
                <Text className="flex-1 font-montserratSemiBold text-gray-700 text-[15px]">Available Sizes</Text>
                <TouchableOpacity
                  onPress={ () => dispatch(setShowSizedGuideBottomSheet(true)) }
                  className="h-auto w-auto px-3.5 py-1.5 flex-row items-center justify-center rounded-lg bg-lightGreen"
                >
                  <Ruler size={ 28 } className="mr-2 text-baseGreen" />
                  <Text className="font-montserratMedium text-base text-baseGreen">Size Guide</Text>
                </TouchableOpacity>
              </View>
              <View className="h-auto w-full mt-3 flex-row gap-x-4 items-center justify-start flex-wrap">
                { product.sizes!.map((eachSize) => {
                  // Check if size exists in variations
                  const isSizeAvailable = product.variations?.some((variation) => variation.size === eachSize);

                  return (
                    <TouchableOpacity
                      key={ eachSize }
                      onPress={() => isSizeAvailable && handleSizeSelection(eachSize)}
                      disabled={!isSizeAvailable}
                      className="h-[40px] w-[50px] flex items-center justify-center rounded-xl"
                      style={ { 
                        borderWidth: 1,
                        borderColor: selectedSize === eachSize ? "#133522" : "#d1d5db",
                        opacity: isSizeAvailable ? 1 : 0.5
                      } }
                    >
                      <Text className={isSizeAvailable ? 'none' : 'line-through'}>{eachSize}</Text>
                    </TouchableOpacity>
                  )
                }) }
              </View>
            </View>
          ) }

          {/*==== Add To Cart ====*/}
          <View className="mt-7 px-5">
            <TouchableOpacity
              onPress={ () => handleAddProductToCart(product?.productType!) }
              className="h-[55px] w-full flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="font-montserratMedium text-lg text-white mr-2">Add to cart</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          {/*==== Product Type and Status ====*/}
          <View className="h-auto w-full px-5">
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

          {/*==== Product Stocks Count ====*/}
          <View className="mt-2 px-5">
            <View className="mt-2.5 flex-row items-center space-x-3">
              <View className="flex-row items-center">
                <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                <Text className="font-montserratMedium text-blue-600">
                  { reviewAndRating?.averageRating?.toFixed(1) ?? '0.0' }
                </Text>
                <Text className="ml-1 font-montserratMedium text-xs text-black">({ reviewAndRating?.reviews!.length } { reviewAndRating?.reviews!.length > 1 ? "reviews" : "review" })</Text>
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
          
          {/* ==== Hero Image ==== */}
          <View className="mt-3 px-5">
            <View className="h-auto w-full p-2 rounded-xl border border-gray-200 bg-[#EDEFF4]">
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
                  <ShimmerPlaceholder
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
          </View>

          {/*==== Thumbnails ====*/}
          <View className="mt-3 px-5 flex-row items-center justify-start flex-wrap gap-2">
            { defaultFeaturedImageAndThumbnails && (defaultFeaturedImageAndThumbnails?.images?.map((eachImage, index) => (
              <TouchableOpacity  key={ eachImage._id } 
                onPress={ () => setFeaturedImage(eachImage)}
                className={`h-[75px] w-[75px] rounded-2xl border ${ (eachImage._id! === featuredImage?._id!) ? "border-baseGreen" : "border-gray-300" } bg-[#F8F9FE]`}
              >
                <Image
                  source={
                    defaultFeaturedImageAndThumbnails?.images![index]?.link!
                    ? { uri: defaultFeaturedImageAndThumbnails?.images![index]?.link! }
                    : require("../../../../../assets/images/app_logo.png")
                  }
                  resizeMode="cover"
                  className="h-[73px] w-[73px] rounded-2xl"
                />
              </TouchableOpacity>
            ))) }
          </View>
 
          {/*==== Available Colours & Size ====*/}
          <View className="h-auto w-full mt-8 px-5 flex-row items-center justify-between">
            { featuredColors.length !== 0 && (
              <View className="h-auto  w-full flex-1">
                <Text className="font-montserratSemiBold text-gray-700 text-[15px]">Available Colours</Text>
                <View className="h-auto w-full mt-3 flex-row gap-x-4 items-center justify-start flex-wrap">
                  { featuredColors.map((eachColor) => (
                    
                    <TouchableOpacity key={ eachColor.name! }
                      onPress={ () => {
                        handleColorSelection(eachColor);
                      } }
                      className="h-7 w-7 flex items-center justify-center rounded-full"
                      style={ {  borderWidth: 1, borderColor: selectedColor?.hex === eachColor.hex ? eachColor.hex : "transparent" } }
                    >
                    <View className="h-5 w-5 rounded-full" style={ { backgroundColor: eachColor.hex! } } />
                  </TouchableOpacity>
                  )) }
                </View>
              </View>
            ) }

            <View className="h-auto">
              <Text className="font-montserratSemiBold text-right text-gray-700 text-[15px]">Size</Text>
              <Text className="font-montserratSemiBold text-right text-gray-700 text-[18px]">{ product?.sizes?.[0] }</Text>
            </View>
          </View>

          {/*==== Add To cart ====*/}
          <View className="mt-5 px-5 ">
            <TouchableOpacity
              onPress={ () => dispatch(setShowSizedGuideBottomSheet(true)) }
              className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGold"
            >
              <Text className="font-normal text-base text-baseGreen">Body Measurement Guide</Text>
              <Ruler size={ 28 } className="ml-2 text-baseGreen" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={ () => navigation.navigate("measurementScreen") }
              className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="font-montserratMedium text-lg text-white mr-2">Add to cart</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>
          </View>
        </View>
      ) }
      
    </View>
  )
}

export default ProductImagesAndColorsComponent