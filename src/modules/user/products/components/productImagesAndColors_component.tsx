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
import SkeletonBlock from '../../../general/components/skeletonBlock_component';
import FastImage from 'react-native-fast-image';
import formatCurrency from '../../../../utils/formatCurrency';
import FormatWords from '../../../../utils/formatWords';

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
  // console.log("SELECTED PRODUCT::: ", product);

  // Global stock — true when every variation across all colours is at zero
  // (or there are no variations). Flags the whole product as out of stock.
  const isOutOfStock = !product?.variations?.some((variation) => (variation.quantity ?? 0) > 0);

  // Selection-aware stock. Each colour carries its own per-size quantities, so
  // the available sizes, the out-of-stock messaging, and the Add-to-cart button
  // must all reflect the CURRENTLY SELECTED colour — not the product as a whole.
  const selectedColorHasStock = product?.variations?.some(
    (variation) => variation.colorValue === selectedColor?.name && (variation.quantity ?? 0) > 0
  );
  const selectedVariation = product?.variations?.find(
    (variation) => variation.colorValue === selectedColor?.name && variation.size === selectedSize
  );
  const canAddToCart = (selectedVariation?.quantity ?? 0) > 0;

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
          <View className="h-auto w-full px-5 pt-5">
            <View className="h-auto w-full flex-row items-center justify-start space-x-3">
              <Text className="px-[8px] py-1.5 font-montserratMedium text-xs rounded-md self-start bg-white">{ FormatWords.productGroupLabel(product?.categories?.productGroup, product?.productType) }</Text>
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
            { isOutOfStock && (
              <View className="mt-3 px-3 py-2 self-start rounded-md border border-red-200 bg-red-50">
                <Text className="font-montserratSemiBold text-xs text-red-600">This product is currently out of stock.</Text>
              </View>
            ) }
          </View>

          {/*==== Product Review, Stocks, Sold & Discount Count ====*/}
          {/* Hidden by request — keep for future re-enable. */}
          {/* <View className="mt-2 px-5">
            <View className="mt-2.5 flex-row items-center space-x-3">
              <View className="flex-row items-center">
                <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                <Text className="font-montserratMedium text-blue-600">
                  { reviewAndRating?.averageRating?.toFixed(1) ?? '0.0' }
                </Text>
                <Text className="ml-1 font-montserratMedium text-xs text-black">({ reviewAndRating?.reviews!.length } { reviewAndRating?.reviews!.length > 1 ? "reviews" : "review" })</Text>
              </View>

              <View className="flex-row items-center">
                <Text className={`font-montserratMedium ${ (product?.variations?.[0]?.quantity ?? 0) >= 10 ? "text-green-600" : "text-red-600" }`}>{ product?.variations?.[0]?.quantity ?? 0 }</Text>
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
          </View> */}

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
                      defaultSource={ require("../../../../../assets/images/app_logo_green.png") }
                      resizeMode={ FastImage.resizeMode.cover }
                      className="h-[500px] w-full rounded-lg"
                      style={{ aspectRatio: 0.68 }}
                      fallback
                  />
                ) : (
                  <View style={{ marginTop: 20 }}>
                    <SkeletonBlock
                      width={ Dimensions.get('window').width - 40 }
                      height={ 350 }
                      radius={ 16 }
                    />
                  </View>
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
                  defaultSource={ require("../../../../../assets/images/app_logo_green.png") }
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
              <Text className="font-montserratSemiBold text-gray-700 text-[15px]">{ selectedColor?.name || "Available Colours" }</Text>
              <View className="h-auto w-full mt-3 flex-row gap-x-4 items-center justify-start flex-wrap">
                { featuredColors.map((eachColor) => {
                  const isColorAvailable = product.variations?.some(
                    (variation) => variation.colorValue === eachColor.name && (variation.quantity ?? 0) > 0
                  );

                  return (
                    // Out-of-stock colours stay selectable so tapping one surfaces
                    // the "out of stock" message + disables Add-to-cart, rather than
                    // silently doing nothing. The diagonal slash marks them; the
                    // swatch itself keeps its true colour (no dimming → black reads
                    // as black, not grey).
                    <TouchableOpacity key={ eachColor.name! }
                      onPress={ () => {
                        handleColorSelection(eachColor);
                        handleUpdateDefaultFeaturedImageAndThumbnails(eachColor.name!);
                      } }
                      className="h-7 w-7 flex items-center justify-center rounded-full"
                      style={ {
                        borderWidth: 1.5,
                        borderColor: selectedColor?.name === eachColor.name ? "#133522" : "transparent",
                      } }
                    >
                      <View className="h-5 w-5 rounded-full border border-gray-200" style={ { backgroundColor: eachColor.hex! } } />
                      { !isColorAvailable && (
                        <View
                          style={{
                            position: "absolute",
                            width: 28,
                            height: 1.5,
                            backgroundColor: "#6b7280",
                            transform: [{ rotate: "45deg" }],
                          }}
                        />
                      ) }
                    </TouchableOpacity>
                  );
                }) }
              </View>
            </View>
          ) }

          {/* Per-colour stock notice — the selected colour is sold out while the
              product still has other colours in stock. */}
          { !isOutOfStock && !selectedColorHasStock && (
            <View className="mt-5 mx-5 px-3 py-2 self-start rounded-md border border-red-200 bg-red-50">
              <Text className="font-montserratSemiBold text-xs text-red-600">This colour is out of stock. Please choose another colour.</Text>
            </View>
          ) }

          {/*==== Available Sizes ====*/}
          { product.sizes?.length !== 0 && (
            <View className="h-auto w-full mt-7 px-5">
              <View className="h-auto w-full flex-row items-center justify-between">
                <Text className="flex-1 font-montserratSemiBold text-gray-700 text-[15px]">Available Sizes</Text>
                { product?.productType !== "accessory" && (
                  <TouchableOpacity
                    onPress={ () => dispatch(setShowSizedGuideBottomSheet(true)) }
                    className="h-auto w-auto px-3.5 py-1.5 flex-row items-center justify-center rounded-lg bg-lightGreen"
                  >
                    <Ruler size={ 28 } className="mr-2 text-baseGreen" />
                    <Text className="font-montserratMedium text-base text-baseGreen">Size Guide</Text>
                  </TouchableOpacity>
                ) }
              </View>
              <View className="h-auto w-full mt-3 flex-row gap-x-4 items-center justify-start flex-wrap">
                { product.sizes!.map((eachSize) => {
                  // A size is available only when the SELECTED COLOUR has that
                  // size in stock. Scoping to `selectedColor` is the fix for the
                  // cross-colour leak where another colour's stock made a size
                  // look available under a colour that doesn't carry it.
                  const isSizeAvailable = product.variations?.some(
                    (variation) => variation.colorValue === selectedColor?.name && variation.size === eachSize && (variation.quantity ?? 0) > 0
                  );

                  return (
                    <TouchableOpacity
                      key={ eachSize }
                      onPress={() => isSizeAvailable && handleSizeSelection(eachSize)}
                      disabled={!isSizeAvailable}
                      className="h-[40px] w-[50px] flex items-center justify-center rounded-xl"
                      style={ {
                        borderWidth: 1,
                        borderColor: !isSizeAvailable
                          ? "#9ca3af"
                          : selectedSize === eachSize ? "#133522" : "#d1d5db",
                        opacity: isSizeAvailable ? 1 : 0.5
                      } }
                    >
                      <Text>{ eachSize }</Text>
                      { !isSizeAvailable && (
                        <View
                          style={{
                            position: "absolute",
                            width: 26,
                            height: 1.5,
                            backgroundColor: "#6b7280",
                            transform: [{ rotate: "45deg" }],
                          }}
                        />
                      ) }
                    </TouchableOpacity>
                  )
                }) }
              </View>
            </View>
          ) }

          {/*==== Add To Cart ====*/}
          <View className="mt-7 px-5">
            <TouchableOpacity
              onPress={ () => canAddToCart && handleAddProductToCart(product?.productType!) }
              disabled={ !canAddToCart }
              className={ `h-[55px] w-full flex-row items-center justify-center rounded-xl ${ canAddToCart ? "bg-baseGreen" : "bg-gray-300" }` }
            >
              <Text className={ `font-montserratMedium text-lg mr-2 ${ canAddToCart ? "text-white" : "text-gray-500" }` }>{ canAddToCart ? "Add to cart" : "Out of stock" }</Text>
              { canAddToCart && <ArrowRight className="text-white" /> }
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          {/*==== Product Type and Status ====*/}
          <View className="h-auto w-full px-5 pt-5">
            <View className="h-auto w-full flex-row items-center justify-start space-x-3">
              <Text className="px-[8px] py-1.5 font-montserratMedium text-xs rounded-md self-start bg-white">{ FormatWords.productGroupLabel(product?.categories?.productGroup, product?.productType) }</Text>
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
                <Text className={`font-montserratMedium ${ (product?.variations?.[0]?.quantity ?? 0) >= 10 ? "text-green-600" : "text-red-600" }`}>{ product?.variations?.[0]?.quantity ?? 0 }</Text>
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
                      defaultSource={ require("../../../../../assets/images/app_logo_green.png") }
                      resizeMode={ FastImage.resizeMode.cover }
                      className="h-[500px] w-full rounded-lg"
                      style={{ aspectRatio: 0.68 }}
                      fallback
                  />
                ) : (
                  <View style={{ marginTop: 20 }}>
                    <SkeletonBlock
                      width={ Dimensions.get('window').width - 40 }
                      height={ 350 }
                      radius={ 16 }
                    />
                  </View>
                ) } 
              </View>
            </View>
          </View>

          {/*==== Thumbnails ====*/}
          <View className="mt-5 px-5 flex-row items-center justify-start flex-wrap gap-x-2">
            { defaultFeaturedImageAndThumbnails && (defaultFeaturedImageAndThumbnails?.images?.map((eachImage, index) => (
              <TouchableOpacity  key={ eachImage._id }
                onPress={ () => setFeaturedImage(eachImage)}
                className={`h-[75px] w-[75px] rounded-2xl border ${ (eachImage._id! === featuredImage?._id!) ? "border-baseGreen" : "border-gray-300" } bg-[#F8F9FE]`}
              >
                <Image
                  source={
                    defaultFeaturedImageAndThumbnails?.images![index]?.link!
                    ? { uri: defaultFeaturedImageAndThumbnails?.images![index]?.link! }
                    : require("../../../../../assets/images/app_logo_green.png")
                  }
                  resizeMode="cover"
                  className="h-[73px] w-[73px] rounded-2xl"
                />
              </TouchableOpacity>
            ))) }
          </View>

          {/*==== Product Price ====*/}
          { (() => {
            const variation = product?.variations?.[0];
            if (!variation) return null;
            const currency = variation.currency || "NGN";
            return (
              <View className="h-auto w-full mt-5 px-5 flex-row items-center justify-between">
                <View className="h-auto w-auto flex items-start justify-center">
                  <View className="flex-row items-center">
                    <Text className="mt-2.5 text-2xl font-medium text-gray-900">{ variation.discount ? formatCurrency(variation.discount || "0", currency, true) : formatCurrency(variation.price || "0", currency, true) }</Text>
                    <Text className="mt-2.5 ml-3 text-lg font-medium text-gray-400 line-through">{ variation.discount && formatCurrency(variation.price || "0", currency, true) }</Text>
                  </View>
                </View>
              </View>
            );
          })() }

          {/*==== Available Colours & Size ====*/}
          <View className="h-auto w-full mt-8 px-5 flex-row items-center justify-between">
            { featuredColors.length !== 0 && (
              <View className="h-auto  w-full flex-1">
                <Text className="font-montserratSemiBold text-gray-700 text-[15px]">{ selectedColor?.name || "Available Colours" }</Text>
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