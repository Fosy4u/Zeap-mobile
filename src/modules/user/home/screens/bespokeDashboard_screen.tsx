import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ArrowRight } from 'iconsax-react-native'
import React from 'react'
import { ScrollView, StatusBar, Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Video } from 'react-native-video'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import RootNavigationStackModel from '../../../../routes/model/routes_model'
import ProductCardComponent from '../../../general/components/productCard_component'
import LinearGradient from 'react-native-linear-gradient'
import IProduct from '../../products/models/product_model'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store/store'
import useHomeHook from '../hooks/home_hook'
import { setProductID } from '../../products/slices/product_slice'

const BespokeDashboardScreen = () => {
    const { popularProducts } = useSelector((state: RootState) => state.productState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const {
        popularProductIsLoading,
    } = useHomeHook();

    const bespokeForOccasions = [
        {
            id: 1,
            title: "Wedding Dresses",
            image: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwedding_dress_1.c9a20f86.jpg&w=640&q=75",
        },
        {
            id: 2,
            title: "Evening Wears",
            image: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FEvening_bespoke.2f25b170.jpg&w=640&q=75",
        },
        {
            id: 3,
            title: "Gala Events",
            image: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbespoke_gala.e8c38849.webp&w=640&q=75",
        },
        {
            id: 4,
            title: "Office Attires",
            image: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmen_suit_1.bb24529f.webp&w=640&q=75",
        },
        {
            id: 5,
            title: "Cultural Events",
            image: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fath6.dc7f6cf5.webp&w=640&q=75",
        },
        {
            id: 6,
            title: "Casuals",
            image: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbespoke_casual.7fb1bf03.webp&w=640&q=75",
        },
    ];

    return (
        <SafeAreaView className="flex-1 h-auto w-screen pb-20 bg-white">
            <StatusBar
                backgroundColor="#112F1E"
                barStyle="light-content"
            />

            {/*==== Main Body Section ====*/}
            <View className="h-auto w-[90%]">

                {/*==== Hero Section ====*/}
                <View className="h-[300px] w-full bg-baseGreen rounded-md">
                    <Video
                        source={{ uri: "https://firebasestorage.googleapis.com/v0/b/zeap-7de3d.appspot.com/o/video%2FbespokeHome.mov?alt=media&token=cce17885-309d-4fbc-9897-a394afd08343" }}
                        style={{ width: "100%", height: 300, borderRadius: 5 }}
                        resizeMode={ FastImage.resizeMode.cover }
                        repeat
                        muted
                    />
                    <View className="h-full w-full absolute inset-0 bg-black/50 rounded-md" />
                    <View className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                        <Text className="mt-24 font-montserratBold text-white text-3xl">Bespoke Fashion</Text>
                        <Text className="text-xs text-white italic">Crafting Unique Styles Just for You</Text>

                        {/*==== Sell on Zeaper Button ====*/}
                        <TouchableOpacity
                            className="mt-5 mx-auto px-4 py-3 flex-row items-center bg-baseGreen rounded-md"
                            onPress={() => {
                            // Add your action here
                            }}
                        >
                            <Text className="font-montserratRegular text-xs text-white">Explore Now</Text>
                            <ArrowRight size={14} variant="Linear" className="ml-2 text-white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/*==== Tailored To Perfection Section ====*/}
                <View className="h-auto w-full mt-5 py-10 px-5 bg-lightGold rounded-md">
                    <Text className="font-montserratBold text-baseGreen text-3xl text-center">BESPOKE</Text>
                    <Text className="font-montserratMedium text-baseGreen text-xs text-center">Tailored To Perfection</Text>

                    <Text className="mt-5 font-montserratMedium text-baseGreen text-xs text-center">
                        "Experience the art of bespoke tailoring with our exclusive collection.
                        Each piece is crafted to your unique specifications, ensuring a perfect
                        fit and unparalleled style."
                    </Text>
                </View>

                {/*==== Bespoke For Men Section ====*/}
                <View className="h-[300px] w-full mt-5 bg-baseGreen rounded-md">
                    <FastImage
                        className="h-full w-full rounded-md"
                        resizeMode={ FastImage.resizeMode.cover }
                        source={{
                            uri: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmen_bespoke_background.bfa21891.webp&w=1920&q=75"
                        }}
                    />
                    <View className="h-full w-full absolute inset-0 bg-black/50 rounded-md" />
                    <View className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                        <Text className="mt-24 font-montserratBold text-white text-xl">BESPOKE FOR REAL MEN</Text>
                        <Text className="text-xs text-white italic">Men With Class</Text>

                        {/*==== Explore Button ====*/}
                        <TouchableOpacity
                            className="mt-5 mx-auto px-4 py-3 flex-row items-center bg-baseGreen rounded-md"
                            onPress={() => {
                            // Add your action here
                            }}
                        >
                            <Text className="font-montserratRegular text-xs text-white">Explore Now</Text>
                            <ArrowRight size={14} variant="Linear" className="ml-2 text-white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/*==== Guarantee Return Section ====*/}
                <View className="h-auto w-full mt-5 pt-5 pb-8 px-2 border border-gray-100 rounded-md">
                    <FastImage
                        className="h-[200px] w-full rounded-md"
                        resizeMode={ FastImage.resizeMode.cover }
                        source={{
                            uri: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsell3.11ca3976.jpg&w=640&q=75"
                        }}
                    />

                    <Text className="mt-5 font-montserratBold text-baseGreen text-xl text-center">GUARANTEE RETURN</Text>
                    <Text className="mt-2 px-5 font-montserratMedium text-baseGreen text-xs text-center">
                        "We guarantee return and cash back if tailor fails to deliver."
                    </Text>

                    {/*==== Explore Button ====*/}
                    <TouchableOpacity
                        className="mt-5 mx-auto px-4 py-3 flex-row items-center bg-gold rounded-md"
                        onPress={() => {
                        // Add your action here
                        }}
                    >
                        <Text className="font-montserratMedium text-xs text-baseGreen">Browse Our Collections</Text>
                        <ArrowRight size={14} variant="Linear" className="ml-2 text-baseGreen" />
                    </TouchableOpacity>
                </View>

                {/*==== Bespoke For Women Section ====*/}
                <View className="h-[300px] w-full mt-5 bg-baseGreen rounded-md">
                    <FastImage
                        className="h-full w-full rounded-md"
                        resizeMode={ FastImage.resizeMode.cover }
                        source={{
                            uri: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwomen_background.013f7769.jpg&w=1920&q=75"
                        }}
                    />
                    <View className="h-full w-full absolute inset-0 bg-black/50 rounded-md" />
                    <View className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                        <Text className="mt-24 font-montserratBold text-white text-xl">BESPOKE FOR WOMEN</Text>
                        <Text className="text-xs text-white italic">Women With Style</Text>

                        {/*==== Explore Button ====*/}
                        <TouchableOpacity
                            className="mt-5 mx-auto px-4 py-3 flex-row items-center bg-baseGreen rounded-md"
                            onPress={() => {
                            // Add your action here
                            }}
                        >
                            <Text className="font-montserratRegular text-xs text-white">Explore Now</Text>
                            <ArrowRight size={14} variant="Linear" className="ml-2 text-white" />
                        </TouchableOpacity>
                    </View>
                </View>


                {/*==== Bespoke For Occasions Section ====*/}
                <View className="h-[400px] w-full mt-7">
                    <Text className="font-montserratBold text-baseGreen text-xl">BESPOKE FOR WOMEN</Text>
                    <Text className="text-xs text-baseGreen italic">Tailored for Every Special Moment</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full mt-4"
                    >
                        { bespokeForOccasions.map((item: any, index: number) => (
                            <FastImage
                                key={ item.id }
                                className={`h-[340px] w-[270px] rounded-md ${ (index !== bespokeForOccasions.length - 1) ? "mr-4" : "" }`}
                                resizeMode={ FastImage.resizeMode.cover }
                                source={{
                                    uri: item.image,
                                    priority: FastImage.priority.normal
                                }}
                            />
                        )) }
                    </ScrollView>
                </View>

                {/*==== Bespoke Shoes Section ====*/}
                <View className="h-[300px] w-full mt-5 bg-baseGreen rounded-md">
                    <FastImage
                        className="h-full w-full rounded-md"
                        resizeMode={ FastImage.resizeMode.cover }
                        source={{
                            uri: "https://zeap-web.vercel.app/asset/Shoes-Banner.jpg"
                        }}
                    />
                    <View className="h-full w-full absolute inset-0 bg-black/50 rounded-md" />
                    <View className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                        <Text className="mt-24 font-montserratBold text-white text-xl">BESPOKE SHOES</Text>
                        <Text className="text-xs text-white italic text-center">{"Custom-made shoes tailored to your specific \nneeds and preferences"}</Text>

                        {/*==== Explore Button ====*/}
                        <TouchableOpacity
                            className="mt-5 mx-auto px-4 py-3 flex-row items-center bg-baseGreen rounded-md"
                            onPress={() => {
                            // Add your action here
                            }}
                        >
                            <Text className="font-montserratRegular text-xs text-white">Explore Now</Text>
                            <ArrowRight size={14} variant="Linear" className="ml-2 text-white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/*==== Popular Items Section ====*/}
                <View className="mt-6">
                    <View className="flex-row justify-between items-center">
                    <Text className="font-medium text-base text-baseGreen">Popular items</Text>
                    <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Popular Products" }) }>
                        <Text className="text-sm text-baseGreen">See all</Text>
                    </TouchableOpacity>
                    </View>

                    <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={ false }
                    className="h-auto w-full mt-2"
                    >
                    { popularProductIsLoading ? (
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
                        popularProducts.slice(0, 10).map((popularProduct: IProduct) => (
                        <ProductCardComponent
                            key={ popularProduct.productId }
                            product={ popularProduct }
                            handleOnPress={ () => {
                            dispatch(setProductID(popularProduct.productId));
                            navigation.navigate("productDetailScreen");
                            } }
                            orientation="Vertical"
                        />
                        ))
                    ) }
                    </ScrollView>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default BespokeDashboardScreen;
