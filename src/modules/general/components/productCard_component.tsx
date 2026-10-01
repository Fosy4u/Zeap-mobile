import React from 'react'
import IProduct from '../../user/products/models/product_model';
import { View } from 'react-native-animatable';
import { Heart } from 'iconsax-react-native';
import FormatWords from '../../../utils/formatWords';
import FastImage from 'react-native-fast-image';
import { Image, Text, TouchableOpacity } from 'react-native';
import formatCurrency from '../../../utils/formatCurrency';
import useWishlistToggle from '../../user/saved/hooks/wishlistToggle_hook';
import useDisplayCurrency from '../hooks/displayCurrency_hook';
import ColorSwatchComponent from './colorSwatch_component';
import getProductSwatchValues from '../../../utils/productColors';

interface IProductCardItemProps {
  product: IProduct;
  handleOnPress: () => void;
  orientation: "Horizontal" | "Vertical";
  gridItem?: boolean;
}

const ProductCardComponent: React.FC<IProductCardItemProps> = (props) => {
    const { product, handleOnPress, orientation, gridItem = false } = props;
    const { isSaved, toggleSave } = useWishlistToggle();
    const { resolveCurrency } = useDisplayCurrency();
    const saved = isSaved(product?.productId);

    return (
        <TouchableOpacity
            onPress={ handleOnPress }
            className={`p-3 rounded-2xl overflow-hidden bg-[#F8F9FE] ${ orientation === "Horizontal" ? "mr-4 h-auto w-[280px] flex-row justify-start" : gridItem ? "h-auto w-full" : "mr-4 h-[300px] w-[170px]" }`}
            >
            <View className={`relative rounded-xl overflow-hidden bg-[#EEF0F7] ${ orientation === "Horizontal" ? "h-[150px] w-[130px] mr-4" : "h-[160px] w-full" }`}>
                <View className="absolute inset-0 items-center justify-center">
                    <Image
                        source={ require("../../../../assets/images/image_placeholder.png") }
                        resizeMode="contain"
                        className="h-1/2 w-1/2"
                    />
                </View>
                <FastImage
                    source={{
                        uri: product?.colors?.[0]?.images?.[0]?.link!,
                        priority: FastImage.priority.normal
                    }}
                    resizeMode={ FastImage.resizeMode.cover }
                    className="h-full w-full"
                    fallback
                />
                <TouchableOpacity
                    onPress={ () => toggleSave(product) }
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    className="h-[35px] w-[35px] absolute top-1.5 right-1.5 flex items-center justify-center rounded-xl bg-gray-200"
                >
                    {/* Always render the heart — it starts unsaved and flips to
                        filled once the wishlist lands, so no spinner is shown. */}
                    <Heart color={ saved ? "#e11d48" : "gray" } variant={ saved ? "Bold" : "Linear" } />
                </TouchableOpacity>
            </View>
            <View className={`mt-3 ${ orientation === "Horizontal" ? "flex-1" : "" }`}>
                <Text className={`text-gray-800 ${ orientation === "Horizontal" ? "text-sm font-montserratSemiBold" : "text-xs" }`}>{ FormatWords.truncateWords(product.title, 30) }</Text>
                <View className="mt-1.5 flex-row items-center justify-between">
                    <Text className="px-2 py-0.5 text-xs rounded-lg bg-lightGreen">
                        { FormatWords.productGroupLabel(product.categories?.productGroup, product?.productType, product?.productId) }
                    </Text>

                    {/* <View className="flex-row">
                        <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                        <Text>4.3</Text>
                    </View> */}
                </View>

                { (() => {
                    const variation = product?.variations?.[0];
                    if (!variation) { return null; }
                    const currency = resolveCurrency(variation.currency);
                    const price = Number(variation.price) || 0;
                    const variationDiscount = Number(variation.discount) || 0;
                    const promoPercent = Number(product?.promo?.discountPercentage) || 0;

                    let displayPrice = price;
                    let savePercent = 0;
                    if (variationDiscount > 0 && variationDiscount < price) {
                        displayPrice = variationDiscount;
                        savePercent = ((price - variationDiscount) / price) * 100;
                    } else if (promoPercent > 0 && promoPercent < 100 && price > 0) {
                        savePercent = promoPercent;
                        displayPrice = price * (1 - promoPercent / 100);
                    }
                    const hasDiscount = savePercent > 0 && displayPrice < price;
                    const colors = getProductSwatchValues(product);
                    const visibleColors = colors.slice(0, 4);
                    const extraColors = Math.max(0, colors.length - visibleColors.length);

                    const isHorizontal = orientation === "Horizontal";

                    // Price stack — current + strikethrough on the first line,
                    // "Save X%" on the next.
                    const priceStack = (
                        <View className={ isHorizontal ? "" : "flex-1 mr-2" }>
                            <View className="flex-row items-baseline flex-wrap">
                                <Text className="text-sm font-semibold text-gray-900">
                                    { formatCurrency(hasDiscount ? displayPrice : price, currency) }
                                </Text>
                                { hasDiscount && (
                                    <Text className="ml-2 text-[11px] font-medium text-gray-400 line-through">
                                        { formatCurrency(price, currency) }
                                    </Text>
                                ) }
                            </View>
                            { hasDiscount && (
                                <Text className="mt-0.5 text-[11px] font-semibold text-green-600">
                                    Save { Number(savePercent.toFixed(2)) }%
                                </Text>
                            ) }
                        </View>
                    );
                    
                    const swatches = colors.length > 0 ? (
                        <View className={ `flex-row items-center flex-shrink-0 ${ isHorizontal ? "mt-2 self-end" : "mt-1" }` }>
                            { visibleColors.map((color, idx) => (
                                <ColorSwatchComponent
                                    key={ `${ color }-${ idx }` }
                                    value={ color }
                                    size={ 12 }
                                    style={{ marginRight: 4 }}
                                />
                            )) }
                            { extraColors > 0 && (
                                <Text className="ml-0.5 text-[10px] text-gray-500">+{ extraColors }</Text>
                            ) }
                        </View>
                    ) : null;

                    return isHorizontal ? (
                        <View className="mt-2.5">
                            { priceStack }
                            { swatches }
                        </View>
                    ) : (
                        <View className="mt-2.5 flex-row items-start justify-between">
                            { priceStack }
                            { swatches }
                        </View>
                    );
                })() }
            </View>
        </TouchableOpacity>
    );
};

export default ProductCardComponent;
