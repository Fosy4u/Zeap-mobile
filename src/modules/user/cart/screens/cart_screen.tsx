import { useDispatch, useSelector } from 'react-redux';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, ScrollView, ToastAndroid } from 'react-native'
import React, { useCallback } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArrowRight, Notification, Trash } from 'iconsax-react-native';
import { RootState } from '../../../../redux/store/store';
import AppLoader from '../../../general/components/appLoader';
import useCartHook from '../hooks/cart_hook';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { setProductID } from '../../products/slices/product_slice';
import useGeneralHook from '../../../general/hooks/general_hook';
import formatCurrency from '../../../../utils/formatCurrency';
import ProductCardComponent from '../../../general/components/productCard_component.tsx';
import EmptyListComponent from '../../products/components/emptyList_component.tsx';


const CartScreen = () => {
  const { cart, isLoading: isCartLoading, loadingMessage: cartLoadingMessage } = useSelector((state: RootState) => state.cartState);
  const { isLoading: isAddressLoading, loadingMessage: addressLoadingMessage } = useSelector((state: RootState) => state.addressState);
  const { popularProducts } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();
  const isLoading = isCartLoading || isAddressLoading;
  const loadingMessage = cartLoadingMessage || addressLoadingMessage;

  const {
    handleGetCarts,
    handleIncreamentProductQuantity,
    handleDecreamentProductQuantity,
    handleRemoveProductFromCart,
    handleGetDeliveryDate,
    getItemDeliveryPeriod,
  } = useCartHook();
  const { getColorCode } = useGeneralHook();

  useFocusEffect(
    useCallback(() => {
      handleGetCarts();
      handleGetDeliveryDate();
    }, [])
  );

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
          { (cart?.basketItems && cart.basketItems.length > 0)
          ? (
            <View>
              { cart?.basketItems?.map((basketItem) => {
                return (
                  <View key={ basketItem._id! } className="h-auto w-full">
                    <View
                      className="h-auto w-full pt-[20px] pb-1 flex-row items-center justify-start">
                      <Image
                        className="h-[120px] w-[80px]"
                        resizeMode="center"
                        source={
                          basketItem?.image!
                          ? { uri: basketItem?.image! }
                          : require("../../../../../assets/images/app_logo.png")
                        }
                      />
                      <View className="h-auto flex-1 ml-3">
                        <Text className="text-sm text-gray-800">{ basketItem.title! }</Text>
                        <View className="h-auto flex-row mt-1 items-center justify-start space-x-5">
                          <View className="h-auto flex-row mt-1 items-center justify-start">
                            <Text className="mr-1 text-xs text-gray-500"> Color:</Text>
                            <View className="h-3 w-3 mr-0.5 rounded-full" style={ { backgroundColor: getColorCode(basketItem.color!) } } />
                            <Text className="font-semibold text-xs text-gray-600">{ basketItem.color! }</Text>
                          </View>

                          <View className="h-4 w-[1px] bg-gray-600" />

                          <View className="h-auto flex-row mt-1 items-center justify-start">
                            <Text className="mr-1 text-xs text-gray-500">Size: </Text>
                            <Text className="font-semibold text-xs text-gray-600">{ basketItem.size! }</Text>
                          </View>
                        </View>

                        <View className="h-auto flex-1 mt-2 flex-row items-center justify-between">
                          <View className="flex-row items-center gap-x-4">
                            <TouchableOpacity
                             className="h-[30px] w-[30px] p-0 pb-2 justify-center items-center border border-gray-400 rounded-lg"
                              onPress={ async () => {
                                // If the quantity is 1, show a toast message
                                if (basketItem?.quantity === 1) {
                                    ToastAndroid.show("You cannot decrement the quantity below 1", ToastAndroid.SHORT);
                                    return;
                                }
                                await handleDecreamentProductQuantity(basketItem._id!);
                              }}
                            >
                              <Text className="text-2xl leading-7">&minus;</Text>
                            </TouchableOpacity>

                            <Text className="font-montserratMedium text-lg">{ basketItem.quantity! }</Text>

                            <TouchableOpacity
                              className="h-[30px] w-[30px] justify-center items-center border border-gray-400 rounded-lg"
                              onPress={ () => handleIncreamentProductQuantity(basketItem._id!) }
                            >
                              <Text className="text-xl leading-6">&#43;</Text>
                            </TouchableOpacity>
                          </View>

                          <Text className="font-semibold text-lg text-baseGreen">{ formatCurrency(basketItem.actualAmount!, basketItem.currency!) }</Text>

                          <TouchableOpacity onPress={ () => handleRemoveProductFromCart(basketItem._id!) } >
                            <Trash color="#AA1F1F" size={18} variant="Bold" />
                          </TouchableOpacity>
                        </View>

                        { getItemDeliveryPeriod(cart.basketItems?.[0].sku!, "Standard") && (
                          <Text className="font-montserratMedium text-[10px] text-blue-400">Delivery period: { getItemDeliveryPeriod(cart.basketItems?.[0].sku!, "Standard") } working days</Text>
                        ) }
                        { getItemDeliveryPeriod(cart.basketItems?.[0].sku!, "Express") && (
                          <Text className="font-montserratMedium text-[10px] text-blue-400">Delivery period: { getItemDeliveryPeriod(cart.basketItems?.[0].sku!, "Express") } working days</Text>
                        ) }
                      </View>
                    </View>

                    <View className="h-[1px] w-full mt-2 bg-gray-200" />
                  </View>
                )
              }) }

              {/*==== Subtotal ====*/}
              <View className="mt-5 flex-row justify-between items-center">
                <Text className="text-base text-baseGreen">Subtotal</Text>
                <Text className="font-semibold text-lg text-baseGreen">{ formatCurrency(cart?.subTotal!, cart?.currency!) }</Text>
              </View>
              <Text className="text-xs text-gray-500">Delivery fees not included yet.</Text>
            </View>
          )
          : (
            <EmptyListComponent />
          ) }

          { (cart?.basketItems && cart.basketItems.length > 0) && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("checkoutScreen");
              }}
              disabled={ isAddressLoading }
              className="h-[55px] w-auto mt-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="text-lg text-white mr-2">{ isAddressLoading ? "Please wait..." : "Complete Your Order" }</Text>
              { isAddressLoading ? null : <ArrowRight className="text-white" /> }
            </TouchableOpacity>
          ) }

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
          <View className="mt-10 mb-10">
            <Text className="font-medium text-base text-baseGreen">Similar items</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={ false }
              className="h-auto w-full my-3"
            >
              { popularProducts.map((popularProduct) => (
                <ProductCardComponent
                  key={ popularProduct.productId }
                  product={ popularProduct }
                  handleOnPress={ () => {
                    dispatch(setProductID(popularProduct.productId));
                    navigation.navigate("productDetailScreen");
                  } }
                  orientation="Vertical"
                />
              )) }
            </ScrollView>
          </View>

        </ScrollView>
      </SafeAreaView>

      { (isLoading) && <AppLoader loadingAdditionalMessage={ loadingMessage } /> }
    </GestureHandlerRootView>
  )
}

export default CartScreen;
