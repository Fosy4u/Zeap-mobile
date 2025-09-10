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

const AccessoriesDashboardScreen = () => {
    const { popularProducts } = useSelector((state: RootState) => state.productState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const {
        popularProductIsLoading,
    } = useHomeHook();

    const ourCollections = [
        {
            id: 1,
            title: "Fragrance",
            image: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgolden-fragrance.374ae26a.webp&w=384&q=75",
        },
        {
            id: 2,
            title: "Hair Care",
            image: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgolden-haircare.becc9b31.webp&w=384&q=75",
        },
        {
            id: 3,
            title: "Makeup",
            image: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgolden-makeup.84c32cfd.webp&w=384&q=75",
        },
        {
            id: 4,
            title: "Skin Care",
            image: "https://zeap-web.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgolden-skincare.f3010f13.webp&w=384&q=75",
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

                {/*==== Zeaper Accessories Section ====*/}
                <View className="h-[300px] w-full mt-5 bg-baseGreen rounded-md">
                    <FastImage
                        className="h-full w-full rounded-md"
                        resizeMode={ FastImage.resizeMode.cover }
                        source={{
                            uri: "https://zeap-web.vercel.app/_next/static/media/acce-home.b4605b8a.jpg"
                        }}
                    />
                    <View className="h-full w-full absolute inset-0 bg-black/50 rounded-md" />
                    <View className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                        <Text className="mt-24 font-montserratBold text-white text-xl">Zeaper Accessories</Text>
                        <Text className="text-xs text-white italic text-center">Discover the latest trends in accessories.</Text>

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

                {/*==== Our Beauty Collections Section ====*/}
                <View className="h-[300px] w-full mt-7">
                    <Text className="font-montserratBold text-baseGreen text-xl">Our Beauty Collections</Text>
                    <Text className="text-xs text-baseGreen italic">Designed for Every Special Moment</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full mt-4"
                    >
                        { ourCollections.map((item: any, index: number) => (
                            <View
                                key={ item.id }
                                className={`h-auto w-[210px] relative rounded-md overflow-hidden ${ (index !== ourCollections.length - 1) ? "mr-4" : "" }`}
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
                                </View>
                            </View>
                        )) }
                    </ScrollView>
                </View>

                {/*==== Our Return Guarantee Section ====*/}
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

                {/*==== Explore Our Bag Collection Section ====*/}
                <View className="h-[300px] w-full mt-5 bg-baseGreen rounded-md">
                    <FastImage
                        className="h-full w-full rounded-md"
                        resizeMode={ FastImage.resizeMode.cover }
                        source={{
                            uri: "https://zeap-web.vercel.app/_next/static/media/golden-bag.20ffb036.jpg"
                        }}
                    />
                    <View className="h-full w-full absolute inset-0 bg-black/50 rounded-md" />
                    <View className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                        <Text className="mt-24 font-montserratBold text-white text-xl">Explore Our Bag Collection</Text>
                        <Text className="text-xs text-white italic text-center">Discover the perfect bag to complement your style.</Text>

                        {/*==== Explore Button ====*/}
                        <TouchableOpacity
                            className="mt-5 mx-auto px-4 py-3 flex-row items-center bg-baseGreen rounded-md"
                            onPress={() => {
                            // Add your action here
                            }}
                        >
                            <Text className="font-montserratRegular text-xs text-white">Shop Now</Text>
                            <ArrowRight size={14} variant="Linear" className="ml-2 text-white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/*==== Accessories Latest Arrivals Section ====*/}
                <View className="mt-6">
                    <View className="flex-row justify-between items-center">
                    <Text className="font-medium text-base text-baseGreen">Accessories Latest</Text>
                    <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Accessories Latest" }) }>
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

export default AccessoriesDashboardScreen;
