import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { Heart } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import IProduct from '../models/product_model';
import { setProductID } from '../slices/product_slice';
import { AppDispatch } from '../../../../redux/store/store';
import formatCurrency from '../../../../utils/formatCurrency';
import FormatWords from '../../../../utils/formatWords';
import useWishlistToggle from '../../saved/hooks/wishlistToggle_hook';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook';
import ColorSwatchComponent from '../../../general/components/colorSwatch_component';
import getProductSwatchValues from '../../../../utils/productColors';

interface IProps {
    product: IProduct;
}

const ProductListCard: React.FC<IProps> = (props) => {
    const { product } = props;
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch<AppDispatch>();
    const { isSaved, toggleSave } = useWishlistToggle();
    const { resolveCurrency } = useDisplayCurrency();
    const saved = isSaved(product?.productId);
    // console.log("PRODUCT LIST ITEM::: ", product);
    

    return (
        <TouchableOpacity
            onPress={() => {
                dispatch(setProductID(product.productId));
                navigation.navigate('productDetailScreen');
            }}
            className="h-auto w-full mt-4 px-3 py-3 flex-row rounded-xl bg-[#F8F9FE]"
        >
            <View className="h-[160px] w-[130px] relative mr-3 overflow-hidden rounded-xl bg-[#EEF0F7]">
                <View className="absolute inset-0 items-center justify-center">
                    <Image
                        source={ require('../../../../../assets/images/image_placeholder.png') }
                        resizeMode="contain"
                        className="h-1/2 w-1/2"
                    />
                </View>
                <FastImage
                    source={{
                        uri: product.colors[0]?.images[0]?.link!,
                        priority: FastImage.priority.normal
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    className="h-full w-full"
                    fallback
                />
                <TouchableOpacity
                    onPress={ () => toggleSave(product) }
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    className="h-[35px] w-[35px] absolute top-0 right-0 flex items-center justify-center rounded-xl bg-gray-200"
                >
                    {/* Always render the heart — it starts unsaved and flips to
                        filled once the wishlist lands, so no spinner is shown. */}
                    <Heart color={ saved ? "#e11d48" : "gray" } variant={ saved ? "Bold" : "Linear" } />
                </TouchableOpacity>
            </View>

            <View className="flex-1 mt-3">
                <Text className="font-montserratMedium text-sm text-gray-800">
                    {product.title}
                </Text>
                <View className="mt-3 flex-row items-center justify-between">
                    <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">
                        { FormatWords.productGroupLabel(product.categories?.productGroup, product?.productType, product?.productId) }
                    </Text>

                    {/* <View className="flex-row">
                        <Star1
                            color="#E4A01C"
                            size={18}
                            variant="Bold"
                            className="mr-0.5"
                        />
                        <Text>4.3</Text>
                    </View> */}
                </View>
                { (() => {
                    const variation = product?.variations?.[0];
                    if (!variation) return null;
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

                    return (
                        <View className="mt-2.5">
                            <View className="flex-row items-baseline flex-wrap">
                                <Text className="text-base font-medium text-gray-900">{ formatCurrency(hasDiscount ? displayPrice : price, currency) }</Text>
                                { hasDiscount && (
                                    <Text className="ml-2 text-sm font-medium text-gray-400 line-through">{ formatCurrency(price, currency) }</Text>
                                ) }
                            </View>
                            { hasDiscount && (
                                <Text className="mt-0.5 text-xs font-semibold text-green-600">Save { Number(savePercent.toFixed(2)) }%</Text>
                            ) }
                        </View>
                    );
                })() }

                { (() => {
                    /* Available colours — same circular swatches (max 4 + "+N")
                       used on the dashboard product card. */
                    const colors = getProductSwatchValues(product);
                    if (colors.length === 0) return null;
                    const visibleColors = colors.slice(0, 4);
                    const extraColors = Math.max(0, colors.length - visibleColors.length);

                    return (
                        <View className="mt-2 flex-row items-center flex-shrink-0">
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
                    );
                })() }
            </View>
        </TouchableOpacity>
    );
};

export default ProductListCard; 