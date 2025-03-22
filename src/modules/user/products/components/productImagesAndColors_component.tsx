import React, { useRef, useState } from 'react'
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native'
import IProductDetails from '../models/productDetails_model';
import useProductsHook from '../hooks/products_hook';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { ArrowRight, Ruler } from 'iconsax-react-native';
import { setShowSizedGuideBottomSheet } from '../slices/product_slice';

interface IProps {
  product: IProductDetails;
};

const ProductImagesAndColorsComponent: React.FC<IProps> = ({ product }) => {
  const { selectedColor, selectedSize, selectedQuantity } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  // console.log("SELECTED COLOR::: ", selectedColor);
  

  const {
    defaultFeaturedImageAndThumbnails,
    featuredImage, setFeaturedImage,
    featuredColors,
    handleUpdateDefaultFeaturedImageAndThumbnails,
    handleSizeSelection,
    handleColorSelection,
  } = useProductsHook();
  


  // Color Palette Toggle Slide Animation.
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [visible, setVisible] = useState(false);
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
          {/*==== Product Name, Image And Price ====*/}
          <View className="h-auto w-full mt-2 pl-5 flex-row items-center justify-between relative">

            {/*==== Featured Image ====*/}
            <View className="h-auto w-[200px] p-3 rounded-xl bg-[#F8F9FE]">
              <Image
                source={
                  featuredImage?.link! && featuredImage?.link! !== ""
                  ? { uri: featuredImage?.link! }
                  : require("../../../../../assets/images/app_logo.png")
                }
                resizeMode="cover"
                className="h-[220px] w-full rounded-lg"
              />
            </View>

            {/*==== Color Palette ====*/}
            <View className="h-[280px] w-[150px] items-end flex justify-center relative">
              <TouchableOpacity onPress={ () => {
                toggleSlide();
                console.log("OPEN DRAWER:::")
              } }
              className=" right-[0.5px]">
                <Image
                  source={ require("../../../../../assets/images/drawer_button.png") }
                  resizeMode="contain"
                  className="h-[150px] w-[41px]"
                />
              </TouchableOpacity>

              { (featuredColors.length !== 0) && (
                  <Animated.View
                    className="h-[260px] w-[150px] pr-0 right-[0px] items-end justify-center rounded-l-full border border-[#0D986A] bg-gray-100 absolute"
                    style={[
                      { transform: [{ translateX: slideAnim }] },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={ () => {
                        handleColorSelection(featuredColors[0]);
                        handleUpdateDefaultFeaturedImageAndThumbnails(featuredColors[0].name!);
                        toggleSlide()
                      } }
                      className="h-7 w-7 flex items-center justify-center rounded-full absolute right-4 top-4"
                      style={ {  borderWidth: 1, borderColor: selectedColor?.hex === featuredColors?.[0]?.hex ? featuredColors?.[0]?.hex : "transparent" } }
                    >
                      <View className="h-5 w-5 rounded-full" style={ { backgroundColor: featuredColors[0]?.hex! } } />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={ () => {
                          handleColorSelection(featuredColors[1]);
                          handleUpdateDefaultFeaturedImageAndThumbnails(featuredColors[1].name!);
                          toggleSlide()
                        } }
                        className="h-7 w-7 flex items-center justify-center rounded-full absolute left-10 top-[55px]"
                        style={ {  borderWidth: 1, borderColor: selectedColor?.hex === featuredColors[1]?.hex ? featuredColors[1]?.hex : "transparent" } }
                    >
                      <View className="h-5 w-5 rounded-full" style={ { backgroundColor: featuredColors[1]?.hex! } } />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={ () => {
                          handleColorSelection(featuredColors[2]);
                          handleUpdateDefaultFeaturedImageAndThumbnails(featuredColors[2].name!);
                          toggleSlide()
                        } }
                        className="h-7 w-7 flex items-center justify-center rounded-full absolute left-4 top-[115px]"
                        style={ {  borderWidth: 1, borderColor: selectedColor?.hex === featuredColors[2]?.hex ? featuredColors[2]?.hex : "transparent" } }
                    >
                      <View className="h-5 w-5 rounded-full" style={ { backgroundColor: featuredColors[2]?.hex! } } />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={ () => {
                          handleColorSelection(featuredColors[3]);
                          handleUpdateDefaultFeaturedImageAndThumbnails(featuredColors[3].name!);
                          toggleSlide()
                        } }
                        className="h-7 w-7 flex items-center justify-center rounded-full absolute left-10 bottom-[55px]"
                        style={ {  borderWidth: 1, borderColor: selectedColor?.hex === featuredColors[3]?.hex ? featuredColors[3]?.hex : "transparent" } }
                    >
                      <View className="h-5 w-5 rounded-full" style={ { backgroundColor: featuredColors[3]?.hex! } } />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={ () => {
                          handleColorSelection(featuredColors[4]);
                          handleUpdateDefaultFeaturedImageAndThumbnails(featuredColors[4].name!);
                          toggleSlide()
                        } }
                        className="h-7 w-7 flex items-center justify-center rounded-full absolute right-4 bottom-4"
                        style={ {  borderWidth: 1, borderColor: selectedColor?.hex === featuredColors[4]?.hex ? featuredColors[4]?.hex : "transparent" } }
                    >
                      <View className="h-5 w-5 rounded-full" style={ { backgroundColor: featuredColors[4]?.hex! } } />
                    </TouchableOpacity>

                    <View className="h-[35px] w-[120px] flex-row items-center justify-center absolute -right-7 -rotate-90 border border-gray-400 rounded-3xl  bg-gray-200">
                      <Text className="mr-1.5">Colors</Text>
                      <Text className="ml-1.5">Sizes</Text>
                    </View>
                  </Animated.View>
              ) }
            </View>
          </View>

          {/*==== Thumbnails ====*/}
          <View className="mt-3 px-5 flex-row items-center justify-start flex-wrap gap-x-2">
            {defaultFeaturedImageAndThumbnails && (defaultFeaturedImageAndThumbnails?.images?.map((eachImage, index) => (
              <TouchableOpacity  key={ eachImage._id } 
                onPress={ () => setFeaturedImage(eachImage) }
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
                  // const isSizeAvailable = product.variations?.some((variation) => variation.size === eachSize);

                  const availableVariation = product?.variations?.find((variation) => variation?.colorValue === selectedColor?.name!);
                  const isSizeAvailable = availableVariation?.size === eachSize;

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
              <Text className="mt-3 text-xs">Size labeled on item is 'Medium', same as '38' you selected.</Text>
            </View>
          ) }

          {/*==== Add To Cart ====*/}
          <View className="mt-7 px-5">
            <TouchableOpacity
              // onPress={ () => handleAddProductToCart("ReadyMade") }
              className="h-[55px] w-full flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="font-montserratMedium text-lg text-white mr-2">Add to cart</Text>
              <ArrowRight className="text-white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <View className="h-auto w-full mt-2 pl-5 flex-row items-center justify-between relative">

            {/*==== Featured Image ====*/}
            <View className="h-auto w-[200px] mt-5 p-3 rounded-xl bg-[#F8F9FE]">
              <Image
                source={
                  featuredImage?.link! && featuredImage?.link! !== ""
                  ? { uri: featuredImage?.link! }
                  : require("../../../../../assets/images/app_logo.png")
                }
                resizeMode="cover"
                className="h-[220px] w-full rounded-lg"
              />
            </View>

          </View> 

          {/*==== Thumbnails ====*/}
          <View className="mt-3 px-5 flex-row items-center justify-start flex-wrap gap-x-2">
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

          {/*==== Add To cart And Measurement Guid ====*/}
          <View className="mt-8 px-5 ">
            <TouchableOpacity
              onPress={ () => dispatch(setShowSizedGuideBottomSheet(true)) }
              className="h-[55px] w-full flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
              <Ruler size={ 28 } className="mr-2 text-baseGreen" />
              <Text className="font-normal text-base text-baseGreen">Body Measurement Guide</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={ () => navigation.navigate("deliveryAddressScreen") }
              className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGold"
            >
              <Text className="font-montserratMedium text-base text-green-800">Add Address</Text>
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