import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ArrowRight } from 'iconsax-react-native'
import React from 'react'
import { Image, ScrollView, StatusBar, Text, TouchableOpacity } from 'react-native'
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
import formatCurrency from '../../../../utils/formatCurrency'

const ReadyMadeDashboardScreen = () => {
    const { popularProducts } = useSelector((state: RootState) => state.productState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const {
        popularProductIsLoading,
    } = useHomeHook();

    const bespokeForOccasions = [
        {
            id: 1,
            title: "Women",
            price: "7000",
            image: "https://zeap-web.vercel.app/_next/static/media/rtw_women.39f9f4e5.webp",
        },
        {
            id: 2,
            title: "Men",
            price: "7000",
            image: "https://zeap-web.vercel.app/_next/static/media/rtw_men.b7a9853d.webp",
        },
        {
            id: 3,
            title: "Kids",
            price: "7000",
            image: "https://zeap-web.vercel.app/_next/static/media/rtw_kid.3b835fb0.webp",
        },
        {
            id: 4,
            title: "Dresses",
            price: "7000",
            image: "https://zeap-web.vercel.app/_next/static/media/rtw_dress.4358c248.webp",
        },
        {
            id: 5,
            title: "Matching Sets",
            price: "7000",
            image: "https://zeap-web.vercel.app/_next/static/media/rtw_matching.58a37606.webp",
        },
        {
            id: 6,
            title: "Shoes",
            price: "7000",
            image: "https://zeap-web.vercel.app/_next/static/media/sneakers_1.217e6852.webp",
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
                        source={{ uri: "https://firebasestorage.googleapis.com/v0/b/zeap-7de3d.appspot.com/o/video%2FrtwHome.mov?alt=media&token=73c9fa7b-a5cf-4059-b552-cf67f390b578" }}
                        style={{ width: "100%", height: 300, borderRadius: 5 }}
                        resizeMode={ FastImage.resizeMode.cover }
                        repeat
                        muted
                    />
                    <View className="h-full w-full absolute inset-0 bg-black/50 rounded-md" />
                    <View className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                        <Text className="mt-24 font-montserratBold text-center text-white text-3xl">Ready to Wear Fashion</Text>
                        <Text className="text-xs text-white italic">Instant Chic. Zero Fuss</Text>

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


                {/*==== Ready To Wear For an Occasions Section ====*/}
                <View className="h-[400px] w-full mt-7">
                    <Text className="font-montserratBold text-baseGreen text-xl">READY TO WEAR FOR OCCASIONS</Text>
                    <Text className="text-xs text-baseGreen italic">Designed for Every Special Moment</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full mt-4"
                    >
                        { bespokeForOccasions.map((item: any, index: number) => (
                            <View
                                key={ item.id }
                                className={`h-auto w-[210px] relative rounded-md overflow-hidden ${ (index !== bespokeForOccasions.length - 1) ? "mr-4" : "" }`}
                            >
                                <FastImage
                                    className="h-full w-full rounded-md"
                                    resizeMode={ FastImage.resizeMode.cover }
                                    source={{
                                        uri: item.image,
                                        priority: FastImage.priority.normal
                                    }}
                                />
                                <View className="h-[70px] w-full absolute bottom-0 flex items-center justify-center rounded-b-md bg-black/60 ">
                                    <Text className="font-montserratBold text-white">{ item.title }</Text>
                                    <Text className="text-xs text-white italic">{ formatCurrency(item.price, "NGN") }</Text>
                                </View>
                            </View>
                        )) }
                    </ScrollView>
                </View>

                {/*==== Tailored To Perfection Section ====*/}
                <View className="h-auto w-full mt-5 py-10 px-5 bg-lightGold rounded-md">
                    <FastImage
                        className="h-auto w-[25px] rounded-md"
                        resizeMode={ FastImage.resizeMode.cover }
                        source={{
                            uri: "../../../../../assets/images/app_logo.png"
                        }}
                    />
                    <Text className="font-montserratBold text-baseGreen text-2xl text-center">Our Return Guarantee</Text>

                    <Text className="mt-5 font-montserratMedium text-baseGreen text-xs text-center">
                        We stand behind our vendors and want you to be satisfied with your purchase. 
                        If for any reason you are not satisfied, we offer a hassle-free Return and Refund Policy.
                    </Text>

                    {/*==== Learn More Button ====*/}
                    <TouchableOpacity
                        className="mt-5 mx-auto px-4 py-3 flex-row items-center bg-baseGreen rounded-md"
                        onPress={() => {
                        // Add your action here
                        }}
                    >
                        <Text className="font-montserratRegular text-xs text-white">Learn More</Text>
                        <ArrowRight size={14} variant="Linear" className="ml-2 text-white" />
                    </TouchableOpacity>
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
                        <Text className="mt-24 font-montserratBold text-white text-xl">READY TO WEAR SHOES</Text>
                        <Text className="text-xs text-white italic text-center">{"Ready made shoes for your specific \nneeds and preferences"}</Text>

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

                {/*==== Ready to Wear Latest Arrivals Section ====*/}
                <View className="mt-6">
                    <View className="flex-row justify-between items-center">
                    <Text className="font-medium text-base text-baseGreen">Latest Arrivals</Text>
                    <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Latest Arrivals" }) }>
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

export default ReadyMadeDashboardScreen;
