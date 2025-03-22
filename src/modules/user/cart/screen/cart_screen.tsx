import { useSelector } from 'react-redux';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArrowRight, Heart, Notification, Star1, Trash } from 'iconsax-react-native';
import { RootState } from '../../../../redux/store/store';
import AppLoader from '../../../general/components/appLoader';
import useCartHook from '../hooks/cart_hook';
import useProductsHook from '../../products/hooks/products_hook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';


const CartScreen = () => {
  const { popularProducts } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  const {
    carts, cartItemsLoading, handleGetCartItems,
    cartTotal, cartTotalLoading, handleGetCartTotal
  } = useCartHook();
  const { handleIncreamentProductQuantity, handleDecreamentProductQuantity, handleRemoveProductFromCart } = useProductsHook();
  

  useEffect(() => {
    (async() => {
      await handleGetCartItems();
      await handleGetCartTotal();
    })()
  }, [carts]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full w-full flex-1 px-5 pt-2 pb-3">

        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
        />

        {/*==== Header ====*/}
        <View className="h-auto w-full py-3 flex-row items-center justify-between">
          <View className="h-[40px] w-[40px]" />
          <Text className="font-semibold text-lg text-baseGreen">My Cart</Text>
          <TouchableOpacity
            className="bg-lightGreen p-2.5 rounded-full"
            onPress={ () => navigation.navigate("userNotificationsScreen") }
          >
            <Notification color="#133522" size={24} variant="Bold" />
          </TouchableOpacity>
        </View>

        {/*==== Cart List ====*/}
        <ScrollView showsVerticalScrollIndicator={ false }
          className="h-auto w-full">
          { (carts && carts?.basketItems?.length !== 0)
          ? (
            <View>
              { carts?.basketItems?.map((basketItem, index) => {
                return (
                    <View key={ basketItem._id! } className="h-auto w-full">
                      <View
                        className="h-auto w-full py-[20px] flex-row items-center justify-start">
                        <Image
                          className="h-[80px] w-[60px]"
                          resizeMode="center"
                          source={
                            basketItem?.image!
                            ? { uri: basketItem?.image! }
                            : require("../../../../../assets/images/app_logo.png")
                          }
                        />
                        <View className="h-auto flex-1 ml-4">
                          <Text className="text-base text-gray-800">{ basketItem.title! }</Text>
                          <Text className="text-xs text-gray-500">Color: { basketItem.bespokeColor! }</Text>

                          <View className="h-auto flex-1 mt-2 flex-row items-center justify-between">
                            <View className="flex-row items-center gap-x-4">
                              <TouchableOpacity onPress={ () => handleDecreamentProductQuantity(basketItem.sku!) } >
                                <Text className="text-2xl">&minus;</Text>
                              </TouchableOpacity>

                              <View className="h-[25px] w-[25px] flex-row justify-center items-center border border-gray-400 rounded-lg">
                                <Text className="">{ basketItem.quantity! }</Text>
                              </View>
                              

                              <TouchableOpacity onPress={ () => handleIncreamentProductQuantity(basketItem.sku!) } >
                                <Text className="text-2xl">&#43;</Text>
                              </TouchableOpacity>
                            </View>

                            <Text className="font-semibold text-lg text-baseGreen">₦ { cartTotal?.itemsTotal!.toLocaleString() }</Text>

                            <TouchableOpacity onPress={ () => handleRemoveProductFromCart(basketItem.sku!) } >
                              <Trash color="#AA1F1F" size={18} variant="Bold" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      
                      <View className="h-[1px] w-full bg-gray-200" />
                    </View>
                )
              }) }

              {/*==== Subtotal ====*/}
              <View className="mt-5 flex-row justify-between items-center">
                <Text className="text-base text-baseGreen">Subtotal</Text>
                <Text className="font-semibold text-lg text-baseGreen">₦ { cartTotal?.total!.toLocaleString() }</Text>
              </View>
              <Text className="text-xs text-gray-500">Delivery fees not included yet.</Text>
            </View>
          )
          : (
            <View className="h-[100px] w-full flex-1 items-center justify-center border border-gray-200 rounded-lg">
              <Text className="text-lg">No item in your cart</Text>
            </View>
          ) }

          <TouchableOpacity 
            onPress={() => {
              navigation.navigate("deliveryAddressScreen")
            }}
            className="h-[55px] w-auto mt-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
          >
            <Text className="text-lg text-white mr-2">Proceed To Checkout</Text>
            <ArrowRight className="text-white" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              navigation.navigate("productListScreen", { screenTitle: "All Products" });
            }}
            className="h-[55px] w-auto mt-4 flex flex-row items-center justify-center rounded-xl bg-gold"
          >
            <Text className="font-medium text-lg text-baseGreen mr-2">Continue Shopping</Text>
            <ArrowRight className="text-baseGreen" />
          </TouchableOpacity>

          {/*==== Similar Items Section ====*/}
          <View className="mt-10 mb-5">
          <Text className="font-medium text-base text-baseGreen">Similar items</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={ false }
              className="h-auto w-full mt-3"
            >
              { popularProducts.map((popularProduct) => (
                <TouchableOpacity key={ popularProduct.productId }
                  onPress={ () => null }
                  className="h-auto w-[170px] mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE]"
                >
                  <View className="h-auto w-full relative py-1 rounded-xl bg-white">
                    <Image
                      className="h-[100px] w-full rounded-t-2xl"
                      resizeMode="contain"
                      source={ 
                        popularProduct.colors[0]?.images[1]?.link
                        ? { uri: popularProduct.colors[0]?.images[1]?.link }
                        : require("../../../../../assets/images/app_logo.png")
                      }
                    />
                    <View className="h-[35px] w-[35px] absolute top-1 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                      <Heart color="gray" />
                    </View>
                  </View>
                  <View className="mt-3">
                    <Text className="text-sm text-gray-800">{ popularProduct.title }</Text>
                    <View className="mt-1.5 flex-row items-center justify-between">
                      <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ popularProduct.categories.productGroup.split("-").join(" ") }</Text>

                      <View className="flex-row">
                        <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                        <Text>4.3</Text>
                      </View>
                    </View>
                    <Text className="mt-2.5 text-base font-medium text-gray-900">₦{ popularProduct.variations[0].price.toLocaleString() }</Text>
                  </View>
                </TouchableOpacity>
              )) }
            </ScrollView>
          </View>

        </ScrollView>
      </SafeAreaView>
      
      { (cartItemsLoading) && <AppLoader loadingAdditionalMessage="Loading cart items." /> }
      { (cartTotalLoading) && <AppLoader loadingAdditionalMessage="Loading total price." /> }
    </GestureHandlerRootView>
  )
}

export default CartScreen;