import React, { useState } from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight, Heart, Ruler, ShoppingBag, Star1 } from 'iconsax-react-native';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import RootNavigationStackModel from '../../../routes/model/routes_model';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DescriptionComponent from '../components/description_component';
import ReviewComponent from '../components/review_component';
import TimelineComponent from '../components/timeline_component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { setSelectedTab } from '../slices/product_slice';

const Tab = createMaterialTopTabNavigator();


const ProductDetailScreen = () => {
  const { selectedTab, tabs } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const [similarItems] = useState([
    {
      id: "001",
      name: "Louis Vuitton Men’s 3piece Suit",
      productType: "Ready-made",
      price: "230.99",
      rating: 4.3,
      isFavorite: false,
      image: require("../../../assets/home/suit.png")
    },
    {
      id: "002",
      name: "Swedish stylish women flay gown",
      productType: "Tailor-made",
      price: "230.99",
      rating: 4.3,
      isFavorite: false,
      image: require("../../../assets/home/gown_one.png")
    },
    {
      id: "003",
      name: "Fancy Blue Children Gown",
      productType: "Ready-made",
      price: "230.99",
      rating: 4.3,
      isFavorite: false,
      image: require("../../../assets/home/blue_shirt.png")
    },
    {
      id: "004",
      name: "Italian wool pink sweat shirt",
      productType: "Ready-made",
      price: "230.99",
      rating: 4.3,
      isFavorite: false,
      image: require("../../../assets/home/sweat_shirt.png")
    },
  ]);
  
  return (
    <SafeAreaView className="h-full w-full relative flex-1 pt-[20px] bg-lightGray">
      <StatusBar
        backgroundColor="#d5f4e3"
        barStyle="dark-content"
      />

      {/*==== Top Skewed Light Green Background ====*/}
      <Image
        source={require("../../../assets/product_detail_top_background.png")}
        className="h-[400px] w-full absolute top-0 left-0"
        resizeMode="stretch"
      />

      {/*==== Header ====*/}
      <View className="h-auto w-full px-[25px] flex-row items-center justify-between">
        <TouchableOpacity onPress={ () => navigation.pop() }>
          <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" />
          </View>
        </TouchableOpacity>
        <Text className="font-semibold text-lg text-baseGreen">Product Details</Text>
        <View className="h-[40px] w-[40px]" />
      </View>


      <ScrollView showsVerticalScrollIndicator={ false } className="mt-[30px]">

        {/*==== Product Name And Price ====*/}
        <View className="h-auto w-full px-[25px] flex-row items-start justify-between">
          <View className="h-auto w-[220px]">
            <Text className="px-[8px] py-[3px] text-xs rounded-md self-start bg-white">Tailor Sewn</Text>
            <Text className="mt-2 font-medium text-[24px] text-baseGreen">
              Swedish stylish women flay gown
            </Text>
            <View className="mt-2.5 flex-row items-center">
              <Text className="mr-5 font-medium text-base text-baseGreen">$230.98</Text> 
              <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
              <Text className="text-xs">4.3</Text>
            </View>
          </View>

          <View>
            <View className="h-[40px] w-[40px] flex items-center justify-center border border-baseGreen rounded-full">
              <Heart size={ 18 } className="text-baseGreen" />
            </View>
            <View className="h-[40px] w-[40px] mt-6 flex items-center justify-center border border-baseGreen rounded-full">
              <ShoppingBag size={ 18 } className="text-baseGreen" />
            </View>
          </View>
        </View>

        {/*==== Product Image And Color Palete ====*/}
        <View className="h-auto w-full mt-10 pl-[25px] flex-row items-center justify-between">
          <View className="h-auto w-[200px] p-4 rounded-xl bg-[#F8F9FE]">
            <View className="h-auto w-auto p-8 flex items-center justify-center rounded-xl bg-[#FFFFFF]">
              <Image
                source={ require("../../../assets/home/gown_one.png") }
                resizeMode="contain"
                className="h-[160px]"
              />
            </View>
          </View>

          <Image
            source={ require("../../../assets/drawer_button.png") }
            resizeMode="contain"
            className="h-[150px] w-[41px]"
          />
        </View>

        <View className="mt-10 px-[25px] pt-5 bg-lightGray">
          {/*==== Checkout And Measurement Guid ====*/}
          <View>
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={ () => null }
                className="h-[55px] w-[60%] mr-3 flex-row items-center justify-center rounded-xl bg-baseGreen"
              >
                <Text className="text-lg text-white mr-2">Checkout</Text>
                <ArrowRight className="text-white" />
              </TouchableOpacity>
              
              <View className="mr-3">
                <Text className="text-xs">Color</Text>
                <Text className="font-medium text-green-800">Green</Text>
              </View>

              <View>
                <Text className="text-xs">Size</Text>
                <Text className="font-medium text-black">Medium</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={ () => navigation.navigate("measurementScreen") }
              className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
              <Ruler size={ 30 } className="mr-2 text-green-800" />
              <Text className="font-medium text-base text-green-800">Body Measurement Guide</Text>
            </TouchableOpacity>
          </View>

          {/*==== Tab View ====*/}
          <View className="h-auto w-full mt-5 px-0.5">
            <View className="h-auto w-full flex-row justify-between">
              { tabs.map((tab, index) => (
                <TouchableOpacity key={ index }
                onPress={ () => dispatch(setSelectedTab(tab)) }>
                  <Text className={`${(selectedTab === tab) ? "font-semibold text-gray-700 text-[15px]" : "text-gray-500"}`}>{ tab }</Text>
                </TouchableOpacity>
              )) }
            </View>
          </View>

          { (selectedTab === "Description") ? (
            <DescriptionComponent />
          ) : (selectedTab === "Reviews") ? (
            <ReviewComponent />
          ) : (
            <TimelineComponent />
          ) }
        
          {/*==== Similar Items Section ====*/}
          <View className="my-12">
            <Text className="font-medium text-base text-baseGreen">Similar items</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={ false }
              className="h-auto w-full mt-3"
            >
              { similarItems.map((similarItem) => (
                <TouchableOpacity
                key={ similarItem.id }
                  onPress={ () => null }
                  className="h-auto w-[170px] mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE]"
                >
                  <View className="h-auto w-full relative py-1 rounded-xl bg-white">
                    <Image
                      className="h-[100px] w-full rounded-t-2xl"
                      resizeMode="contain"
                      source={ similarItem.image }
                    />
                    <View className="h-[35px] w-[35px] absolute top-1 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                      <Heart color="gray" />
                    </View>
                  </View>
                  <View className="mt-3">
                    <Text className="text-sm text-gray-800">{ similarItem.name }</Text>
                    <View className="mt-1.5 flex-row items-center justify-between">
                      <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ similarItem.productType }</Text>

                      <View className="flex-row">
                        <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                        <Text>4.3</Text>
                      </View>
                    </View>
                    <Text className="mt-2.5 text-base font-medium text-gray-900">${ similarItem.price }</Text>
                  </View>
                </TouchableOpacity>
              )) }
            </ScrollView>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default ProductDetailScreen;