import React, { useState, useCallback } from "react";
import { Image, Text, View, Pressable, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ArrowRight, Heart, Notification, SearchNormal1, Star1 } from "iconsax-react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { setSelectedCategory } from "../slices/home_slice";
import RootNavigationStackModel from "../../../routes/model/routes_model";

const DashboardScreen = () => {
  const { categories, selectedCategory, bestDeals } = useSelector((state: RootState) => state.homeState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();

  const [buttonContainerVisible, setButtonContainerVisible] = useState(false);
  const [popularItems, setPopularItems] = useState([
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

  const openButtonContainer = useCallback(() => {
    setButtonContainerVisible(true);
  }, []);

  const closeButtonContainer = useCallback(() => {
    setButtonContainerVisible(false);
  }, []);

  return (
    <GestureHandlerRootView>
        <SafeAreaView className="flex-1 h-auto w-screen pb-20">
            <StatusBar
                backgroundColor="#112F1E"
                barStyle="light-content"
            />
            <ScrollView className="pb-[120px]">

                <View className="px-5 py-6 bg-baseGreen">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Image
                          className="h-[60px] w-[60px] rounded-full"
                          resizeMode="cover"
                          source={require("../../../assets/home/profile_image.png")}
                        />
                        <View className="ml-2">
                          <Text className="text-gray-400 text-base">Welcome back,</Text>
                          <Text className="mt-1 font-medium text-base text-white">Otor John Stephen</Text>
                        </View>
                      </View>
                      <Pressable
                        className="bg-lightGreen p-2.5 rounded-full"
                        onPress={ () => null }
                      >
                        <Notification color="#133522" size={24} variant="Bold" />
                      </Pressable>
                    </View>
                    
                    <View className="h-auto w-full mt-8 px-3 py-1 flex-row items-center justify-between border border-gray-300 rounded-xl bg-gray-100">
                        <TextInput
                            placeholder="Search item"
                            placeholderTextColor="#9ca3af"
                            className="text-base"
                            onChangeText={(value) => null}
                        />
                        <TouchableOpacity onPress={ () => null }>
                            <SearchNormal1 color="#9ca3af" className="mr-1" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-5 py-6">
                    {/*==== New Arrivals Section ====*/}
                    <View className="px-5 py-7 flex flex-row items-center justify-between rounded-2xl bg-lightGold">
                      <View>
                        <Text className="text-sm text-gray-600">New Arrivals</Text>
                        <Text className="mt-1 font-semibold text-2xl text-gray-600">20% OFF</Text>
                        <Text className="mt-1.5 text-base text-gray-800">On All Handbags</Text>
                      </View>
                      <Image
                        className="h-[120px] w-[100px] mr-3"
                        resizeMode="cover"
                        source={require("../../../assets/home/hand_bag.png")}
                      />
                    </View>

                    {/*==== Categories Section ====*/}
                    <View className="mt-6">
                      <View className="flex-row justify-between items-center">
                        <Text className="font-medium text-base text-baseGreen">Category</Text>
                        <TouchableOpacity onPress={ () => navigation.navigate("allCategoryScreen") }>
                          <Text className="text-sm text-baseGreen">See all</Text>
                        </TouchableOpacity>
                      </View>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="mt-3"
                      >
                        { categories.map((category) => (
                          <TouchableOpacity
                            key={ category.id }
                            onPress={ () => dispatch(setSelectedCategory(category)) }
                          >
                            <View className={ `mr-3 px-4 py-2.5 rounded-lg ${ (selectedCategory.id === category.id) ? 'bg-baseGreen' : 'bg-gray-200' }` }>
                              <Text className={ `text-sm ${ (selectedCategory.id === category.id) ? 'text-white' : 'text-gray-800' }` }>{ category.name }</Text>
                            </View>
                          </TouchableOpacity>
                          
                        )) }
                      </ScrollView>

                      <View className="h-[400px] w-full mt-4 pb-4 relative flex items-center justify-end overflow-hidden"
                          style={{ backgroundColor: selectedCategory.color[0] }}>
                        <Image
                          source={ selectedCategory.image }
                          resizeMode="contain"
                          className="h-[370px] w-full absolute bottom-0 -right-4"
                        />
                        <TouchableOpacity
                          onPress={ () => navigation.navigate("productDetailScreen") }
                          className="h-[50px] w-[160px] mt-6 flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                          <Text className="text-sm text-white mr-2">Shop Now</Text>
                          <ArrowRight className="text-white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/*==== Popular Items Section ====*/}
                    <View className="mt-6">
                      <View className="flex-row justify-between items-center">
                        <Text className="font-medium text-base text-baseGreen">Popular items</Text>
                        <TouchableOpacity onPress={ () => navigation.navigate("categoryListScreen", { screenTitle: "All Popular Items" }) }>
                          <Text className="text-sm text-baseGreen">See all</Text>
                        </TouchableOpacity>
                      </View>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full mt-3"
                      >
                        { popularItems.map((popularItem) => (
                          <TouchableOpacity
                          key={ popularItem.id }
                            onPress={ () => null }
                            className="h-auto w-[170px] mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE]"
                          >
                            <View className="h-auto w-full relative py-1 rounded-xl bg-white">
                              <Image
                                className="h-[100px] w-full rounded-t-2xl"
                                resizeMode="contain"
                                source={ popularItem.image }
                              />
                              <View className="h-[35px] w-[35px] absolute top-1 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                                <Heart color="gray" />
                              </View>
                            </View>
                            <View className="mt-3">
                              <Text className="text-sm text-gray-800">{ popularItem.name }</Text>
                              <View className="mt-1.5 flex-row items-center justify-between">
                                <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ popularItem.productType }</Text>

                                <View className="flex-row">
                                  <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                                  <Text>4.3</Text>
                                </View>
                              </View>
                              <Text className="mt-2.5 text-base font-medium text-gray-900">${ popularItem.price }</Text>
                            </View>
                          </TouchableOpacity>
                        )) }
                      </ScrollView>
                    </View>
                    
                    {/*==== Best Deals Section ====*/}
                    <View className="mt-6">
                      <View className="flex-row justify-between items-center">
                        <Text className="font-medium text-base text-baseGreen">Best deals</Text>
                        <TouchableOpacity onPress={ () => navigation.navigate("categoryListScreen", { screenTitle: "All Best Deals" }) }>
                          <Text className="text-sm text-baseGreen">See all</Text>
                        </TouchableOpacity>
                      </View>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={ false }
                        className="h-auto w-full mt-3"
                      >
                        { bestDeals.map((bestDeal) => (
                          <TouchableOpacity
                          key={ bestDeal.id }
                            onPress={ () => null }
                            className="h-auto w-[340px] mr-4 px-4 py-5 flex-row justify-start rounded-2xl overflow-hidden bg-[#F8F9FE]"
                          >
                            <View className="h-[150px] w-[130px] relative mr-4 py-2 flex justify-center rounded-xl bg-white">
                              <Image
                                className="h-[120px] w-full rounded-t-2xl"
                                resizeMode="contain"
                                source={ bestDeal.image }
                              />
                              <View className="h-[35px] w-[35px] absolute top-2 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                                <Heart color="gray" />
                              </View>
                            </View>

                            <View className="w-[160px] mt-3">
                              <Text className="text-base text-gray-800">{ bestDeal.name }</Text>
                              <View className="mt-3 flex-row items-center justify-between">
                                <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ bestDeal.productType }</Text>

                                <View className="flex-row">
                                  <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                                  <Text>4.3</Text>
                                </View>
                              </View>
                              <Text className="mt-2.5 text-base font-medium text-gray-900">${ bestDeal.price }</Text>
                            </View>
                          </TouchableOpacity>
                        )) }
                      </ScrollView>
                    </View>

                    {/*==== Invite a Friend Section ====*/}
                    <View className="mt-6 px-5 pt-5 pb-14 rounded-2xl bg-lightGreen">
                      <Text className="text-lg leading-tight text-gray-800">Invite a friend and earn delivery points</Text>
                      <View className="mt-2 flex-row items-center justify-start">
                        <View className="mr-4">
                          <Text className="text-sm text-gray-600">Redeem points and</Text>
                          <Text className="text-sm text-gray-600">get free coupons</Text>
                        </View>
                        <TouchableOpacity onPress={ () => navigation.navigate("inviteFriendScreen") }
                          className="px-4 py-2 rounded-lg bg-baseGreen">
                          <Text className="text-white text-sm font-medium">Invite</Text>
                        </TouchableOpacity>
                      </View>
                      <Image
                        source={require("../../../assets/home/invite_tree.png")}
                        className="absolute bottom-0 right-0"
                        resizeMode="contain"
                      />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DashboardScreen;
